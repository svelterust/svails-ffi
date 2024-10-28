import * as schema from "$lib/schema";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { env } from "$env/dynamic/private";

// Create database
const client = createClient({
  url: env.TURSO_DATABASE_URL ?? "file:development.sqlite",
  authToken: env.TURSO_AUTH_TOKEN,
  syncUrl: env.TURSO_SYNC_URL,
  syncInterval: env.TURSO_SYNC_URL ? 300 : undefined,
});
export const db = drizzle(client, { schema });

// Optimize when running locally
if (!env.TURSO_AUTH_TOKEN) {
  await db.run(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    PRAGMA busy_timeout = 5000;
    PRAGMA cache_size = 1000000000;
    PRAGMA foreign_keys = true;
    PRAGMA temp_store = memory;
  `);
}

// Run migrations automatically
await migrate(db, { migrationsFolder: "migrations" });
