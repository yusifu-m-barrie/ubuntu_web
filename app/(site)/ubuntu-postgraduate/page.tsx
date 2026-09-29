import { CapabilityMark } from "@/components/illustrations/AboutMarks";
import { HeroSlider } from "@/components/sections/HeroSlider";
import { CohortTabs } from "@/components/sections/CohortTabs";
import { CtaLink } from "@/components/ui/PageHero";
import { loadContent, siteUrl } from "@/lib/content";
import { Award, GraduationCap, Laptop, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { postgraduate } = await loadContent();
  return {
    title: postgraduate.seo.title,
    description: postgraduate.seo.description,
    alternates: { canonical: siteUrl("/ubuntu-postgraduate") },
  };
}

const highlightIcons: LucideIcon[] = [GraduationCap, Laptop, Award];

export default async function PostgraduateRoute() {
  const { postgraduate, alumni, team, apply } = await loadContent();
  const publicTeam = team
    .filter((member) => member.linkedin)
    .map((member) => ({ name: member.name, linkedin: member.linkedin }));

  return (
    <>
      <section className="relative min-h-[70vh] overflow-hidden lg:min-h-[913px]">
        <HeroSlider
          slides={postgraduate.heroSlides}
          kenBurns
          overlay
          label="Ubuntu Postgraduate training photos"
        />
        <div className="relative z-[2] flex min-h-[70vh] items-center px-4 py-20 lg:min-h-[913px]">
          <div className="mx-auto max-w-4xl text-center">
            <h1
              className="animate-fade-up font-serif text-4xl font-bold leading-tight text-white md:text-6xl"
              style={{ animationDelay: "80ms" }}
            >
              {postgraduate.title}
            </h1>
            <p
              className="animate-fade-up mx-auto mt-6 max-w-3xl text-lg text-white/90 md:text-2xl"
              style={{ animationDelay: "160ms" }}
            >
              {postgraduate.heroSubtitle}
            </p>
            <div className="animate-fade-up mt-8" style={{ animationDelay: "240ms" }}>
              <CtaLink href={postgraduate.ctaHref}>{postgraduate.ctaLabel}</CtaLink>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-4xl space-y-5 px-6 text-justify text-lg leading-relaxed text-muted md:text-xl">
          {postgraduate.intro.map((paragraph, index) => (
            <p
              key={paragraph.slice(0, 32)}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="bg-[#f2f2f2] py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3 lg:px-6">
          {postgraduate.highlights.map((item, index) => {
            const Icon = highlightIcons[index] ?? Award;
            return (
              <article
                key={item.title}
                className="hover-glow animate-fade-up group rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-navy/10"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <CapabilityMark>
                  <Icon className="h-9 w-9" aria-hidden />
                </CapabilityMark>
                <h2 className="mt-5 font-serif text-2xl font-bold text-navy md:text-3xl">{item.title}</h2>
                <p className="mt-4 text-muted">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <CohortTabs cohorts={postgraduate.cohorts} alumni={alumni} team={publicTeam} />
        </div>
      </section>

      <section className="bg-navy py-16 text-center text-cream lg:py-20">
        <div className="animate-fade-up mx-auto max-w-3xl px-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">{apply.scholarship}</p>
          <h2 className="mt-4 font-serif text-3xl font-bold md:text-4xl">{apply.headline}</h2>
          <div className="mt-8">
            <CtaLink href={postgraduate.ctaHref}>{postgraduate.ctaLabel}</CtaLink>
          </div>
        </div>
      </section>
    </>
  );
}
