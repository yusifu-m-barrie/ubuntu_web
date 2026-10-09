import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 32;
const MAX_PASSWORD_LENGTH = 256;

function scryptOptions(N: number, r: number, p: number) {
  return { N, r, p, maxmem: 64 * 1024 * 1024 };
}

function scrypt(password: string, salt: Buffer, keylen: number, options: { N: number; r: number; p: number; maxmem: number }) {
  return new Promise<Buffer>((resolve, reject) => {
    scryptCallback(password, salt, keylen, options, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
}

export async function hashAdminPassword(password: string) {
  if (!password || password.length > MAX_PASSWORD_LENGTH) {
    throw new Error("Choose a password of 1–256 characters.");
  }
  const salt = randomBytes(16);
  const N = 16384;
  const r = 8;
  const p = 1;
  const hash = await scrypt(password, salt, KEY_LENGTH, scryptOptions(N, r, p));
  return `scrypt$${N}$${r}$${p}$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

async function verifyScrypt(password: string, stored: string) {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const N = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  if (!N || !r || !p) return false;
  let salt: Buffer;
  let expected: Buffer;
  try {
    salt = Buffer.from(parts[4], "base64url");
    expected = Buffer.from(parts[5], "base64url");
  } catch {
    return false;
  }
  if (!salt.length || !expected.length) return false;
  const actual = await scrypt(password, salt, expected.length, scryptOptions(N, r, p));
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

const dummyHashPromise = hashAdminPassword("not-the-admin-password");

export async function verifyAdminPassword(password: string) {
  if (!password || password.length > MAX_PASSWORD_LENGTH) {
    await dummyHashPromise.then((hash) => verifyScrypt("invalid", hash)).catch(() => false);
    return false;
  }

  const storedHash = process.env.ADMIN_PASSWORD_HASH || "";
  if (storedHash.startsWith("scrypt$")) {
    return verifyScrypt(password, storedHash);
  }

  if (process.env.VERCEL) {
    await dummyHashPromise.then((hash) => verifyScrypt(password, hash)).catch(() => false);
    return false;
  }

  const legacy = process.env.ADMIN_PASSWORD || "";
  if (!legacy) {
    await dummyHashPromise.then((hash) => verifyScrypt(password, hash)).catch(() => false);
    return false;
  }

  const left = Buffer.from(password);
  const right = Buffer.from(legacy);
  if (left.length !== right.length) {
    await dummyHashPromise.then((hash) => verifyScrypt(password, hash)).catch(() => false);
    return false;
  }
  return timingSafeEqual(left, right);
}
