"use client";

import { STATUS_LABELS } from "@/lib/applications/constants";
import type { ApplicationStatus } from "@/types/application";
import { APPLICATION_STATUSES } from "@/types/application";

const STEPS = APPLICATION_STATUSES.filter((status) => status !== "REJECTED");

export function StatusPipeline({
  status,
  onPick,
  disabled,
}: {
  status: ApplicationStatus;
  onPick?: (status: ApplicationStatus) => void;
  disabled?: boolean;
}) {
  const currentIndex = STEPS.indexOf(status as (typeof STEPS)[number]);
  const rejected = status === "REJECTED";

  return (
    <div>
      <ol className="grid grid-cols-3 gap-2 sm:grid-cols-5" aria-label="Application progress">
        {STEPS.map((step, index) => {
          const done = !rejected && currentIndex >= 0 && index <= currentIndex;
          const current = !rejected && step === status;
          const className = current
            ? "bg-orange text-white"
            : done
              ? "bg-cream/15 text-cream ring-1 ring-orange/50"
              : "bg-white/10 text-sand";
          if (onPick) {
            return (
              <li key={step}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onPick(step)}
                  className={`w-full rounded-xl px-2 py-2 text-center text-[11px] font-semibold leading-tight hover:bg-orange hover:text-white disabled:opacity-60 ${className}`}
                  aria-current={current ? "step" : undefined}
                >
                  {STATUS_LABELS[step]}
                </button>
              </li>
            );
          }
          return (
            <li
              key={step}
              className={`rounded-xl px-2 py-2 text-center text-[11px] font-semibold leading-tight ${className}`}
              aria-current={current ? "step" : undefined}
            >
              {STATUS_LABELS[step]}
            </li>
          );
        })}
      </ol>
      {onPick ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onPick("REJECTED")}
          className={`mt-2 w-full rounded-xl px-2 py-2 text-center text-[11px] font-semibold ${
            rejected ? "bg-red-700 text-white" : "bg-white/10 text-sand hover:bg-red-700 hover:text-white"
          }`}
        >
          Rejected
        </button>
      ) : rejected ? (
        <p className="mt-2 rounded-xl bg-red-700 px-2 py-2 text-center text-[11px] font-semibold text-white">Rejected</p>
      ) : null}
    </div>
  );
}
