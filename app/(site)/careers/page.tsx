import { ImageSlider } from "@/components/sections/ImageSlider";
import { VideoHero } from "@/components/sections/VideoHero";
import { CtaLink } from "@/components/ui/PageHero";
import { loadContent, siteUrl } from "@/lib/content";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { careers } = await loadContent();
  return {
    title: careers.seo.title,
    description: careers.seo.description,
    alternates: { canonical: siteUrl("/careers") },
  };
}

export default async function CareersRoute() {
  const { careers } = await loadContent();

  return (
    <>
      <VideoHero
        videoId={careers.heroVideoId}
        poster={careers.heroPoster}
        posterAlt={careers.slides[0]?.alt || careers.heroTitle}
      >
        <div className="mx-auto max-w-4xl text-center">
          <h1
            className="animate-fade-up font-serif text-4xl font-bold leading-tight text-white md:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            {careers.heroTitle}
          </h1>
          <p
            className="animate-fade-up mx-auto mt-6 max-w-3xl text-lg text-white/90 md:text-2xl"
            style={{ animationDelay: "160ms" }}
          >
            {careers.heroSubtitle}
          </p>
          <div className="animate-fade-up mt-8" style={{ animationDelay: "240ms" }}>
            <CtaLink href={careers.heroCtaHref}>{careers.heroCta}</CtaLink>
          </div>
        </div>
      </VideoHero>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-6">
          <div className="animate-fade-up space-y-5 text-lg leading-relaxed text-muted md:text-xl">
            {careers.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 28)}>{paragraph}</p>
            ))}
            <div className="rounded-3xl bg-[#f2f2f2] p-8">
              <h2 className="font-serif text-3xl font-bold text-navy md:text-4xl">{careers.whyTitle}</h2>
              <p className="mt-4 text-muted">{careers.whyText}</p>
            </div>
          </div>
          <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
            <ImageSlider slides={careers.slides} label="Ubuntu Afrika careers training photos" />
          </div>
        </div>
      </section>

      <section id="courses" className="scroll-mt-24 bg-[#f2f2f2] py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <h2 className="animate-fade-up text-center font-serif text-4xl font-bold text-navy md:text-5xl">
            {careers.coursesTitle}
          </h2>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {careers.courses.map((course, index) => (
              <li
                key={course.title}
                className="animate-fade-up group"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <article className="hover-glow flex h-full flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-navy/10">
                  <img
                    src={course.icon}
                    alt=""
                    className="h-[72px] w-[72px] object-contain transition duration-300 group-hover:scale-110"
                  />
                  <h3 className="mt-5 font-serif text-xl font-semibold text-navy">{course.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{course.description}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
