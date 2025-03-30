import { pgTable, serial, text, timestamp, boolean, jsonb, integer, foreignKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Kullanıcılar tablosu
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  lastLogin: timestamp("last_login"),
  emailVerified: boolean("email_verified").default(false),
  role: text("role").notNull().default("user"),
});

// Sosyal giriş tablosu
export const socialLogins = pgTable("social_logins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  providerId: text("provider_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastLogin: timestamp("last_login"),
  profileData: jsonb("profile_data"),
});

// Oturum tablosu
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expires: timestamp("expires").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
});

// Şifre sıfırlama tablosu
export const passwordResets = pgTable("password_resets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expires: timestamp("expires").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// E-posta doğrulama tablosu
export const emailVerifications = pgTable("email_verifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expires: timestamp("expires").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// İlişkileri tanımlama
export const usersRelations = relations(users, ({ many }) => ({
  socialLogins: many(socialLogins),
  sessions: many(sessions),
  passwordResets: many(passwordResets),
  emailVerifications: many(emailVerifications),
}));

export const socialLoginsRelations = relations(socialLogins, ({ one }) => ({
  user: one(users, {
    fields: [socialLogins.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

// Drizzle Zod şemaları
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
});

export const selectUserSchema = createSelectSchema(users);

export const insertSocialLoginSchema = createInsertSchema(socialLogins).omit({ 
  id: true,
  createdAt: true,
  lastLogin: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
});

// Form doğrulama şemaları
export const loginSchema = z.object({
  email: z.string().email({
    message: "Geçerli bir e-posta adresi giriniz",
  }),
  password: z.string().min(6, {
    message: "Şifre en az 6 karakter olmalıdır",
  }),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, {
    message: "İsim en az 2 karakter olmalıdır",
  }),
  email: z.string().email({
    message: "Geçerli bir e-posta adresi giriniz",
  }),
  username: z
    .string()
    .min(3, {
      message: "Kullanıcı adı en az 3 karakter olmalıdır",
    })
    .regex(/^[a-z0-9_]+$/, {
      message: "Kullanıcı adı sadece küçük harf, rakam ve alt çizgi içerebilir",
    }),
  password: z
    .string()
    .min(8, {
      message: "Şifre en az 8 karakter olmalıdır",
    })
    .regex(/.*[A-Z].*/, {
      message: "Şifre en az bir büyük harf içermelidir",
    })
    .regex(/.*[a-z].*/, {
      message: "Şifre en az bir küçük harf içermelidir",
    })
    .regex(/.*\d.*/, {
      message: "Şifre en az bir rakam içermelidir",
    }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

export const socialLoginDataSchema = z.object({
  provider: z.enum(["google", "facebook", "twitter", "apple"]),
  providerId: z.string(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  profileData: z.record(z.any()).optional(),
});

// Tip tanımları
export type User = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type SocialLoginData = z.infer<typeof socialLoginDataSchema>;