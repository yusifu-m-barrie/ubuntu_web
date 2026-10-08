import { sanityClient, sanityConfigured } from "@/lib/sanity/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!sanityConfigured || !sanityClient) {
    return NextResponse.json({ stamp: "" });
  }

  try {
    const stamp = await sanityClient.fetch<string | null>(
      `*[!(_id in path("drafts.**"))] | order(_updatedAt desc)[0]._updatedAt`,
      {},
      { cache: "no-store" },
    );
    return NextResponse.json(
      { stamp: stamp || "" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ stamp: "" });
  }
}
