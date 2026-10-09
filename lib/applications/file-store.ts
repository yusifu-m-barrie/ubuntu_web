import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { ADMIN_PAGE_SIZE, OPEN_APPLICATION_STATUSES } from "@/lib/applications/constants";
import { tallyCounts } from "@/lib/applications/counts";
import { DuplicateApplicationError } from "@/lib/applications/errors";
import {
  appendHistory,
  noteHistoryEvent,
  statusHistoryEvent,
  submittedHistoryEvent,
  withHistory,
} from "@/lib/applications/history";
import { payloadToRecord } from "@/lib/applications/map";
import { cohortYear, formatReference, fullName, toSummary } from "@/lib/applications/reference";
import type { ApplicationStore } from "@/lib/applications/store";
import type { ApplicationListQuery, ApplicationRecord } from "@/types/application";

type FileDb = {
  lastNumbers: Record<string, number>;
  applications: ApplicationRecord[];
  drafts: Record<string, string>;
};

const dbPath = () => path.join(process.cwd(), ".data", "applications.json");

async function readDb(): Promise<FileDb> {
  try {
    const raw = await fs.readFile(dbPath(), "utf8");
    return JSON.parse(raw) as FileDb;
  } catch {
    return { lastNumbers: {}, applications: [], drafts: {} };
  }
}

async function writeDb(db: FileDb) {
  await fs.mkdir(path.dirname(dbPath()), { recursive: true });
  await fs.writeFile(dbPath(), JSON.stringify(db, null, 2));
}

function matchesQuery(record: ApplicationRecord, filters: ApplicationListQuery) {
  if (filters.status && record.status !== filters.status) return false;
  if (filters.programme && record.programme !== filters.programme) return false;
  if (filters.fieldOfStudy && record.fieldOfStudy !== filters.fieldOfStudy) return false;
  if (filters.query) {
    const haystack = [
      record.applicationReference,
      record.email,
      record.firstName,
      record.lastName,
      record.middleName,
      record.institution,
      fullName(record.firstName, record.lastName, record.middleName),
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(filters.query.toLowerCase())) return false;
  }
  return true;
}

export const fileStore: ApplicationStore = {
  async create({ draftId, payload }) {
    const db = await readDb();
    const existingId = db.drafts[draftId];
    if (existingId) {
      const current = db.applications.find((item) => item.id === existingId);
      if (current) return current;
    }

    const year = cohortYear();
    const email = payload.personal.email.trim().toLowerCase();
    const open = db.applications.find(
      (item) =>
        item.email.toLowerCase() === email &&
        item.cohortYear === year &&
        OPEN_APPLICATION_STATUSES.includes(item.status),
    );
    if (open) {
      throw new DuplicateApplicationError(
        `An application (${open.applicationReference}) with this email is already in progress.`,
      );
    }

    const next = (db.lastNumbers[String(year)] || 0) + 1;
    db.lastNumbers[String(year)] = next;
    const now = new Date().toISOString();
    const record = payloadToRecord(randomUUID(), formatReference(year, next), payload, {
      status: "NEW",
      submittedAt: now,
      updatedAt: now,
      reviewedAt: null,
      reviewedBy: null,
      adminNotes: "",
      cohortYear: year,
      history: [submittedHistoryEvent(now)],
    });
    db.applications.unshift(record);
    db.drafts[draftId] = record.id;
    await writeDb(db);
    return record;
  },

  async list(filters: ApplicationListQuery = {}) {
    const db = await readDb();
    const counts = tallyCounts(db.applications.map((item) => item.status));
    const filtered = db.applications.filter((item) => matchesQuery(item, filters));
    const sort = filters.sort === "oldest" ? "oldest" : "newest";
    filtered.sort((a, b) => {
      const delta = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      return sort === "oldest" ? delta : -delta;
    });
    const pageSize = Math.min(Math.max(filters.pageSize || ADMIN_PAGE_SIZE, 1), 50);
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
    const page = Math.min(Math.max(filters.page || 1, 1), totalPages);
    const start = (page - 1) * pageSize;
    return {
      items: filtered.slice(start, start + pageSize).map(toSummary),
      total,
      page,
      pageSize,
      sort,
      counts,
    };
  },

  async get(id) {
    const db = await readDb();
    const record = db.applications.find((item) => item.id === id);
    return record ? withHistory(record) : null;
  },

  async getByReference(reference) {
    const db = await readDb();
    const record = db.applications.find((item) => item.applicationReference === reference);
    return record ? withHistory(record) : null;
  },

  async findOpenByEmail(email, year) {
    const db = await readDb();
    return (
      db.applications.find(
        (item) =>
          item.email.toLowerCase() === email.toLowerCase() &&
          item.cohortYear === year &&
          OPEN_APPLICATION_STATUSES.includes(item.status),
      ) || null
    );
  },

  async updateStatus(id, status, reviewedBy = "Admin") {
    const db = await readDb();
    const record = db.applications.find((item) => item.id === id);
    if (!record) return null;
    const now = new Date().toISOString();
    record.history = appendHistory(withHistory(record).history, statusHistoryEvent(now, record.status, status, reviewedBy));
    record.status = status;
    record.updatedAt = now;
    record.reviewedAt = now;
    record.reviewedBy = reviewedBy;
    await writeDb(db);
    return record;
  },

  async addNotes(id, notes, reviewedBy = "Admin") {
    const db = await readDb();
    const record = db.applications.find((item) => item.id === id);
    if (!record) return null;
    const stamp = new Date().toISOString();
    const entry = `[${stamp}] ${reviewedBy}: ${notes.trim()}`;
    record.adminNotes = record.adminNotes ? `${record.adminNotes}\n\n${entry}` : entry;
    record.history = appendHistory(withHistory(record).history, noteHistoryEvent(stamp, notes, reviewedBy));
    record.updatedAt = stamp;
    record.reviewedBy = reviewedBy;
    await writeDb(db);
    return record;
  },

  async appendHistoryEvent(id, event) {
    const db = await readDb();
    const record = db.applications.find((item) => item.id === id);
    if (!record) return null;
    const history = withHistory(record).history;
    if (history.some((item) => item.id === event.id)) {
      return record;
    }
    if (
      (event.type === "APPLICANT_NOTIFIED" || event.type === "ADMIN_NOTIFIED") &&
      history.some((item) => item.type === event.type)
    ) {
      return record;
    }
    record.history = appendHistory(history, event);
    record.updatedAt = new Date().toISOString();
    await writeDb(db);
    return record;
  },
};
