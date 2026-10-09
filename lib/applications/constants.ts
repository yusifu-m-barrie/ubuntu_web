import {
  APPLICATION_STATUSES,
  DOCUMENT_KINDS,
  REQUIRED_DOCUMENT_KINDS,
  type ApplicationStatus,
  type DocumentKind,
} from "@/types/application";

export { APPLICATION_STATUSES, DOCUMENT_KINDS, REQUIRED_DOCUMENT_KINDS };

export const APPLICATION_STEPS = [
  { id: 1, label: "Personal", title: "Personal information" },
  { id: 2, label: "Academic", title: "Academic information" },
  { id: 3, label: "Programme", title: "Programme" },
  { id: 4, label: "Motivation", title: "Motivation" },
  { id: 5, label: "Documents", title: "Documents" },
  { id: 6, label: "Review", title: "Review & submit" },
] as const;

export const GENDERS = ["Woman", "Man", "Non-binary", "Prefer not to say"] as const;

export const DEGREES = [
  "Bachelor's degree",
  "Higher National Diploma (HND)",
  "Master's degree",
  "Equivalent IT qualification",
] as const;

export const FIELDS_OF_STUDY = [
  "Computer Science",
  "Information Technology",
  "ICT",
  "Software Engineering",
  "Computer Engineering",
  "Other related field",
] as const;

export const PROGRAMMES = ["Ubuntu Postgraduate", "Ubuntu Tech / Graduate training"] as const;

export const AREAS_OF_INTEREST = [
  "Software Development",
  "Web Development",
  "Mobile Development",
  "Data & AI",
  "Cybersecurity",
  "Networking",
  "IT Support",
  "Cloud/DevOps",
  "Other",
] as const;

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  NEW: "New",
  UNDER_REVIEW: "Under review",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

export const OPEN_APPLICATION_STATUSES: ApplicationStatus[] = [
  "NEW",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "INTERVIEW",
  "ACCEPTED",
];

export const DOCUMENT_LABELS: Record<DocumentKind, string> = {
  cv: "CV",
  certificate: "Degree certificate",
  transcript: "Academic transcript",
  otherDocument: "Other supporting document",
};

export const DOCUMENT_HINTS: Record<DocumentKind, string> = {
  cv: "Up-to-date curriculum vitae. PDF, Word, JPEG, or PNG. 10 MB maximum.",
  certificate: "Degree or equivalent certificate. PDF, Word, JPEG, or PNG. 10 MB maximum.",
  transcript: "Official or student copy of your transcript. PDF, Word, JPEG, or PNG. 10 MB maximum.",
  otherDocument: "Optional cover letter or supporting file. PDF, Word, JPEG, or PNG. 10 MB maximum.",
};

export { MAX_FILE_BYTES, MAX_FILE_LABEL, ACCEPTED_UPLOAD_ATTR } from "@/lib/applications/file-types";
export const DRAFT_STORAGE_KEY = "uta-application-draft-v3";
export const ADMIN_COOKIE = "uta_admin";
export const REFERENCE_PREFIX = "UTA";
export const ADMIN_PAGE_SIZE = 20;
