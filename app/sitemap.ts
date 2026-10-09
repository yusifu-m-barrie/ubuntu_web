import { siteUrl } from "@/lib/content";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "/",
    "/about-us",
    "/ubuntu-postgraduate",
    "/ubuntu-experience",
    "/careers",
    "/events",
    "/events-2",
    "/apply-now",
    "/apply",
    "/contact",
  ];
  return pages.map((path) => ({
    url: siteUrl(path),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
