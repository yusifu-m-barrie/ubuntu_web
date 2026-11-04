import { ApplyWizard } from "@/components/apply/ApplyWizard";
import { PrivacyNotice } from "@/components/apply/PrivacyNotice";
import { PageHero } from "@/components/ui/PageHero";
import { APPLICATION_CLOSING_LABEL, APPLICATIONS_CLOSED_MESSAGE, applicationsOpen } from "@/lib/applications/deadline";
import { loadContent, siteUrl } from "@/lib/content";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Application form",
    description: "Complete your Ubuntu Tech Afrika graduate and postgraduate programme application.",
    alternates: { canonical: siteUrl("/apply/form") },
    robots: { index: false, follow: false },
  };
}

export default async function ApplyFormPage() {
  const { apply } = await loadContent();
  const open = applicationsOpen();

  return (
    <>
      <PageHero kicker="Application" title="Graduate/Postgraduate programme application" />
      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6 lg:py-16">
        <p className="text-sm text-muted">
          <Link href="/apply" className="font-semibold text-orange hover:underline">
            Back to programme information
          </Link>
        </p>
        {open ? (
          <>
            <p className="mt-4 text-base font-bold text-navy">Applications close on {APPLICATION_CLOSING_LABEL}.</p>
            <p className="mt-3 text-sm text-muted">
              Your answers are saved as you move between steps. Documents may be PDF, Word, JPEG, or PNG files of 10 MB or
              less. Each person may submit only one application for this intake.
            </p>
            <div className="mt-6">
              <PrivacyNotice
                title={apply.privacyTitle}
                intro={apply.privacyIntro}
                points={apply.privacyPoints}
                contact={apply.privacyContact}
                compact
              />
            </div>
            <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-navy/10 sm:p-8">
              <ApplyWizard />
            </div>
          </>
        ) : (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-navy/10 sm:p-8">
            <p className="text-lg font-bold text-navy">{APPLICATIONS_CLOSED_MESSAGE}</p>
            <p className="mt-3 text-sm text-muted">This intake is no longer accepting applications.</p>
          </div>
        )}
      </div>
    </>
  );
}
