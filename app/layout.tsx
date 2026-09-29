import type { Metadata } from "next";
import { DM_Sans, Source_Serif_4 } from "next/font/google";
import { loadContent, siteUrl } from "@/lib/content";
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await loadContent();
  const { settings } = content;
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: settings.defaultSeo.title,
      template: `%s | ${settings.companyName}`,
    },
    description: settings.defaultSeo.description,
    icons: { icon: settings.favicon },
    openGraph: {
      title: settings.defaultSeo.title,
      description: settings.defaultSeo.description,
      images: [settings.defaultSeo.ogImage || settings.logo],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.defaultSeo.title,
      description: settings.defaultSeo.description,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen bg-cream font-sans antialiased">{children}</body>
    </html>
  );
}
