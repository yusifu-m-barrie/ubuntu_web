import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";
import { ADMIN_PAGE_SIZE, OPEN_APPLICATION_STATUSES } from "@/lib/applications/constants";
import { emptyCounts } from "@/lib/applications/counts";
import { ApplicationStorageError, DuplicateApplicationError } from "@/lib/applications/errors";
import {
  appendHistory,
  noteHistoryEvent,
  statusHistoryEvent,
  submittedHistoryEvent,
  withHistory,
} from "@/lib/applications/history";
import { payloadToRecord } from "@/lib/applications/map";
import { cohortYear, formatReference, toSummary } from "@/lib/applications/reference";
import type { ApplicationStore } from "@/lib/applications/store";
import type {
  ApplicationHistoryEvent,
  ApplicationListQuery,
  ApplicationRecord,
  ApplicationStatus,
  FileReference,
} from "@/types/application";
import { APPLICATION_STATUSES } from "@/types/application";

function sql() {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!url) throw new ApplicationStorageError("POSTGRES_URL is not set.");
  return neon(url);
}

const SELECT_COLUMNS = `
  id, draft_id, reference, first_name, middle_name, last_name, email, phone, date_of_birth, gender,
  country, city, address, institution, degree, field_of_study, graduation_year, grade_or_gpa,
  additional_qualifications, programme, areas_of_interest, motivation, career_goals, relevant_experience,
  additional_information, cv, certificate, transcript, other_document, status, submitted_at, updated_at,
  reviewed_at, reviewed_by, admin_notes, cohort_year, history
`;

let schemaReady = false;

async function ensureSchema() {
  if (schemaReady) return;
  const db = sql();
  await db`
    CREATE TABLE IF NOT EXISTS application_counters (
      year INTEGER PRIMARY KEY,
      last_number INTEGER NOT NULL DEFAULT 0
    )
  `;
  await db`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      draft_id TEXT UNIQUE NOT NULL,
      reference TEXT UNIQUE NOT NULL,
      first_name TEXT NOT NULL DEFAULT '',
      middle_name TEXT NOT NULL DEFAULT '',
      last_name TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      date_of_birth DATE,
      gender TEXT NOT NULL DEFAULT '',
      country TEXT NOT NULL DEFAULT '',
      city TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL DEFAULT '',
      institution TEXT NOT NULL DEFAULT '',
      degree TEXT NOT NULL DEFAULT '',
      field_of_study TEXT NOT NULL DEFAULT '',
      graduation_year INTEGER,
      grade_or_gpa TEXT NOT NULL DEFAULT '',
      additional_qualifications TEXT NOT NULL DEFAULT '',
      programme TEXT NOT NULL DEFAULT '',
      areas_of_interest TEXT[] NOT NULL DEFAULT '{}',
      motivation TEXT NOT NULL DEFAULT '',
      career_goals TEXT NOT NULL DEFAULT '',
      relevant_experience TEXT NOT NULL DEFAULT '',
      additional_information TEXT NOT NULL DEFAULT '',
      cv JSONB,
      certificate JSONB,
      transcript JSONB,
      other_document JSONB,
      status TEXT NOT NULL DEFAULT 'NEW',
      submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      reviewed_at TIMESTAMPTZ,
      reviewed_by TEXT,
      admin_notes TEXT NOT NULL DEFAULT '',
      cohort_year INTEGER,
      payload JSONB
    )
  `;

  const alters = [
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS first_name TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS middle_name TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS last_name TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS phone TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS date_of_birth DATE",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS gender TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS country TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS city TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS address TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS institution TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS degree TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS field_of_study TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS graduation_year INTEGER",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS grade_or_gpa TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS additional_qualifications TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS programme TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS areas_of_interest TEXT[] NOT NULL DEFAULT '{}'",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS motivation TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS career_goals TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS relevant_experience TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS additional_information TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS cv JSONB",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS certificate JSONB",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS transcript JSONB",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS other_document JSONB",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS reviewed_by TEXT",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS admin_notes TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS cohort_year INTEGER",
    "ALTER TABLE applications ADD COLUMN IF NOT EXISTS history JSONB NOT NULL DEFAULT '[]'::jsonb",
  ];
  for (const statement of alters) {
    await runQuery(statement);
  }
  await runQuery("ALTER TABLE applications ALTER COLUMN status SET DEFAULT 'NEW'");
  try {
    await runQuery("ALTER TABLE applications ALTER COLUMN payload DROP NOT NULL");
  } catch {
    /* payload column may not exist on a fresh table */
  }
  await runQuery("DROP INDEX IF EXISTS applications_email_year_idx");
  await runQuery("CREATE UNIQUE INDEX IF NOT EXISTS applications_reference_idx ON applications (reference)");
  await runQuery("CREATE INDEX IF NOT EXISTS applications_email_idx ON applications (LOWER(email))");
  await runQuery("CREATE INDEX IF NOT EXISTS applications_status_idx ON applications (status)");
  await runQuery("CREATE INDEX IF NOT EXISTS applications_programme_idx ON applications (programme)");
  await runQuery("CREATE INDEX IF NOT EXISTS applications_field_idx ON applications (field_of_study)");
  await runQuery("CREATE INDEX IF NOT EXISTS applications_submitted_idx ON applications (submitted_at DESC)");
  await runQuery("CREATE INDEX IF NOT EXISTS applications_cohort_idx ON applications (cohort_year)");
  schemaReady = true;
}

