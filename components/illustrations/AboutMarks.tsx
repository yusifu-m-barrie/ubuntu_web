import type { ReactNode } from "react";

export function TeamNetworkIllustration() {
  return (
    <svg viewBox="0 0 280 88" className="mx-auto h-16 w-auto text-orange" aria-hidden>
      <circle cx="40" cy="44" r="14" fill="currentColor" opacity="0.18" />
      <circle cx="40" cy="44" r="7" fill="currentColor" />
      <circle cx="100" cy="28" r="14" fill="currentColor" opacity="0.18" />
      <circle cx="100" cy="28" r="7" fill="currentColor" />
      <circle cx="140" cy="60" r="16" fill="currentColor" opacity="0.22" />
      <circle cx="140" cy="60" r="8" fill="currentColor" />
      <circle cx="180" cy="26" r="14" fill="currentColor" opacity="0.18" />
      <circle cx="180" cy="26" r="7" fill="currentColor" />
      <circle cx="240" cy="48" r="14" fill="currentColor" opacity="0.18" />
      <circle cx="240" cy="48" r="7" fill="currentColor" />
      <path
        d="M54 44H86M114 34L128 52M152 52L168 32M194 32L226 46"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.45"
      />
    </svg>
  );
}

export function CapabilityMark({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange/10 text-orange ring-1 ring-orange/20 transition duration-300 group-hover:scale-110 group-hover:bg-orange group-hover:text-white group-hover:ring-orange">
      {children}
    </div>
  );
}
