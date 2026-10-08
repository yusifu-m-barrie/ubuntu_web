import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const PATHS = [
  "/",
  "/about-us",
  "/ubuntu-postgraduate",
  "/ubuntu-experience",
  "/careers",
  "/events",
  "/events-2",
  "/contact",
  "/apply-now",
];

function authorized(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const sanityHeader = request.headers.get("x-sanity-webhook-secret");
  const query = request.nextUrl.searchParams.get("secret");
  return header === secret || sanityHeader === secret || query === secret;
}

function bust() {
  revalidateTag("sanity");
  revalidatePath("/", "layout");
  PATHS.forEach((path) => revalidatePath(path));
}

export async function POST(request: NextRequest) {
  if (!process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Revalidation is not configured." }, { status: 501 });
  }
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  bust();
  return NextResponse.json({ revalidated: true, now: Date.now() });
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  bust();
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
