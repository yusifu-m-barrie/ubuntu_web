import { ApplyWizard } from "@/components/apply/ApplyWizard";
import { PageHero } from "@/components/ui/PageHero";
import { siteUrl } from "@/lib/content";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Application form",
    description: "Complete your Ubuntu Tech Africa graduate and postgraduate programme application.",
    alternates: { canonical: siteUrl("/apply/form") },
    robots: { index: false, follow: false },
  };
}

export default function ApplyFormPage() {
  return (
    <>
      <PageHero kicker="Application" title="Graduate/Postgraduate programme application" />
      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6 lg:py-16">
        <p className="text-sm text-muted">
          <Link href="/apply" className="font-semibold text-orange hover:underline">
            Back to programme information
          </Link>
        </p>
        <p className="mt-4 text-sm text-muted">
          Your answers are saved as you move between steps. Documents may be PDF, Word, JPEG, or PNG files of 10 MB or
          less.
        </p>
        <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-navy/10 sm:p-8">
          <ApplyWizard />
        </div>
      </div>
    </>
  );
}
