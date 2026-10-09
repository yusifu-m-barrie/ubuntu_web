import "../globals.css";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Application review",
    template: "%s | Ubuntu Tech Africa Admin",
  },
  robots: { index: false, follow: false },
};

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream font-sans antialiased text-ink">
      <a
        href="#admin-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-navy focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-cream"
      >
        Skip to content
      </a>
      <main id="admin-content">{children}</main>
    </div>
  );
}
