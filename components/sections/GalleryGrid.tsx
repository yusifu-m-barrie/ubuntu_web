"use client";

import { morphTo } from "@/lib/morph";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import { createPortal, flushSync } from "react-dom";

export function GalleryGrid({ images }: { images: { src: string; alt: string }[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [morphIndex, setMorphIndex] = useState<number | null>(null);
  const titleId = useId();
  const current = active === null ? null : images[active];

  const close = useCallback(() => {
    morphTo(() => setActive(null));
  }, []);
  const showPrev = useCallback(
    () => setActive((index) => (index === null ? index : (index - 1 + images.length) % images.length)),
    [images.length],
  );
  const showNext = useCallback(
    () => setActive((index) => (index === null ? index : (index + 1) % images.length)),
    [images.length],
  );

  function open(index: number) {
    flushSync(() => setMorphIndex(index));
    morphTo(() => setActive(index));
  }

  useEffect(() => {
    if (active === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, showPrev, showNext]);

  return (
    <>
      <ul className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {images.map((image, index) => (
          <li
            key={image.src}
            className="animate-fade-in mb-5 break-inside-avoid"
            style={{ animationDelay: `${Math.min(index, 18) * 45}ms` }}
          >
            <button
              type="button"
              onClick={() => open(index)}
              className="hover-glow group relative w-full cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-navy/10"
            >
              <img
                src={image.src}
                alt={image.alt}
                loading={index < 8 ? "eager" : "lazy"}
                className="h-auto w-full object-contain"
                style={{
                  viewTransitionName: active === null && morphIndex === index ? "gallery-photo" : undefined,
                }}
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-navy/0 opacity-0 transition duration-500 group-hover:bg-navy/25 group-hover:opacity-100">
                <span className="inline-flex translate-y-2 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy shadow-md transition duration-500 group-hover:translate-y-0">
                  <Expand className="h-4 w-4" aria-hidden />
                  View photo
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {current
        ? createPortal(
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-8">
              <button
                type="button"
                aria-label="Close photo"
                className="animate-modal-overlay absolute inset-0 cursor-pointer bg-navy/85 backdrop-blur-sm"
                onClick={close}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="animate-modal-panel relative z-[1] flex max-h-[94vh] w-full max-w-6xl flex-col items-center"
                onClick={(event) => event.stopPropagation()}
              >
                <p id={titleId} className="sr-only">
                  {current.alt}
                </p>
                <img
                  src={current.src}
                  alt={current.alt}
                  className="max-h-[82vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
                  style={{ viewTransitionName: "gallery-photo" }}
                />
                <div className="mt-4 flex w-full items-center justify-between gap-3 text-white">
                  <button
                    type="button"
                    onClick={showPrev}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur transition duration-300 hover:scale-105 hover:bg-orange"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden />
                    Previous
                  </button>
                  <p className="text-sm text-white/80">
                    {active! + 1} / {images.length}
                  </p>
                  <button
                    type="button"
                    onClick={showNext}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur transition duration-300 hover:scale-105 hover:bg-orange"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="absolute right-0 top-0 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-navy shadow-md transition duration-300 hover:scale-110 hover:bg-orange hover:text-white"
                  aria-label="Close photo"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
