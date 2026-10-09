"use client";

import { describedBy, Field, focusFirstError, inputClass, StepActions } from "@/components/apply/Fields";
import { AREAS_OF_INTEREST, PROGRAMMES } from "@/lib/applications/constants";
import { programmeSchema } from "@/lib/applications/schema";
import type { ProgrammeInformation } from "@/types/application";
import { useState } from "react";

type Props = {
  value: ProgrammeInformation;
  onChange: (value: ProgrammeInformation) => void;
  onNext: () => void;
  onBack: () => void;
};

export function ProgrammeStep({ value, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Partial<Record<keyof ProgrammeInformation, string>>>({});

  function toggleInterest(item: string) {
    const areasOfInterest = value.areasOfInterest.includes(item)
      ? value.areasOfInterest.filter((entry) => entry !== item)
      : [...value.areasOfInterest, item];
    onChange({ ...value, areasOfInterest });
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = programmeSchema.safeParse(value);
    if (!result.success) {
      const next: Partial<Record<keyof ProgrammeInformation, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !next[key as keyof ProgrammeInformation]) {
          next[key as keyof ProgrammeInformation] = issue.message;
        }
      }
      setErrors(next);
      if (next.programme) focusFirstError({ programme: next.programme });
      else if (next.areasOfInterest) document.getElementById("areasOfInterest")?.focus();
      return;
    }
    setErrors({});
    onNext();
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <fieldset className="space-y-5">
        <legend className="sr-only">Programme</legend>
        <Field id="programme" label="Programme" required error={errors.programme}>
          <select
            id="programme"
            value={value.programme}
            onChange={(event) => onChange({ ...value, programme: event.target.value })}
            className={inputClass}
            aria-invalid={Boolean(errors.programme)}
            aria-describedby={describedBy("programme", undefined, errors.programme)}
          >
            <option value="">Select programme</option>
            {PROGRAMMES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <div>
          <p id="areas-label" className="text-sm font-medium text-navy">
            Areas of interest <span className="text-orange">*</span>
          </p>
          <p className="mt-1 text-xs text-muted">Select all that apply.</p>
          <ul id="areasOfInterest" tabIndex={-1} className="mt-3 grid gap-2 sm:grid-cols-2 outline-none" aria-labelledby="areas-label">
            {AREAS_OF_INTEREST.map((item) => (
              <li key={item}>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-cream px-3 py-2 text-sm text-navy ring-1 ring-navy/10">
                  <input
                    type="checkbox"
                    className="accent-orange"
                    checked={value.areasOfInterest.includes(item)}
                    onChange={() => toggleInterest(item)}
                  />
                  {item}
                </label>
              </li>
            ))}
          </ul>
          {errors.areasOfInterest ? (
            <p role="alert" className="mt-2 text-sm text-red-700">
              {errors.areasOfInterest}
            </p>
          ) : null}
        </div>
      </fieldset>
      <StepActions onBack={onBack} nextLabel="Continue" />
    </form>
  );
}
