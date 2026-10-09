"use client";

import { APPLICATION_STEPS } from "@/lib/applications/constants";

export function ProgressSteps({ current }: { current: number }) {
  const currentStep = APPLICATION_STEPS[current - 1];
  const percent = (current / APPLICATION_STEPS.length) * 100;

  return (
    <div className="mb-8">
      <p id="application-progress" tabIndex={-1} className="text-sm font-medium text-navy outline-none">
        Step {current} of {APPLICATION_STEPS.length}
        <span className="text-muted"> — {currentStep?.title}</span>
      </p>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-sand"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={APPLICATION_STEPS.length}
        aria-valuenow={current}
        aria-label="Application progress"
      >
        <div className="h-full rounded-full bg-orange transition-all duration-300" style={{ width: `${percent}%` }} />
      </div>
      <ol className="mt-4 hidden gap-2 sm:grid sm:grid-cols-3 lg:grid-cols-6">
        {APPLICATION_STEPS.map((step) => {
          const done = step.id < current;
          const active = step.id === current;
          return (
            <li key={step.id} className="flex min-w-0 items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  done || active ? "bg-orange text-white" : "bg-sand text-muted"
                }`}
                aria-current={active ? "step" : undefined}
              >
                {done ? "✓" : step.id}
              </span>
              <span className={`truncate text-xs font-medium ${active ? "text-navy" : "text-muted"}`}>{step.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
