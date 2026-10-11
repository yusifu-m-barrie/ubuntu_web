"use client";

import { describedBy, Field, focusFirstError, inputClass, StepActions } from "@/components/apply/Fields";
import { MOTIVATION_MAX_CHARS } from "@/lib/applications/constants";
import { questionsSchema } from "@/lib/applications/schema";
import type { ApplicationQuestions } from "@/types/application";
import { useState } from "react";

function countHint(value: string) {
  return `${value.length} / ${MOTIVATION_MAX_CHARS}`;
}

type Props = {
  value: ApplicationQuestions;
  onChange: (value: ApplicationQuestions) => void;
  onNext: () => void;
  onBack: () => void;
};

export function MotivationStep({ value, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationQuestions, string>>>({});

  function update<K extends keyof ApplicationQuestions>(key: K, next: ApplicationQuestions[K]) {
    onChange({ ...value, [key]: next.slice(0, MOTIVATION_MAX_CHARS) });
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = questionsSchema.safeParse(value);
    if (!result.success) {
      const next: Partial<Record<keyof ApplicationQuestions, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !next[key as keyof ApplicationQuestions]) {
          next[key as keyof ApplicationQuestions] = issue.message;
        }
      }
      setErrors(next);
      focusFirstError(next);
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
          hint={countHint(value.motivation)}
          error={errors.motivation}
        >
          <textarea
            id="motivation"
            required
            rows={5}
            maxLength={MOTIVATION_MAX_CHARS}
            value={value.motivation}
            onChange={(event) => update("motivation", event.target.value)}
            aria-invalid={Boolean(errors.motivation)}
            aria-describedby={describedBy("motivation", countHint(value.motivation), errors.motivation)}
            className={inputClass}
          />
        </Field>
        <Field
          id="careerGoals"
          label="What are your career goals?"
          required
          hint={countHint(value.careerGoals)}
          error={errors.careerGoals}
        >
          <textarea
            id="careerGoals"
            required
            rows={5}
            maxLength={MOTIVATION_MAX_CHARS}
            value={value.careerGoals}
            onChange={(event) => update("careerGoals", event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(errors.careerGoals)}
            aria-describedby={describedBy("careerGoals", countHint(value.careerGoals), errors.careerGoals)}
          />
        </Field>
        <Field
          id="relevantExperience"
          label="Describe any relevant projects or experience"
          hint={countHint(value.relevantExperience)}
          error={errors.relevantExperience}
        >
          <textarea
            id="relevantExperience"
            rows={4}
            maxLength={MOTIVATION_MAX_CHARS}
            value={value.relevantExperience}
            onChange={(event) => update("relevantExperience", event.target.value)}
            className={inputClass}
            aria-describedby={describedBy("relevantExperience", countHint(value.relevantExperience), errors.relevantExperience)}
          />
        </Field>
        <Field
          id="additionalInformation"
          label="Additional information"
          hint={countHint(value.additionalInformation)}
          error={errors.additionalInformation}
        >
          <textarea
            id="additionalInformation"
            rows={3}
            maxLength={MOTIVATION_MAX_CHARS}
            value={value.additionalInformation}
            onChange={(event) => update("additionalInformation", event.target.value)}
            className={inputClass}
            aria-describedby={describedBy("additionalInformation", countHint(value.additionalInformation), errors.additionalInformation)}
          />
        </Field>
      </fieldset>
      <StepActions onBack={onBack} nextLabel="Continue" />
    </form>
  );
}
