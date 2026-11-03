"use client";

import { describedBy, Field, focusFirstError, inputClass, StepActions } from "@/components/apply/Fields";
import { MOTIVATION_MAX_CHARS } from "@/lib/applications/constants";
import {
  isProfessionalProse,
  PROFESSIONAL_PROSE_ERROR,
  PROFESSIONAL_PROSE_HINT,
  sanitizeProfessionalProse,
} from "@/lib/applications/prose";
import { questionsSchema } from "@/lib/applications/schema";
import type { ApplicationQuestions } from "@/types/application";
import { useState } from "react";


type Props = {
  value: ApplicationQuestions;
  onChange: (value: ApplicationQuestions) => void;
  onNext: () => void;
  onBack: () => void;
};

function countCharacters(value: string) {
  return value.trim().length;
}

function characterError(value: string, required: boolean) {
  const count = countCharacters(value);
  if (required && count < 50) return "Please enter at least 50 characters.";
  if (count > MOTIVATION_MAX_CHARS) return "You cannot enter more than 250 characters.";
  if (!isProfessionalProse(value)) return PROFESSIONAL_PROSE_ERROR;
  return undefined;
}

// function characterHint(value: string) {
//   return `${value.length} / ${MOTIVATION_MAX_CHARS}`;
// }

function characterHint(value: string) {
  return `Character count: ${countCharacters(value)}/${MOTIVATION_MAX_CHARS}`;
}

export function MotivationStep({ value, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationQuestions, string>>>({});

  function update<K extends keyof ApplicationQuestions>(key: K, next: ApplicationQuestions[K]) {
    const cleaned = sanitizeProfessionalProse(next).slice(0, MOTIVATION_MAX_CHARS);
    onChange({ ...value, [key]: cleaned });

    setErrors((current) => {
      const updated = { ...current };
      delete updated[key];
      const error = characterError(cleaned, key === "motivation" || key === "careerGoals");
      if (error) updated[key] = error;
      return updated;
    });
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    const result = questionsSchema.safeParse(value);
    if (!result.success) {
      const nextErrors: Partial<Record<keyof ApplicationQuestions, string>> = {};

      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !nextErrors[key as keyof ApplicationQuestions]) {
          nextErrors[key as keyof ApplicationQuestions] = issue.message;
        }
      }

      setErrors(nextErrors);
      focusFirstError(nextErrors);
      return;
    }

    setErrors({});
    onNext();
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <fieldset className="space-y-5">
        <legend className="sr-only">Application questions</legend>

        <Field
          id="motivation"
          label="Why do you want to join Ubuntu Tech Afrika?"
          required
          hint={`${PROFESSIONAL_PROSE_HINT} ${characterHint(value.motivation)}`}
          error={errors.motivation}
        >
          <textarea
            id="motivation"
            required
            rows={5}
            value={value.motivation}
            onChange={(event) => update("motivation", event.target.value)}
            aria-invalid={Boolean(errors.motivation)}
            aria-describedby={describedBy("motivation", PROFESSIONAL_PROSE_HINT, errors.motivation)}
            className={inputClass}
          />
        </Field>

        <Field
          id="careerGoals"
          label="What are your career goals?"
          required
          hint={`${PROFESSIONAL_PROSE_HINT} ${characterHint(value.careerGoals)}`}
          error={errors.careerGoals}
        >
          <textarea
            id="careerGoals"
            required
            rows={5}
            value={value.careerGoals}
            onChange={(event) => update("careerGoals", event.target.value)}
            aria-invalid={Boolean(errors.careerGoals)}
            aria-describedby={describedBy("careerGoals", PROFESSIONAL_PROSE_HINT, errors.careerGoals)}
            className={inputClass}
          />
        </Field>

        <Field
          id="relevantExperience"
          label="Describe any relevant projects or experience"
          hint={`${PROFESSIONAL_PROSE_HINT} ${characterHint(value.relevantExperience)}`}
          error={errors.relevantExperience}
        >
          <textarea
            id="relevantExperience"
            rows={4}
            maxLength={MOTIVATION_MAX_CHARS}
            value={value.relevantExperience}
            onChange={(event) => update("relevantExperience", event.target.value)}
            className={inputClass}
            aria-describedby={describedBy("relevantExperience", PROFESSIONAL_PROSE_HINT, errors.relevantExperience)}
          />
        </Field>

        <Field
          id="additionalInformation"
          label="Additional information"
          hint={`${PROFESSIONAL_PROSE_HINT} ${characterHint(value.additionalInformation)}`}
          error={errors.additionalInformation}
        >
          <textarea
            id="additionalInformation"
            rows={3}
            maxLength={MOTIVATION_MAX_CHARS}
            value={value.additionalInformation}
            onChange={(event) => update("additionalInformation", event.target.value)}
            className={inputClass}
            aria-describedby={describedBy("additionalInformation", PROFESSIONAL_PROSE_HINT, errors.additionalInformation)}
          />
        </Field>
      </fieldset>

      <StepActions onBack={onBack} nextLabel="Continue" />
    </form>
  );
}