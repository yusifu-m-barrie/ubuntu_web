"use client";

import { addAdminNoteAction } from "@/lib/applications/admin-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function NotesForm({ id }: { id: string }) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!notes.trim()) return;
    setSaving(true);
    setError("");
    const formData = new FormData();
    formData.set("id", id);
    formData.set("notes", notes);
    const result = await addAdminNoteAction(formData);
    setSaving(false);
    if (!result.ok) {
      setError(result.error || "Unable to save notes.");
      return;
    }
    setNotes("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      <label htmlFor="adminNotes" className="text-sm font-medium text-navy">
        Add a note
      </label>
      <textarea
        id="adminNotes"
        rows={4}
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        className="w-full rounded-lg border border-navy/15 bg-cream px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={saving || !notes.trim()}
        className="rounded-full bg-orange px-4 py-2 text-sm font-semibold text-white hover:bg-orange-dark disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save note"}
      </button>
      {error ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </form>
  );
}
