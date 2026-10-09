import { requireAdminPage } from "@/lib/applications/admin-guard";
import Link from "next/link";

export default async function ApplicationsAdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();
  return (
    <div className="min-h-screen">
      <header className="border-b border-navy/10 bg-navy text-cream">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">Ubuntu Tech Africa</p>
            <p className="font-serif text-lg">Graduate application review</p>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin/applications" className="hover:text-orange">
              Applications
            </Link>
            <form action="/api/admin/logout" method="POST">
              <button type="submit" className="hover:text-orange">
                Log out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">{children}</div>
    </div>
  );
}
