import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatAdminDate } from "@/lib/applications/admin-format";
import { APPLICATION_STATUSES, FIELDS_OF_STUDY, STATUS_LABELS } from "@/lib/applications/constants";
import { listApplications } from "@/lib/applications/service";
import type { ApplicationCounts, ApplicationStatus } from "@/types/application";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Applications",
  robots: { index: false, follow: false },
};

type Search = {
  q?: string;
  status?: string;
  programme?: string;
  fieldOfStudy?: string;
  sort?: string;
  page?: string;
};

function hrefFor(params: Search, overrides: Partial<Search> = {}) {
  const next = { ...params, ...overrides };
  const search = new URLSearchParams();
  if (next.q) search.set("q", next.q);
  if (next.status) search.set("status", next.status);
  if (next.programme) search.set("programme", next.programme);
  if (next.fieldOfStudy) search.set("fieldOfStudy", next.fieldOfStudy);
  if (next.sort && next.sort !== "newest") search.set("sort", next.sort);
  if (next.page && next.page !== "1") search.set("page", next.page);
  const query = search.toString();
  return query ? `/admin/applications?${query}` : "/admin/applications";
}

const STATS: { key: keyof ApplicationCounts; label: string; status?: ApplicationStatus; className: string }[] = [
  { key: "total", label: "Total", className: "bg-navy text-cream" },
  { key: "NEW", label: "New", status: "NEW", className: "bg-orange text-white" },
  { key: "UNDER_REVIEW", label: "Under review", status: "UNDER_REVIEW", className: "bg-navy-soft text-cream" },
  { key: "SHORTLISTED", label: "Shortlisted", status: "SHORTLISTED", className: "bg-sand text-navy" },
  { key: "INTERVIEW", label: "Interview", status: "INTERVIEW", className: "bg-navy text-orange" },
  { key: "ACCEPTED", label: "Accepted", status: "ACCEPTED", className: "bg-white text-navy ring-2 ring-orange" },
  { key: "REJECTED", label: "Rejected", status: "REJECTED", className: "bg-white text-navy" },
];

