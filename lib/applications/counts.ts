import { APPLICATION_STATUSES } from "@/types/application";
import type { ApplicationCounts, ApplicationStatus } from "@/types/application";

export function emptyCounts(): ApplicationCounts {
  return {
    total: 0,
    NEW: 0,
    UNDER_REVIEW: 0,
    SHORTLISTED: 0,
    INTERVIEW: 0,
    ACCEPTED: 0,
    REJECTED: 0,
  };
}

export function tallyCounts(statuses: ApplicationStatus[]): ApplicationCounts {
  const counts = emptyCounts();
  for (const status of statuses) {
    if (APPLICATION_STATUSES.includes(status)) counts[status] += 1;
    counts.total += 1;
  }
  return counts;
}
