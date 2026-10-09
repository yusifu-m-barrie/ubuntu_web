import { ADMIN_COOKIE } from "@/lib/applications/constants";

const encoder = new TextEncoder();
const SESSION_MS = 8 * 60 * 60 * 1000;
const MIN_SECRET_LENGTH = 32;

function productionCookies() {
  return process.env.NODE_ENV === "production";
}

export function adminCookieName() {
  return productionCookies() ? `__Host-${ADMIN_COOKIE}` : ADMIN_COOKIE;
}

function adminSecret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

export function adminConfigured() {
  if (adminSecret().length < MIN_SECRET_LENGTH) return false;
  if (process.env.ADMIN_PASSWORD_HASH?.startsWith("scrypt$")) return true;
  if (!process.env.VERCEL && process.env.ADMIN_PASSWORD) return true;
  return false;
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "==".slice((value.length * 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmac(secret: string, payload: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toBase64Url(new Uint8Array(signature));
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let i = 0; i < left.length; i += 1) mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return mismatch === 0;
}

export function sanitizeAdminPath(next: string | undefined) {
  if (!next || !next.startsWith("/admin") || next.startsWith("//") || next.includes("\\") || next.includes("://")) {
    return "/admin/applications";
  }
  try {
    const url = new URL(next, "https://ubuntu.invalid");
    if (url.origin !== "https://ubuntu.invalid" || !url.pathname.startsWith("/admin")) {
      return "/admin/applications";
    }
    return `${url.pathname}${url.search}`;
  } catch {
    return "/admin/applications";
  }
}

export function isSameOrigin(request: Request) {
  const allowed = new Set<string>();
  try {
    allowed.add(new URL(request.url).origin);
  } catch {
    /* ignore */
  }
  const host = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "").split(",")[0].trim();
  const proto = (request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https"))
    .split(",")[0]
    .trim();
  if (host) allowed.add(`${proto}://${host}`);
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site) {
    try {
      allowed.add(new URL(site).origin);
    } catch {
      /* ignore */
    }
  }
  const origin = request.headers.get("origin");
  if (origin) return allowed.has(origin);
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return allowed.has(new URL(referer).origin);
    } catch {
      return false;
    }
  }
  return false;
}

export async function createAdminToken() {
  const secret = adminSecret();
  if (secret.length < MIN_SECRET_LENGTH) throw new Error("Admin authentication is not configured.");
  const now = Date.now();
  const payload = toBase64Url(
    encoder.encode(
      JSON.stringify({
        v: 1,
        role: "admin",
        iat: now,
        exp: now + SESSION_MS,
        jti: crypto.randomUUID(),
      }),
    ),
  );
  const signature = await hmac(secret, payload);
  return `${payload}.${signature}`;
}

type AdminTokenPayload = { v?: number; role?: string; exp?: number; jti?: string };

function revokedTokens() {
  const globalStore = globalThis as unknown as { __utaRevokedAdmin?: Map<string, number> };
  return (globalStore.__utaRevokedAdmin ||= new Map());
}

function pruneRevoked(now: number) {
  const store = revokedTokens();
  if (store.size < 50) return;
  for (const [jti, exp] of store) {
    if (exp <= now) store.delete(jti);
  }
}

async function readAdminToken(token: string | undefined): Promise<AdminTokenPayload | null> {
  const secret = adminSecret();
  if (secret.length < MIN_SECRET_LENGTH || !token || !token.includes(".")) return null;
  const dot = token.lastIndexOf(".");
  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!payload || !signature) return null;
  const expected = await hmac(secret, payload);
  if (!timingSafeEqual(expected, signature)) return null;
  try {
    return JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as AdminTokenPayload;
  } catch {
    return null;
  }
}

export async function verifyAdminToken(token: string | undefined) {
  const json = await readAdminToken(token);
  if (!json || json.v !== 1 || json.role !== "admin" || typeof json.exp !== "number" || json.exp <= Date.now()) {
    return false;
  }
  if (json.jti && revokedTokens().has(json.jti)) return false;
  return true;
}

export async function revokeAdminToken(token: string | undefined) {
  const json = await readAdminToken(token);
  if (!json?.jti || typeof json.exp !== "number") return;
  pruneRevoked(Date.now());
  revokedTokens().set(json.jti, json.exp);
}

export function adminTokenFromRequest(request: Request) {
  const raw = request.headers.get("cookie") || "";
  const name = adminCookieName();
  for (const part of raw.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

export function adminCookieOptions() {
  return {
    name: adminCookieName(),
    httpOnly: true,
    sameSite: "lax" as const,
    secure: productionCookies(),
    path: "/",
    maxAge: SESSION_MS / 1000,
  };
}

export function clearAdminCookieOptions() {
  return {
    ...adminCookieOptions(),
    maxAge: 0,
    expires: new Date(0),
  };
}
