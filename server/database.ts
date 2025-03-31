import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { pool } from "./db";
import * as schema from "@shared/auth.schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "./auth";

// Drizzle ORM ile veritabanı bağlantısı
export const db = drizzle(pool, { schema });

// Veritabanı tablolarını otomatik oluşturmak için migrasyon fonksiyonu
export async function migrateDb() {
  try {
    console.log("🛢️ Starting database migration...");
    
    // Temel tablolar için sorguları çalıştır
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        avatar TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        last_login TIMESTAMP,
        email_verified BOOLEAN DEFAULT FALSE,
        role TEXT NOT NULL DEFAULT 'user'
      );

      CREATE TABLE IF NOT EXISTS social_logins (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        provider TEXT NOT NULL,
        provider_id TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        last_login TIMESTAMP,
        profile_data JSONB
      );

      CREATE TABLE IF NOT EXISTS password_resets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token TEXT NOT NULL UNIQUE,
        expires TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS email_verifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token TEXT NOT NULL UNIQUE,
        expires TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    
    console.log("✅ Database migration completed!");
  } catch (error) {
    console.error("❌ Database migration failed:", error);
    throw error;
  }
}

// Başlangıç admin kullanıcısı oluşturma
export async function createInitialAdminUser() {
  try {
    const [existingAdmin] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, 'admin@zekibot.com'));

    if (!existingAdmin) {
      const hashedPassword = await hashPassword('admin123');
      
      await db.insert(schema.users).values({
        email: 'admin@zekibot.com',
        name: 'ZekiBot Admin',
        username: 'admin',
        password: hashedPassword,
        emailVerified: true,
        role: 'admin'
      });
      
      console.log("👤 Initial admin user created");
    }
  } catch (error) {
    console.error("❌ Failed to create initial admin user:", error);
  }
}

// Veritabanı şemasını başlatma
export async function initializeDatabase() {
  try {
    await migrateDb();
    await createInitialAdminUser();
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
  }
}