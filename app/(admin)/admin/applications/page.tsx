import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireAdminPage } from "@/lib/applications/admin-guard";
import { formatAdminDate } from "@/lib/applications/admin-format";
import { APPLICATION_STATUSES, PROGRAMMES, STATUS_LABELS } from "@/lib/applications/constants";
import { listApplications } from "@/lib/applications/service";
import type { ApplicationCounts, ApplicationStatus } from "@/types/application";
import Link from "next/link";

export const metadata = {
  title: "Applications",
  robots: { index: false, follow: false },
};

type Search = {
  q?: string;
  status?: string;
  programme?: string;
  sort?: string;
  page?: string;
};

function hrefFor(params: Search, overrides: Partial<Search> = {}) {
  const next = { ...params, ...overrides };
  const search = new URLSearchParams();
  if (next.q) search.set("q", next.q);
  if (next.status) search.set("status", next.status);
  if (next.programme) search.set("programme", next.programme);
  if (next.sort && next.sort !== "newest") search.set("sort", next.sort);
  if (next.page && next.page !== "1") search.set("page", next.page);
  const query = search.toString();
  return query ? `/admin/applications?${query}` : "/admin/applications";
}

const STATS: { key: keyof ApplicationCounts; label: string; status?: ApplicationStatus; className: string }[] = [
  { key: "total", label: "Total applications", className: "bg-navy text-cream" },
  { key: "NEW", label: "New", status: "NEW", className: "bg-white text-navy" },
  { key: "UNDER_REVIEW", label: "Under review", status: "UNDER_REVIEW", className: "bg-white text-navy" },
  { key: "SHORTLISTED", label: "Shortlisted", status: "SHORTLISTED", className: "bg-white text-navy" },
  { key: "INTERVIEW", label: "Interview", status: "INTERVIEW", className: "bg-white text-navy" },
  { key: "ACCEPTED", label: "Accepted", status: "ACCEPTED", className: "bg-white text-navy" },
  { key: "REJECTED", label: "Rejected", status: "REJECTED", className: "bg-white text-navy" },
];

export default async function ApplicationsIndex({
  searchParams,
}: {
  searchParams?: Promise<Search>;
}) {
  await requireAdminPage();
  const params = (await searchParams) || {};
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
  const pageSize = result?.pageSize || 20;
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-navy">Applications</h1>
          <p className="mt-2 text-sm text-muted">Review graduate and postgraduate programme applications.</p>
        </div>
      </div>

      {counts ? (
        <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7" aria-label="Application overview">
          {STATS.map((stat) => {
            const active = stat.status ? params.status === stat.status : !params.status;
            return (
              <Link
                key={stat.key}
                href={hrefFor(params, { status: stat.status || "", page: "1" })}
                className={`rounded-2xl p-4 ring-1 transition ${stat.className} ${
                  active ? "ring-orange shadow-sm" : "ring-navy/10 hover:ring-orange/50"
                }`}
              >
                <p className={`text-xs font-semibold uppercase tracking-wide ${stat.key === "total" ? "text-orange" : "text-muted"}`}>
                  {stat.label}
                </p>
                <p className="mt-2 font-serif text-3xl">{counts[stat.key]}</p>
              </Link>
            );
          })}
        </section>
      ) : null}

      <form className="mt-8 grid gap-3 rounded-2xl bg-white p-4 ring-1 ring-navy/10 lg:grid-cols-[1.4fr_11rem_14rem_10rem_auto]" method="get" aria-label="Filter applications">
        <label className="text-sm text-navy">
          Search
          <input
            type="search"
            name="q"
            defaultValue={params.q || ""}
            placeholder="Name, email, or reference"
            className="mt-1 w-full rounded-lg border border-navy/15 bg-cream px-3 py-2"
          />
        </label>
        <label className="text-sm text-navy">
          Status
          <select name="status" defaultValue={params.status || ""} className="mt-1 w-full rounded-lg border border-navy/15 bg-cream px-3 py-2">
            <option value="">All</option>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-navy">
          Programme
          <select
            name="programme"
            defaultValue={params.programme || ""}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-cream px-3 py-2"
          >
            <option value="">All</option>
            {PROGRAMMES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-navy">
          Sort
          <select name="sort" defaultValue={params.sort || "newest"} className="mt-1 w-full rounded-lg border border-navy/15 bg-cream px-3 py-2">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
        <button type="submit" className="self-end rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white">
          Apply
        </button>
      </form>

      {error ? (
        <p role="alert" className="mt-8 rounded-2xl bg-white p-6 text-sm text-red-700 ring-1 ring-navy/10">
          {error}
        </p>
      ) : null}

      {!error && applications.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white p-10 text-center ring-1 ring-navy/10">
          <p className="font-serif text-2xl text-navy">No applications found</p>
          <p className="mt-2 text-sm text-muted">
            {params.q || params.status || params.programme
              ? "Try a different search or filter."
              : "New submissions will appear here."}
          </p>
        </div>
      ) : null}

      {applications.length ? (
        <>
          <ul className="mt-8 space-y-4 xl:hidden">
            {applications.map((item) => (
              <li key={item.id} className="rounded-2xl bg-white p-4 ring-1 ring-navy/10">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-navy">{item.fullName}</p>
                    <p className="text-sm text-muted">{item.applicationReference}</p>
                  </div>
                  <StatusBadge status={item.status as ApplicationStatus} />
                </div>
                <p className="mt-2 text-sm">{item.email}</p>
                <p className="text-sm text-muted">
                  {item.programme} · {item.degree || "—"}
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-xs text-muted">{formatAdminDate(item.submittedAt)}</span>
                  <Link href={`/admin/applications/${item.id}`} className="text-sm font-semibold text-orange">
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 hidden overflow-x-auto rounded-2xl bg-white ring-1 ring-navy/10 xl:block">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-sand text-navy">
                <tr>
                  <th className="px-4 py-3 font-semibold">Applicant name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Programme</th>
                  <th className="px-4 py-3 font-semibold">Degree</th>
                  <th className="px-4 py-3 font-semibold">Application reference</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Submitted date</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((item) => (
                  <tr key={item.id} className="border-t border-navy/10">
                    <td className="px-4 py-3 font-medium text-navy">{item.fullName}</td>
                    <td className="px-4 py-3">{item.email}</td>
                    <td className="px-4 py-3">{item.programme}</td>
                    <td className="px-4 py-3">{item.degree || "—"}</td>
                    <td className="px-4 py-3 font-medium">{item.applicationReference}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3 text-muted">{formatAdminDate(item.submittedAt)}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/applications/${item.id}`} className="font-semibold text-orange hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
                  className="rounded-full border-2 border-navy px-4 py-2 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
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
    </div>
  );
}
