"use client";

import { ProgressSteps } from "@/components/apply/ProgressSteps";
import { AcademicStep } from "@/components/apply/steps/AcademicStep";
import { DocumentsStep } from "@/components/apply/steps/DocumentsStep";
import { MotivationStep } from "@/components/apply/steps/MotivationStep";
import { PersonalStep } from "@/components/apply/steps/PersonalStep";
import { ProgrammeStep } from "@/components/apply/steps/ProgrammeStep";
import { ReviewStep } from "@/components/apply/steps/ReviewStep";
import { SuccessPanel } from "@/components/apply/SuccessPanel";
import { DRAFT_STORAGE_KEY } from "@/lib/applications/constants";
import { emptyDraft } from "@/lib/applications/draft";
import { applicationPayloadSchema } from "@/lib/applications/schema";
import type { ApplicationDraft } from "@/types/application";
import { useCallback, useEffect, useRef, useState } from "react";

function readDraft(): ApplicationDraft {
  if (typeof window === "undefined") return emptyDraft();
  try {
    const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return emptyDraft();
    const parsed = JSON.parse(raw) as ApplicationDraft;
    if (!parsed?.draftId) return emptyDraft();
    const base = emptyDraft();
    return {
      ...base,
      ...parsed,
      personal: { ...base.personal, ...parsed.personal },
      academic: { ...base.academic, ...parsed.academic },
      programme: { ...base.programme, ...parsed.programme, areasOfInterest: parsed.programme?.areasOfInterest || [] },
      questions: { ...base.questions, ...parsed.questions },
      documents: parsed.documents || {},
    };
  } catch {
    return emptyDraft();
  }
}

export function ApplyWizard() {
  const [draft, setDraft] = useState<ApplicationDraft | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submittingRef = useRef(false);

  useEffect(() => {
    setDraft(readDraft());
  }, []);

  useEffect(() => {
    if (!draft) return;
    sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  }, [draft]);

  useEffect(() => {
    if (!draft) return;
    const snapshot = draft;
    function onBeforeUnload(event: BeforeUnloadEvent) {
      if (snapshot.submittedReference) return;
      const started =
        snapshot.personal.firstName ||
        snapshot.personal.email ||
        snapshot.academic.institution ||
        Object.keys(snapshot.documents).length > 0 ||
        snapshot.questions.motivation;
      if (!started) return;
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [draft]);

  const patchDraft = useCallback((partial: Partial<ApplicationDraft>) => {
    setDraft((current) => (current ? { ...current, ...partial } : current));
  }, []);

  const goTo = useCallback((step: number) => {
    setDraft((current) => (current ? { ...current, step } : current));
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.requestAnimationFrame(() => {
      document.getElementById("application-progress")?.focus();
    });
  }, []);

  async function onSubmit() {
    if (!draft || submittingRef.current || draft.submittedReference) return;
    setSubmitError("");
    const parsed = applicationPayloadSchema.safeParse({
      personal: draft.personal,
      academic: draft.academic,
      programme: draft.programme,
      questions: draft.questions,
      documents: draft.documents,
      declaration: draft.declaration,
    });
    if (!parsed.success) {
      setSubmitError(parsed.error.issues[0]?.message || "Please review the form and complete the missing fields.");
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId: draft.draftId, payload: parsed.data }),
      });
      const data = (await response.json().catch(() => ({}))) as { reference?: string; error?: string };
      if (!response.ok || !data.reference) {
        throw new Error(data.error || "Unable to submit your application right now.");
      }
      const next = { ...draft, submittedReference: data.reference };
      setDraft(next);
      sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit your application right now.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  function startNew() {
    const next = emptyDraft();
    sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    setDraft(next);
    setSubmitError("");
  }

  if (!draft) {
    return <p className="text-sm text-muted">Loading your application…</p>;
  }

  if (draft.submittedReference) {
    return <SuccessPanel reference={draft.submittedReference} onStartNew={startNew} />;
  }

  return (
    <div>
      <ProgressSteps current={draft.step} />
      {draft.step === 1 ? (
        <PersonalStep
          value={draft.personal}
          onChange={(personal) => patchDraft({ personal })}
          onNext={() => goTo(2)}
        />
      ) : null}
      {draft.step === 2 ? (
        <AcademicStep
          value={draft.academic}
          onChange={(academic) => patchDraft({ academic })}
          onNext={() => goTo(3)}
          onBack={() => goTo(1)}
        />
      ) : null}
      {draft.step === 3 ? (
        <ProgrammeStep
          value={draft.programme}
          onChange={(programme) => patchDraft({ programme })}
          onNext={() => goTo(4)}
          onBack={() => goTo(2)}
        />
      ) : null}
      {draft.step === 4 ? (
        <MotivationStep
          value={draft.questions}
          onChange={(questions) => patchDraft({ questions })}
          onNext={() => goTo(5)}
          onBack={() => goTo(3)}
        />
      ) : null}
      {draft.step === 5 ? (
        <DocumentsStep
          value={draft.documents}
          onChange={(documents) => patchDraft({ documents })}
          onNext={() => goTo(6)}
          onBack={() => goTo(4)}
        />
      ) : null}
      {draft.step === 6 ? (
        <ReviewStep
          draft={draft}
          error={submitError}
          submitting={submitting}
          onBack={() => goTo(5)}
          onEdit={goTo}
          onDeclaration={(declaration) => patchDraft({ declaration })}
          onSubmit={onSubmit}
        />
      ) : null}
    </div>
  );
}
