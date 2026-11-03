"use client";

import { CtaLink } from "@/components/ui/PageHero";
import { readStoredDraft } from "@/lib/applications/draft";
import { useEffect, useState } from "react";

export function ApplyStartActions({ className = "mt-8" }: { className?: string }) {
  const [label, setLabel] = useState("Start Application");

  useEffect(() => {
    const stored = readStoredDraft();
    if (!stored || stored.submittedReference) return;
    if (stored.personal?.firstName || (stored.step && stored.step > 1)) {
      setLabel("Continue application");
    }
  }, []);

  return (
    <div className={className}>
      <CtaLink href="/apply/form">{label}</CtaLink>
    </div>
  );
}
