"use client";

import { describedBy, Field, focusFirstError, inputClass, StepActions } from "@/components/apply/Fields";
import { DEGREES, FIELDS_OF_STUDY } from "@/lib/applications/constants";
import { academicSchema } from "@/lib/applications/schema";
import type { AcademicInformation, AdditionalQualification } from "@/types/application";
import { useState } from "react";

type Props = {
  value: AcademicInformation;
  onChange: (value: AcademicInformation) => void;
  onNext: () => void;
  onBack: () => void;
};

type QualificationField = keyof AdditionalQualification;

const qualificationFields: QualificationField[] = [
  "institution",
  "degree",
  "fieldOfStudy",
  "graduationYear",
  "gradeOrGPA",
];

function emptyQualification(): AdditionalQualification {
  return {
    institution: "",
    degree: "",
    fieldOfStudy: "",
    graduationYear: "",
    gradeOrGPA: "",
  };
}

function QualificationFields({
  value,
  idPrefix,
  errors,
  requiredFields,
  onChange,
}: {
  value: AdditionalQualification;
  idPrefix: string;
  errors: Record<string, string>;
  requiredFields: QualificationField[];
  onChange: (field: QualificationField, next: string) => void;
}) {
  function idFor(field: QualificationField) {
    return idPrefix ? `${idPrefix}-${field}` : field;
  }

  function renderInput(field: QualificationField) {
    const id = idFor(field);
    const error = errors[id];
    const required = requiredFields.includes(field);
    const commonProps = {
      id,
      value: value[field],
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        onChange(field, event.target.value),
      className: inputClass,
      "aria-invalid": Boolean(error),
      "aria-describedby": describedBy(id, undefined, error),
    };

    switch (field) {
      case "institution":
        return (
          <Field id={id} label="Institution" required={required} error={error}>
            <input autoComplete="organization" {...commonProps} />
          </Field>
        );

      case "degree":
        return (
          <Field id={id} label="Degree" required={required} error={error}>
            <select {...commonProps}>
              <option value="">Select degree</option>
              {DEGREES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
        );

      case "fieldOfStudy":
        return (
          <Field id={id} label="Field of study" required={required} error={error}>
            <select {...commonProps}>
              <option value="">Select field</option>
              {FIELDS_OF_STUDY.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
        );

      case "graduationYear":
        return (
          <Field id={id} label="Graduation year" required={required} error={error}>
            <input inputMode="numeric" placeholder="2024" {...commonProps} />
          </Field>
        );

      case "gradeOrGPA":
        return (
          <Field id={id} label="Grade / GPA" required={required} error={error}>
            <input {...commonProps} />
          </Field>
        );
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {qualificationFields.map((field) => (
        <div key={field} className={field === "institution" ? "sm:col-span-2" : undefined}>
          {renderInput(field)}
        </div>
      ))}
    </div>
  );
}

export function AcademicStep({ value, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function updatePrimary(field: QualificationField, next: string) {
    onChange({ ...value, [field]: next });
    setErrors((current) => {
      const updated = { ...current };
      delete updated[field];
      return updated;
    });
  }

  function updateAdditional(index: number, field: QualificationField, next: string) {
  const qualifications = [...value.additionalQualifications];
  qualifications[index] = { ...qualifications[index], [field]: next };

  onChange({ ...value, additionalQualifications: qualifications });

  setErrors((current) => {
    const updated = { ...current };
    delete updated[`additionalQualification-${index}-${field}`];
    return updated;
  });
}

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    const result = academicSchema.safeParse(value);
    if (!result.success) {
      const next: Record<string, string> = {};

      for (const issue of result.error.issues) {
        const [first, second, third] = issue.path;
        const id =
          first === "additionalQualification" && typeof second === "number" && typeof third === "string"
            ? `additionalQualification-${second}-${third}`
            : typeof first === "string"
              ? first
              : undefined;

        if (id && !next[id]) next[id] = issue.message;
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
        <legend className="sr-only">Qualification</legend>

        <div className="sm:col-span-2">
          <QualificationFields
            value={value}
            idPrefix=""
            errors={errors}
            requiredFields={["institution", "degree", "fieldOfStudy", "graduationYear"]}
            onChange={updatePrimary}
          />
        </div>

        <div className="sm:col-span-2">
  {value.additionalQualifications.map((qualification, index) => (
    <fieldset
      key={index}
      className="mt-4 grid gap-4 rounded-xl border border-navy/10 p-4 sm:grid-cols-2"
    >
      <legend className="px-2 text-sm font-semibold text-navy">
        Additional qualification {index + 1}
      </legend>
      <div className="sm:col-span-2">
        <QualificationFields
          value={qualification}
          idPrefix={`additionalQualification-${index}`}
          errors={errors}
          requiredFields={[]}
          onChange={(field, next) => updateAdditional(index, field, next)}
        />
      </div>
    </fieldset>
  ))}

  {value.additionalQualifications.length < 2 ? (
    <button
      type="button"
      className="mt-2 text-sm font-semibold text-orange hover:underline"
      onClick={() =>
        onChange({
          ...value,
          additionalQualifications: [
            ...value.additionalQualifications,
            emptyQualification(),
          ],
        })
      }
    >
      + Add Additional Qualification
    </button>
  ) : null}
</div>
      </fieldset>

      <StepActions onBack={onBack} nextLabel="Continue" />
    </form>
  );
}