"use client";

import type { Slide } from "@/types/content";
import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDE_MS = 5000;

export function HeroSlider({
  slides,
  kenBurns = true,
  overlay = false,
  label = "Ubuntu Afrika photos",
}: {
  slides: Slide[];
  kenBurns?: boolean;
  overlay?: boolean;
  label?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [slides.length]);

  if (!slides[0]) return null;

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-navy"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
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
              sizes="(max-width: 768px) 100vw, 70vw"
              className={`object-cover object-center ${kenBurns && active ? "animate-ken-burns" : "scale-100"}`}
            />
          </div>
        );
      })}
      {overlay ? <div className="absolute inset-0 z-[1] bg-black/40" /> : null}
      <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show photo ${i + 1} of ${slides.length}`}
            aria-current={i === index}
            className={`h-2.5 w-2.5 cursor-pointer rounded-full transition duration-300 ${
              i === index ? "scale-125 bg-white shadow-[0_0_12px_rgba(255,255,255,0.85)]" : "bg-white/50 hover:bg-white/80"
            }`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
