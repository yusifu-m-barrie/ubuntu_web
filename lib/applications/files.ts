import { get, put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import type { DocumentKind, UploadedDocument } from "@/types/application";
import {
  isSafeStorageKey,
  inspectUploadMetadata,
  sniffAllowedType,
  type AllowedContentType,
} from "@/lib/applications/file-types";

const localRoot = () => path.resolve(process.cwd(), ".data", "uploads");

function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function uniqueStorageName(kind: DocumentKind, extension: string) {
  return `${kind}/${randomUUID()}.${extension}`;
}

function assertSafeStorageKey(key: string) {
  if (!isSafeStorageKey(key)) {
    throw new Error("Invalid file reference.");
  }
}

async function resolveLocalPath(storageKey: string) {
  assertSafeStorageKey(storageKey);
  const relative = storageKey.replace(/^applications\//, "");
  const root = localRoot();
  const absolute = path.resolve(root, relative);
  const prefix = root.endsWith(path.sep) ? root : root + path.sep;
  if (absolute !== root && !absolute.startsWith(prefix)) {
    throw new Error("Invalid file reference.");
  }
  return absolute;
}

export async function saveApplicationFile(kind: DocumentKind, file: File): Promise<UploadedDocument> {
  const meta = inspectUploadMetadata(file);
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!sniffAllowedType(bytes.subarray(0, Math.min(bytes.length, 8192)), meta.extension)) {
    throw new Error("The file contents do not match a supported document type.");
  }

  const relativeKey = uniqueStorageName(kind, meta.extension);
  const uploadedAt = new Date().toISOString();
  const record = {
    kind,
    filename: meta.filename,
    contentType: meta.contentType,
    size: bytes.byteLength,
    uploadedAt,
  };

  if (blobConfigured()) {
    const storageKey = `applications/${relativeKey}`;
    await put(storageKey, Buffer.from(bytes), {
      access: "private",
      contentType: meta.contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
    });
    return {
      ...record,
      storage: "blob",
      pathname: storageKey,
    };
  }

  if (process.env.VERCEL) {
    throw new Error("File storage is not configured. Set BLOB_READ_WRITE_TOKEN.");
  }

  const absolute = await resolveLocalPath(relativeKey);
  await fs.mkdir(path.dirname(absolute), { recursive: true });
  await fs.writeFile(absolute, bytes);
  return {
    ...record,
    storage: "local",
    pathname: relativeKey,
  };
}

export function contentDisposition(filename: string) {
  const ascii = filename.replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "_").slice(0, 180) || "document";
  const encoded = encodeURIComponent(filename.replace(/[\r\n]/g, "")).slice(0, 500);
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}

export function downloadContentType(stored: string): AllowedContentType | "application/octet-stream" {
  if (
    stored === "application/pdf" ||
    stored === "application/msword" ||
    stored === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    stored === "image/jpeg" ||
    stored === "image/png"
  ) {
    return stored;
  }
  return "application/octet-stream";
}

export async function readApplicationFile(doc: UploadedDocument) {
  assertSafeStorageKey(doc.pathname);
  const contentType = downloadContentType(doc.contentType);

  if (doc.storage === "blob") {
    const result = await get(doc.pathname, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    if (!result || result.statusCode !== 200 || !result.stream) {
      throw new Error("Unable to download this file.");
    }
    return {
      stream: result.stream,
      contentType,
      filename: doc.filename,
    };
  }

  const absolute = await resolveLocalPath(doc.pathname);
  const data = await fs.readFile(absolute);
  return {
    stream: new Uint8Array(data),
    contentType,
    filename: doc.filename,
  };
}
