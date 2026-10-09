"use client";

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
};

export function Field({ id, label, hint, error, required, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-navy">
        {label}
        {required ? (
          <>
            <span className="text-orange" aria-hidden="true">
              {" "}
              *
            </span>
            <span className="sr-only"> required</span>
          </>
        ) : (
          <span className="font-normal text-muted"> (optional)</span>
        )}
      </label>
      <div className="mt-1">{children}</div>
      {hint ? (
        <p id={hintId} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const inputClass =
  "mt-0 w-full rounded-lg border border-navy/15 bg-cream px-3 py-2.5 text-navy outline-none transition focus:border-orange";

export function describedBy(id: string, hint?: string, error?: string) {
  return [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
}

export function focusFirstError(errors: Record<string, string | undefined>) {
  const id = Object.keys(errors).find((key) => errors[key]);
  if (!id) return;
  document.getElementById(id)?.focus();
}

export function StepActions({
  onBack,
  nextLabel,
  submitting,
  disableNext,
}: {
  onBack?: () => void;
  nextLabel: string;
  submitting?: boolean;
  disableNext?: boolean;
}) {
  return (
    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border-2 border-navy px-6 py-3 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white"
        >
          Back
        </button>
      ) : (
        <span />
      )}
      <button
        type="submit"
        disabled={submitting || disableNext}
        className="btn-shine hover-glow-orange rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Submitting…" : nextLabel}
      </button>
    </div>
  );
}
