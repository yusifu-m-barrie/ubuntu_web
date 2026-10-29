import { DEFAULT_PROGRAMME } from "@/lib/applications/constants";
import type { ApplicationDraft } from "@/types/application";

export function emptyDraft(): ApplicationDraft {
  return {
    draftId: crypto.randomUUID(),
    step: 1,
    personal: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      district: "",
      address: "",
    },
    academic: {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      graduationYear: "",
      gradeOrGPA: "",
      additionalQualifications: [],
    },
    programme: {
      programme: DEFAULT_PROGRAMME,
      areasOfInterest: [],
    },
    questions: {
      motivation: "",
      careerGoals: "",
      relevantExperience: "",
      additionalInformation: "",
    },
    documents: {
      otherDocument: [],
    },
    declaration: false,
  };
}

export function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
