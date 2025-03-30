import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { db } from "./database";
import { users, User, InsertUser, LoginData, RegisterData, socialLogins } from "@shared/auth.schema";
import { eq } from "drizzle-orm";

declare global {
  namespace Express {
    interface User extends User {}
  }
}

const scryptAsync = promisify(scrypt);

// Şifre hash'leme fonksiyonu
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Şifre karşılaştırma fonksiyonu
export async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Session store için PostgreSQL bağlantısı
const PostgresSessionStore = connectPg(session);
const sessionStore = new PostgresSessionStore({
  pool,
  tableName: 'sessions',
  createTableIfMissing: true
});

// Auth işlemlerini kurma fonksiyonu
export function setupAuth(app: Express) {
  // Session ayarları
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'zekibot-secret-key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
    }
  };

  // Session ve passport başlatma
  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport yerel strateji
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          // Kullanıcıyı e-posta ile bul
          const [user] = await db.select().from(users).where(eq(users.email, email));
          
          if (!user || !(await comparePasswords(password, user.password))) {
            return done(null, false, { message: "E-posta veya şifre hatalı" });
          }
          
          // Kullanıcının son giriş zamanını güncelle
          await db.update(users)
            .set({ lastLogin: new Date() })
            .where(eq(users.id, user.id));
          
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Oturum serileştirme
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Kullanıcı doğrulama middleware'i
  const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Yetkisiz erişim" });
  };

  // API routes
  
  // Kullanıcı kaydı
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const { password, confirmPassword, ...userData } = req.body as RegisterData;
      
      // E-posta ve kullanıcı adı kontrolü
      const [existingUser] = await db.select()
        .from(users)
        .where(eq(users.email, userData.email));
      
      if (existingUser) {
        return res.status(400).json({ message: "Bu e-posta adresi zaten kullanılıyor" });
      }
      
      const [existingUsername] = await db.select()
        .from(users)
        .where(eq(users.username, userData.username));
      
      if (existingUsername) {
        return res.status(400).json({ message: "Bu kullanıcı adı zaten kullanılıyor" });
      }
      
      // Kullanıcı oluşturma
      const hashedPassword = await hashPassword(password);
      
      const [newUser] = await db.insert(users)
        .values({
          ...userData,
          password: hashedPassword,
          emailVerified: false,
          role: 'user'
        })
        .returning();
      
      // Kullanıcıyı otomatik olarak giriş yap
      req.login(newUser, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = newUser;
        res.status(201).json({ user: userWithoutPassword });
      });
    } catch (error) {
      console.error("Kayıt hatası:", error);
      res.status(500).json({ message: "Sunucu hatası, lütfen daha sonra tekrar deneyin" });
    }
  });

  // Kullanıcı girişi
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Giriş başarısız" });
      }
      
      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = user;
        res.status(200).json({ user: userWithoutPassword });
      });
    })(req, res, next);
  });

  // Kullanıcı çıkışı
  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Mevcut kullanıcı bilgisini getir
  app.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Giriş yapılmamış" });
    }
    
    const { password, ...userWithoutPassword } = req.user as User;
    res.json({ user: userWithoutPassword });
  });

  // Sosyal giriş
  app.post("/api/auth/social", async (req, res, next) => {
    try {
      const { provider, providerId, email, name, profileData } = req.body;
      
      // Önce bu sosyal giriş var mı kontrol et
      const [existingSocialLogin] = await db.select()
        .from(socialLogins)
        .where(eq(socialLogins.providerId, providerId))
        .where(eq(socialLogins.provider, provider));
      
      if (existingSocialLogin) {
        // Mevcut kullanıcıyı bul
        const [user] = await db.select()
          .from(users)
          .where(eq(users.id, existingSocialLogin.userId));
        
        if (user) {
          // Son giriş zamanını güncelle
          await db.update(socialLogins)
            .set({ lastLogin: new Date() })
            .where(eq(socialLogins.id, existingSocialLogin.id));
          
          await db.update(users)
            .set({ lastLogin: new Date() })
            .where(eq(users.id, user.id));
          
          // Giriş yap
          req.login(user, (err) => {
            if (err) return next(err);
            const { password, ...userWithoutPassword } = user;
            res.status(200).json({ user: userWithoutPassword });
          });
          
          return;
        }
      }
      
      // Yeni kullanıcı ya da hesap birleştirme
      if (email) {
        // E-posta ile kullanıcı var mı bak
        const [existingUser] = await db.select()
          .from(users)
          .where(eq(users.email, email));
        
        if (existingUser) {
          // Mevcut hesaba sosyal giriş ekle
          await db.insert(socialLogins)
            .values({
              userId: existingUser.id,
              provider,
              providerId,
              profileData: profileData || {},
              lastLogin: new Date()
            });
          
          // Son giriş zamanını güncelle
          await db.update(users)
            .set({ lastLogin: new Date() })
            .where(eq(users.id, existingUser.id));
          
          // Giriş yap
          req.login(existingUser, (err) => {
            if (err) return next(err);
            const { password, ...userWithoutPassword } = existingUser;
            res.status(200).json({ user: userWithoutPassword });
          });
          
          return;
        }
      }
      
      // Yeni kullanıcı oluştur
      // Rastgele kullanıcı adı ve şifre oluştur
      const randomUsername = `user_${randomBytes(6).toString('hex')}`;
      const randomPassword = randomBytes(12).toString('hex');
      const hashedPassword = await hashPassword(randomPassword);
      
      const [newUser] = await db.insert(users)
        .values({
          email: email || `${providerId}@${provider}.example.com`,
          name: name || `User_${providerId.slice(0, 6)}`,
          username: randomUsername,
          password: hashedPassword,
          emailVerified: true, // Sosyal girişte e-posta doğrulanmış kabul edilir
          role: 'user'
        })
        .returning();
      
      // Sosyal giriş bilgisini kaydet
      await db.insert(socialLogins)
        .values({
          userId: newUser.id,
          provider,
          providerId,
          profileData: profileData || {},
          lastLogin: new Date()
        });
      
      // Giriş yap
      req.login(newUser, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = newUser;
        res.status(201).json({ user: userWithoutPassword });
      });
      
    } catch (error) {
      console.error("Sosyal giriş hatası:", error);
      res.status(500).json({ message: "Sunucu hatası, lütfen daha sonra tekrar deneyin" });
    }
  });
}