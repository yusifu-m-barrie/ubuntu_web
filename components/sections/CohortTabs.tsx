"use client";

import { AlumniProfileModal } from "@/components/sections/AlumniProfileModal";
import type { AlumniRecord } from "@/types/content";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

const ALIASES: Record<string, string> = {
  "alaji kanu": "alhaji kanu",
  "abdulai brato": "abdulai kamara",
  "isatu magdalene kamara": "isatu kamara",
  "philip adikali sesay": "philip sesay",
  "amadu wurie bah": "amadu bah",
  "omaru calla kamara": "omaru kamara",
  "john a kamara": "john kamara",
};

function normalize(name: string) {
  return name.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();
}

function nameKey(name: string) {
  const aliased = ALIASES[normalize(name)] ?? normalize(name);
  const parts = aliased.split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  return `${parts[0]} ${parts[parts.length - 1]}`;
}

function linkedinFor(name: string, team: { name: string; linkedin?: string }[]) {
  const key = nameKey(name);
  const match = team.find((member) => member.linkedin && nameKey(member.name) === key);
  return match?.linkedin;
}

export function CohortTabs({
  cohorts,
  alumni,
  team = [],
}: {
  cohorts: string[];
  alumni: AlumniRecord[];
  team?: { name: string; linkedin?: string }[];
}) {
  const [active, setActive] = useState(cohorts[cohorts.length - 1] ?? cohorts[0]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const visible = useMemo(() => alumni.filter((person) => person.cohort === active), [alumni, active]);
  const selected = selectedIndex === null ? null : visible[selectedIndex];
  const closeProfile = useCallback(() => setSelectedIndex(null), []);
  const showPrev = useCallback(() => setSelectedIndex((current) => (current === null ? current : Math.max(0, current - 1))), []);
  const showNext = useCallback(
    () =>
      setSelectedIndex((current) =>
        current === null ? current : Math.min(visible.length - 1, current + 1),
      ),
    [visible.length],
  );

  return (
    <div>
      <div
        role="tablist"
        aria-label="Cohorts"
        className="flex flex-wrap gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-navy/10"
      >
        {cohorts.map((cohort) => {
          const selectedTab = active === cohort;
          return (
            <button
              key={cohort}
              type="button"
              role="tab"
              aria-selected={selectedTab}
              className={`cursor-pointer rounded-full px-4 py-2.5 text-sm font-semibold transition duration-300 ${
                selectedTab
                  ? "bg-navy text-cream shadow-[0_8px_20px_rgba(18,38,58,0.28)]"
                  : "bg-transparent text-navy hover:scale-[1.03] hover:bg-cream"
              }`}
              onClick={() => {
                setActive(cohort);
                setSelectedIndex(null);
              }}
            >
              {cohort}
            </button>
          );
        })}
      </div>

      <ul key={active} className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((person, index) => (
          <li
            key={`${person.cohort}-${person.name}`}
            className="animate-tab-in group"
            style={{ animationDelay: `${index * 55}ms` }}
          >
            <button
              type="button"
              onClick={() => setSelectedIndex(index)}
              className="hover-glow h-full w-full cursor-pointer overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-navy/10 focus-visible:ring-2 focus-visible:ring-orange"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                {person.photo ? (
                  <Image
                    src={person.photo}
                    alt={person.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top transition duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted">No photo</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/0 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                <span className="pointer-events-none absolute inset-x-0 bottom-4 mx-auto w-fit cursor-pointer rounded-full bg-orange px-4 py-2 text-sm font-semibold text-white opacity-0 translate-y-2 shadow-md transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  View profile
                </span>
              </div>
              <div className="px-4 py-5">
                <h3 className="font-serif text-xl text-navy">{person.name}</h3>
                <p className="mt-1 text-sm font-medium text-orange">{person.cohort}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{person.job}</p>
                <p className="mt-1 text-sm text-muted">{person.organization}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {selected ? (
        <AlumniProfileModal
          person={selected}
          linkedin={linkedinFor(selected.name, team)}
          onClose={closeProfile}
          onPrev={showPrev}
          onNext={showNext}
          hasPrev={selectedIndex !== null && selectedIndex > 0}
          hasNext={selectedIndex !== null && selectedIndex < visible.length - 1}
        />
      ) : null}
    </div>
  );
}
