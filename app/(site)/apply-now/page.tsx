import { CtaLink, PageHero } from "@/components/ui/PageHero";
import { loadContent, siteUrl } from "@/lib/content";
import type { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  const { apply } = await loadContent();
  return {
    title: apply.seo.title,
    description: apply.seo.description,
    alternates: { canonical: siteUrl("/apply-now") },
  };
}

export default async function ApplyPage() {
  const { apply } = await loadContent();

  return (
    <>
      <PageHero title={apply.headline} subtitle={apply.scholarship} kicker="Apply Now" />
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-16 lg:grid-cols-2 lg:px-6">
        <div>
          <h2 className="font-serif text-3xl text-navy">{apply.documentsTitle}</h2>
          <ul className="mt-6 space-y-3 text-lg text-muted">
            {apply.documents.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="mt-8">
            <CtaLink href={apply.ctaMailto}>{apply.ctaLabel}</CtaLink>
          </div>
        </div>
        <Image
          src={apply.heroImage}
          alt="Ubuntu Afrika postgraduate programme"
          width={900}
          height={700}
          className="rounded-3xl object-cover"
        />
      </div>
    </>
  );
}
