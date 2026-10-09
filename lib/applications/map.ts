import type { ApplicationPayload, ApplicationRecord, DocumentKind, FileReference } from "@/types/application";
import { DOCUMENT_KINDS } from "@/types/application";

export function payloadToRecord(
  id: string,
  reference: string,
  payload: ApplicationPayload,
  extras: Pick<
    ApplicationRecord,
    "status" | "submittedAt" | "updatedAt" | "reviewedAt" | "reviewedBy" | "adminNotes" | "cohortYear" | "history"
  >,
): ApplicationRecord {
  return {
    id,
    applicationReference: reference,
    firstName: payload.personal.firstName,
    middleName: payload.personal.middleName,
    lastName: payload.personal.lastName,
    email: payload.personal.email.trim().toLowerCase(),
    phone: payload.personal.phone,
    dateOfBirth: payload.personal.dateOfBirth,
    gender: payload.personal.gender,
    country: payload.personal.country,
    city: payload.personal.city,
    address: payload.personal.address,
    institution: payload.academic.institution,
    degree: payload.academic.degree,
    fieldOfStudy: payload.academic.fieldOfStudy,
    graduationYear: payload.academic.graduationYear,
    gradeOrGPA: payload.academic.gradeOrGPA,
    additionalQualifications: payload.academic.additionalQualifications,
    programme: payload.programme.programme,
    areasOfInterest: payload.programme.areasOfInterest,
    motivation: payload.questions.motivation,
    careerGoals: payload.questions.careerGoals,
    relevantExperience: payload.questions.relevantExperience,
    additionalInformation: payload.questions.additionalInformation,
    cv: payload.documents.cv,
    certificate: payload.documents.certificate,
    transcript: payload.documents.transcript,
    otherDocument: payload.documents.otherDocument || null,
    ...extras,
  };
}

export function documentFromRecord(record: ApplicationRecord, kind: DocumentKind): FileReference | null {
  return record[kind];
}

export function isDocumentKind(value: string): value is DocumentKind {
  return DOCUMENT_KINDS.includes(value as DocumentKind);
}
