import {
  AREAS_OF_INTEREST,
  DEGREES,
  FIELDS_OF_STUDY,
  GENDERS,
  PROGRAMMES,
} from "@/lib/applications/constants";
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
  country: required("Country").max(80),
  city: required("City").max(80),
  address: required("Address").max(240),
});

export const academicSchema = z.object({
  institution: required("Institution").max(160),
  degree: oneOf(DEGREES, "Select your degree."),
  fieldOfStudy: oneOf(FIELDS_OF_STUDY, "Select your field of study."),
  graduationYear: z
    .string()
    .trim()
    .regex(/^(19|20)\d{2}$/, "Enter a valid graduation year.")
    .refine((value) => {
      const year = Number(value);
      const max = new Date().getUTCFullYear() + 1;
      return year >= 1980 && year <= max;
    }, "Enter a valid graduation year."),
  gradeOrGPA: z.string().trim().max(80),
  additionalQualifications: z.string().trim().max(1000),
});

export const programmeSchema = z.object({
  programme: oneOf(PROGRAMMES, "Select a programme."),
  areasOfInterest: z
    .array(z.string())
    .min(1, "Select at least one area of interest.")
    .refine((values) => values.every((value) => AREAS_OF_INTEREST.includes(value as (typeof AREAS_OF_INTEREST)[number])), {
      message: "Choose a listed area of interest.",
    }),
});

export const questionsSchema = z.object({
  motivation: required("Motivation").min(40, "Please write at least 40 characters.").max(2000),
  careerGoals: required("Career goals").min(40, "Please write at least 40 characters.").max(2000),
  relevantExperience: z.string().trim().max(2000),
  additionalInformation: z.string().trim().max(2000),
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
  otherDocument: fileReferenceSchema.optional(),
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
