"use client";

import type { NavItem } from "@/types/content";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  logo: string;
  companyName: string;
  items: NavItem[];
};

function collectHrefs(items: NavItem[]) {
  const hrefs = new Set<string>(["/"]);
  for (const item of items) {
    if (item.href && item.href !== "#") hrefs.add(item.href);
    item.children?.forEach((child) => hrefs.add(child.href));
  }
  return [...hrefs];
}

export function SiteHeader({ logo, companyName, items }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    collectHrefs(items).forEach((href) => router.prefetch(href));
  }, [items, router]);

  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <Link href="/" prefetch className="flex items-center gap-3">
          <Image
            src={logo}
            alt={`${companyName} logo`}
            width={48}
            height={48}
            className="site-logo h-12 w-12 object-contain transition duration-300 hover:scale-105"
          />
          <span className="font-serif text-lg font-semibold text-navy">{companyName}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {items.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  prefetch
                  onMouseEnter={() => router.prefetch(item.href)}
                  className="relative inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-navy transition duration-300 after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-orange after:transition-transform after:duration-300 hover:text-orange hover:after:scale-x-100"
                >
                  {item.label}
                  <ChevronDown className="h-4 w-4" aria-hidden />
                </Link>
                <div className="invisible absolute left-0 top-full z-20 min-w-56 rounded-xl border border-navy/10 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      prefetch
                      onMouseEnter={() => router.prefetch(child.href)}
                      className="block cursor-pointer rounded-lg px-3 py-2 text-sm text-navy transition duration-300 hover:bg-sand hover:text-orange"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onMouseEnter={() => router.prefetch(item.href)}
                className={
                  item.accent
                    ? "btn-shine hover-glow-orange cursor-pointer rounded-full bg-orange px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:bg-orange-dark"
                    : `relative cursor-pointer rounded-full px-3 py-2 text-sm font-medium transition duration-300 after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:origin-left after:rounded-full after:bg-orange after:transition-transform after:duration-300 ${
                        pathname === item.href
                          ? "text-orange after:scale-x-100"
                          : "text-navy after:scale-x-0 hover:text-orange hover:after:scale-x-100"
                      }`
                }
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <button
          type="button"
          className="inline-flex cursor-pointer rounded-md p-2 text-navy transition duration-300 hover:bg-sand hover:text-orange lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle menu</span>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open ? (
        <div id="mobile-menu" className="border-t border-navy/10 bg-cream px-4 py-4 lg:hidden">
          {items.map((item) => (
            <div key={item.label} className="py-1">
              <Link
                href={item.href === "#" ? item.children?.[0]?.href || "/" : item.href}
                prefetch
                className={`block py-2 text-base font-medium ${item.accent ? "text-orange" : "text-navy"}`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  prefetch
                  className="block py-1 pl-4 text-sm text-muted"
                  onClick={() => setOpen(false)}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </header>
  );
}
