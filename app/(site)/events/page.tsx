import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { HeroSlider } from "@/components/sections/HeroSlider";
import { loadContent, siteUrl } from "@/lib/content";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { gallery } = await loadContent();
  return {
    title: gallery.seo.title,
    description: gallery.seo.description,
    alternates: { canonical: siteUrl("/events") },
  };
}

export default async function EventsGalleryRoute() {
  const { gallery } = await loadContent();

  return (
    <>
      <section className="relative min-h-[60vh] overflow-hidden lg:min-h-[780px]">
        <HeroSlider
          slides={gallery.heroSlides}
          kenBurns
          overlay
          label="Ubuntu Afrika events and gallery photos"
        />
        <div className="relative z-[2] flex min-h-[60vh] items-center px-4 py-20 lg:min-h-[780px]">
          <div className="mx-auto max-w-4xl text-center">
            <h1
              className="animate-fade-up font-serif text-4xl font-bold leading-tight text-white md:text-6xl"
              style={{ animationDelay: "80ms" }}
            >
              {gallery.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-[#f2f2f2] py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <GalleryGrid images={gallery.images} />
        </div>
      </section>
    </>
  );
}
