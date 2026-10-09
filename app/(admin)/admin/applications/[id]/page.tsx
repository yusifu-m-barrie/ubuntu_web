import { AdminHistory } from "@/components/admin/AdminHistory";
import { NotesForm } from "@/components/admin/NotesForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusForm } from "@/components/admin/StatusForm";
import { formatAdminDate, formatAdminDay } from "@/lib/applications/admin-format";
import { requireAdminPage } from "@/lib/applications/admin-guard";
import { DOCUMENT_KINDS, DOCUMENT_LABELS } from "@/lib/applications/constants";
import { formatBytes } from "@/lib/applications/draft";
import { ApplicationNotFoundError } from "@/lib/applications/errors";
import { isSafeApplicationId } from "@/lib/applications/file-types";
import { documentFromRecord } from "@/lib/applications/map";
import { fullName } from "@/lib/applications/reference";
import { getApplication } from "@/lib/applications/service";
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
  try {
    application = await getApplication(id);
  } catch (error) {
    if (error instanceof ApplicationNotFoundError) notFound();
    throw error;
  }

  const name = fullName(application.firstName, application.lastName, application.middleName);
  const address = [application.address, application.city, application.country].filter(Boolean).join(", ");

  return (
    <article>
      <p className="text-sm">
        <Link href="/admin/applications" className="font-semibold text-orange hover:underline">
          All applications
        </Link>
      </p>
      <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">{application.applicationReference}</p>
          <h1 className="mt-2 font-serif text-3xl text-navy">{name}</h1>
          <p className="mt-2 text-sm text-muted">Submitted {formatAdminDate(application.submittedAt)}</p>
        </div>
        <div className="w-full max-w-sm rounded-2xl bg-white p-4 ring-1 ring-navy/10">
          <StatusBadge status={application.status} />
          <div className="mt-4">
            <StatusForm id={application.id} status={application.status} />
          </div>
          <p className="mt-3 text-xs text-muted">
            Last reviewed {formatAdminDate(application.reviewedAt)}
            {application.reviewedBy ? ` by ${application.reviewedBy}` : ""}
          </p>
        </div>
      </div>

      <section className="mt-8 rounded-2xl bg-white p-6 ring-1 ring-navy/10">
        <h2 className="font-serif text-xl text-navy">Personal information</h2>
        <dl className="mt-4">
          <Row label="Full name" value={name} />
          <Row
            label="Email"
            value={
              <a className="text-navy hover:text-orange" href={`mailto:${application.email}`}>
                {application.email}
              </a>
            }
          />
          <Row
            label="Phone"
            value={
              <a className="text-navy hover:text-orange" href={`tel:${application.phone}`}>
                {application.phone}
              </a>
            }
          />
          <Row label="Date of birth" value={formatAdminDay(application.dateOfBirth)} />
          <Row label="Gender" value={application.gender} />
          <Row label="Address" value={address} />
        </dl>
      </section>

      <section className="mt-4 rounded-2xl bg-white p-6 ring-1 ring-navy/10">
        <h2 className="font-serif text-xl text-navy">Academic information</h2>
        <dl className="mt-4">
          <Row label="Institution" value={application.institution} />
          <Row label="Degree" value={application.degree} />
          <Row label="Field" value={application.fieldOfStudy} />
          <Row label="Graduation year" value={application.graduationYear} />
          <Row label="GPA / grade" value={application.gradeOrGPA || "—"} />
        </dl>
      </section>

      <section className="mt-4 rounded-2xl bg-white p-6 ring-1 ring-navy/10">
        <h2 className="font-serif text-xl text-navy">Programme</h2>
        <dl className="mt-4">
          <Row label="Programme" value={application.programme} />
          <Row label="Areas of interest" value={application.areasOfInterest.join(", ") || "—"} />
        </dl>
      </section>

      <section className="mt-4 rounded-2xl bg-white p-6 ring-1 ring-navy/10">
        <h2 className="font-serif text-xl text-navy">Motivation</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-navy">
          <div>
            <h3 className="font-medium text-muted">Motivation</h3>
            <p className="mt-1 whitespace-pre-line">{application.motivation}</p>
          </div>
          <div>
            <h3 className="font-medium text-muted">Career goals</h3>
            <p className="mt-1 whitespace-pre-line">{application.careerGoals}</p>
          </div>
          <div>
            <h3 className="font-medium text-muted">Relevant experience</h3>
            <p className="mt-1 whitespace-pre-line">{application.relevantExperience || "—"}</p>
          </div>
          <div>
            <h3 className="font-medium text-muted">Additional information</h3>
            <p className="mt-1 whitespace-pre-line">{application.additionalInformation || "—"}</p>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-2xl bg-white p-6 ring-1 ring-navy/10">
        <h2 className="font-serif text-xl text-navy">Documents</h2>
        <ul className="mt-4 space-y-3">
          {DOCUMENT_KINDS.map((kind) => {
            const file = documentFromRecord(application, kind);
            return (
              <li key={kind} className="flex flex-col gap-2 rounded-xl bg-cream px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-navy">{DOCUMENT_LABELS[kind]}</p>
                  <p className="text-xs text-muted">
                    {file ? `${file.filename} · ${formatBytes(file.size)}` : kind === "otherDocument" ? "Not provided" : "Missing"}
                  </p>
                </div>
                {file ? (
                  <a
                    href={`/api/admin/applications/${application.id}/files/${kind}`}
                    download
                    className="inline-flex rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-soft"
                  >
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

      <section className="mt-4 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-navy/10">
          <h2 className="font-serif text-xl text-navy">Admin notes</h2>
          {application.adminNotes ? (
            <pre className="mt-4 whitespace-pre-wrap font-sans text-sm text-navy">{application.adminNotes}</pre>
          ) : (
            <p className="mt-4 text-sm text-muted">No notes yet.</p>
          )}
          <NotesForm id={application.id} />
        </div>
        <div className="rounded-2xl bg-white p-6 ring-1 ring-navy/10">
          <h2 className="font-serif text-xl text-navy">Application history</h2>
          <div className="mt-4">
            <AdminHistory events={application.history} />
          </div>
        </div>
      </section>
    </article>
  );
}
