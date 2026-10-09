import { randomUUID } from "node:crypto";
import { STATUS_LABELS } from "@/lib/applications/constants";
import type { ApplicationHistoryEvent, ApplicationRecord, ApplicationStatus } from "@/types/application";

export function submittedHistoryEvent(at: string): ApplicationHistoryEvent {
  return {
    id: randomUUID(),
    at,
    type: "SUBMITTED",
    actor: "Applicant",
    message: "Application submitted",
  };
}

export function statusHistoryEvent(
  at: string,
  fromStatus: ApplicationStatus,
  toStatus: ApplicationStatus,
  actor = "Admin",
): ApplicationHistoryEvent {
  return {
    id: randomUUID(),
    at,
    type: "STATUS_CHANGED",
    actor,
    fromStatus,
    toStatus,
    message: `Status changed from ${STATUS_LABELS[fromStatus]} to ${STATUS_LABELS[toStatus]}`,
  };
}

export function noteHistoryEvent(at: string, notes: string, actor = "Admin"): ApplicationHistoryEvent {
  return {
    id: randomUUID(),
    at,
    type: "NOTE_ADDED",
    actor,
    message: notes.trim(),
  };
}

export function applicantNotifiedEvent(applicationId: string, at: string): ApplicationHistoryEvent {
  return {
    id: `applicant-email:${applicationId}`,
    at,
    type: "APPLICANT_NOTIFIED",
    actor: "System",
    message: "Applicant confirmation email sent",
  };
}

export function adminNotifiedEvent(applicationId: string, at: string): ApplicationHistoryEvent {
  return {
    id: `admin-email:${applicationId}`,
    at,
    type: "ADMIN_NOTIFIED",
    actor: "System",
    message: "Admin notification email sent",
  };
}

export function hasHistoryType(history: ApplicationHistoryEvent[] | undefined, type: ApplicationHistoryEvent["type"]) {
  return Boolean(history?.some((event) => event.type === type));
}

export function hasHistoryId(history: ApplicationHistoryEvent[] | undefined, id: string) {
  return Boolean(history?.some((event) => event.id === id));
}

export function synthesizeHistory(record: Pick<ApplicationRecord, "submittedAt" | "reviewedAt" | "reviewedBy" | "status">) {
  const events: ApplicationHistoryEvent[] = [submittedHistoryEvent(record.submittedAt)];
  if (record.reviewedAt) {
    events.push({
      id: randomUUID(),
      at: record.reviewedAt,
      type: "STATUS_CHANGED",
      actor: record.reviewedBy || "Admin",
      toStatus: record.status,
      message: `Status updated to ${STATUS_LABELS[record.status]}`,
    });
  }
  return events;
}

export function withHistory(record: ApplicationRecord): ApplicationRecord {
  if (record.history?.length) return record;
  return { ...record, history: synthesizeHistory(record) };
}

export function appendHistory(history: ApplicationHistoryEvent[] | undefined, event: ApplicationHistoryEvent) {
  return [...(history || []), event];
}
