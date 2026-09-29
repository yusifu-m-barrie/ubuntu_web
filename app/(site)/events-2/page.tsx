import { PageHero } from "@/components/ui/PageHero";
import { loadContent, siteUrl } from "@/lib/content";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { eventsList } = await loadContent();
  return {
    title: eventsList.seo.title,
    description: eventsList.seo.description,
    alternates: { canonical: siteUrl("/events-2") },
  };
}

export default async function EventsRoute() {
  const { eventsList } = await loadContent();

  return (
    <>
      <PageHero title={eventsList.title} kicker="Events" />
      <div className="mx-auto max-w-3xl px-4 py-16 text-muted lg:px-6">
        {eventsList.body ? <p className="text-lg">{eventsList.body}</p> : null}
      </div>
    </>
  );
}
