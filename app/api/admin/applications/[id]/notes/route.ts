import { requireAdminRequest } from "@/lib/applications/admin-guard";
import { isSafeApplicationId } from "@/lib/applications/file-types";
import { addAdminNotes, toApplicationHttpError } from "@/lib/applications/service";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminRequest(request, { mutate: true });
    const { id } = await params;
    if (!isSafeApplicationId(id)) {
      return NextResponse.json({ error: "Invalid application." }, { status: 400 });
    }
    const body = await request.json().catch(() => null);
    await addAdminNotes(id, body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const mapped = toApplicationHttpError(error);
    return NextResponse.json({ error: mapped.error, code: mapped.code }, { status: mapped.status });
  }
}
