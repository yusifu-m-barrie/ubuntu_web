export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_FILE_LABEL = "10 MB";
export const MAX_ORIGINAL_FILENAME = 180;

export const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "jpg", "jpeg", "png"] as const;
export type AllowedExtension = (typeof ALLOWED_EXTENSIONS)[number];

export const ALLOWED_CONTENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
] as const;
export type AllowedContentType = (typeof ALLOWED_CONTENT_TYPES)[number];

export const EXTENSION_TO_MIME: Record<AllowedExtension, AllowedContentType> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

const MIME_ALIASES: Record<string, AllowedContentType> = {
  "application/pdf": "application/pdf",
  "application/x-pdf": "application/pdf",
  "application/msword": "application/msword",
  "application/vnd.ms-word": "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg": "image/jpeg",
  "image/jpg": "image/jpeg",
  "image/pjpeg": "image/jpeg",
  "image/png": "image/png",
  "image/x-png": "image/png",
};

const DOCUMENT_KINDS = ["cv", "certificate", "transcript", "otherDocument"] as const;

export const ACCEPTED_UPLOAD_ATTR = [
  ".pdf",
  ".doc",
  ".docx",
  ".jpg",
  ".jpeg",
  ".png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
].join(",");

const BLOCKED_SIGNATURES: number[][] = [
  [0x4d, 0x5a],
  [0x7f, 0x45, 0x4c, 0x46],
];

function startsWith(bytes: Uint8Array, signature: number[]) {
  return signature.every((value, index) => bytes[index] === value);
}

function latin1(bytes: Uint8Array, end = bytes.length) {
  return new TextDecoder("latin1").decode(bytes.subarray(0, end));
}

export function isAllowedExtension(value: string): value is AllowedExtension {
  return ALLOWED_EXTENSIONS.includes(value as AllowedExtension);
}

export function isAllowedContentType(value: string): value is AllowedContentType {
  return ALLOWED_CONTENT_TYPES.includes(value as AllowedContentType);
}

export function sanitizeOriginalFilename(name: string) {
  const trimmed = name.replace(/[\u0000-\u001f\u007f]/g, "").trim();
  const base = trimmed.split(/[/\\]/).pop() || "document";
  return base.slice(0, MAX_ORIGINAL_FILENAME);
}

export function extensionFromFilename(name: string): AllowedExtension | "" {
  const safe = sanitizeOriginalFilename(name).toLowerCase();
  const match = /\.([a-z0-9]+)$/.exec(safe);
  if (!match) return "";
  return isAllowedExtension(match[1]) ? match[1] : "";
}

export function isSafeStorageKey(key: string) {
  if (!key || key.length > 240) return false;
  if (key.includes("..") || key.includes("\\") || key.includes("\0") || key.startsWith("/") || key.includes("//")) {
    return false;
  }
  return /^(applications\/)?(cv|certificate|transcript|otherDocument)\/[A-Za-z0-9._-]+$/.test(key);
}

export function isSafeApplicationId(id: string) {
  return (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) || /^UTA-\d{4}-\d{6}$/.test(id)
  );
}

export function isDocumentKindValue(value: string): value is (typeof DOCUMENT_KINDS)[number] {
  return DOCUMENT_KINDS.includes(value as (typeof DOCUMENT_KINDS)[number]);
}

export function sniffAllowedType(bytes: Uint8Array, extension: AllowedExtension) {
  if (bytes.length < 8) return false;
  if (BLOCKED_SIGNATURES.some((signature) => startsWith(bytes, signature))) return false;

  if (extension === "pdf") {
    const head = latin1(bytes, Math.min(bytes.length, 1024)).replace(/^\uFEFF/, "");
    return /^\s*%PDF/.test(head) || head.includes("%PDF-");
  }
  if (extension === "jpg" || extension === "jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (extension === "png") {
    return startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  }
  if (extension === "doc") {
    return startsWith(bytes, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
  }
  if (extension === "docx") {
    const zip =
      bytes[0] === 0x50 && bytes[1] === 0x4b && (bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07);
    if (!zip) return false;
    const ascii = latin1(bytes, Math.min(bytes.length, 8192));
    return ascii.includes("word/") || ascii.includes("[Content_Types].xml");
  }
  return false;
}

export function inspectUploadMetadata(file: { name: string; type: string; size: number }) {
  const filename = sanitizeOriginalFilename(file.name);
  if (!filename || filename === "." || filename === "..") {
    throw new Error("That filename is not allowed.");
  }
  if (/[/\\]/.test(file.name) || file.name.includes("\0")) {
    throw new Error("That filename is not allowed.");
  }
  if (file.size < 1) {
    throw new Error("The selected file is empty.");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(`Each file must be ${MAX_FILE_LABEL} or smaller.`);
  }

  const extension = extensionFromFilename(filename);
  if (!extension) {
    throw new Error("Please upload a PDF, Word, JPEG, or PNG file.");
  }

  const contentType = EXTENSION_TO_MIME[extension];
  const declared = file.type.trim().toLowerCase();
  if (declared && declared !== "application/octet-stream" && declared !== "binary/octet-stream") {
    const aliased = MIME_ALIASES[declared];
    if (!aliased) {
      throw new Error("That file type is not allowed.");
    }
    if (aliased !== contentType) {
      throw new Error("The file type does not match the file contents.");
    }
  }

  return { filename, extension, contentType };
}

export async function validateSelectedFile(file: File) {
  const meta = inspectUploadMetadata(file);
  const header = new Uint8Array(await file.slice(0, 8192).arrayBuffer());
  if (!sniffAllowedType(header, meta.extension)) {
    throw new Error("The file contents do not match a supported document type.");
  }
  return meta;
}
