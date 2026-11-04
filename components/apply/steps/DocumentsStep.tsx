"use client";

import { Field, focusFirstError, StepActions } from "@/components/apply/Fields";
import {
  ACCEPTED_UPLOAD_ATTR,
  DOCUMENT_HINTS,
  DOCUMENT_KINDS,
  DOCUMENT_LABELS,
  MAX_FILE_LABEL,
  REQUIRED_DOCUMENT_KINDS,
} from "@/lib/applications/constants";
import { formatBytes } from "@/lib/applications/draft";
import { validateSelectedFile } from "@/lib/applications/file-types";
import { documentsSchema } from "@/lib/applications/schema";
import type { DraftDocuments, DocumentKind, FileReference } from "@/types/application";
import { useRef, useState } from "react";

type Props = {
  value: DraftDocuments;
  onChange: (value: DraftDocuments) => void;
  onNext: () => void;
  onBack: () => void;
};

type UploadEntry = {
  id: string;
  kind: DocumentKind;
  filename: string;
  size: number;
  file: File;
  status: "uploading" | "uploaded" | "error";
  progress: number;
  error?: string;
  uploaded?: FileReference;
};

function uploadWithProgress(
  kind: DocumentKind,
  file: File,
  onProgress: (percent: number) => void,
  onRequest: (request: XMLHttpRequest) => void,
): Promise<FileReference> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/applications/upload");
    xhr.timeout = 120000;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText) as {
          document?: FileReference;
          error?: string;
        };

        if (xhr.status >= 200 && xhr.status < 300 && data.document) {
          resolve(data.document);
        } else {
          reject(new Error(data.error || "Upload failed. Please try again."));
        }
      } catch {
        reject(new Error("Upload failed. Please try again."));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed. Check your connection and try again."));
    xhr.ontimeout = () => reject(new Error("The upload timed out. Please try again."));
    xhr.onabort = () => reject(new Error("The upload was cancelled."));

    const body = new FormData();
    body.append("kind", kind);
    body.append("file", file);
    onRequest(xhr);
    xhr.send(body);
  });
}

