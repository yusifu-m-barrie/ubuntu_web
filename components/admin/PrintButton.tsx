"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:border-orange hover:text-orange"
    >
      <Printer className="h-3.5 w-3.5" aria-hidden />
      Print
    </button>
  );
}
