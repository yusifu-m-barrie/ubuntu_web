import { DOCUMENT_KINDS } from "@/lib/applications/constants";
import { saveApplicationFile } from "@/lib/applications/files";
import { isDocumentKindValue } from "@/lib/applications/file-types";
import { clientKey, consumeRateLimit } from "@/lib/applications/rate-limit";
import type { DocumentKind } from "@/types/application";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}

export async function POST(request: Request) {
  const limited = consumeRateLimit("upload", clientKey(request), 20, 15 * 60 * 1000);
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "Too many uploads. Please wait and try again." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }
  try {
    const form = await request.formData();
    const kind = String(form.get("kind") || "");
    const file = form.get("file");
    if (!isDocumentKindValue(kind) || !DOCUMENT_KINDS.includes(kind as DocumentKind)) {
      return NextResponse.json({ error: "Unknown document type." }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Please choose a supported document." }, { status: 400 });
    }
    const document = await saveApplicationFile(kind, file);
    return NextResponse.json({
      document: {
        kind: document.kind,
        filename: document.filename,
        contentType: document.contentType,
        size: document.size,
        storage: document.storage,
        pathname: document.pathname,
        uploadedAt: document.uploadedAt,
      },
    });
  } catch (error) {
    const raw = error instanceof Error ? error.message : "Upload failed.";
    const message =
      /BLOB|POSTGRES|token|configured/i.test(raw) ? "Upload is temporarily unavailable. Please try again." : raw;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
