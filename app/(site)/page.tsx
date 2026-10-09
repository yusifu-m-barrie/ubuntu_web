import { FeatureShowcase } from "@/components/sections/FeatureShowcase";
import { HomeExplore } from "@/components/sections/HomeExplore";
import { HomeHero } from "@/components/sections/HomeHero";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { Reveal } from "@/components/motion/Reveal";
import { CtaLink } from "@/components/ui/PageHero";
import { loadContent, siteUrl } from "@/lib/content";
import type { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  const { home, settings } = await loadContent();
  return {
    title: { absolute: home.seo.title },
    description: home.seo.description,
    alternates: { canonical: siteUrl("/") },
    openGraph: { title: home.seo.title, description: home.seo.description, images: [settings.logo] },
  };
}

export default async function HomePage() {
  const { home, testimonials, settings } = await loadContent();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: settings.companyName,
    url: siteUrl("/"),
    email: settings.emails[0],
    telephone: settings.phoneFooter,
    address: {
      "@type": "PostalAddress",
      streetAddress: "4 Azzolini Highway NP Area",
      addressLocality: "Makeni City",
      addressRegion: "Bombali District",
      addressCountry: "SL",
    },
    sameAs: settings.socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
  };

  const explore = [
    {
      href: "/about-us",
      label: "About Us",
      image: home.heroSlides[1]?.src || home.features[0].image,
      alt: home.heroSlides[1]?.alt || home.features[0].imageAlt,
    },
    {
      href: "/ubuntu-postgraduate",
      label: "Ubuntu Postgraduate",
      image: home.heroSlides[5]?.src || home.features[1].image,
      alt: home.heroSlides[5]?.alt || home.features[1].imageAlt,
    },
    {
      href: "/careers",
      label: "Careers",
      image: home.features[1].image,
      alt: home.features[1].imageAlt,
    },
    {
      href: "/events",
      label: "Events & Gallery",
      image: home.heroSlides[0]?.src || home.features[2].image,
      alt: home.heroSlides[0]?.alt || home.features[2].imageAlt,
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <HomeHero
        title={home.heroTitle}
        line1={home.heroLine1}
        line2={home.heroLine2}
        ctaLabel={home.heroCtaLabel}
        ctaHref={home.heroCtaHref}
        applyLabel="Apply Now"
        applyHref="/apply"
        tagline={settings.tagline}
        background={home.heroBackground}
        slides={home.heroSlides}
      />

      <section className="relative scroll-mt-24 overflow-hidden bg-cream py-16 lg:py-24" id="simple">
        <div className="pointer-events-none absolute -left-24 top-10 hidden opacity-40 lg:block">
          <Image src="/images/circle1.png" alt="" width={320} height={320} />
        </div>
        <div className="relative mx-auto max-w-[1300px] px-4 lg:px-6">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-4xl font-bold text-navy md:text-5xl">{home.introTitle}</h2>
            <p className="mt-5 text-lg text-muted md:text-xl">{home.introText}</p>
          </Reveal>
          <Reveal className="mt-14" delay={120}>
            <FeatureShowcase features={home.features} />
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-[1300px] px-4 lg:px-6">
          <Reveal>
            <HomeExplore paths={explore} />
          </Reveal>
        </div>
      </section>

      <TestimonialCarousel
        items={testimonials}
        title={home.testimonialsTitle}
        subtitle={home.testimonialsSubtitle}
      />

      <section className="bg-[#f2f2f2] py-16">
        <Reveal>
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-10 px-4 sm:gap-16">
            {home.partners.map((partner) => (
              <Image
                key={partner.src}
                src={partner.src}
                alt={partner.alt}
                width={220}
                height={80}
                className="h-16 w-auto object-contain opacity-80 transition duration-500 hover:scale-110 hover:opacity-100"
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <CtaLink href="/apply">Apply Now</CtaLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
