import {
  adminConfigured,
  adminCookieOptions,
  createAdminToken,
  isSameOrigin,
  sanitizeAdminPath,
} from "@/lib/applications/admin-auth";
import { verifyAdminPassword } from "@/lib/applications/password";
import { clientKey, loginAttemptState, recordLoginFailure, recordLoginSuccess } from "@/lib/applications/rate-limit";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  if (!adminConfigured()) {
    return NextResponse.json({ error: "Admin access is not configured." }, { status: 503 });
  }

  const key = clientKey(request);
  const limited = loginAttemptState(key);
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "Too many sign-in attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  const body = (await request.json().catch(() => null)) as { password?: string; next?: string } | null;
  const password = typeof body?.password === "string" ? body.password : "";
  const valid = await verifyAdminPassword(password);
  if (!valid) {
    recordLoginFailure(key);
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  recordLoginSuccess(key);
  const token = await createAdminToken();
  const redirect = sanitizeAdminPath(body?.next);
  const response = NextResponse.json({ ok: true, redirect });
  const cookie = adminCookieOptions();
  response.cookies.set(cookie.name, token, cookie);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
