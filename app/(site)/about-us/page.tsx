import { CapabilityMark, TeamNetworkIllustration } from "@/components/illustrations/AboutMarks";
import { HeroSlider } from "@/components/sections/HeroSlider";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { loadContent, siteUrl } from "@/lib/content";
import { Compass, Globe, Layers, MapPinned, Smartphone, Target } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  const { about } = await loadContent();
  return {
    title: about.seo.title,
    description: about.seo.description,
    alternates: { canonical: siteUrl("/about-us") },
  };
}

const capabilityIcons = {
  "Full Stack Development": Layers,
  "Web Apps Development": Globe,
  "Mobile Development": Smartphone,
} as const;

export default async function AboutPage() {
  const { about, team } = await loadContent();

  return (
    <>
      <section className="relative min-h-[70vh] overflow-hidden lg:min-h-[913px]">
        <HeroSlider
          slides={about.heroSlides}
          kenBurns={false}
          overlay
          label="Ubuntu Afrika about page photos"
        />
        <div className="relative z-[2] flex min-h-[70vh] items-center justify-center px-4 py-20 text-center lg:min-h-[913px]">
          <div className="max-w-4xl">
            <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-6xl">{about.heroTitle}</h1>
            <p className="mt-6 text-lg text-white/90 md:text-2xl">{about.heroSubtitle}</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-4xl space-y-5 px-6 text-justify text-lg leading-relaxed text-muted md:text-xl">
          {about.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="bg-[#f2f2f2] py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3 lg:px-6">
          <article className="hover-glow reveal-in rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-navy/10">
            <Target className="mx-auto h-10 w-10 text-orange" aria-hidden />
            <h2 className="mt-4 font-serif text-3xl font-bold text-navy">{about.aimTitle}</h2>
            <p className="mt-4 text-muted">{about.aimText}</p>
          </article>
          <article className="hover-glow reveal-in rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-navy/10">
            <Compass className="mx-auto h-10 w-10 text-orange" aria-hidden />
            <h2 className="mt-4 font-serif text-3xl font-bold text-navy">{about.missionTitle}</h2>
            <p className="mt-4 text-muted">{about.missionText}</p>
          </article>
          <article className="hover-glow reveal-in rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-navy/10">
            <MapPinned className="mx-auto h-10 w-10 text-orange" aria-hidden />
            <h2 className="mt-4 font-serif text-3xl font-bold text-navy">{about.keyAreasTitle}</h2>
            <ul className="mt-4 space-y-2 text-muted">
              {about.keyAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="bg-[#e07a3d]">
        <div className="mx-auto max-w-6xl px-4 py-8 lg:px-6 lg:py-12">
          <Image
            src={about.impactImage}
            alt={about.impactImageAlt}
            width={1600}
            height={900}
            className="h-auto w-full"
          />
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:grid-cols-3 lg:px-6">
          {about.capabilities.map((item) => {
            const Icon = capabilityIcons[item.title as keyof typeof capabilityIcons] ?? Layers;
            return (
              <article key={item.title} className="hover-glow group rounded-2xl p-6 text-center">
                <CapabilityMark>
                  <Icon className="h-9 w-9" aria-hidden />
                </CapabilityMark>
                <h3 className="mt-5 font-serif text-xl font-semibold text-navy">{item.title}</h3>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f2f2f2] py-16 lg:py-20">
        <div className="pointer-events-none absolute -right-20 top-10 hidden opacity-20 lg:block">
          <Image src="/images/circle1.png" alt="" width={280} height={280} />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 lg:px-6">
          <TeamNetworkIllustration />
          <h2 className="mt-4 text-center font-serif text-4xl font-bold text-navy md:text-5xl">{about.teamTitle}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted">{about.teamIntro}</p>
          <div className="mt-12">
            <TeamGrid team={team} />
          </div>
        </div>
      </section>
    </>
  );
}
