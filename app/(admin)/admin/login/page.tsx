import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { adminConfigured, sanitizeAdminPath } from "@/lib/applications/admin-auth";
import Link from "next/link";

export const metadata = {
  title: "Application review login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string; error?: string }>;
}) {
  return <AdminLoginInner searchParams={searchParams} />;
}

async function AdminLoginInner({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string; error?: string }>;
}) {
  const params = (await searchParams) || {};
  const configured = adminConfigured();
  const nextPath = sanitizeAdminPath(params.next);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">Staff access</p>
      <h1 className="mt-3 font-serif text-3xl text-navy">Review applications</h1>
      <p className="mt-2 text-sm text-muted">
        <Link href="/" className="text-orange hover:underline">
          Back to the website
        </Link>
      </p>
      {!configured ? (
        <p className="mt-6 rounded-2xl bg-white p-6 text-sm text-muted ring-1 ring-navy/10">
          Administrator sign-in is not configured on this server.
        </p>
      ) : (
        <AdminLoginForm nextPath={nextPath} error={params.error} />
      )}
    </div>
  );
}
