"use client";

import type { Testimonial } from "@/types/content";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const SLIDE_MS = 7000;

export function TestimonialCarousel({
  items,
  title,
  subtitle,
}: {
  items: Testimonial[];
  title: string;
  subtitle: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = items[index];

  const go = useCallback(
    (next: number) => {
      const total = items.length;
      setIndex(((next % total) + total) % total);
    },
    [items.length],
  );

  useEffect(() => {
    if (items.length < 2 || paused) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [items.length, paused]);

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

  if (!current) return null;

  return (
    <section
      className="relative overflow-hidden bg-navy py-20 text-cream"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute -right-16 top-10 hidden opacity-20 lg:block">
        <Image src="/images/circle1.png" alt="" width={280} height={280} />
      </div>
      <div className="relative mx-auto max-w-[1100px] px-4 lg:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-4xl font-bold text-white md:text-5xl">{title}</h2>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-orange md:text-base">
            {subtitle}
          </p>
        </div>

        <figure
          className="clip-circle is-on relative mx-auto mt-12 max-w-4xl rounded-3xl bg-white/5 p-8 text-center ring-1 ring-white/10 backdrop-blur-sm md:p-12"
          key={current.name}
        >
          <Quote className="mx-auto h-10 w-10 text-orange" aria-hidden />
          <blockquote className="mt-6 text-lg leading-relaxed text-white/90 md:text-2xl">
            “{current.quote}”
          </blockquote>
          <figcaption className="mt-8 flex flex-col items-center gap-3">
            <Image
              src={current.image}
              alt={current.name}
              width={88}
              height={88}
              className="h-20 w-20 rounded-full object-cover ring-4 ring-orange"
            />
            <div>
              <p className="font-semibold text-white">{current.name}</p>
              <p className="text-sm text-orange">{current.cohort}</p>
            </div>
          </figcaption>
        </figure>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-orange"
            aria-label="Previous testimonial"
            onClick={() => go(index - 1)}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <div className="flex flex-wrap justify-center gap-3" role="tablist" aria-label="Beneficiary voices">
            {items.map((item, i) => (
              <button
                key={item.name}
                type="button"
                aria-label={`Show ${item.name}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
            className={`cursor-pointer overflow-hidden rounded-full ring-2 transition duration-300 ${
              i === index
                ? "scale-110 ring-orange shadow-[0_0_18px_rgba(238,122,18,0.55)]"
                : "ring-white/30 opacity-70 hover:scale-105 hover:opacity-100"
            }`}
              >
                <Image src={item.image} alt="" width={56} height={56} className="h-12 w-12 object-cover" />
              </button>
            ))}
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-orange"
            aria-label="Next testimonial"
            onClick={() => go(index + 1)}
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
