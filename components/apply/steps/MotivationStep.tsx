"use client";

import { describedBy, Field, focusFirstError, inputClass, StepActions } from "@/components/apply/Fields";
import { questionsSchema } from "@/lib/applications/schema";
import type { ApplicationQuestions } from "@/types/application";
import { useState } from "react";

type Props = {
  value: ApplicationQuestions;
  onChange: (value: ApplicationQuestions) => void;
  onNext: () => void;
  onBack: () => void;
};

export function MotivationStep({ value, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationQuestions, string>>>({});

  function update<K extends keyof ApplicationQuestions>(key: K, next: ApplicationQuestions[K]) {
    onChange({ ...value, [key]: next });
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
          label="Why do you want to join Ubuntu Tech Africa?"
          required
          error={errors.motivation}
        >
          <textarea
            id="motivation"
            required
            rows={5}
            value={value.motivation}
            onChange={(event) => update("motivation", event.target.value)}
            aria-invalid={Boolean(errors.motivation)}
            aria-describedby={describedBy("motivation", undefined, errors.motivation)}
            className={inputClass}
          />
        </Field>
        <Field id="careerGoals" label="What are your career goals?" required error={errors.careerGoals}>
          <textarea
            id="careerGoals"
            required
            rows={5}
            value={value.careerGoals}
            onChange={(event) => update("careerGoals", event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(errors.careerGoals)}
          />
        </Field>
        <Field id="relevantExperience" label="Describe any relevant projects or experience" error={errors.relevantExperience}>
          <textarea
            id="relevantExperience"
            rows={4}
            value={value.relevantExperience}
            onChange={(event) => update("relevantExperience", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="additionalInformation" label="Additional information" error={errors.additionalInformation}>
          <textarea
            id="additionalInformation"
            rows={3}
            value={value.additionalInformation}
            onChange={(event) => update("additionalInformation", event.target.value)}
            className={inputClass}
          />
        </Field>
      </fieldset>
      <StepActions onBack={onBack} nextLabel="Continue" />
    </form>
  );
}
