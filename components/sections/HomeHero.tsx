"use client";

import { CtaLink } from "@/components/ui/PageHero";
import type { Slide } from "@/types/content";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const SLIDE_MS = 5000;

export function HomeHero({
  title,
  line1,
  line2,
  ctaLabel,
  ctaHref,
  applyLabel,
  applyHref,
  tagline,
  background,
  slides,
}: {
  title: string;
  line1: string;
  line2: string;
  ctaLabel: string;
  ctaHref: string;
  applyLabel: string;
  applyHref: string;
  tagline: string;
  background: string;
  slides: Slide[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (next: number) => {
      const total = slides.length;
      setIndex(((next % total) + total) % total);
    },
    [slides.length],
  );

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [slides.length, paused]);

  useEffect(() => {
    if (!paused) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(index - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(index + 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paused, go, index]);

  return (
    <section className="overflow-hidden bg-cream">
      <div className="mx-auto grid min-h-[calc(100vh-4.5rem)] max-w-[1400px] lg:grid-cols-[minmax(320px,0.4fr)_1.6fr]">
        <div className="relative flex flex-col justify-center px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <Image
            src={background}
            alt=""
            fill
            className="object-contain object-[12%_top] opacity-30"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
          <div className="animate-fade-up relative">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange">{tagline}</p>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-navy md:text-5xl lg:text-[3.4rem]">
              {title}
            </h1>
            <span className="mt-6 block h-1 w-16 rounded-full bg-orange" aria-hidden />
            <p className="mt-6 text-lg leading-relaxed text-navy/80 md:text-xl">{line1}</p>
            <p className="mt-4 text-lg leading-relaxed text-navy/80 md:text-xl">{line2}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaLink href={ctaHref}>{ctaLabel}</CtaLink>
              <CtaLink href={applyHref} variant="outline">
                {applyLabel}
              </CtaLink>
            </div>
          </div>
          <a
            href="#simple"
            className="animate-bounce-y relative mt-12 inline-flex w-fit cursor-pointer text-navy/70 transition hover:text-orange"
            aria-label="Continue to I am Because We Are"
          >
            <ChevronDown className="h-7 w-7" aria-hidden />
          </a>
        </div>

        <div
          className="relative px-4 pb-8 lg:px-6 lg:py-8 lg:pl-0"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="hover-glow relative h-full min-h-[58vh] overflow-hidden rounded-[2rem] bg-navy shadow-2xl ring-1 ring-navy/10 lg:min-h-full lg:rounded-[2.5rem]">
            {slides.map((slide, i) => {
              const active = i === index;
              return (
                <div
                  key={slide.src}
                  className={`clip-wipe absolute inset-0 ${active ? "is-on" : ""}`}
                  aria-hidden={!active}
                >
                  <Image
                    src={slide.src}
                    alt={active ? slide.alt : ""}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className={`object-cover object-center ${active ? "animate-ken-burns" : "scale-100"}`}
                  />
                </div>
              );
            })}

            <div className="absolute inset-x-0 bottom-5 z-[2] flex items-center justify-center gap-3">
              <button
                type="button"
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-navy shadow-md transition duration-300 hover:scale-110 hover:bg-orange hover:text-white hover:shadow-[0_8px_20px_rgba(238,122,18,0.45)]"
                aria-label="Previous photo"
                onClick={() => go(index - 1)}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <div
                className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-md"
                role="tablist"
                aria-label="Homepage photos"
              >
                {slides.map((slide, i) => (
                  <button
                    key={slide.src}
                    type="button"
                    aria-label={`Show photo ${i + 1} of ${slides.length}`}
                    aria-current={i === index}
                    className={`h-2.5 cursor-pointer rounded-full transition-all ${
                      i === index ? "w-7 bg-orange" : "w-2.5 bg-navy/25 hover:bg-navy/50"
                    }`}
                    onClick={() => setIndex(i)}
                  />
                ))}
              </div>
              <button
                type="button"
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-navy shadow-md transition duration-300 hover:scale-110 hover:bg-orange hover:text-white hover:shadow-[0_8px_20px_rgba(238,122,18,0.45)]"
                aria-label="Next photo"
                onClick={() => go(index + 1)}
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
