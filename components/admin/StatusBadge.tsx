import { STATUS_LABELS } from "@/lib/applications/constants";
import type { ApplicationStatus } from "@/types/application";

const tones: Record<ApplicationStatus, string> = {
  NEW: "bg-orange/15 text-orange-dark",
  UNDER_REVIEW: "bg-navy/10 text-navy",
  SHORTLISTED: "bg-orange text-white",
  INTERVIEW: "bg-navy text-cream",
  ACCEPTED: "bg-navy text-orange ring-1 ring-orange",
  REJECTED: "bg-sand text-red-800",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tones[status] || tones.NEW}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
