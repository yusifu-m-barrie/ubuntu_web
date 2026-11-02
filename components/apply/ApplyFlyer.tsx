"use client";

import { Expand, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

export function ApplyFlyer({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative w-full cursor-pointer overflow-hidden rounded-[1.5rem] bg-cream text-left shadow-[0_28px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/15 transition duration-500 hover:-translate-y-1 hover:shadow-[0_36px_90px_rgba(238,122,18,0.28)]"
        aria-label="View programme flyer"
      >
        <Image
          src={src}
          alt={alt}
          width={900}
          height={1200}
          priority
          sizes="(min-width: 1024px) 38vw, 90vw"
          className="h-auto max-h-[min(72vh,720px)] w-full object-contain"
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-t from-navy/80 via-navy/20 to-transparent px-4 py-5 opacity-0 transition duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy">
            <Expand className="h-4 w-4" aria-hidden />
            View flyer
          </span>
        </span>
      </button>

      {open
        ? createPortal(
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-8">
              <button
                type="button"
                aria-label="Close flyer"
                className="animate-modal-overlay absolute inset-0 cursor-pointer bg-navy/88 backdrop-blur-sm"
                onClick={close}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="animate-modal-panel relative z-[1] flex max-h-[94vh] w-full max-w-4xl flex-col items-center"
              >
                <p id={titleId} className="sr-only">
                  {alt}
                </p>
                <img src={src} alt={alt} className="max-h-[82vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl" />
                <button
                  type="button"
                  onClick={close}
                  className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-orange"
                >
                  <X className="h-4 w-4" aria-hidden />
                  Close
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
