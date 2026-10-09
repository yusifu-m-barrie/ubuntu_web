"use client";

import { describedBy, Field, focusFirstError, inputClass, StepActions } from "@/components/apply/Fields";
import { GENDERS } from "@/lib/applications/constants";
import { personalSchema } from "@/lib/applications/schema";
import type { PersonalInformation } from "@/types/application";
import { useState } from "react";

type Props = {
  value: PersonalInformation;
  onChange: (value: PersonalInformation) => void;
  onNext: () => void;
};

export function PersonalStep({ value, onChange, onNext }: Props) {
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalInformation, string>>>({});

  function update<K extends keyof PersonalInformation>(key: K, next: PersonalInformation[K]) {
    onChange({ ...value, [key]: next });
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = personalSchema.safeParse(value);
    if (!result.success) {
      const next: Partial<Record<keyof PersonalInformation, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !next[key as keyof PersonalInformation]) {
          next[key as keyof PersonalInformation] = issue.message;
        }
      }
      setErrors(next);
      focusFirstError(next);
      return;
    }
    setErrors({});
    onChange(result.data);
    onNext();
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="sr-only">Personal information</legend>
        <Field id="firstName" label="First name" required error={errors.firstName}>
          <input
            id="firstName"
            autoComplete="given-name"
            value={value.firstName}
            onChange={(event) => update("firstName", event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={describedBy("firstName", undefined, errors.firstName)}
          />
        </Field>
        <Field id="middleName" label="Middle name" error={errors.middleName}>
          <input
            id="middleName"
            autoComplete="additional-name"
            value={value.middleName}
            onChange={(event) => update("middleName", event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(errors.middleName)}
            aria-describedby={describedBy("middleName", undefined, errors.middleName)}
          />
        </Field>
        <Field id="lastName" label="Last name" required error={errors.lastName}>
          <input
            id="lastName"
            autoComplete="family-name"
            value={value.lastName}
            onChange={(event) => update("lastName", event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={describedBy("lastName", undefined, errors.lastName)}
          />
        </Field>
        <Field id="email" label="Email" required error={errors.email}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={value.email}
            onChange={(event) => update("email", event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email", undefined, errors.email)}
          />
        </Field>
        <Field id="phone" label="Phone number" required error={errors.phone}>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={value.phone}
            onChange={(event) => update("phone", event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy("phone", undefined, errors.phone)}
          />
        </Field>
        <Field id="dateOfBirth" label="Date of birth" required error={errors.dateOfBirth}>
          <input
            id="dateOfBirth"
            type="date"
            autoComplete="bday"
            max={new Date(new Date().getFullYear() - 16, new Date().getMonth(), new Date().getDate())
              .toISOString()
              .slice(0, 10)}
            min={new Date(new Date().getFullYear() - 80, new Date().getMonth(), new Date().getDate())
              .toISOString()
              .slice(0, 10)}
            value={value.dateOfBirth}
            onChange={(event) => update("dateOfBirth", event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(errors.dateOfBirth)}
            aria-describedby={describedBy("dateOfBirth", undefined, errors.dateOfBirth)}
          />
        </Field>
        <Field id="gender" label="Gender" required error={errors.gender}>
          <select
            id="gender"
            value={value.gender}
            onChange={(event) => update("gender", event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(errors.gender)}
            aria-describedby={describedBy("gender", undefined, errors.gender)}
          >
            <option value="">Select</option>
            {GENDERS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <Field id="country" label="Country" required error={errors.country}>
          <input
            id="country"
            autoComplete="country-name"
            value={value.country}
            onChange={(event) => update("country", event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(errors.country)}
            aria-describedby={describedBy("country", undefined, errors.country)}
          />
        </Field>
        <Field id="city" label="City" required error={errors.city}>
          <input
            id="city"
            autoComplete="address-level2"
            value={value.city}
            onChange={(event) => update("city", event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(errors.city)}
            aria-describedby={describedBy("city", undefined, errors.city)}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field id="address" label="Address" required error={errors.address}>
            <input
              id="address"
              autoComplete="street-address"
              value={value.address}
              onChange={(event) => update("address", event.target.value)}
              className={inputClass}
              aria-invalid={Boolean(errors.address)}
              aria-describedby={describedBy("address", undefined, errors.address)}
            />
          </Field>
        </div>
      </fieldset>
      <StepActions nextLabel="Continue" />
    </form>
  );
}
