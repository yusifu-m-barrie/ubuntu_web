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
import type { DocumentKind, FileReference } from "@/types/application";
import { useState } from "react";

type Props = {
  value: Partial<Record<DocumentKind, FileReference>>;
  onChange: (value: Partial<Record<DocumentKind, FileReference>>) => void;
  onNext: () => void;
  onBack: () => void;
};

function uploadWithProgress(
  kind: DocumentKind,
  file: File,
  onProgress: (percent: number) => void,
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
        const data = JSON.parse(xhr.responseText) as { document?: FileReference; error?: string };
        if (xhr.status >= 200 && xhr.status < 300 && data.document) {
          resolve(data.document);
          return;
        }
        reject(new Error(data.error || "Upload failed. Please try again."));
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
    xhr.send(body);
  });
}

export function DocumentsStep({ value, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Partial<Record<DocumentKind | "form", string>>>({});
  const [uploading, setUploading] = useState<DocumentKind | null>(null);
  const [progress, setProgress] = useState(0);

  async function onFile(kind: DocumentKind, file: File | undefined, input: HTMLInputElement) {
    if (!file) return;
    setErrors((current) => ({ ...current, [kind]: undefined, form: undefined }));
    try {
      await validateSelectedFile(file);
    } catch (error) {
      input.value = "";
      setErrors((current) => ({
        ...current,
        [kind]: error instanceof Error ? error.message : "Please choose a supported document.",
      }));
      return;
    }
    setUploading(kind);
    setProgress(0);
    try {
      const document = await uploadWithProgress(kind, file, setProgress);
      onChange({ ...value, [kind]: document });
    } catch (error) {
      setErrors((current) => ({
        ...current,
        [kind]: error instanceof Error ? error.message : "Upload failed. Please try again.",
      }));
    } finally {
      input.value = "";
      setUploading(null);
      setProgress(0);
    }
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = documentsSchema.safeParse(value);
    if (!result.success) {
      const next: Partial<Record<DocumentKind | "form", string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string") next[key as DocumentKind] = "This document is required.";
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
          PDF, Word (.doc, .docx), JPEG, or PNG files, up to {MAX_FILE_LABEL} each. CV, certificate, and transcript are
          required.
        </p>
        {DOCUMENT_KINDS.map((kind) => {
          const uploaded = value[kind];
          const required = REQUIRED_DOCUMENT_KINDS.includes(kind as (typeof REQUIRED_DOCUMENT_KINDS)[number]);
          const inputId = `doc-${kind}`;
          const isUploading = uploading === kind;
          return (
            <Field
              key={kind}
              id={inputId}
              label={DOCUMENT_LABELS[kind]}
              required={required}
              hint={DOCUMENT_HINTS[kind]}
              error={errors[kind]}
            >
              <div className="rounded-xl border border-dashed border-navy/20 bg-cream px-4 py-4">
                {uploaded ? (
                  <p className="text-sm text-navy">
                    <span className="font-medium">{uploaded.filename}</span>
                    <span className="text-muted"> · {formatBytes(uploaded.size)}</span>
                  </p>
                ) : (
                  <p className="text-sm text-muted">No file selected.</p>
                )}
                {isUploading ? (
                  <div className="mt-3" aria-live="polite">
                    <p className="text-xs font-medium text-navy">Uploading… {progress}%</p>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-sand">
                      <div className="h-full rounded-full bg-orange transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                ) : (
                  <input
                    id={inputId}
                    type="file"
                    accept={ACCEPTED_UPLOAD_ATTR}
                    disabled={uploading !== null}
                    onChange={(event) => onFile(kind, event.target.files?.[0], event.currentTarget)}
                    className="mt-3 block w-full text-sm text-navy file:mr-3 file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-soft disabled:cursor-not-allowed disabled:opacity-60"
                  />
                )}
              </div>
            </Field>
          );
        })}
      </fieldset>
      <StepActions onBack={onBack} nextLabel="Continue" disableNext={uploading !== null} />
    </form>
  );
}
