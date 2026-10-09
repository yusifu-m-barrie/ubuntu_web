import { adminCookieName, isSameOrigin, verifyAdminToken } from "@/lib/applications/admin-auth";
import { ApplicationError, UnauthorizedError } from "@/lib/applications/errors";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getAdminSession() {
  const token = (await cookies()).get(adminCookieName())?.value;
  if (!(await verifyAdminToken(token))) return null;
  return { role: "admin" as const };
}

export async function requireAdminPage() {
  if (!(await getAdminSession())) {
    redirect("/admin/login");
  }
  return { role: "admin" as const };
}

export async function requireAdminRequest(request: Request, options?: { mutate?: boolean }) {
  const mutate = options?.mutate ?? (request.method !== "GET" && request.method !== "HEAD");
  if (mutate && !isSameOrigin(request)) {
    throw new ApplicationError("Invalid request origin.", 403, "FORBIDDEN");
  }
  if (!(await getAdminSession())) {
    throw new UnauthorizedError();
  }
  return { role: "admin" as const };
}
