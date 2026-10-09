import { ApplicationStorageError } from "@/lib/applications/errors";
import type {
  ApplicationHistoryEvent,
  ApplicationListQuery,
  ApplicationListResult,
  ApplicationPayload,
  ApplicationRecord,
  ApplicationStatus,
} from "@/types/application";

export type ApplicationStore = {
  create: (input: { draftId: string; payload: ApplicationPayload }) => Promise<ApplicationRecord>;
  get: (id: string) => Promise<ApplicationRecord | null>;
  getByReference: (reference: string) => Promise<ApplicationRecord | null>;
  list: (query?: ApplicationListQuery) => Promise<ApplicationListResult>;
  findOpenByEmail: (email: string, cohortYear: number) => Promise<ApplicationRecord | null>;
  updateStatus: (id: string, status: ApplicationStatus, reviewedBy?: string) => Promise<ApplicationRecord | null>;
  addNotes: (id: string, notes: string, reviewedBy?: string) => Promise<ApplicationRecord | null>;
  appendHistoryEvent: (id: string, event: ApplicationHistoryEvent) => Promise<ApplicationRecord | null>;
};

export async function getApplicationStore(): Promise<ApplicationStore> {
  if (process.env.POSTGRES_URL || process.env.DATABASE_URL) {
    const { postgresStore } = await import("./postgres-store");
    return postgresStore;
  }
  if (process.env.VERCEL) {
    throw new ApplicationStorageError("Application storage is not configured. Set POSTGRES_URL.");
  }
  const { fileStore } = await import("./file-store");
  return fileStore;
}
