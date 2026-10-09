export default function ApplicationDetailLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <p className="text-sm text-muted">Loading application…</p>
      <div className="mt-4 h-16 animate-pulse rounded-2xl bg-white ring-1 ring-navy/10" />
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-2xl bg-white ring-1 ring-navy/10" />
        <div className="h-64 animate-pulse rounded-2xl bg-white ring-1 ring-navy/10" />
      </div>
    </div>
  );
}
