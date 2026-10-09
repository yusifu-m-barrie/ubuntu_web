import { requireAdminRequest } from "@/lib/applications/admin-guard";
import { isSafeApplicationId } from "@/lib/applications/file-types";
import { toApplicationHttpError, updateApplicationStatus } from "@/lib/applications/service";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ error: "Use the admin dashboard." }, { status: 405 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminRequest(request, { mutate: true });
    const { id } = await params;
    if (!isSafeApplicationId(id)) {
      return NextResponse.json({ error: "Invalid application." }, { status: 400 });
    }
    const body = await request.json().catch(() => null);
    const application = await updateApplicationStatus(id, body);
    return NextResponse.json({ ok: true, status: application.status });
  } catch (error) {
    const mapped = toApplicationHttpError(error);
    return NextResponse.json({ error: mapped.error, code: mapped.code }, { status: mapped.status });
  }
}
