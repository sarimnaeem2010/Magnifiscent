import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const _dbUrl = new URL(process.env.DATABASE_URL);

// Neon and other cloud Postgres hosts have dotted FQDNs (e.g. *.neon.tech).
// Replit's internal dev Postgres uses a plain hostname like "helium" with no dots.
// For cloud hosts normalise the deprecated sslmode aliases → verify-full.
// For local/internal hosts disable SSL entirely — they don't support it.
const isLocalDb =
  !_dbUrl.hostname.includes(".") ||
  _dbUrl.hostname === "localhost" ||
  _dbUrl.hostname === "127.0.0.1";

if (isLocalDb) {
  // Explicitly disable SSL in the connection string so pg never attempts it
  _dbUrl.searchParams.set("sslmode", "disable");
} else if (_dbUrl.searchParams.has("sslmode")) {
  // Normalise deprecated sslmode aliases on cloud connections
  _dbUrl.searchParams.set("sslmode", "verify-full");
}

export const pool = new Pool({
  connectionString: _dbUrl.toString(),
  ssl: isLocalDb ? false : undefined,
});
export const db = drizzle(pool, { schema });

export * from "./schema";
export { seedDatabase } from "./seed.js";
