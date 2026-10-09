import { adminCookieName, sanitizeAdminPath, verifyAdminToken } from "@/lib/applications/admin-auth";
import { NextRequest, NextResponse } from "next/server";

function withAdminHeaders(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(adminCookieName())?.value;
  const signedIn = await verifyAdminToken(token);
  const isLogin = pathname === "/admin/login" || pathname === "/api/admin/login";
  const isLogout = pathname === "/api/admin/logout";

  if (isLogin) {
    if (signedIn && pathname === "/admin/login") {
      return withAdminHeaders(NextResponse.redirect(new URL("/admin/applications", request.url)));
    }
    return withAdminHeaders(NextResponse.next());
  }

  if (isLogout) {
    return withAdminHeaders(NextResponse.next());
  }

  if (signedIn) {
    return withAdminHeaders(NextResponse.next());
  }

  if (pathname.startsWith("/api/admin")) {
    return withAdminHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }

  const login = new URL("/admin/login", request.url);
  const next = sanitizeAdminPath(pathname);
  if (next !== "/admin/applications") login.searchParams.set("next", next);
  return withAdminHeaders(NextResponse.redirect(login));
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
