"use client";

import type { AlumniRecord } from "@/types/content";
import { ChevronLeft, ChevronRight, Linkedin, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

const FIELDS: { key: keyof AlumniRecord; label: string }[] = [
  { key: "residence", label: "Place of residence" },
  { key: "birthPlace", label: "Place of Birth" },
  { key: "familyPlace", label: "Place of the most of the family" },
  { key: "job", label: "Current job (principal) and position" },
  { key: "organization", label: "Organization" },
  { key: "socialHelp", label: "Another Job or social help" },
  { key: "contact", label: "Contact" },
  { key: "family", label: "Family" },
  { key: "age", label: "Age" },
  { key: "grade", label: "Calificación Postgrado" },
];

function gradeTone(grade: string) {
  const lower = grade.toLowerCase();
  if (lower.includes("excelencia")) return "bg-orange/10 text-orange";
  if (lower.includes("do not finish")) return "bg-navy/5 text-muted";
  return "bg-navy/10 text-navy";
}

function renderContact(contact: string) {
  const parts = contact.split(/(\S+@\S+\.\S+|\+?\d[\d\s/-]{6,}\d)/g);
  return parts.map((part, index) => {
    if (part.includes("@")) {
      return (
        <a key={`${part}-${index}`} href={`mailto:${part}`} className="font-medium text-orange hover:underline">
          {part}
        </a>
      );
    }
    if (/^\+?\d[\d\s/-]{6,}\d$/.test(part.trim())) {
      const tel = part.replace(/[^\d+]/g, "");
      return (
        <a key={`${part}-${index}`} href={`tel:${tel}`} className="font-medium text-orange hover:underline">
          {part}
        </a>
      );
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

export function AlumniProfileModal({
  person,
  linkedin,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  person: AlumniRecord;
  linkedin?: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && hasPrev) onPrev();
      if (event.key === "ArrowRight" && hasNext) onNext();
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onPrev, onNext, hasPrev, hasNext, person.name]);

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4 lg:p-8">
      <button
        type="button"
        aria-label="Close profile"
        className="animate-modal-overlay absolute inset-0 cursor-pointer bg-navy/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="animate-modal-panel relative z-[1] flex h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-t-3xl bg-cream shadow-2xl ring-1 ring-navy/10 sm:h-auto sm:max-h-[94vh] sm:rounded-3xl"
      >
        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.15fr)]">
          <div className="relative min-h-[320px] bg-[#0b1c2c] sm:min-h-[420px] lg:min-h-[720px]">
            {person.photo ? (
              <Image
                src={person.photo}
                alt={person.name}
                fill
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-contain object-center p-3 sm:p-5"
                priority
              />
            ) : null}
          </div>

          <div className="flex min-h-0 flex-col bg-cream">
            <div className="flex items-start justify-between gap-4 border-b border-navy/10 px-5 py-5 sm:px-8 sm:py-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">{person.cohort}</p>
                <h3 id={titleId} className="mt-1 font-serif text-3xl font-bold text-navy sm:text-4xl">
                  {person.name}
                </h3>
                {person.grade ? (
                  <p className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${gradeTone(person.grade)}`}>
                    {person.grade}
                  </p>
                ) : null}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-navy shadow-sm ring-1 ring-navy/10 transition hover:bg-orange hover:text-white"
                aria-label={`Close ${person.name} profile`}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
              <dl className="grid gap-4 sm:grid-cols-2">
                {FIELDS.map((field, index) => {
                  const value = person[field.key];
                  if (!value || typeof value !== "string") return null;
                  return (
                    <div
                      key={field.key}
                      className="animate-fade-up rounded-2xl bg-white p-4 shadow-sm ring-1 ring-navy/10"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-orange">{field.label}</dt>
                      <dd className="mt-2 text-sm leading-relaxed text-navy">
                        {field.key === "contact" ? renderContact(value) : value}
                      </dd>
                    </div>
                  );
                })}
              </dl>
              {person.internalNotes ? (
                <p className="mt-5 rounded-2xl bg-sand px-4 py-3 text-sm leading-relaxed text-muted">
                  {person.internalNotes}
                </p>
              ) : null}
              {linkedin ? (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#0A66C2] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#004182]"
                >
                  <Linkedin className="h-4 w-4" aria-hidden />
                  LinkedIn
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-navy/10 bg-white px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onPrev}
            disabled={!hasPrev}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-navy transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Previous
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!hasNext}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-navy transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
