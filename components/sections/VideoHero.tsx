"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

export function VideoHero({
  videoId,
  poster,
  posterAlt,
  children,
}: {
  videoId: string;
  poster: string;
  posterAlt: string;
  children: ReactNode;
}) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);
    const onChange = () => setReduceMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`;

  return (
    <section className="relative min-h-[70vh] overflow-hidden lg:min-h-[913px]">
      <div className="absolute inset-0 bg-navy">
        <Image src={poster} alt={posterAlt} fill priority sizes="100vw" className="object-cover object-center" />
        {!reduceMotion ? (
          <div className="video-cover absolute inset-0 hidden sm:block">
            <iframe
              src={src}
              title="Ubuntu Afrika careers video"
              allow="autoplay; encrypted-media"
              allowFullScreen
              tabIndex={-1}
            />
          </div>
        ) : null}
        <div className="absolute inset-0 z-[1] bg-navy/55" />
      </div>
      <div className="relative z-[2] flex min-h-[70vh] items-center px-4 py-20 lg:min-h-[913px]">
        {children}
      </div>
    </section>
  );
}
