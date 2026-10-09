import { requireAdminRequest } from "@/lib/applications/admin-guard";
import { DOCUMENT_KINDS } from "@/lib/applications/constants";
import { toApplicationHttpError } from "@/lib/applications/errors";
import { contentDisposition, readApplicationFile } from "@/lib/applications/files";
import { isDocumentKindValue, isSafeApplicationId } from "@/lib/applications/file-types";
import { documentFromRecord } from "@/lib/applications/map";
import { getApplication } from "@/lib/applications/service";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string; kind: string }> }) {
  try {
    await requireAdminRequest(request, { mutate: false });
    const { id, kind } = await params;
    if (!isSafeApplicationId(id)) {
      return NextResponse.json({ error: "Invalid application." }, { status: 400 });
    }
    if (!isDocumentKindValue(kind) || !DOCUMENT_KINDS.includes(kind)) {
      return NextResponse.json({ error: "Unknown document type." }, { status: 400 });
    }
    const application = await getApplication(id);
    const file = documentFromRecord(application, kind);
    if (!file) {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }
    const downloaded = await readApplicationFile(file);
    const body = downloaded.stream instanceof Uint8Array ? Buffer.from(downloaded.stream) : downloaded.stream;
    return new NextResponse(body, {
      headers: {
        "Content-Type": downloaded.contentType,
        "Content-Disposition": contentDisposition(downloaded.filename),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch (error) {
    const mapped = toApplicationHttpError(error);
    return NextResponse.json({ error: mapped.error, code: mapped.code }, { status: mapped.status });
  }
}
