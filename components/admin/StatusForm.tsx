"use client";

import { updateApplicationStatusAction } from "@/lib/applications/admin-actions";
import { APPLICATION_STATUSES, STATUS_LABELS } from "@/lib/applications/constants";
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
      <label htmlFor="status" className="text-sm font-medium text-navy">
        Application status
      </label>
      <select
        id="status"
        value={value}
        disabled={saving}
        onChange={(event) => setValue(event.target.value as ApplicationStatus)}
        className="mt-1 w-full rounded-lg border border-navy/15 bg-cream px-3 py-2 text-sm"
      >
        {APPLICATION_STATUSES.map((item) => (
          <option key={item} value={item}>
            {STATUS_LABELS[item]}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={saving || value === status}
        onClick={() => setConfirming(true)}
        className="mt-3 w-full rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-soft disabled:opacity-60"
      >
        {saving ? "Updating…" : "Update status"}
      </button>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-red-700">
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
                onClick={() => setConfirming(false)}
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
