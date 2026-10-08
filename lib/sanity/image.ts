import imageUrlBuilder from "@sanity/image-url";
import { sanityClient, sanityConfigured } from "@/lib/sanity/client";

const builder = sanityConfigured && sanityClient ? imageUrlBuilder(sanityClient) : null;

function withVersion(url: string, version?: unknown) {
  const stamp = version ? encodeURIComponent(String(version)) : "";
  if (!url || !stamp) return url;
  return url.includes("?") ? `${url}&v=${stamp}` : `${url}?v=${stamp}`;
}

export function sanityImageUrl(source: unknown, fallback = "", version?: unknown) {
  if (!source) return fallback;
  if (typeof source === "string") {
    return withVersion(source, version) || fallback;
  }
  if (!builder) return fallback;

  const value = source as Record<string, unknown>;
  const imageSource = value.asset
    ? source
    : value.image && typeof value.image === "object"
      ? value.image
      : source;

  try {
    const url = builder.image(imageSource as Parameters<typeof builder.image>[0]).width(1600).auto("format").url();
    return withVersion(url || "", version) || fallback;
  } catch {
    return fallback;
  }
}
