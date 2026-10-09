"use client";

export default function ApplicationsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div role="alert" className="rounded-2xl bg-white p-8 text-center ring-1 ring-navy/10">
      <h1 className="font-serif text-2xl text-navy">Unable to load applications</h1>
      <p className="mt-2 text-sm text-muted">Please try again. If the problem continues, contact the technical team.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-dark"
      >
        Try again
      </button>
    </div>
  );
}
