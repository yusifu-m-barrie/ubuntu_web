import { ApplyFlyer } from "@/components/apply/ApplyFlyer";
import { ApplyStartActions } from "@/components/apply/ApplyStartActions";
import { Reveal } from "@/components/motion/Reveal";
import { CtaLink } from "@/components/ui/PageHero";
import { APPLICATION_STEPS } from "@/lib/applications/constants";
import {
  APPLICATION_CLOSING_LABEL,
  APPLICATIONS_CLOSED_MESSAGE,
  applicationsOpen,
} from "@/lib/applications/deadline";
import { loadContent, siteUrl } from "@/lib/content";
import { CalendarDays, CheckCircle2, FileText, GraduationCap } from "lucide-react";
import type { Metadata } from "next";

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
  const open = applicationsOpen();

  return (
    <>
      <section className="relative overflow-hidden bg-navy text-cream">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 18%, rgba(238,122,18,0.28), transparent 34%), radial-gradient(circle at 88% 8%, rgba(246,241,232,0.08), transparent 26%), linear-gradient(115deg, transparent 42%, rgba(238,122,18,0.08) 42.2%, rgba(238,122,18,0.08) 43%, transparent 43.2%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-6 lg:py-20">
          <div className="animate-fade-up">
            {apply.heroKicker ? (
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">{apply.heroKicker}</p>
            ) : null}
            <h1 className="mt-4 max-w-xl font-serif text-4xl leading-tight md:text-5xl lg:text-[3.4rem]">{apply.heroTitle}</h1>
            {apply.scholarship ? (
              <p className="mt-5 inline-flex rounded-full bg-orange px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                {apply.scholarship}
              </p>
            ) : null}
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-sand">{apply.intro}</p>
            {apply.headline ? <p className="mt-4 max-w-xl text-sm text-cream/80">{apply.headline}</p> : null}
            <p className="mt-6 inline-flex max-w-xl items-start gap-2 text-lg font-bold text-white md:text-xl">
              <CalendarDays className="mt-0.5 h-6 w-6 shrink-0 text-orange" aria-hidden />
              {open ? `Applications close on ${APPLICATION_CLOSING_LABEL}` : APPLICATIONS_CLOSED_MESSAGE}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ApplyStartActions className="" open={open} />
            </div>
          </div>

          <div className="animate-fade-up mx-auto w-full max-w-sm lg:max-w-md" style={{ animationDelay: "120ms" }}>
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-orange lg:text-left">
              Current intake flyer
            </p>
            <ApplyFlyer src={apply.heroImage} alt={apply.heroImageAlt} />
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-2 lg:px-6">
          <Reveal>
            <article className="hover-glow h-full rounded-3xl bg-white p-8 ring-1 ring-navy/10">
              <GraduationCap className="h-8 w-8 text-orange" aria-hidden />
              <h2 className="mt-4 font-serif text-2xl text-navy">{apply.whoTitle}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{apply.whoBody}</p>
            </article>
          </Reveal>
          <Reveal delay={80}>
            <article className="hover-glow h-full rounded-3xl bg-white p-8 ring-1 ring-navy/10">
              <CheckCircle2 className="h-8 w-8 text-orange" aria-hidden />
              <h2 className="mt-4 font-serif text-2xl text-navy">{apply.expectTitle}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{apply.expectBody}</p>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:px-6">
          <Reveal>
            <div>
              <FileText className="h-8 w-8 text-orange" aria-hidden />
              <h2 className="mt-4 font-serif text-3xl text-navy">{apply.documentsTitle}</h2>
              {apply.documentsNote ? <p className="mt-3 text-sm text-muted">{apply.documentsNote}</p> : null}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <ul className="space-y-3">
              {apply.documents.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-cream px-4 py-3 text-sm leading-relaxed text-navy ring-1 ring-navy/10 md:text-base"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-sand/60 py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <Reveal>
            <h2 className="font-serif text-3xl text-navy">{apply.processTitle}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted md:text-base">{apply.processBody}</p>
          </Reveal>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {APPLICATION_STEPS.map((step, index) => (
              <Reveal key={step.id} delay={index * 70}>
                <li className="hover-glow h-full rounded-3xl bg-white p-5 ring-1 ring-navy/10">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange text-sm font-semibold text-white">
                    {step.id}
                  </span>
                  <p className="mt-4 font-serif text-lg text-navy">{step.title}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy py-16 text-center text-cream lg:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          aria-hidden
          style={{
            backgroundImage: "radial-gradient(circle at 50% 120%, rgba(238,122,18,0.35), transparent 46%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">Apply</p>
          <h2 className="mt-4 font-serif text-3xl font-bold md:text-4xl">{apply.readyTitle}</h2>
          <p className="mt-4 text-lg font-bold text-white">
            {open ? `Applications close on ${APPLICATION_CLOSING_LABEL}` : APPLICATIONS_CLOSED_MESSAGE}
          </p>
          {open ? (
            <div className="mt-8 flex justify-center">
              <CtaLink href="/apply/form">Start Application</CtaLink>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
