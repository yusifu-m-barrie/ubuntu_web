import { PageHero } from "@/components/ui/PageHero";
import { loadContent, siteUrl } from "@/lib/content";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { experience } = await loadContent();
  return {
    title: experience.seo.title,
    description: experience.seo.description,
    alternates: { canonical: siteUrl("/ubuntu-experience") },
  };
}

export default async function ExperienceRoute() {
  const { experience } = await loadContent();

  return (
    <>
      <PageHero title={experience.title} kicker="Ubuntu Experience" />
      <div className="mx-auto max-w-3xl px-4 py-16 text-muted lg:px-6">
        {experience.body ? <p className="text-lg">{experience.body}</p> : null}
      </div>
    </>
  );
}
