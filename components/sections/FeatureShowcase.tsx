"use client";

import type { FeatureBlock } from "@/types/content";
import { Clock, Smartphone, Users, Zap } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const FEATURE_MS = 5500;

const icons = [Zap, Users, Smartphone, Clock];

export function FeatureShowcase({ features }: { features: FeatureBlock[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = features[active];

  useEffect(() => {
    if (features.length < 2 || paused) return;
    const id = window.setInterval(() => {
      setActive((index) => (index + 1) % features.length);
    }, FEATURE_MS);
    return () => window.clearInterval(id);
  }, [features.length, paused]);

  useEffect(() => {
    if (!paused) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        setActive((index) => (index + 1) % features.length);
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        setActive((index) => (index - 1 + features.length) % features.length);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paused, features.length]);

  if (!current) return null;

  return (
    <div
      className="grid items-stretch gap-6 lg:grid-cols-[minmax(280px,0.92fr)_1.08fr]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div role="tablist" aria-label="Programme features" className="flex flex-col gap-3">
        {features.map((feature, index) => {
          const selected = index === active;
          const Icon = icons[index] ?? Zap;
          return (
            <button
              key={feature.title}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(index)}
              className={`group cursor-pointer rounded-2xl p-5 text-left shadow-sm ring-1 transition duration-300 ${
                selected
                  ? "bg-white shadow-[0_16px_36px_rgba(238,122,18,0.18)] ring-orange"
                  : "hover-glow bg-white/70 ring-navy/10 hover:bg-white hover:ring-orange/40"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition ${
                    selected ? "bg-orange text-white" : "bg-cream text-navy group-hover:bg-orange/15"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-sm font-bold uppercase tracking-[0.5px] text-[#01b88e]">{feature.eyebrow}</p>
              </span>
              <h3 className="mt-3 font-serif text-2xl font-bold leading-tight text-navy md:text-3xl">
                {feature.title}
              </h3>
              {selected ? (
                <span className="mt-4 block h-1 overflow-hidden rounded-full bg-navy/10">
                  <span
                    key={active}
                    className="animate-progress-fill block h-full rounded-full bg-orange"
                    style={{ animationPlayState: paused ? "paused" : "running" }}
                  />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="relative min-h-[360px] overflow-hidden rounded-3xl bg-navy shadow-xl ring-1 ring-navy/10 sm:min-h-[460px] lg:min-h-full">
        {features.map((feature, index) => {
          const selected = index === active;
          return (
            <div
              key={feature.image}
              className={`clip-circle absolute inset-0 ${selected ? "is-on" : ""}`}
              aria-hidden={!selected}
            >
              <Image
                src={feature.image}
                alt={selected ? feature.imageAlt : ""}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-cover object-center ${selected ? "animate-ken-burns" : "scale-100"}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
