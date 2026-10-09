import { REFERENCE_PREFIX } from "@/lib/applications/constants";
import type { ApplicationRecord, ApplicationSummary } from "@/types/application";

export function cohortYear(date = new Date()) {
  return date.getUTCFullYear();
}

export function formatReference(year: number, sequence: number) {
  return `${REFERENCE_PREFIX}-${year}-${String(sequence).padStart(6, "0")}`;
}

export function fullName(firstName: string, lastName: string, middleName = "") {
  return [firstName, middleName, lastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ");
}

export function toSummary(record: ApplicationRecord): ApplicationSummary {
  return {
    id: record.id,
    applicationReference: record.applicationReference,
    email: record.email,
    fullName: fullName(record.firstName, record.lastName, record.middleName),
    programme: record.programme,
    degree: record.degree,
    fieldOfStudy: record.fieldOfStudy,
    status: record.status,
    submittedAt: record.submittedAt,
  };
}
