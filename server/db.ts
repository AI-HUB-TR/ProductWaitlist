import pg from 'pg';
const { Pool } = pg;

// PostgreSQL bağlantı havuzu oluşturma
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Bağlantı havuzundan istemci alma
export async function getClient() {
  const client = await pool.connect();
  return client;
}

// Bağlantı havuzunu kapatma
export async function closePool() {
  await pool.end();
}

// Veritabanı sorgularını yürütme yardımcı fonksiyonu
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, params, duration, rows: res.rowCount });
  return res;
}

// Transaction için yardımcı fonksiyon
export async function withTransaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}