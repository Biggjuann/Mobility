import pg from 'pg';
import { config } from './config.js';

// Railway Postgres requires TLS. `rejectUnauthorized: false` accepts Railway's
// managed certificate chain while still encrypting the connection in transit.
const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  ssl: config.isProd ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
});

export const query = (text, params) => pool.query(text, params);

export async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email         text UNIQUE NOT NULL,
      password_hash text NOT NULL,
      created_at    timestamptz NOT NULL DEFAULT now()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_state (
      user_id    uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      state      jsonb NOT NULL DEFAULT '{}'::jsonb,
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}

export default pool;
