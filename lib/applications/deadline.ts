/** Last moment applications are accepted: 4 December 2026, 23:59 GMT. */
export const APPLICATION_CLOSES_AT = Date.UTC(2026, 11, 4, 23, 59, 59, 999);

export const APPLICATION_CLOSING_LABEL = "4 December 2026, 23:59 GMT";

export const APPLICATIONS_CLOSED_MESSAGE = `Applications closed on ${APPLICATION_CLOSING_LABEL}.`;

export function applicationsOpen(now = Date.now()) {
  return now <= APPLICATION_CLOSES_AT;
}

export function configuredDeadline(value?: string) {
  const deadline = value?.trim();
  if (!deadline) return APPLICATION_CLOSING_LABEL;
  return deadline;
}
