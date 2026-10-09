import { SanityLiveRefresh } from "@/components/SanityLiveRefresh";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { loadContent } from "@/lib/content";
import "../globals.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await loadContent();
  return (
    <div className="min-h-screen bg-cream font-sans antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-navy focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-cream"
      >
        Skip to content
      </a>
      <SiteHeader
        logo={content.settings.logo}
        companyName={content.settings.companyName}
        items={content.navigation}
      />
      <main id="main-content">{children}</main>
      <SiteFooter settings={content.settings} />
      <SanityLiveRefresh />
    </div>
  );
}
