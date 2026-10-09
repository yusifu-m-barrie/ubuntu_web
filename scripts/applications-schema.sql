CREATE TABLE IF NOT EXISTS application_counters (
  year INTEGER PRIMARY KEY,
  last_number INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  draft_id TEXT UNIQUE NOT NULL,
  reference TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  middle_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  graduation_year INTEGER NOT NULL,
  grade_or_gpa TEXT NOT NULL DEFAULT '',
  additional_qualifications TEXT NOT NULL DEFAULT '',
  programme TEXT NOT NULL,
  areas_of_interest TEXT[] NOT NULL DEFAULT '{}',
  motivation TEXT NOT NULL,
  career_goals TEXT NOT NULL,
  relevant_experience TEXT NOT NULL DEFAULT '',
  additional_information TEXT NOT NULL DEFAULT '',
  -- Document JSONB fields store metadata only (kind, filename, contentType, size, storage, pathname, uploadedAt).
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
  cohort_year INTEGER NOT NULL,
  history JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS applications_reference_idx
  ON applications (reference);

CREATE INDEX IF NOT EXISTS applications_email_idx
  ON applications (LOWER(email));

CREATE INDEX IF NOT EXISTS applications_status_idx
  ON applications (status);

CREATE INDEX IF NOT EXISTS applications_programme_idx
  ON applications (programme);

CREATE INDEX IF NOT EXISTS applications_field_idx
  ON applications (field_of_study);

CREATE INDEX IF NOT EXISTS applications_submitted_idx
  ON applications (submitted_at DESC);

CREATE INDEX IF NOT EXISTS applications_cohort_idx
  ON applications (cohort_year);
