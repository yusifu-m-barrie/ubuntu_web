import {
  adminTokenFromRequest,
  clearAdminCookieOptions,
  isSameOrigin,
  revokeAdminToken,
} from "@/lib/applications/admin-auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  await revokeAdminToken(adminTokenFromRequest(request));
  const redirect = NextResponse.redirect(new URL("/admin/login", request.url), 303);
  const cookie = clearAdminCookieOptions();
  redirect.cookies.set(cookie.name, "", cookie);
  redirect.headers.set("Cache-Control", "private, no-store");
  return redirect;
}
