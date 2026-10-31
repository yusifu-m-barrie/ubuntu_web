import { ApplyStartActions } from "@/components/apply/ApplyStartActions";
import { CtaLink, PageHero } from "@/components/ui/PageHero";
import { configuredDeadline } from "@/lib/applications/deadline";
import { loadContent, siteUrl } from "@/lib/content";
import { CheckCircle2, FileText, GraduationCap, ListChecks } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Graduate/Postgraduate Programme Application",
    description:
      "Apply to the Ubuntu Tech Afrika graduate and postgraduate programme. Develop practical skills, gain professional experience, and join the Ubuntu Tech Afrika team.",
    alternates: { canonical: siteUrl("/apply") },
  };
}

export default async function ApplyLanding() {
  const { apply } = await loadContent();
  const deadline = configuredDeadline(apply.closingDate);

  return (
    <>
      <PageHero
        kicker="Ubuntu Tech Afrika · Graduate/Postgraduate Programme"
        title={apply.heroTitle}
        subtitle={apply.scholarship || undefined}
      />

      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-6 lg:py-16">
        <div>
          <p className="text-lg leading-relaxed text-muted">{apply.intro}</p>
          {apply.headline ? <p className="mt-4 text-sm text-navy">{apply.headline}</p> : null}
          <ApplyStartActions />
          {deadline ? (
            <p className="mt-6 text-sm font-medium text-navy">
              Application deadline: <span className="text-orange">{deadline}</span>
            </p>
          ) : null}
        </div>
        <Image
          src={apply.heroImage}
          alt="Ubuntu Afrika postgraduate programme"
          width={900}
          height={700}
          priority
          sizes="(min-width: 1024px) 42vw, 100vw"
          className="rounded-3xl object-cover"
        />
      </div>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
          <article className="rounded-2xl bg-cream p-6 ring-1 ring-navy/10">
            <GraduationCap className="h-8 w-8 text-orange" aria-hidden />
            <h2 className="mt-4 font-serif text-xl text-navy">{apply.whoTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{apply.whoBody}</p>
          </article>
          <article className="rounded-2xl bg-cream p-6 ring-1 ring-navy/10">
            <CheckCircle2 className="h-8 w-8 text-orange" aria-hidden />
            <h2 className="mt-4 font-serif text-xl text-navy">{apply.expectTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{apply.expectBody}</p>
          </article>
          <article className="rounded-2xl bg-cream p-6 ring-1 ring-navy/10">
            <FileText className="h-8 w-8 text-orange" aria-hidden />
            <h2 className="mt-4 font-serif text-xl text-navy">{apply.documentsTitle}</h2>
            <ul className="mt-3 space-y-1 text-sm text-muted">
              {apply.documents.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {apply.documentsNote ? <p className="mt-3 text-xs text-muted">{apply.documentsNote}</p> : null}
          </article>
          <article className="rounded-2xl bg-cream p-6 ring-1 ring-navy/10">
            <ListChecks className="h-8 w-8 text-orange" aria-hidden />
            <h2 className="mt-4 font-serif text-xl text-navy">{apply.processTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{apply.processBody}</p>
          </article>
        </div>
      </section>

      <section className="bg-navy py-16 text-center text-cream">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">Apply</p>
          <h2 className="mt-4 font-serif text-3xl font-bold md:text-4xl">{apply.readyTitle}</h2>
          <div className="mt-8">
            <CtaLink href="/apply/form">Start Application</CtaLink>
          </div>
        </div>
      </section>
    </>
  );
}
