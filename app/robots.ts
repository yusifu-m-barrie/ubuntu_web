import { siteUrl } from "@/lib/content";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/api/", "/admin", "/admin/", "/apply/form"],
    },
    sitemap: siteUrl("/sitemap.xml"),
  };
}
