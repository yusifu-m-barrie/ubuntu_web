"use client";

import { describedBy, Field, focusFirstError, inputClass, StepActions } from "@/components/apply/Fields";
import { DEGREES, FIELDS_OF_STUDY } from "@/lib/applications/constants";
import { academicSchema } from "@/lib/applications/schema";
import type { AcademicInformation } from "@/types/application";
import { useState } from "react";

type Props = {
  value: AcademicInformation;
  onChange: (value: AcademicInformation) => void;
  onNext: () => void;
  onBack: () => void;
};

export function AcademicStep({ value, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Partial<Record<keyof AcademicInformation, string>>>({});

  function update<K extends keyof AcademicInformation>(key: K, next: AcademicInformation[K]) {
    onChange({ ...value, [key]: next });
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = academicSchema.safeParse(value);
    if (!result.success) {
      const next: Partial<Record<keyof AcademicInformation, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !next[key as keyof AcademicInformation]) {
          next[key as keyof AcademicInformation] = issue.message;
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
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="sr-only">Academic information</legend>
        <div className="sm:col-span-2">
          <Field id="institution" label="Institution" required error={errors.institution}>
            <input
              id="institution"
              autoComplete="organization"
              value={value.institution}
              onChange={(event) => update("institution", event.target.value)}
              className={inputClass}
              aria-invalid={Boolean(errors.institution)}
              aria-describedby={describedBy("institution", undefined, errors.institution)}
            />
          </Field>
        </div>
        <Field id="degree" label="Degree" required error={errors.degree}>
          <select
            id="degree"
            value={value.degree}
            onChange={(event) => update("degree", event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(errors.degree)}
            aria-describedby={describedBy("degree", undefined, errors.degree)}
          >
            <option value="">Select degree</option>
            {DEGREES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <Field id="fieldOfStudy" label="Field of study" required error={errors.fieldOfStudy}>
          <select
            id="fieldOfStudy"
            value={value.fieldOfStudy}
            onChange={(event) => update("fieldOfStudy", event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(errors.fieldOfStudy)}
            aria-describedby={describedBy("fieldOfStudy", undefined, errors.fieldOfStudy)}
          >
            <option value="">Select field</option>
            {FIELDS_OF_STUDY.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <Field id="graduationYear" label="Graduation year" required error={errors.graduationYear}>
          <input
            id="graduationYear"
            inputMode="numeric"
            placeholder="2024"
            value={value.graduationYear}
            onChange={(event) => update("graduationYear", event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(errors.graduationYear)}
            aria-describedby={describedBy("graduationYear", undefined, errors.graduationYear)}
          />
        </Field>
        <Field id="gradeOrGPA" label="Grade / GPA" error={errors.gradeOrGPA}>
          <input
            id="gradeOrGPA"
            value={value.gradeOrGPA}
            onChange={(event) => update("gradeOrGPA", event.target.value)}
            className={inputClass}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field id="additionalQualifications" label="Additional qualifications" error={errors.additionalQualifications}>
            <textarea
              id="additionalQualifications"
              rows={3}
              value={value.additionalQualifications}
              onChange={(event) => update("additionalQualifications", event.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </fieldset>
      <StepActions onBack={onBack} nextLabel="Continue" />
    </form>
  );
}
