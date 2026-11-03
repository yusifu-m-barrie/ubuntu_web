"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LOGO = "/images/nuevo-logo-ubuntu-2-3_enano.jpg";

export function AdminHeader() {
  const pathname = usePathname();
  const onApplications = pathname.startsWith("/admin/applications");

  return (
    <header className="sticky top-0 z-40 border-b-4 border-orange bg-navy text-cream print:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <Link href="/admin/applications" className="flex min-w-0 items-center gap-3">
          <Image
            src={LOGO}
            alt="Ubuntu Tech Afrika"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full bg-cream object-contain p-0.5 ring-2 ring-orange"
            priority
          />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange">Ubuntu Tech Afrika</p>
            <p className="truncate font-serif text-lg leading-tight">Application review</p>
          </div>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/admin/applications"
            className={`rounded-full px-3 py-2 font-semibold ${
              onApplications ? "bg-orange text-white" : "text-cream hover:bg-white/10 hover:text-orange"
            }`}
          >
            Applications
          </Link>
          <Link href="/" className="hidden rounded-full px-3 py-2 text-sand hover:text-orange sm:inline">
            Website
          </Link>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="rounded-full border border-cream/25 px-3 py-2 font-semibold hover:border-orange hover:bg-orange hover:text-white"
            >
              Log out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
