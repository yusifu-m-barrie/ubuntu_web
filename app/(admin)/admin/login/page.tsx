import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { adminConfigured, sanitizeAdminPath } from "@/lib/applications/admin-auth";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Application review login",
  robots: { index: false, follow: false },
};

const LOGO = "/images/nuevo-logo-ubuntu-2-3_enano.jpg";

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
    <div className="relative min-h-screen overflow-hidden bg-navy text-cream">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-orange" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 18%, rgba(238,122,18,0.35), transparent 36%), radial-gradient(circle at 88% 80%, rgba(246,241,232,0.12), transparent 32%)",
        }}
      />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
        <div className="mb-8 flex items-center gap-3">
          <Image
            src={LOGO}
            alt="Ubuntu Tech Afrika"
            width={56}
            height={56}
            className="h-14 w-14 rounded-full bg-cream object-contain p-1 ring-2 ring-orange"
            priority
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">Ubuntu Tech Afrika</p>
            <h1 className="font-serif text-3xl">Staff sign in</h1>
          </div>
        </div>
        <p className="text-sm text-sand">
          Review graduate and postgraduate applications.{" "}
          <Link href="/" className="font-semibold text-orange hover:underline">
            Back to the website
          </Link>
        </p>
        {!configured ? (
          <p className="mt-6 rounded-2xl bg-cream p-6 text-sm text-muted ring-1 ring-white/10">
            Administrator sign-in is not configured on this server.
          </p>
        ) : (
          <AdminLoginForm nextPath={nextPath} error={params.error} />
        )}
      </div>
    </div>
  );
}
