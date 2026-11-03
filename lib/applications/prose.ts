export const PROFESSIONAL_PROSE_HINT =
  "Write in clear, professional language. Letters, numbers, and standard punctuation only. Symbols and special characters are not allowed.";

export const PROFESSIONAL_PROSE_ERROR =
  "Use letters, numbers, and standard punctuation only. Symbols and special characters are not allowed.";

const ALLOWED = /[\p{L}\p{M}\p{N}\s.,;:'’"“”()\-\/!?]/u;
const DISALLOWED = /[^\p{L}\p{M}\p{N}\s.,;:'’"“”()\-\/!?]/gu;

export function sanitizeProfessionalProse(value: string) {
  return value.replace(DISALLOWED, "").replace(/[ \t]{2,}/g, " ");
}

export function isProfessionalProse(value: string) {
  if (!value.trim()) return true;
  return [...value].every((character) => ALLOWED.test(character));
}
