"use client";

import Link from "next/link";

type Props = {
  reference: string;
  onStartNew: () => void;
};

export function SuccessPanel({ reference, onStartNew }: Props) {
  return (
    <div role="status" className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-navy/10 sm:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">Application received</p>
      <h2 className="mt-3 font-serif text-3xl text-navy">Application Submitted Successfully</h2>
      <p className="mt-4 text-muted">
        Please keep this reference number for future communication.
      </p>
      <p className="mt-6 font-serif text-2xl font-semibold tracking-wide text-navy sm:text-3xl" aria-label={`Application reference ${reference}`}>
        {reference}
      </p>
      <p className="mt-4 text-sm text-muted">
        A confirmation email will be sent to the address you provided. If it does not arrive, please check your spam
        folder and keep this reference number.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href="/apply" className="rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white hover:bg-orange-dark">
          Back to apply
        </Link>
        <button
          type="button"
          onClick={onStartNew}
          className="rounded-full border-2 border-navy px-6 py-3 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white"
        >
          Start another application
        </button>
      </div>
    </div>
  );
}
