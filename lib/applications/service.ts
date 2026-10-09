import { ADMIN_PAGE_SIZE } from "@/lib/applications/constants";
import { ApplicationError, ApplicationNotFoundError, toApplicationHttpError } from "@/lib/applications/errors";
import {
  addNotesSchema,
  listApplicationsQuerySchema,
  submitApplicationSchema,
  updateStatusSchema,
} from "@/lib/applications/schema";
import { getApplicationStore } from "@/lib/applications/store";
import type { ApplicationListQuery, ApplicationListResult, ApplicationRecord, ApplicationStatus } from "@/types/application";

export { toApplicationHttpError };

export async function createApplication(input: unknown): Promise<ApplicationRecord> {
  const parsed = submitApplicationSchema.safeParse(input);
  if (!parsed.success) {
    throw new ApplicationError(parsed.error.issues[0]?.message || "Please complete every required field.");
  }
  const store = await getApplicationStore();
  return store.create(parsed.data);
}

export async function getApplication(idOrReference: string): Promise<ApplicationRecord> {
  const store = await getApplicationStore();
  const byId = await store.get(idOrReference);
  if (byId) return byId;
  const byReference = await store.getByReference(idOrReference);
  if (!byReference) throw new ApplicationNotFoundError();
  return byReference;
}

export async function listApplications(rawQuery: unknown = {}): Promise<ApplicationListResult> {
  const parsed = listApplicationsQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    throw new ApplicationError("Invalid search filters.");
  }
  const query: ApplicationListQuery = {
    query: parsed.data.q,
    status: parsed.data.status,
    programme: parsed.data.programme,
    fieldOfStudy: parsed.data.fieldOfStudy,
    sort: parsed.data.sort,
    page: parsed.data.page,
    pageSize: ADMIN_PAGE_SIZE,
  };
  const store = await getApplicationStore();
  return store.list(query);
}

export async function searchApplications(q: string) {
  return listApplications({ q });
}

export async function filterApplications(filters: { status?: string; programme?: string; fieldOfStudy?: string }) {
  return listApplications(filters);
}

export async function updateApplicationStatus(id: string, input: unknown): Promise<ApplicationRecord> {
  const parsed = updateStatusSchema.safeParse(input);
  if (!parsed.success) {
    throw new ApplicationError("Choose a valid status.");
  }
  const store = await getApplicationStore();
  const updated = await store.updateStatus(id, parsed.data.status as ApplicationStatus, parsed.data.reviewedBy || "Admin");
  if (!updated) throw new ApplicationNotFoundError();
  return updated;
}

export async function addAdminNotes(id: string, input: unknown): Promise<ApplicationRecord> {
  const parsed = addNotesSchema.safeParse(input);
  if (!parsed.success) {
    throw new ApplicationError(parsed.error.issues[0]?.message || "Notes are required.");
  }
  const store = await getApplicationStore();
  const updated = await store.addNotes(id, parsed.data.notes, parsed.data.reviewedBy || "Admin");
  if (!updated) throw new ApplicationNotFoundError();
  return updated;
}
