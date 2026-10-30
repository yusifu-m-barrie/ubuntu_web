import { DEFAULT_COUNTRY, DEFAULT_PROGRAMME } from "@/lib/applications/constants";
import type {
  AdditionalQualification,
  ApplicationPayload,
  ApplicationRecord,
  DocumentKind,
  FileReference,
} from "@/types/application";
import { DOCUMENT_KINDS } from "@/types/application";

export function isFilledQualification(qualification: AdditionalQualification) {
  return [
    qualification.institution,
    qualification.degree,
    qualification.fieldOfStudy,
    qualification.graduationYear,
    qualification.gradeOrGPA,
  ].some((value) => value.trim());
}

export function filledQualifications(items: AdditionalQualification[] = []) {
  return items.filter(isFilledQualification).slice(0, 2);
}

export function qualificationsFromStorage(value: unknown): AdditionalQualification[] {
  let parsed = value;
  if (typeof parsed === "string") {
    const trimmed = parsed.trim();
    if (!trimmed || trimmed === "[]") return [];
    try {
      parsed = JSON.parse(trimmed) as unknown;
    } catch {
      return [];
    }
  }
  if (!Array.isArray(parsed)) return [];
  return filledQualifications(
    parsed.flatMap((entry) => {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return [];
      const item = entry as Record<string, unknown>;
      return [
        {
          institution: typeof item.institution === "string" ? item.institution : "",
          degree: typeof item.degree === "string" ? item.degree : "",
          fieldOfStudy: typeof item.fieldOfStudy === "string" ? item.fieldOfStudy : "",
          graduationYear: typeof item.graduationYear === "string" ? item.graduationYear : "",
          gradeOrGPA: typeof item.gradeOrGPA === "string" ? item.gradeOrGPA : "",
        },
      ];
    }),
  );
}

export function filesFromStorage(value: unknown): FileReference[] {
  let parsed = value;
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed) as unknown;
    } catch {
      return [];
    }
  }
  if (Array.isArray(parsed)) {
    return parsed.map(fileFromStorage).filter((file): file is FileReference => file !== null);
  }
  const legacyFile = fileFromStorage(parsed);
  return legacyFile ? [legacyFile] : [];
}

export function fileFromStorage(value: unknown): FileReference | null {
  let parsed = value;
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed) as unknown;
    } catch {
      return null;
    }
  }
  if (!parsed || typeof parsed !== "object") return null;
  const file = parsed as FileReference & { storageKey?: string };
  const pathname = file.pathname || file.storageKey;
  if (!pathname || !file.filename) return null;
  return {
    kind: file.kind,
    filename: file.filename,
    contentType: file.contentType,
    size: file.size,
    storage: file.storage,
    pathname,
    uploadedAt: file.uploadedAt,
  };
}

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
    district: payload.personal.district,
    country: DEFAULT_COUNTRY,
    city: "",
    address: payload.personal.address,
    institution: payload.academic.institution,
    degree: payload.academic.degree,
    fieldOfStudy: payload.academic.fieldOfStudy,
    graduationYear: payload.academic.graduationYear,
    gradeOrGPA: payload.academic.gradeOrGPA,
    additionalQualifications: filledQualifications(payload.academic.additionalQualifications),
    programme: payload.programme.programme || DEFAULT_PROGRAMME,
    areasOfInterest: payload.programme.areasOfInterest,
    motivation: payload.questions.motivation,
    careerGoals: payload.questions.careerGoals,
    relevantExperience: payload.questions.relevantExperience,
    additionalInformation: payload.questions.additionalInformation,
    cv: payload.documents.cv,
    certificate: payload.documents.certificate,
    transcript: payload.documents.transcript,
    otherDocument: payload.documents.otherDocument ?? [],
    ...extras,
  };
}

export function documentFromRecord(
  record: ApplicationRecord,
  kind: DocumentKind,
  index = 0,
): FileReference | null {
  if (kind === "otherDocument") {
    return record.otherDocument[index] ?? null;
  }
  return record[kind];
}

export function normalizeStoredRecord(record: ApplicationRecord): ApplicationRecord {
  return {
    ...record,
    additionalQualifications: qualificationsFromStorage(record.additionalQualifications),
    otherDocument: filesFromStorage(record.otherDocument),
  };
}

export function isDocumentKind(value: string): value is DocumentKind {
  return DOCUMENT_KINDS.includes(value as DocumentKind);
}
