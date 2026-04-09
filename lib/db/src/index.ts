import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Explicitly set sslmode=verify-full to avoid pg deprecation warning
// (modes 'require', 'prefer', 'verify-ca' are deprecated aliases for 'verify-full')
const _dbUrl = new URL(process.env.DATABASE_URL);
if (_dbUrl.searchParams.has("sslmode")) {
  _dbUrl.searchParams.set("sslmode", "verify-full");
}

export const pool = new Pool({ connectionString: _dbUrl.toString() });
export const db = drizzle(pool, { schema });

export * from "./schema";
export { seedDatabase } from "./seed.js";
