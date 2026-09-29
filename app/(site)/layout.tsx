import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { loadContent } from "@/lib/content";

export const dynamic = "force-static";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await loadContent();
  return (
    <>
      <SiteHeader
        logo={content.settings.logo}
        companyName={content.settings.companyName}
        items={content.navigation}
      />
      <main>{children}</main>
      <SiteFooter settings={content.settings} />
    </>
  );
}
