import imageUrlBuilder from "@sanity/image-url";
import { sanityClient, sanityConfigured } from "@/lib/sanity/client";

const builder = sanityConfigured && sanityClient ? imageUrlBuilder(sanityClient) : null;

export function sanityImageUrl(source: unknown, fallback = "") {
  if (!source || !builder) return fallback;
  try {
    return builder.image(source as Parameters<typeof builder.image>[0]).width(800).url() || fallback;
  } catch {
    return fallback;
  }
}
