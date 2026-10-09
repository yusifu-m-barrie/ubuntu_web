"use client";

import { StepActions } from "@/components/apply/Fields";
import { DOCUMENT_KINDS, DOCUMENT_LABELS } from "@/lib/applications/constants";
import { fullName } from "@/lib/applications/reference";
import type { ApplicationDraft } from "@/types/application";
import { useEffect, useState } from "react";

type Props = {
  draft: ApplicationDraft;
  error?: string;
  submitting: boolean;
  onBack: () => void;
  onEdit: (step: number) => void;
  onDeclaration: (value: boolean) => void;
  onSubmit: () => void;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 py-2 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-sm font-medium text-muted">{label}</dt>
      <dd className="text-sm text-navy">{value || "—"}</dd>
    </div>
  );
}

export function ReviewStep({ draft, error, submitting, onBack, onEdit, onDeclaration, onSubmit }: Props) {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (error) setConfirming(false);
  }, [error]);

  useEffect(() => {
    if (!confirming) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !submitting) setConfirming(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [confirming, submitting]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.declaration) return;
    setConfirming(true);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <section className="rounded-2xl bg-cream p-5 ring-1 ring-navy/10 sm:p-6">
          <header className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-serif text-xl text-navy">Personal information</h2>
            <button type="button" className="text-sm font-semibold text-orange hover:underline" onClick={() => onEdit(1)} aria-label="Edit personal information">
              Edit
            </button>
          </header>
          <dl>
            <Row label="Name" value={fullName(draft.personal.firstName, draft.personal.lastName, draft.personal.middleName)} />
            <Row label="Email" value={draft.personal.email} />
            <Row label="Phone number" value={draft.personal.phone} />
            <Row label="Date of birth" value={draft.personal.dateOfBirth} />
            <Row label="Gender" value={draft.personal.gender} />
            <Row label="Country" value={draft.personal.country} />
            <Row label="City" value={draft.personal.city} />
            <Row label="Address" value={draft.personal.address} />
          </dl>
        </section>

        <section className="mt-4 rounded-2xl bg-cream p-5 ring-1 ring-navy/10 sm:p-6">
          <header className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-serif text-xl text-navy">Academic information</h2>
            <button type="button" className="text-sm font-semibold text-orange hover:underline" onClick={() => onEdit(2)} aria-label="Edit academic information">
              Edit
            </button>
          </header>
          <dl>
            <Row label="Institution" value={draft.academic.institution} />
            <Row label="Degree" value={draft.academic.degree} />
            <Row label="Field of study" value={draft.academic.fieldOfStudy} />
            <Row label="Graduation year" value={draft.academic.graduationYear} />
            <Row label="Grade / GPA" value={draft.academic.gradeOrGPA} />
            <Row label="Additional" value={draft.academic.additionalQualifications} />
          </dl>
        </section>

        <section className="mt-4 rounded-2xl bg-cream p-5 ring-1 ring-navy/10 sm:p-6">
          <header className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-serif text-xl text-navy">Programme</h2>
            <button type="button" className="text-sm font-semibold text-orange hover:underline" onClick={() => onEdit(3)} aria-label="Edit programme">
              Edit
            </button>
          </header>
          <dl>
            <Row label="Programme" value={draft.programme.programme} />
            <Row label="Interests" value={draft.programme.areasOfInterest.join(", ")} />
          </dl>
        </section>

        <section className="mt-4 rounded-2xl bg-cream p-5 ring-1 ring-navy/10 sm:p-6">
          <header className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-serif text-xl text-navy">Motivation</h2>
            <button type="button" className="text-sm font-semibold text-orange hover:underline" onClick={() => onEdit(4)} aria-label="Edit motivation">
              Edit
            </button>
          </header>
          <dl>
            <Row label="Why Ubuntu Tech Africa" value={draft.questions.motivation} />
            <Row label="Career goals" value={draft.questions.careerGoals} />
            <Row label="Projects / experience" value={draft.questions.relevantExperience} />
            <Row label="Additional" value={draft.questions.additionalInformation} />
          </dl>
        </section>

        <section className="mt-4 rounded-2xl bg-cream p-5 ring-1 ring-navy/10 sm:p-6">
          <header className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-serif text-xl text-navy">Documents</h2>
            <button type="button" className="text-sm font-semibold text-orange hover:underline" onClick={() => onEdit(5)} aria-label="Edit documents">
              Edit
            </button>
          </header>
          <ul className="space-y-2 text-sm">
            {DOCUMENT_KINDS.map((kind) => (
              <li key={kind} className="flex justify-between gap-3">
                <span className="text-muted">{DOCUMENT_LABELS[kind]}</span>
                <span className="text-right font-medium text-navy">
                  {draft.documents[kind]?.filename || (kind === "otherDocument" ? "Not provided" : "Missing")}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <label className="mt-6 flex items-start gap-3 text-sm text-navy">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-orange"
            checked={draft.declaration}
            onChange={(event) => onDeclaration(event.target.checked)}
            required
          />
          <span>
            I confirm that the information and documents I have provided are true and complete, and I consent to Ubuntu
            Afrika processing this application.
          </span>
        </label>

        {error ? (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <StepActions onBack={onBack} nextLabel="Submit application" submitting={submitting} />
      </form>

      {confirming ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/50 p-4 sm:items-center" role="presentation">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-text"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg ring-1 ring-navy/10"
          >
            <h2 id="confirm-title" className="font-serif text-2xl text-navy">
              Submit this application?
            </h2>
            <p id="confirm-text" className="mt-3 text-sm text-muted">
              You will not be able to edit it after it is sent. Keep your reference number for future communication.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="rounded-full border-2 border-navy px-5 py-2.5 text-sm font-semibold text-navy"
                onClick={() => setConfirming(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-dark disabled:opacity-60"
                onClick={onSubmit}
                disabled={submitting}
                autoFocus
              >
                {submitting ? "Submitting…" : "Confirm and submit"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
