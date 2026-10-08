"use client";

import { Reveal } from "@/components/motion/Reveal";
import type { Slide } from "@/types/content";
import Image from "next/image";

function Illustration({ variant }: { variant: number }) {
  if (variant === 1) {
    return (
      <svg viewBox="0 0 180 180" className="h-full w-full" aria-hidden="true">
        <circle cx="90" cy="90" r="62" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
        <circle cx="90" cy="90" r="38" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
        <path d="M28 90h124M90 28v124" fill="none" stroke="currentColor" strokeWidth="1.25" opacity="0.4" />
        <circle cx="128" cy="52" r="8" fill="currentColor" opacity="0.8" />
      </svg>
    );
  }
  if (variant === 2) {
    return (
      <svg viewBox="0 0 180 180" className="h-full w-full" aria-hidden="true">
        <rect x="36" y="40" width="108" height="100" rx="18" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <path d="M54 72h72M54 92h54M54 112h40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        <circle cx="138" cy="48" r="10" fill="currentColor" opacity="0.8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 180 180" className="h-full w-full" aria-hidden="true">
      <path d="M40 128c18-42 82-42 100 0" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <circle cx="70" cy="72" r="16" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.55" />
      <circle cx="110" cy="68" r="14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.55" />
      <circle cx="148" cy="46" r="8" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

export function CareersStory({
  paragraphs,
  slides,
  whyTitle,
  whyText,
}: {
  paragraphs: string[];
  slides: Slide[];
  whyTitle: string;
  whyText: string;
}) {
  const rows = paragraphs.map((text, index) => ({
    text,
    slide: slides[index] || slides[0],
    imageOnLeft: index % 2 === 1,
    label: String(index + 1).padStart(2, "0"),
  }));

  return (
    <section className="overflow-hidden bg-cream py-16 lg:py-24">
      <div className="mx-auto max-w-6xl space-y-16 px-4 lg:space-y-24 lg:px-6">
        {rows.map((row, index) => (
          <Reveal key={row.label} delay={index * 80}>
            <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
              <div className={row.imageOnLeft ? "lg:order-1" : "lg:order-2"}>
                <div className="relative mx-auto max-w-xl">
                  <div
                    className={`animate-float-soft pointer-events-none absolute text-orange ${
                      row.imageOnLeft ? "-left-10 -top-10" : "-right-10 -top-10"
                    } h-40 w-40`}
                  >
                    <Illustration variant={index + 1} />
                  </div>
                  <div className="careers-photo hover-glow relative overflow-hidden rounded-[2rem] bg-navy shadow-lg ring-1 ring-navy/10">
                    <div className="relative aspect-[4/3]">
                      {row.slide ? (
                        <Image
                          src={row.slide.src}
                          alt={row.slide.alt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover object-center transition duration-700"
                        />
                      ) : null}
                    </div>
                    <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold tracking-[0.18em] text-navy shadow-sm">
                      {row.label}
                    </span>
                  </div>
                </div>
              </div>
              <div className={row.imageOnLeft ? "lg:order-2" : "lg:order-1"}>
                <p className="text-lg leading-relaxed text-muted md:text-xl md:leading-8">{row.text}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="mx-auto mt-20 max-w-3xl px-4 text-center lg:mt-28 lg:px-6">
          <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-orange text-white shadow-[0_10px_28px_rgba(238,122,18,0.35)]">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M12 3l1.6 4.9H19l-4.2 3 1.6 4.9L12 12.8 7.6 15.8 9.2 10.9 5 7.9h5.4z" />
            </svg>
          </span>
          <h2 className="font-serif text-3xl font-bold text-navy md:text-5xl">{whyTitle}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{whyText}</p>
        </div>
      </Reveal>
    </section>
  );
}
