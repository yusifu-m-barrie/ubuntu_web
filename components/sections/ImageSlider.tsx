"use client";

import type { Slide } from "@/types/content";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const SLIDE_MS = 5000;

export function ImageSlider({
  slides,
  label = "Ubuntu Afrika training photos",
}: {
  slides: Slide[];
  label?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[index];

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

  if (!slide) return null;

  return (
    <div
      className="group relative overflow-hidden rounded-3xl bg-navy shadow-lg ring-1 ring-navy/10 transition duration-500 hover:shadow-[0_20px_50px_rgba(238,122,18,0.2)]"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[3/2] min-h-[280px] sm:min-h-[420px]">
        {slides.map((item, i) => {
          const active = i === index;
          return (
            <div
              key={item.src}
              className={`clip-wipe absolute inset-0 ${active ? "is-on" : ""}`}
              aria-hidden={!active}
            >
              <Image
                src={item.src}
                alt={active ? item.alt : ""}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-cover object-center ${active ? "animate-ken-burns" : "scale-100"}`}
                priority={i === 0}
              />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="absolute left-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-navy shadow-md transition duration-300 hover:scale-110 hover:bg-orange hover:text-white hover:shadow-[0_8px_20px_rgba(238,122,18,0.45)]"
        aria-label="Previous photo"
        onClick={() => go(index - 1)}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>
      <button
        type="button"
        className="absolute right-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-navy shadow-md transition duration-300 hover:scale-110 hover:bg-orange hover:text-white hover:shadow-[0_8px_20px_rgba(238,122,18,0.45)]"
        aria-label="Next photo"
        onClick={() => go(index + 1)}
      >
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>

      <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
        {slides.map((item, i) => (
          <button
            key={item.src}
            type="button"
            aria-label={`Show photo ${i + 1} of ${slides.length}`}
            aria-current={i === index}
            className={`h-2.5 w-2.5 cursor-pointer rounded-full transition ${
              i === index ? "bg-white" : "bg-white/50 hover:bg-white/80"
            }`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
