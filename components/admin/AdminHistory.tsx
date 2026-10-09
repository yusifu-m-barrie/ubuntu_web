import { formatAdminDate } from "@/lib/applications/admin-format";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { ApplicationHistoryEvent } from "@/types/application";

export function AdminHistory({ events }: { events: ApplicationHistoryEvent[] }) {
  const ordered = [...events].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  if (!ordered.length) {
    return <p className="text-sm text-muted">No history recorded yet.</p>;
  }

  return (
    <ol className="space-y-4">
      {ordered.map((event) => (
        <li key={event.id} className="border-l-2 border-orange/40 pl-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{formatAdminDate(event.at)}</p>
          <p className="mt-1 text-sm text-navy">{event.message}</p>
          <p className="mt-1 text-xs text-muted">{event.actor}</p>
          {event.toStatus ? (
            <div className="mt-2">
              <StatusBadge status={event.toStatus} />
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
