"use client";

import { describedBy, Field, focusFirstError, inputClass, StepActions } from "@/components/apply/Fields";
import { DEGREES, FIELDS_OF_STUDY, OTHER_FIELD_OF_STUDY } from "@/lib/applications/constants";
import { academicSchema } from "@/lib/applications/schema";
import type { AcademicInformation, AdditionalQualification } from "@/types/application";
import { Minus } from "lucide-react";
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
    fieldOfStudyOther: "",
    graduationYear: "",
    gradeOrGPA: "",
  };
}

function QualificationFields({
  value,
  idPrefix,
  errors,
  requiredFields,
  otherFieldOfStudy,
  otherFieldError,
  onChange,
  onOtherFieldOfStudyChange,
}: {
  value: AdditionalQualification;
  idPrefix: string;
  errors: Record<string, string>;
  requiredFields: QualificationField[];
  otherFieldOfStudy: string;
  otherFieldError?: string;
  onChange: (field: QualificationField, next: string) => void;
  onOtherFieldOfStudyChange: (next: string) => void;
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

      case "fieldOfStudy": {
        const otherFieldId = `${id}-other`;
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
            {value.fieldOfStudy === OTHER_FIELD_OF_STUDY ? (
              <div className="mt-3">
                <Field
                  id={otherFieldId}
                  label="Please specify your field of study"
                  required={required}
                  error={otherFieldError}
                >
                  <input
                    id={otherFieldId}
                    value={otherFieldOfStudy}
                    onChange={(event) => onOtherFieldOfStudyChange(event.target.value)}
                    placeholder="Enter your field of study"
                    className={inputClass}
                    aria-invalid={Boolean(otherFieldError)}
                    aria-describedby={describedBy(otherFieldId, undefined, otherFieldError)}
                    autoComplete="off"
                  />
                </Field>
              </div>
            ) : null}
          </Field>
        );
      }

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

  function addAdditionalQualification() {
    if (value.additionalQualifications.length >= 2) return;

    onChange({
      ...value,
      additionalQualifications: [...value.additionalQualifications, emptyQualification()],
    });
  }

  function updatePrimary(field: QualificationField, next: string) {
    onChange({
      ...value,
      [field]: next,
      ...(field === "fieldOfStudy" && next !== OTHER_FIELD_OF_STUDY ? { fieldOfStudyOther: "" } : {}),
    });
    setErrors((current) => {
      const updated = { ...current };
      delete updated[field];
      if (field === "fieldOfStudy") delete updated["fieldOfStudy-other"];
      return updated;
    });
  }

  function updateAdditional(index: number, field: QualificationField, next: string) {
    const qualifications = [...value.additionalQualifications];
    qualifications[index] = {
      ...qualifications[index],
      [field]: next,
      ...(field === "fieldOfStudy" && next !== OTHER_FIELD_OF_STUDY ? { fieldOfStudyOther: "" } : {}),
    };

    onChange({ ...value, additionalQualifications: qualifications });

    setErrors((current) => {
      const updated = { ...current };
      delete updated[`additionalQualification-${index}-${field}`];
      if (field === "fieldOfStudy") {
        delete updated[`additionalQualification-${index}-fieldOfStudy-other`];
      }
      return updated;
    });
  }

  function issueId(path: PropertyKey[]) {
    const [first, second, third] = path;
    if (first === "additionalQualifications" && typeof second === "number" && typeof third === "string") {
      return third === "fieldOfStudyOther"
        ? `additionalQualification-${second}-fieldOfStudy-other`
        : `additionalQualification-${second}-${third}`;
    }
    if (first === "fieldOfStudyOther") return "fieldOfStudy-other";
    return typeof first === "string" ? first : undefined;
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    const result = academicSchema.safeParse(value);
    if (!result.success) {
      const next: Record<string, string> = {};

      for (const issue of result.error.issues) {
        const id = issueId(issue.path);
        if (id && !next[id]) next[id] = issue.message;
      }

      setErrors(next);
      focusFirstError(next);
      return;
    }

    onChange({ ...value, ...result.data });
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
            otherFieldOfStudy={value.fieldOfStudyOther ?? ""}
            otherFieldError={errors["fieldOfStudy-other"]}
            onOtherFieldOfStudyChange={(next) => {
              onChange({ ...value, fieldOfStudyOther: next });
              setErrors((current) => {
                const updated = { ...current };
                delete updated["fieldOfStudy-other"];
                return updated;
              });
            }}
          />
        </div>

        <div className="sm:col-span-2">
          {value.additionalQualifications.map((qualification, index) => (
              <fieldset
                key={index}
                className="mt-4 grid gap-4 rounded-xl border border-navy/10 p-4 sm:grid-cols-2"
              >
                <legend className="flex w-full items-center justify-between px-2 text-sm font-semibold text-navy">
                  <span>Additional qualification {index + 1}</span>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-navy hover:bg-navy/5 focus-visible:ring-2 focus-visible:ring-orange"
                    aria-label={`Remove additional qualification ${index + 1}`}
                    onClick={() =>
                      onChange({
                        ...value,
                        additionalQualifications: value.additionalQualifications.filter((_, itemIndex) => itemIndex !== index),
                      })
                    }
                  >
                    <Minus aria-hidden="true" size={18} />
                  </button>
                </legend>
                <div className="sm:col-span-2">
                  <QualificationFields
                    value={qualification}
                    idPrefix={`additionalQualification-${index}`}
                    errors={errors}
                    requiredFields={[]}
                    onChange={(field, next) => updateAdditional(index, field, next)}
                    otherFieldOfStudy={qualification.fieldOfStudyOther ?? ""}
                    otherFieldError={errors[`additionalQualification-${index}-fieldOfStudy-other`]}
                    onOtherFieldOfStudyChange={(next) => {
                      const qualifications = [...value.additionalQualifications];
                      qualifications[index] = { ...qualifications[index], fieldOfStudyOther: next };
                      onChange({ ...value, additionalQualifications: qualifications });
                      setErrors((current) => {
                        const updated = { ...current };
                        delete updated[`additionalQualification-${index}-fieldOfStudy-other`];
                        return updated;
                      });
                    }}
                  />
                </div>
              </fieldset>
          ))}

          {value.additionalQualifications.length < 2 ? (
            <button
              type="button"
              className="mt-2 text-sm font-semibold text-orange hover:underline"
              onClick={addAdditionalQualification}
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