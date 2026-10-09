export const APPLICATION_STATUSES = [
  "NEW",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "INTERVIEW",
  "ACCEPTED",
  "REJECTED",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const DOCUMENT_KINDS = ["cv", "certificate", "transcript", "otherDocument"] as const;
export type DocumentKind = (typeof DOCUMENT_KINDS)[number];

export const REQUIRED_DOCUMENT_KINDS = ["cv", "certificate", "transcript"] as const;
export type RequiredDocumentKind = (typeof REQUIRED_DOCUMENT_KINDS)[number];

export type FileReference = {
  kind: DocumentKind;
  filename: string;
  contentType: string;
  size: number;
  storage: "blob" | "local";
  pathname: string;
  uploadedAt?: string;
};

export type UploadedDocument = FileReference;

export type PersonalInformation = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  country: string;
  city: string;
  address: string;
};

export type AcademicInformation = {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
  gradeOrGPA: string;
  additionalQualifications: string;
};

export type ProgrammeInformation = {
  programme: string;
  areasOfInterest: string[];
};

export type ApplicationQuestions = {
  motivation: string;
  careerGoals: string;
  relevantExperience: string;
  additionalInformation: string;
};

export type ApplicationDocuments = {
  cv: FileReference;
  certificate: FileReference;
  transcript: FileReference;
  otherDocument?: FileReference;
};

export type ApplicationPayload = {
  personal: PersonalInformation;
  academic: AcademicInformation;
  programme: ProgrammeInformation;
  questions: ApplicationQuestions;
  documents: ApplicationDocuments;
  declaration: boolean;
};

export const APPLICATION_HISTORY_TYPES = [
  "SUBMITTED",
  "STATUS_CHANGED",
  "NOTE_ADDED",
  "APPLICANT_NOTIFIED",
  "ADMIN_NOTIFIED",
] as const;
export type ApplicationHistoryType = (typeof APPLICATION_HISTORY_TYPES)[number];

export type ApplicationHistoryEvent = {
  id: string;
  at: string;
  type: ApplicationHistoryType;
  actor: string;
  message: string;
  fromStatus?: ApplicationStatus;
  toStatus?: ApplicationStatus;
};

export type ApplicationRecord = {
  id: string;
  applicationReference: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  country: string;
  city: string;
  address: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
  gradeOrGPA: string;
  additionalQualifications: string;
  programme: string;
  areasOfInterest: string[];
  motivation: string;
  careerGoals: string;
  relevantExperience: string;
  additionalInformation: string;
  cv: FileReference | null;
  certificate: FileReference | null;
  transcript: FileReference | null;
  otherDocument: FileReference | null;
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  adminNotes: string;
  cohortYear: number;
  history: ApplicationHistoryEvent[];
};

export type ApplicationDraft = {
  draftId: string;
  step: number;
  submittedReference?: string;
  personal: PersonalInformation;
  academic: AcademicInformation;
  programme: ProgrammeInformation;
  questions: ApplicationQuestions;
  documents: Partial<Record<DocumentKind, FileReference>>;
  declaration: boolean;
};

export type ApplicationSummary = {
  id: string;
  applicationReference: string;
  email: string;
  fullName: string;
  programme: string;
  degree: string;
  fieldOfStudy: string;
  status: ApplicationStatus;
  submittedAt: string;
};

export type ApplicationListSort = "newest" | "oldest";

export type ApplicationListQuery = {
  query?: string;
  status?: ApplicationStatus;
  programme?: string;
  fieldOfStudy?: string;
  sort?: ApplicationListSort;
  page?: number;
  pageSize?: number;
};

export type ApplicationCounts = {
  total: number;
  NEW: number;
  UNDER_REVIEW: number;
  SHORTLISTED: number;
  INTERVIEW: number;
  ACCEPTED: number;
  REJECTED: number;
};

export type ApplicationListResult = {
  items: ApplicationSummary[];
  total: number;
  page: number;
  pageSize: number;
  sort: ApplicationListSort;
  counts: ApplicationCounts;
};
