import { AdminHistory } from "@/components/admin/AdminHistory";
import { CopyButton } from "@/components/admin/CopyButton";
import { NotesForm } from "@/components/admin/NotesForm";
import { PrintButton } from "@/components/admin/PrintButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusForm } from "@/components/admin/StatusForm";
import { formatAdminDate, formatAdminDay } from "@/lib/applications/admin-format";
import { requireAdminPage } from "@/lib/applications/admin-guard";
import { displayFieldOfStudy, DOCUMENT_KINDS, DOCUMENT_LABELS } from "@/lib/applications/constants";
import { formatBytes } from "@/lib/applications/draft";
import { ApplicationNotFoundError } from "@/lib/applications/errors";
import { isSafeApplicationId } from "@/lib/applications/file-types";
import { documentFromRecord, requiredDocumentStats } from "@/lib/applications/map";
import { fullName } from "@/lib/applications/reference";
import { getApplication, listApplications } from "@/lib/applications/service";
import { ChevronLeft, ChevronRight, Download, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export const metadata = {
  title: "Application",
  robots: { index: false, follow: false },
};

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-1 py-2 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-sm font-medium text-muted">{label}</dt>
      <dd className="text-sm text-navy">{value || "—"}</dd>
    </div>
  );
}

export default async function ApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const { id } = await params;
  if (!isSafeApplicationId(id)) notFound();

  let application;
  let queue = null;
  try {
    const loaded = await Promise.all([
      getApplication(id),
      listApplications({ sort: "newest", page: "1" }).catch(() => null),
    ]);
    application = loaded[0];
    queue = loaded[1];
  } catch (error) {
    if (error instanceof ApplicationNotFoundError) notFound();
    throw error;
  }

  const name = fullName(application.firstName, application.lastName, application.middleName);
  const address = [application.address, application.district, application.country].filter(Boolean).join(", ");
  const field = displayFieldOfStudy(application.fieldOfStudy, application.fieldOfStudyOther);
  const docs = requiredDocumentStats(application);
  const queueIndex = queue?.items.findIndex((item) => item.id === application.id) ?? -1;
  const previous = queueIndex > 0 ? queue?.items[queueIndex - 1] : null;
  const next = queueIndex >= 0 ? queue?.items[queueIndex + 1] : null;

  return (
    <article>
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/admin/applications" className="font-semibold text-orange hover:underline">
          All applications
        </Link>
        <div className="flex flex-wrap gap-2">
          {previous ? (
            <Link
              href={`/admin/applications/${previous.id}`}
              className="inline-flex items-center gap-1 rounded-full border border-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:border-orange"
            >
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
              Previous
            </Link>
          ) : null}
          {next ? (
            <Link
              href={`/admin/applications/${next.id}`}
              className="inline-flex items-center gap-1 rounded-full border border-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:border-orange"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          ) : null}
          <PrintButton />
        </div>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-orange">{application.programme}</p>
      <h1 className="mt-2 font-serif text-3xl text-navy md:text-4xl">{name}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-navy px-3 py-1 text-sm font-semibold text-orange">
          {application.applicationReference}
        </span>
        <CopyButton value={application.applicationReference} label="Copy reference" />
        <StatusBadge status={application.status} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
        <span className="rounded-full bg-white px-3 py-1 text-navy ring-1 ring-navy/10">{field || "Field not set"}</span>
        <span className="rounded-full bg-white px-3 py-1 text-navy ring-1 ring-navy/10">{application.district || "District not set"}</span>
        <span className="rounded-full bg-white px-3 py-1 text-navy ring-1 ring-navy/10">{application.institution || "Institution not set"}</span>
        <span className={`rounded-full px-3 py-1 ring-1 ${docs.complete ? "bg-navy text-orange ring-orange" : "bg-sand text-navy ring-navy/10"}`}>
          Documents {docs.present}/{docs.total}
        </span>
      </div>
      <p className="mt-3 text-sm text-muted">Submitted {formatAdminDate(application.submittedAt)}</p>

      <div className="sticky top-[4.6rem] z-30 mt-6 rounded-2xl bg-navy p-4 text-cream shadow-lg ring-1 ring-orange/40 print:hidden">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">Decision</p>
            <div className="mt-3">
              <StatusForm id={application.id} status={application.status} />
            </div>
            <p className="mt-2 text-xs text-sand">
              Last reviewed {formatAdminDate(application.reviewedAt)}
              {application.reviewedBy ? ` by ${application.reviewedBy}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={`mailto:${application.email}?subject=${encodeURIComponent(application.applicationReference)}`}
              className="inline-flex items-center gap-2 rounded-full bg-orange px-4 py-2 text-sm font-semibold text-white hover:bg-orange-dark"
            >
              <Mail className="h-4 w-4" aria-hidden />
              Email
            </a>
            <a
              href={`tel:${application.phone}`}
              className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-semibold text-navy hover:bg-white"
            >
              <Phone className="h-4 w-4" aria-hidden />
              Call
            </a>
            <CopyButton value={application.email} label="Copy email" />
          </div>
        </div>
      </div>

          <section className="mt-8 overflow-hidden rounded-2xl bg-white ring-1 ring-navy/10">
            <div className="h-1.5 bg-orange" aria-hidden />
            <div className="p-6">
              <h2 className="font-serif text-xl text-navy">Personal information</h2>
              <dl className="mt-4">
                <Row label="Full name" value={name} />
                <Row
                  label="Email"
                  value={
                    <a className="font-medium text-orange hover:underline" href={`mailto:${application.email}`}>
                      {application.email}
                    </a>
                  }
                />
                <Row
                  label="Phone"
                  value={
                    <a className="font-medium text-orange hover:underline" href={`tel:${application.phone}`}>
                      {application.phone}
                    </a>
                  }
                />
                <Row label="Date of birth" value={formatAdminDay(application.dateOfBirth)} />
                <Row label="Gender" value={application.gender} />
                <Row label="District" value={application.district} />
                <Row label="Address" value={address} />
              </dl>
            </div>
          </section>

          <section className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-navy/10">
            <div className="h-1.5 bg-navy" aria-hidden />
            <div className="p-6">
              <h2 className="font-serif text-xl text-navy">Qualification</h2>
              <dl className="mt-4">
                <Row label="Institution" value={application.institution} />
                <Row label="Degree" value={application.degree} />
                <Row label="Field" value={field} />
                <Row label="Graduation year" value={application.graduationYear} />
                <Row label="GPA / grade" value={application.gradeOrGPA || "—"} />
                {application.additionalQualifications.map((qualification, index) => (
                  <div key={`additional-${index}`} className="contents">
                    <Row
                      label={`Additional qualification ${index + 1} — Institution`}
                      value={qualification.institution}
                    />
                    <Row label={`Additional qualification ${index + 1} — Degree`} value={qualification.degree} />
                    <Row
                      label={`Additional qualification ${index + 1} — Field`}
                      value={displayFieldOfStudy(qualification.fieldOfStudy, qualification.fieldOfStudyOther)}
                    />
                    <Row
                      label={`Additional qualification ${index + 1} — Graduation year`}
                      value={qualification.graduationYear}
                    />
                    <Row
                      label={`Additional qualification ${index + 1} — GPA / grade`}
                      value={qualification.gradeOrGPA || "—"}
                    />
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-navy/10">
            <div className="h-1.5 bg-orange" aria-hidden />
            <div className="p-6">
              <h2 className="font-serif text-xl text-navy">Programme</h2>
              <dl className="mt-4">
                <Row label="Programme" value={application.programme} />
                <Row
                  label="Areas of interest"
                  value={application.areasOfInterest.length ? application.areasOfInterest.join(", ") : "—"}
                />
              </dl>
            </div>
          </section>

          <section className="mt-4 overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-navy/10">
            <h2 className="font-serif text-xl text-navy">Motivation</h2>
            <div className="mt-4 grid min-w-0 gap-3 text-sm leading-relaxed text-navy">
              {[
                ["Motivation", application.motivation],
                ["Career goals", application.careerGoals],
                ["Relevant experience", application.relevantExperience],
                ["Additional information", application.additionalInformation],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0 overflow-hidden rounded-xl border border-navy/10 bg-cream">
                  <h3 className="border-b border-navy/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-orange">
                    {label}
                  </h3>
                  <p className="max-w-full overflow-hidden px-4 py-3 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                    {value.trim() || "—"}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-4 overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-navy/10">
            <h2 className="font-serif text-xl text-navy">Documents</h2>
            <ul className="mt-4 space-y-3">
              {DOCUMENT_KINDS.map((kind) => {
                if (kind === "otherDocument") {
                  const files = application.otherDocument ?? [];
                  return (
                    <li key={kind} className="rounded-xl bg-cream px-4 py-3">
                      <p className="text-sm font-medium text-navy">{DOCUMENT_LABELS[kind]}</p>
                      {files.length ? (
                        <ul className="mt-2 space-y-2">
                          {files.map((file, index) => (
                            <li key={`${file.pathname}-${index}`} className="flex items-center justify-between gap-3 text-sm">
                              <span className="text-muted">
                                {file.filename} · {formatBytes(file.size)}
                              </span>
                              <a
                                href={`/api/admin/applications/${application.id}/files/otherDocument?index=${index}`}
                                download
                                className="inline-flex items-center gap-1 font-semibold text-orange hover:underline"
                              >
                                <Download className="h-4 w-4" aria-hidden />
                                Download
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-1 text-xs text-muted">Not provided</p>
                      )}
                    </li>
                  );
                }

                const file = documentFromRecord(application, kind);
                return (
                  <li
                    key={kind}
                    className="flex flex-col gap-2 rounded-xl bg-cream px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-navy">{DOCUMENT_LABELS[kind]}</p>
                      <p className="text-xs text-muted">{file ? `${file.filename} · ${formatBytes(file.size)}` : "Missing"}</p>
                    </div>
                    {file ? (
                      <a
                        href={`/api/admin/applications/${application.id}/files/${kind}`}
                        download
                        className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-orange"
                      >
                        <Download className="h-4 w-4" aria-hidden />
                        Download
                      </a>
                    ) : (
                      <span className="text-sm text-muted">No file</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 print:hidden">
        <div className="rounded-2xl bg-white p-5 ring-1 ring-navy/10">
          <h2 className="font-serif text-xl text-navy">Admin notes</h2>
          {application.adminNotes ? (
            <pre className="mt-4 max-h-48 overflow-auto whitespace-pre-wrap font-sans text-sm text-navy">{application.adminNotes}</pre>
          ) : (
            <p className="mt-4 text-sm text-muted">No notes yet.</p>
          )}
          <NotesForm id={application.id} />
        </div>
        <div className="rounded-2xl bg-white p-5 ring-1 ring-navy/10">
          <h2 className="font-serif text-xl text-navy">History</h2>
          <div className="mt-4 max-h-80 overflow-auto">
            <AdminHistory events={application.history} />
          </div>
        </div>
      </div>
    </article>
  );
}
