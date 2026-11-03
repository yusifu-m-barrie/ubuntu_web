export default function ApplicationsLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <div className="h-8 w-64 animate-pulse rounded bg-sand" />
      <p className="mt-3 text-sm text-muted">Loading applications…</p>
      <div className="mt-8 h-28 animate-pulse rounded-2xl bg-white ring-1 ring-navy/10" />
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-2xl bg-white ring-1 ring-navy/10" />
        ))}
      </div>
      <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(16.5rem,1fr))] gap-3">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="h-40 animate-pulse rounded-2xl bg-white ring-1 ring-navy/10" />
        ))}
      </div>
    </div>
  );
}
