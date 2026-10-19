import { ApplicationStorageError } from "@/lib/applications/errors";
import { Pool, type QueryResultRow } from "pg";

declare global {
  var __utaPgPool: Pool | undefined;
}

function databaseUrl() {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!url) throw new ApplicationStorageError("POSTGRES_URL is not set.");
  return url;
}

function sslFor(url: string) {
  const host = url.toLowerCase();
  const railway =
    host.includes("rlwy.net") || host.includes("railway.app") || host.includes("railway.internal");
  const required = host.includes("sslmode=require") || process.env.POSTGRES_SSL === "require";
  if (!railway && !required) return undefined;
  return { rejectUnauthorized: false };
}

function pool() {
  if (!globalThis.__utaPgPool) {
    const url = databaseUrl();
    globalThis.__utaPgPool = new Pool({
      connectionString: url,
      ssl: sslFor(url),
      max: process.env.VERCEL ? 1 : 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 15_000,
    });
  }
  return globalThis.__utaPgPool;
}

export async function queryRows<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) {
  const result = await pool().query<T>(text, params);
  return result.rows;
}

export async function runQuery(text: string, params: unknown[] = []) {
  await pool().query(text, params);
}
