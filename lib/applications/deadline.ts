export function configuredDeadline(value?: string) {
  const deadline = value?.trim();
  if (!deadline) return "";
  const parsed = Date.parse(deadline);
  if (!Number.isNaN(parsed) && parsed < Date.now()) return "";
  return deadline;
}