type ApplicationRow = Record<string, unknown>;

function asHistory(value: unknown): ApplicationHistoryEvent[] {
  let parsed = value;
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed) as unknown;
    } catch {
      return [];
    }
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((item): item is ApplicationHistoryEvent => {
    if (!item || typeof item !== "object") return false;
    const event = item as ApplicationHistoryEvent;
    return Boolean(event.id && event.at && event.type && event.message);
  });
}

function asFile(value: unknown): FileReference | null {
  if (!value || typeof value !== "object") return null;
  const file = value as FileReference & { storageKey?: string };
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

function rowToRecord(row: ApplicationRow): ApplicationRecord {
  const submitted = row.submitted_at || row.created_at;
  const areas = Array.isArray(row.areas_of_interest)
    ? (row.areas_of_interest as string[])
    : [];
  return {
    id: String(row.id),
    applicationReference: String(row.reference),
    firstName: String(row.first_name || ""),
    middleName: String(row.middle_name || ""),
    lastName: String(row.last_name || ""),
    email: String(row.email || ""),
    phone: String(row.phone || ""),
    dateOfBirth: row.date_of_birth ? String(row.date_of_birth).slice(0, 10) : "",
    gender: String(row.gender || ""),
    country: String(row.country || ""),
    city: String(row.city || ""),
    address: String(row.address || ""),
    institution: String(row.institution || ""),
    degree: String(row.degree || ""),
    fieldOfStudy: String(row.field_of_study || ""),
    graduationYear: row.graduation_year == null ? "" : String(row.graduation_year),
    gradeOrGPA: String(row.grade_or_gpa || ""),
    additionalQualifications: String(row.additional_qualifications || ""),
    programme: String(row.programme || ""),
    areasOfInterest: areas,
    motivation: String(row.motivation || ""),
    careerGoals: String(row.career_goals || ""),
    relevantExperience: String(row.relevant_experience || ""),
    additionalInformation: String(row.additional_information || ""),
    cv: asFile(row.cv),
    certificate: asFile(row.certificate),
    transcript: asFile(row.transcript),
    otherDocument: asFile(row.other_document),
    status: (row.status as ApplicationStatus) || "NEW",
    submittedAt: submitted ? new Date(String(submitted)).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(String(row.updated_at)).toISOString() : new Date().toISOString(),
    reviewedAt: row.reviewed_at ? new Date(String(row.reviewed_at)).toISOString() : null,
    reviewedBy: row.reviewed_by ? String(row.reviewed_by) : null,
    adminNotes: String(row.admin_notes || ""),
    cohortYear: Number(row.cohort_year) || cohortYear(),
    history: asHistory(row.history),
  };
}

async function nextReference(year: number) {
  const db = sql();
  await db`
    INSERT INTO application_counters (year, last_number)
    VALUES (${year}, 1)
    ON CONFLICT (year)
    DO UPDATE SET last_number = application_counters.last_number + 1
  `;
  const rows = await db`
    SELECT last_number FROM application_counters WHERE year = ${year}
  `;
  return formatReference(year, Number((rows[0] as { last_number: number }).last_number));
}

function isUniqueViolation(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && String(error.code) === "23505";
}

async function queryRows(text: string, params: unknown[] = []) {
  return (await sql().query(text, params)) as ApplicationRow[];
}

async function runQuery(text: string, params: unknown[] = []) {
  await sql().query(text, params);
}

export const postgresStore: ApplicationStore = {
  async create({ draftId, payload }) {
    await ensureSchema();
    const db = sql();
    const year = cohortYear();
    const email = payload.personal.email.trim().toLowerCase();

    const existingDraft = (await db`
      SELECT id FROM applications WHERE draft_id = ${draftId} LIMIT 1
    `) as { id: string }[];
    if (existingDraft[0]) {
      const current = await this.get(existingDraft[0].id);
      if (current) return current;
    }

    const open = await this.findOpenByEmail(email, year);
    if (open) {
      throw new DuplicateApplicationError(
        `An application (${open.applicationReference}) with this email is already in progress.`,
      );
    }

    const id = randomUUID();
    const reference = await nextReference(year);
    const now = new Date().toISOString();
    const record = payloadToRecord(id, reference, payload, {
      status: "NEW",
      submittedAt: now,
      updatedAt: now,
      reviewedAt: null,
      reviewedBy: null,
      adminNotes: "",
      cohortYear: year,
      history: [submittedHistoryEvent(now)],
    });

    try {
      await db`
        INSERT INTO applications (
          id, draft_id, reference, first_name, middle_name, last_name, email, phone, date_of_birth, gender,
          country, city, address, institution, degree, field_of_study, graduation_year, grade_or_gpa,
          additional_qualifications, programme, areas_of_interest, motivation, career_goals, relevant_experience,
          additional_information, cv, certificate, transcript, other_document, status, submitted_at, updated_at,
          admin_notes, cohort_year, history
        ) VALUES (
          ${record.id}, ${draftId}, ${record.applicationReference}, ${record.firstName}, ${record.middleName},
          ${record.lastName}, ${record.email}, ${record.phone}, ${record.dateOfBirth}, ${record.gender},
          ${record.country}, ${record.city}, ${record.address}, ${record.institution}, ${record.degree},
          ${record.fieldOfStudy}, ${Number(record.graduationYear)}, ${record.gradeOrGPA},
          ${record.additionalQualifications}, ${record.programme}, ${record.areasOfInterest}, ${record.motivation},
          ${record.careerGoals}, ${record.relevantExperience}, ${record.additionalInformation},
          ${record.cv}, ${record.certificate}, ${record.transcript}, ${record.otherDocument},
          ${record.status}, ${record.submittedAt}, ${record.updatedAt}, ${record.adminNotes}, ${record.cohortYear},
          ${JSON.stringify(record.history)}
        )
      `;
    } catch (error) {
      if (isUniqueViolation(error)) {
        const raced = (await db`
          SELECT id FROM applications WHERE draft_id = ${draftId} LIMIT 1
        `) as { id: string }[];
        if (raced[0]) {
          const current = await this.get(raced[0].id);
          if (current) return current;
        }
        throw new DuplicateApplicationError();
      }
      throw new ApplicationStorageError("Unable to save this application.");
    }

    const created = await this.get(id);
    if (!created) throw new ApplicationStorageError("The application was saved but could not be loaded.");
    return created;
  },

  async get(id) {
    await ensureSchema();
    const rows = await queryRows(`SELECT ${SELECT_COLUMNS} FROM applications WHERE id = $1 LIMIT 1`, [id]);
    return rows[0] ? withHistory(rowToRecord(rows[0])) : null;
  },

  async getByReference(reference) {
    await ensureSchema();
    const rows = await queryRows(`SELECT ${SELECT_COLUMNS} FROM applications WHERE reference = $1 LIMIT 1`, [reference]);
    return rows[0] ? withHistory(rowToRecord(rows[0])) : null;
  },

  async list(filters: ApplicationListQuery = {}) {
    await ensureSchema();
    const clauses: string[] = [];
    const params: unknown[] = [];
    const add = (clause: string, value: unknown) => {
      params.push(value);
      clauses.push(clause.replace("?", `$${params.length}`));
    };
    if (filters.status) add("status = ?", filters.status);
    if (filters.programme) add("programme = ?", filters.programme);
    if (filters.fieldOfStudy) add("field_of_study = ?", filters.fieldOfStudy);
    if (filters.query) {
      const like = `%${filters.query.replace(/[%_]/g, "")}%`;
      const start = params.length + 1;
      params.push(like, like, like, like, like, like);
      clauses.push(
        `(reference ILIKE $${start} OR email ILIKE $${start + 1} OR first_name ILIKE $${start + 2} OR last_name ILIKE $${start + 3} OR institution ILIKE $${start + 4} OR CONCAT(first_name, ' ', last_name) ILIKE $${start + 5})`,
      );
    }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const sort = filters.sort === "oldest" ? "oldest" : "newest";
    const order = sort === "oldest" ? "ASC" : "DESC";
    const pageSize = Math.min(Math.max(filters.pageSize || ADMIN_PAGE_SIZE, 1), 50);
    const countRows = await queryRows(`SELECT COUNT(*)::int AS n FROM applications ${where}`, params);
    const filteredTotal = Number(countRows[0]?.n || 0);
    const totalPages = Math.max(1, Math.ceil(filteredTotal / pageSize) || 1);
    const page = Math.min(Math.max(filters.page || 1, 1), totalPages);
    const offset = (page - 1) * pageSize;
    const rows = await queryRows(
      `SELECT ${SELECT_COLUMNS} FROM applications ${where} ORDER BY submitted_at ${order} NULLS LAST LIMIT ${pageSize} OFFSET ${offset}`,
      params,
    );
    const grouped = await queryRows(`SELECT status, COUNT(*)::int AS n FROM applications GROUP BY status`);
    const counts = emptyCounts();
    for (const row of grouped) {
      const status = String(row.status) as ApplicationStatus;
      const n = Number(row.n || 0);
      if (APPLICATION_STATUSES.includes(status)) {
        counts[status] = n;
        counts.total += n;
      }
    }
    return {
      items: rows.map((row) => toSummary(rowToRecord(row))),
      total: filteredTotal,
      page,
      pageSize,
      sort,
      counts,
    };
  },


  async findOpenByEmail(email, year) {
    await ensureSchema();
    const rows = await queryRows(
      `SELECT ${SELECT_COLUMNS} FROM applications
       WHERE LOWER(email) = $1 AND cohort_year = $2 AND status = ANY($3)
       ORDER BY submitted_at DESC LIMIT 1`,
      [email.toLowerCase(), year, OPEN_APPLICATION_STATUSES],
    );
    return rows[0] ? withHistory(rowToRecord(rows[0])) : null;
  },

  async updateStatus(id, status, reviewedBy = "Admin") {
    await ensureSchema();
    const current = await this.get(id);
    if (!current) return null;
    const now = new Date().toISOString();
    const history = appendHistory(current.history, statusHistoryEvent(now, current.status, status, reviewedBy));
    await runQuery(
      `UPDATE applications
       SET status = $1, updated_at = $2, reviewed_at = $2, reviewed_by = $3, history = $4::jsonb
       WHERE id = $5`,
      [status, now, reviewedBy, JSON.stringify(history), id],
    );
    return this.get(id);
  },

  async addNotes(id, notes, reviewedBy = "Admin") {
    await ensureSchema();
    const current = await this.get(id);
    if (!current) return null;
    const stamp = new Date().toISOString();
    const entry = `[${stamp}] ${reviewedBy}: ${notes.trim()}`;
    const adminNotes = current.adminNotes ? `${current.adminNotes}\n\n${entry}` : entry;
    const history = appendHistory(current.history, noteHistoryEvent(stamp, notes, reviewedBy));
    await runQuery(
      `UPDATE applications
       SET admin_notes = $1, updated_at = $2, reviewed_by = $3, history = $4::jsonb
       WHERE id = $5`,
      [adminNotes, stamp, reviewedBy, JSON.stringify(history), id],
    );
    return this.get(id);
  },

  async appendHistoryEvent(id, event) {
    await ensureSchema();
    const current = await this.get(id);
    if (!current) return null;
    if (current.history.some((item) => item.id === event.id)) {
      return current;
    }
    if (
      (event.type === "APPLICANT_NOTIFIED" || event.type === "ADMIN_NOTIFIED") &&
      current.history.some((item) => item.type === event.type)
    ) {
      return current;
    }
    const now = new Date().toISOString();
    const history = appendHistory(current.history, event);
    await runQuery(`UPDATE applications SET history = $1::jsonb, updated_at = $2 WHERE id = $3`, [
      JSON.stringify(history),
      now,
      id,
    ]);
    return this.get(id);
  },
};
