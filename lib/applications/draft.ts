import { DEFAULT_PROGRAMME, DRAFT_STORAGE_KEY, DRAFT_TTL_MS } from "@/lib/applications/constants";
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
      fieldOfStudyOther: "",
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

type StoredDraft = {
  savedAt: number;
  draft: ApplicationDraft;
};

function storage() {
  if (typeof window === "undefined") return null;
  return window.sessionStorage;
}

export function clearStoredDraft() {
  try {
    storage()?.removeItem(DRAFT_STORAGE_KEY);
    window.localStorage?.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function readStoredDraft(): ApplicationDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY) || localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredDraft | ApplicationDraft;
    const envelope = parsed && typeof parsed === "object" && "draft" in parsed && "savedAt" in parsed;
    const draft = envelope ? (parsed as StoredDraft).draft : (parsed as ApplicationDraft);
    const savedAt = envelope ? Number((parsed as StoredDraft).savedAt) : 0;
    if (!draft?.draftId) {
      clearStoredDraft();
      return null;
    }
    if (draft.submittedReference) return draft;
    if (!savedAt || Date.now() - savedAt > DRAFT_TTL_MS) {
      clearStoredDraft();
      return null;
    }
    return draft;
  } catch {
    clearStoredDraft();
    return null;
  }
}

export function writeStoredDraft(draft: ApplicationDraft) {
  if (typeof window === "undefined") return;
  const payload: StoredDraft = { savedAt: Date.now(), draft };
  const raw = JSON.stringify(payload);
  try {
    sessionStorage.setItem(DRAFT_STORAGE_KEY, raw);
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    /* ignore quota */
  }
}

export function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
