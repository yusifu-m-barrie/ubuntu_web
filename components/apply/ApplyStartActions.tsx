"use client";

import { CtaLink } from "@/components/ui/PageHero";
import { DRAFT_STORAGE_KEY } from "@/lib/applications/constants";
import { useEffect, useState } from "react";

export function ApplyStartActions() {
  const [label, setLabel] = useState("Start Application");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { submittedReference?: string; personal?: { firstName?: string }; step?: number };
      if (parsed.submittedReference) return;
      if (parsed.personal?.firstName || (parsed.step && parsed.step > 1)) {
        setLabel("Continue application");
      }
    } catch {
      /* ignore stored draft */
    }
  }, []);

  return (
    <div className="mt-8">
      <CtaLink href="/apply/form">{label}</CtaLink>
    </div>
  );
}
