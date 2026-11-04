import { requireAdminRequest } from "@/lib/applications/admin-guard";
import { queryRows } from "@/lib/applications/db";
import { toApplicationHttpError } from "@/lib/applications/service";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}

export async function POST(request: Request) {
  try {
    await requireAdminRequest(request, { mutate: true });
    const rows = await queryRows<{ removed: number }>(`
      WITH deleted AS (
        DELETE FROM applications
        WHERE submitted_at < date_trunc('day', CURRENT_TIMESTAMP)
        RETURNING id
      )
      SELECT COUNT(*)::int AS removed FROM deleted
    `);
    return NextResponse.json({
      ok: true,
      removed: rows[0]?.removed ?? 0,
      keptToday: true,
    });
  } catch (error) {
    const mapped = toApplicationHttpError(error);
    return NextResponse.json({ error: mapped.error, code: mapped.code }, { status: mapped.status });
  }
}
