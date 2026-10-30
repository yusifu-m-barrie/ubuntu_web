import {
  DEFAULT_PROGRAMME,
  DEGREES,
  FIELDS_OF_STUDY,
  GENDERS,
  MOTIVATION_MAX_CHARS,
} from "@/lib/applications/constants";
import { DISTRICTS } from "@/lib/applications/locations";
import { ALLOWED_CONTENT_TYPES, MAX_FILE_BYTES, isSafeStorageKey } from "@/lib/applications/file-types";
import { APPLICATION_STATUSES, DOCUMENT_KINDS } from "@/types/application";
import { z } from "zod";


const required = (label: string) => z.string().trim().min(1, `${label} is required.`);

function oneOf(options: readonly string[], message: string) {
  return z
    .string()
    .trim()
    .min(1, message)
    .refine((value) => options.includes(value), message);
}

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .max(160, "Email is too long.")
  .email("Enter a valid email address.")
  .refine((value) => !value.includes(" "), "Enter a valid email address.")
  .transform((value) => value.toLowerCase());

export const personalSchema = z.object({
  firstName: required("First name").max(80),
  middleName: z.string().trim().max(80),
  lastName: required("Last name").max(80),
  email: emailSchema,
  phone: required("Phone number").max(40),
  dateOfBirth: z
    .string()
    .trim()
    .min(1, "Date of birth is required.")
    .refine((value) => {
      const date = new Date(`${value}T00:00:00`);
      if (Number.isNaN(date.getTime())) return false;
      const today = new Date();
      const latest = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
      const earliest = new Date(today.getFullYear() - 80, today.getMonth(), today.getDate());
      return date <= latest && date >= earliest;
    }, "Enter a valid date of birth."),
  gender: oneOf(GENDERS, "Select a gender option."),
  district: oneOf(DISTRICTS, "Select a district."),
  address: required("Address").max(240),
});


const graduationYearSchema = z
  .string()
  .trim()
  .regex(/^(19|20)\d{2}$/, "Enter a valid graduation year.")
  .refine((value) => {
    const year = Number(value);
    const max = new Date().getUTCFullYear() + 1;
    return year >= 1980 && year <= max;
  }, "Enter a valid graduation year.");

const optionalGraduationYearSchema = z.string().trim().refine(
  (value) => value === "" || graduationYearSchema.safeParse(value).success,
  "Enter a valid graduation year.",
);

const optionalQualificationSchema = z.object({
  institution: z.string().trim().max(160),
  degree: z.string().trim().refine(
    (value) => value === "" || DEGREES.some((option) => option === value),
    "Select your degree.",
  ),
  fieldOfStudy: z.string().trim().refine(
    (value) => value === "" || FIELDS_OF_STUDY.some((option) => option === value),
    "Select your field of study.",
  ),
  graduationYear: optionalGraduationYearSchema,
  gradeOrGPA: z.string().trim().max(80),
});

export const academicSchema = z.object({
  institution: required("Institution").max(160),
  degree: oneOf(DEGREES, "Select your degree."),
  fieldOfStudy: oneOf(FIELDS_OF_STUDY, "Select your field of study."),
  graduationYear: graduationYearSchema,
  gradeOrGPA: z.string().trim().max(80),
  additionalQualifications: z
    .array(optionalQualificationSchema)
    .max(2)
    .default([])
    .transform((items) =>
      items.filter((item) =>
        [item.institution, item.degree, item.fieldOfStudy, item.graduationYear, item.gradeOrGPA].some((value) =>
          value.trim(),
        ),
      ),
    ),
});

export const programmeSchema = z
  .object({
    programme: z.string().optional(),
    areasOfInterest: z.array(z.string()).optional(),
  })
  .transform(() => ({
    programme: DEFAULT_PROGRAMME,
    areasOfInterest: [] as string[],
  }));


export const questionsSchema = z.object({
  motivation: required("Motivation")
    .min(50, "Please enter at least 50 characters.")
    .max(MOTIVATION_MAX_CHARS, "You cannot enter more than 250 characters."),
  careerGoals: required("Career goals")
    .min(50, "Please enter at least 50 characters.")
    .max(MOTIVATION_MAX_CHARS, "You cannot enter more than 250 characters."),
  relevantExperience: z.string().trim().max(MOTIVATION_MAX_CHARS, `Use ${MOTIVATION_MAX_CHARS} characters or fewer.`),
  additionalInformation: z.string().trim().max(MOTIVATION_MAX_CHARS, `Use ${MOTIVATION_MAX_CHARS} characters or fewer.`),
});

export const fileReferenceSchema = z.object({
  kind: z.enum(DOCUMENT_KINDS),
  filename: z
    .string()
    .trim()
    .min(1)
    .max(180)
    .refine((value) => !/[\\/\u0000]/.test(value), "That filename is not allowed."),
  contentType: z.enum(ALLOWED_CONTENT_TYPES),
  size: z.number().int().positive().max(MAX_FILE_BYTES),
  storage: z.enum(["blob", "local"]),
  pathname: z
    .string()
    .min(1)
    .max(240)
    .refine(isSafeStorageKey, "Invalid file reference."),
  uploadedAt: z.string().datetime().optional(),
});

export const documentsSchema = z.object({
  cv: fileReferenceSchema,
  certificate: fileReferenceSchema,
  transcript: fileReferenceSchema,
  otherDocument: z.array(fileReferenceSchema).max(8).default([]),
});

export const applicationPayloadSchema = z.object({
  personal: personalSchema,
  academic: academicSchema,
  programme: programmeSchema,
  questions: questionsSchema,
  documents: documentsSchema,
  declaration: z.boolean().refine((value) => value === true, "You must confirm the declaration before submitting."),
});

export const submitApplicationSchema = z.object({
  draftId: z.string().uuid(),
  payload: applicationPayloadSchema,
});

const optionalText = z.preprocess((value) => (value === "" || value == null ? undefined : value), z.string().trim().max(120).optional());

export const listApplicationsQuerySchema = z.object({
  q: optionalText,
  status: z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    z.enum(APPLICATION_STATUSES).optional(),
  ),
  programme: optionalText,
  fieldOfStudy: optionalText,
  sort: z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    z.enum(["newest", "oldest"]).optional(),
  ),
  page: z.preprocess((value) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
  }, z.number().int().min(1).max(10000)),
});

export const updateStatusSchema = z.object({
  status: z.enum(APPLICATION_STATUSES),
  reviewedBy: z.string().trim().max(80).optional(),
});

export const addNotesSchema = z.object({
  notes: required("Notes").max(4000),
  reviewedBy: z.string().trim().max(80).optional(),
});