export function DocumentsStep({ value, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Partial<Record<DocumentKind | "form", string>>>({});
  const [uploads, setUploads] = useState<UploadEntry[]>([]);
  const documentsRef = useRef(value);
  const uploadsRef = useRef<UploadEntry[]>([]);
  const uploadRequests = useRef(new Map<string, XMLHttpRequest>());
  const cancelledUploads = useRef(new Set<string>());

  function updateDocuments(update: (current: DraftDocuments) => DraftDocuments) {
    const next = update(documentsRef.current);
    documentsRef.current = next;
    onChange(next);
  }

  function setUploadList(next: UploadEntry[] | ((current: UploadEntry[]) => UploadEntry[])) {
    setUploads((current) => {
      const resolved = typeof next === "function" ? next(current) : next;
      uploadsRef.current = resolved;
      return resolved;
    });
  }

  function updateUpload(id: string, update: (entry: UploadEntry) => UploadEntry) {
    setUploadList((current) => current.map((entry) => (entry.id === id ? update(entry) : entry)));
  }

  function sameFilename(left: string, right: string) {
    return left.trim().toLowerCase() === right.trim().toLowerCase();
  }

  function takenFilenames(exceptKind?: DocumentKind) {
    const names: string[] = [];
    const documents = documentsRef.current;
    for (const kind of DOCUMENT_KINDS) {
      if (exceptKind && kind === exceptKind && kind !== "otherDocument") continue;
      if (kind === "otherDocument") {
        for (const file of documents.otherDocument ?? []) names.push(file.filename);
      } else if (documents[kind]) {
        names.push(documents[kind].filename);
      }
    }
    for (const entry of uploadsRef.current) {
      if (exceptKind && entry.kind === exceptKind && exceptKind !== "otherDocument") continue;
      if (entry.status !== "error") names.push(entry.filename);
    }
    return names;
  }

  async function uploadFile(kind: DocumentKind, file: File, id: string) {
    try {
      await validateSelectedFile(file);
    } catch (error) {
      updateUpload(id, (entry) => ({
        ...entry,
        status: "error",
        error: error instanceof Error ? error.message : "Please choose a supported document.",
      }));
      return;
    }

    if (cancelledUploads.current.has(id)) return;

    try {
      const uploaded = await uploadWithProgress(
        kind,
        file,
        (progress) => {
          if (!cancelledUploads.current.has(id)) {
            updateUpload(id, (entry) => ({ ...entry, progress }));
          }
        },
        (request) => uploadRequests.current.set(id, request),
      );

      if (cancelledUploads.current.has(id)) return;

      updateDocuments((current) => {
        if (kind === "otherDocument") {
          return {
            ...current,
            otherDocument: [...(current.otherDocument ?? []), uploaded],
          };
        }

        return { ...current, [kind]: uploaded };
      });

      updateUpload(id, (entry) => ({
        ...entry,
        status: "uploaded",
        progress: 100,
        error: undefined,
        uploaded,
      }));
      setErrors((current) => ({ ...current, [kind]: undefined, form: undefined }));
    } catch (error) {
      if (cancelledUploads.current.has(id)) return;

      updateUpload(id, (entry) => ({
        ...entry,
        status: "error",
        error: error instanceof Error ? error.message : "Upload failed. Please try again.",
      }));
    } finally {
      uploadRequests.current.delete(id);
    }
  }

  function removeFile(kind: DocumentKind, file: FileReference) {
    updateDocuments((current) => {
      if (kind === "otherDocument") {
        return {
          ...current,
          otherDocument: (current.otherDocument ?? []).filter((item) => item !== file),
        };
      }

      const next = { ...current };
      delete next[kind];
      return next;
    });
  }

  function removeUpload(entry: UploadEntry) {
    cancelledUploads.current.add(entry.id);
    uploadRequests.current.get(entry.id)?.abort();
    setUploadList((current) => current.filter((item) => item.id !== entry.id));
    if (entry.uploaded) removeFile(entry.kind, entry.uploaded);
  }

  function onFilesSelected(kind: DocumentKind, files: FileList | null) {
    if (!files?.length) return;

    setErrors((current) => ({ ...current, [kind]: undefined, form: undefined }));

    const selectedFiles = Array.from(files);
    const taken = takenFilenames(kind === "otherDocument" ? undefined : kind);
    const accepted: File[] = [];
    const seen = new Set<string>();
    let duplicate = false;

    for (const file of selectedFiles) {
      const key = file.name.trim().toLowerCase();
      if (!key || seen.has(key) || taken.some((name) => sameFilename(name, file.name))) {
        duplicate = true;
        continue;
      }
      seen.add(key);
      accepted.push(file);
    }

    if (kind === "otherDocument") {
      const currentCount = documentsRef.current.otherDocument?.length ?? 0;
      if (currentCount + accepted.length > 8) {
        setErrors((current) => ({
          ...current,
          otherDocument: "You can upload up to 8 supporting documents.",
        }));
        return;
      }
    }

    if (duplicate) {
      setErrors((current) => ({
        ...current,
        [kind]: "A file with this name is already uploaded. Choose a different file.",
      }));
      if (!accepted.length) return;
    }

    const entries = accepted.map((file) => ({
      id: crypto.randomUUID(),
      kind,
      filename: file.name,
      size: file.size,
      file,
      status: "uploading" as const,
      progress: 0,
    }));

    setUploadList((current) => [
      ...current.filter((entry) => kind === "otherDocument" || entry.kind !== kind),
      ...entries,
    ]);

    for (const entry of entries) {
      void uploadFile(kind, entry.file, entry.id);
    }
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    const result = documentsSchema.safeParse(documentsRef.current);
    if (!result.success) {
      const next: Partial<Record<DocumentKind | "form", string>> = {};

      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string") {
          next[key as DocumentKind] = "This document is required.";
        }
      }

      setErrors(next);
      const first = Object.keys(next)[0];
      if (first) document.getElementById(`doc-${first}`)?.focus();
      else focusFirstError(next);
      return;
    }

    setErrors({});
    onNext();
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <fieldset className="space-y-4">
        <legend className="sr-only">Application documents</legend>
        <p className="text-sm text-muted">
          PDF, Word (.doc, .docx), JPEG, or PNG files, up to {MAX_FILE_LABEL} each. Degree / Certificate / Official
          Attestation, Academic Transcript / Statement of Result, and CV / Resume are required. Other supporting
          document is optional.
        </p>

        {DOCUMENT_KINDS.map((kind) => {
          const required = REQUIRED_DOCUMENT_KINDS.includes(kind as (typeof REQUIRED_DOCUMENT_KINDS)[number]);
          const fieldId = `doc-${kind}`;
          const entries = uploads.filter((entry) => entry.kind === kind);
          const isOther = kind === "otherDocument";
          const busy = entries.some((entry) => entry.status === "uploading");

          const existingFiles = isOther
            ? value.otherDocument ?? []
            : value[kind]
              ? [value[kind] as FileReference]
              : [];
          const savedFiles = existingFiles.filter((file) => !entries.some((entry) => entry.uploaded === file));
          const hasFiles = entries.length > 0 || savedFiles.length > 0;

          return (
            <Field
              key={kind}
              id={fieldId}
              label={DOCUMENT_LABELS[kind]}
              required={required}
              hint={DOCUMENT_HINTS[kind]}
              error={errors[kind]}
            >
              <div className="rounded-xl border border-dashed border-navy/20 bg-cream px-4 py-4">
                <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
                  <div className="shrink-0">
                    <input
                      id={fieldId}
                      type="file"
                      accept={ACCEPTED_UPLOAD_ATTR}
                      multiple={isOther}
                      disabled={!isOther && busy}
                      onChange={(event) => {
                        onFilesSelected(kind, event.currentTarget.files);
                        event.currentTarget.value = "";
                      }}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={fieldId}
                      className="inline-flex cursor-pointer rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-soft peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orange"
                    >
                      {isOther ? "Add supporting documents" : "Choose file"}
                    </label>
                  </div>
                  <div className="min-w-0">
                    {hasFiles ? (
                      <ul className="space-y-3">
                        {entries.map((entry) => (
                          <li key={entry.id} className="text-sm text-navy">
                            <div className="flex items-start justify-between gap-3">
                              <p className="min-w-0 break-words">
                                <span className="font-medium">{entry.filename}</span>
                                <span className="text-muted"> · {formatBytes(entry.size)}</span>
                                {entry.status === "uploaded" ? " · Uploaded" : null}
                              </p>
                              <button
                                type="button"
                                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-navy hover:bg-navy/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                                aria-label={`Remove ${entry.filename}`}
                                onClick={() => removeUpload(entry)}
                              >
                                ×
                              </button>
                            </div>
                            {entry.status === "uploading" ? (
                              <div className="mt-2" aria-live="polite">
                                <p className="text-xs font-medium">Uploading… {entry.progress}%</p>
                                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-sand">
                                  <div
                                    className="h-full rounded-full bg-orange transition-all"
                                    style={{ width: `${entry.progress}%` }}
                                  />
                                </div>
                              </div>
                            ) : null}
                            {entry.status === "error" ? (
                              <div className="mt-1 flex items-center gap-3">
                                <p role="alert" className="text-xs text-red-700">
                                  {entry.error}
                                </p>
                                <button
                                  type="button"
                                  className="text-xs font-semibold text-orange hover:underline"
                                  onClick={() => {
                                    updateUpload(entry.id, (current) => ({
                                      ...current,
                                      status: "uploading",
                                      progress: 0,
                                      error: undefined,
                                    }));
                                    void uploadFile(kind, entry.file, entry.id);
                                  }}
                                >
                                  Retry
                                </button>
                              </div>
                            ) : null}
                          </li>
                        ))}
                        {savedFiles.map((file) => (
                          <li key={file.pathname} className="flex items-start justify-between gap-3 text-sm text-navy">
                            <p className="min-w-0 break-words">
                              <span className="font-medium">{file.filename}</span>
                              <span className="text-muted"> · {formatBytes(file.size)} · Uploaded</span>
                            </p>
                            <button
                              type="button"
                              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-navy hover:bg-navy/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                              aria-label={`Remove ${file.filename}`}
                              onClick={() => removeFile(kind, file)}
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="pt-1.5 text-sm text-muted">No file chosen</p>
                    )}
                  </div>
                </div>
              </div>
            </Field>
          );
        })}
      </fieldset>

      <StepActions
        onBack={onBack}
        nextLabel="Continue"
        disableNext={uploads.some((entry) => entry.status === "uploading")}
      />
    </form>
  );
}