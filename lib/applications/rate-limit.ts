type Bucket = { count: number; resetAt: number };

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 5;

function bucketStore(name: string) {
  const globalStore = globalThis as unknown as Record<string, Map<string, Bucket> | undefined>;
  return (globalStore[name] ||= new Map());
}

function prune(store: Map<string, Bucket>, now: number) {
  if (store.size < 200) return;
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) store.delete(key);
  }
}

export function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const ip = forwarded.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return ip.slice(0, 128);
}

export function consumeRateLimit(scope: string, key: string, max: number, windowMs: number) {
  const store = bucketStore(`__utaRate_${scope}`);
  const now = Date.now();
  prune(store, now);
  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (current.count >= max) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  }
  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export function loginAttemptState(key: string) {
  const store = bucketStore("__utaLoginAttempts");
  const now = Date.now();
  prune(store, now);
  const bucket = store.get(key);
  if (!bucket || bucket.resetAt <= now) {
    return { allowed: true, retryAfter: 0 };
  }
  if (bucket.count >= LOGIN_MAX_ATTEMPTS) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }
  return { allowed: true, retryAfter: 0 };
}

export function recordLoginFailure(key: string) {
  const store = bucketStore("__utaLoginAttempts");
  const now = Date.now();
  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return;
  }
  current.count += 1;
}

export function recordLoginSuccess(key: string) {
  bucketStore("__utaLoginAttempts").delete(key);
}
