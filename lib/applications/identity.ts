import type { ApplicationPayload, ApplicationRecord } from "@/types/application";

export const DUPLICATE_APPLICATION_MESSAGE =
  "An application with this email or phone number already exists for this intake. Each person may apply only once.";

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 8) return "";
  if (digits.startsWith("232") && digits.length >= 11) return digits.slice(-9);
  if (digits.startsWith("0") && digits.length >= 9) return digits.slice(-9);
  return digits.length > 9 ? digits.slice(-9) : digits;
}

export function identityFromPayload(payload: ApplicationPayload) {
  return {
    email: normalizeEmail(payload.personal.email),
    phone: normalizePhone(payload.personal.phone),
  };
}

export function isSameApplicant(
  record: Pick<ApplicationRecord, "email" | "phone">,
  identity: ReturnType<typeof identityFromPayload>,
) {
  if (identity.email && normalizeEmail(record.email) === identity.email) return true;
  const recordPhone = normalizePhone(record.phone);
  if (identity.phone && recordPhone && recordPhone === identity.phone) return true;
  return false;
}
