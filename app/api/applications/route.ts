import { notifyApplicationSubmitted } from "@/lib/applications/notify";
import { clientKey, consumeRateLimit } from "@/lib/applications/rate-limit";
import { createApplication, toApplicationHttpError } from "@/lib/applications/service";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}

export async function POST(request: Request) {
  const limited = consumeRateLimit("submit", clientKey(request), 8, 15 * 60 * 1000);
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please wait and try again." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }
  const body = await request.json().catch(() => null);
  try {
    const record = await createApplication(body);
    try {
      await notifyApplicationSubmitted(record);
    } catch {
      /* Application is already stored; email failure must not fail submit. */
    }
    return NextResponse.json({ ok: true, reference: record.applicationReference });
  } catch (error) {
    const mapped = toApplicationHttpError(error);
    return NextResponse.json({ error: mapped.error, code: mapped.code }, { status: mapped.status });
  }
}
