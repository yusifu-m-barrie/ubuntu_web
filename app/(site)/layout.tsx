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
      <SiteHeader
        logo={content.settings.logo}
        companyName={content.settings.companyName}
        items={content.navigation}
      />
      <main>{children}</main>
      <SiteFooter settings={content.settings} />
      <SanityLiveRefresh />
    </div>
  );
}
