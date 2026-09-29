"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-serif text-3xl text-navy">Something went wrong</h1>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-orange px-5 py-2 font-semibold text-white"
      >
        Try again
      </button>
    </div>
  );
}
