"use client";

import { StatusPipeline } from "@/components/admin/StatusPipeline";
import { updateApplicationStatusAction } from "@/lib/applications/admin-actions";
import { STATUS_LABELS } from "@/lib/applications/constants";
import type { ApplicationStatus } from "@/types/application";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function StatusForm({ id, status }: { id: string; status: ApplicationStatus }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setValue(status);
  }, [status]);

  useEffect(() => {
    if (!confirming) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !saving) setConfirming(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [confirming, saving]);

  const sensitive = value === "ACCEPTED" || value === "REJECTED";

  async function confirm() {
    setSaving(true);
    setError("");
    const formData = new FormData();
    formData.set("id", id);
    formData.set("status", value);
    const result = await updateApplicationStatusAction(formData);
    setSaving(false);
    setConfirming(false);
    if (!result.ok) {
      setError(result.error || "Unable to update status.");
      setValue(status);
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <p className="text-sm font-medium text-cream">Tap a stage to update</p>
      <div className="mt-2">
        <StatusPipeline
          status={value}
          disabled={saving}
          onPick={(next) => {
            setValue(next);
            if (next !== status) setConfirming(true);
          }}
        />
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-orange">
          {error}
        </p>
      ) : null}

      {confirming ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/50 p-4 sm:items-center" role="presentation">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="status-confirm-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg ring-1 ring-navy/10"
          >
            <h2 id="status-confirm-title" className="font-serif text-2xl text-navy">
              {sensitive ? `Mark as ${STATUS_LABELS[value]}?` : "Change application status?"}
            </h2>
            <p className="mt-3 text-sm text-muted">
              This will change the status from {STATUS_LABELS[status]} to {STATUS_LABELS[value]}.
              {sensitive ? " This decision should be confirmed before continuing." : ""}
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="rounded-full border-2 border-navy px-5 py-2.5 text-sm font-semibold text-navy"
                onClick={() => {
                  setConfirming(false);
                  setValue(status);
                }}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-dark disabled:opacity-60"
                onClick={confirm}
                disabled={saving}
                autoFocus
              >
                {saving ? "Updating…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