function FilterForm({ params }: { params: Search }) {
  const filtered = Boolean(params.q || params.status || params.fieldOfStudy || params.programme);
  return (
    <form
      className="mt-8 grid gap-3 rounded-2xl bg-white p-4 ring-1 ring-navy/10 lg:grid-cols-[1.2fr_10rem_12rem_9rem_auto_auto]"
      method="get"
      aria-label="Filter applications"
    >
      <label className="text-sm text-navy">
        Search
        <input
          type="search"
          name="q"
          defaultValue={params.q || ""}
          placeholder="Name, email, or reference"
          className="mt-1 w-full rounded-xl border border-navy/15 bg-cream px-3 py-2"
        />
      </label>
      <label className="text-sm text-navy">
        Status
        <select name="status" defaultValue={params.status || ""} className="mt-1 w-full rounded-xl border border-navy/15 bg-cream px-3 py-2">
          <option value="">All</option>
          {APPLICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm text-navy">
        Field of study
        <select
          name="fieldOfStudy"
          defaultValue={params.fieldOfStudy || ""}
          className="mt-1 w-full rounded-xl border border-navy/15 bg-cream px-3 py-2"
        >
          <option value="">All fields</option>
          {FIELDS_OF_STUDY.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm text-navy">
        Sort
        <select name="sort" defaultValue={params.sort || "newest"} className="mt-1 w-full rounded-xl border border-navy/15 bg-cream px-3 py-2">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </label>
      <button type="submit" className="self-end rounded-full bg-orange px-5 py-2 text-sm font-semibold text-white hover:bg-orange-dark">
        Apply
      </button>
      {filtered ? (
        <Link href="/admin/applications" className="self-end rounded-full border-2 border-navy px-5 py-2 text-center text-sm font-semibold text-navy hover:bg-navy hover:text-white">
          Clear
        </Link>
      ) : (
        <span className="hidden lg:block" />
      )}
    </form>
  );
}

function QueueSkeleton() {
  return (
    <div className="mt-8" aria-busy="true">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
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

async function ApplicationsQueue({ params }: { params: Search }) {
  let error = "";
  let result = null;
  try {
    result = await listApplications(params);
  } catch (caught) {
    error = caught instanceof Error ? caught.message : "Unable to load applications.";
  }

  const applications = result?.items || [];
  const counts = result?.counts;
  const total = result?.total || 0;
  const page = result?.page || 1;
  const pageSize = result?.pageSize || 48;
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const filtered = Boolean(params.q || params.status || params.fieldOfStudy || params.programme);

  return (
    <>
      {counts ? (
        <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7" aria-label="Application overview">
          {STATS.map((stat) => {
            const active = stat.status ? params.status === stat.status : !params.status;
            return (
              <Link
                key={stat.key}
                href={hrefFor(params, { status: stat.status || "", page: "1" })}
                className={`rounded-2xl p-4 ring-1 transition hover:-translate-y-0.5 ${stat.className} ${
                  active ? "ring-orange shadow-[0_10px_24px_rgba(238,122,18,0.28)]" : "ring-navy/10"
                }`}
              >
                <p
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    stat.key === "NEW"
                      ? "text-white/90"
                      : stat.key === "total" || stat.key === "UNDER_REVIEW" || stat.key === "INTERVIEW"
                        ? "text-orange"
                        : "text-muted"
                  }`}
                >
                  {stat.label}
                </p>
                <p className="mt-2 font-serif text-3xl">{counts[stat.key]}</p>
              </Link>
            );
          })}
        </section>
      ) : null}

      {error ? (
        <p role="alert" className="mt-8 rounded-2xl bg-white p-6 text-sm text-red-700 ring-1 ring-navy/10">
          {error}
        </p>
      ) : null}

      {!error && applications.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white p-10 text-center ring-1 ring-navy/10">
          <p className="font-serif text-2xl text-navy">No applications found</p>
          <p className="mt-2 text-sm text-muted">
            {filtered ? "Try a different search or filter." : "New submissions will appear here."}
          </p>
        </div>
      ) : null}

      {applications.length ? (
        <>
          <ul className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(16.5rem,1fr))] gap-3">
            {applications.map((item) => (
              <li key={item.id} className="min-w-0">
                <Link
                  href={`/admin/applications/${item.id}`}
                  className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-navy/10 transition hover:-translate-y-0.5 hover:ring-orange"
                >
                  <span className="h-1.5 shrink-0 bg-orange" aria-hidden />
                  <div className="flex min-w-0 flex-1 flex-col p-3">
                    <div className="flex items-start justify-between gap-1.5">
                      <p className="min-w-0 truncate text-sm font-semibold text-navy">{item.fullName}</p>
                      <StatusBadge status={item.status as ApplicationStatus} />
                    </div>
                    <p className="mt-1 truncate text-xs font-medium text-orange">{item.applicationReference}</p>
                    <p className="mt-2 truncate text-xs text-navy">{item.email}</p>
                    <p className="mt-1 truncate text-xs text-muted">{item.fieldOfStudy || "Field not set"}</p>
                    <p className="truncate text-xs text-muted">
                      {item.district || "—"} · {item.degree || "—"}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                      <span className="truncate text-[11px] text-muted">{formatAdminDate(item.submittedAt)}</span>
                      <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-navy px-2.5 py-1 text-[11px] font-semibold text-white group-hover:bg-orange">
                        Review
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <nav className="mt-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center" aria-label="Pagination">
            <p className="text-sm text-muted">
              Showing {from}–{to} of {total}
            </p>
            <div className="flex gap-2">
              {page > 1 ? (
                <Link
                  href={hrefFor(params, { page: String(page - 1) })}
                  className="rounded-full border-2 border-navy px-4 py-2 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
                >
                  Previous
                </Link>
              ) : (
                <span className="rounded-full border-2 border-navy/20 px-4 py-2 text-sm text-muted">Previous</span>
              )}
              {page < totalPages ? (
                <Link
                  href={hrefFor(params, { page: String(page + 1) })}
                  className="rounded-full bg-orange px-4 py-2 text-sm font-semibold text-white hover:bg-orange-dark"
                >
                  Next
                </Link>
              ) : (
                <span className="rounded-full border-2 border-navy/20 px-4 py-2 text-sm text-muted">Next</span>
              )}
            </div>
          </nav>
        </>
      ) : null}
    </>
  );
}

export default async function ApplicationsIndex({
  searchParams,
}: {
  searchParams?: Promise<Search>;
}) {
  const params = (await searchParams) || {};

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">Review queue</p>
          <h1 className="mt-1 font-serif text-3xl text-navy">Applications</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Open a file to read the application, download documents, leave notes, and move it through review.
          </p>
        </div>
      </div>

      <FilterForm params={params} />

      <Suspense fallback={<QueueSkeleton />}>
        <ApplicationsQueue params={params} />
      </Suspense>
    </div>
  );
}
