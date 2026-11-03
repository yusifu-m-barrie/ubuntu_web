import type { AlumniRecord, TeamMember } from "@/types/content";

const ALIASES: Record<string, string> = {
  "alaji kanu": "alhaji kanu",
  "alhaji mohamed kanu": "alhaji kanu",
  "abdulai brato": "abdulai kamara",
  "isatu magdalene kamara": "isatu kamara",
  "philip adikali sesay": "philip sesay",
  "amadu wurie bah": "amadu bah",
  "omaru calla kamara": "omaru kamara",
  "john a kamara": "john kamara",
  "abdul andrew ojuku kamara": "andrew kamara",
  "andrew a o kamara": "andrew kamara",
};

function normalize(name: string) {
  return name.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();
}

export function personKey(name: string) {
  const aliased = ALIASES[normalize(name)] ?? normalize(name);
  const parts = aliased.split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  return `${parts[0]} ${parts[parts.length - 1]}`;
}

export function findPerson<T extends { name: string }>(name: string, people: T[]) {
  const key = personKey(name);
  return people.find((person) => personKey(person.name) === key);
}

const STUDENT_JOB = "Student";
const STUDENT_JOB_COHORTS = new Set(["2023 - 2024", "2025 - 2026"]);

function cohortKey(value: string) {
  return value.replace(/\s*-\s*/g, " - ").replace(/\s+/g, " ").trim();
}

export function applyStaffPositionsToAlumni(alumni: AlumniRecord[], team: TeamMember[]): AlumniRecord[] {
  return alumni.map((person) => {
    const member = findPerson(person.name, team);
    if (member) return { ...person, job: member.role };
    if (STUDENT_JOB_COHORTS.has(cohortKey(person.cohort))) {
      return { ...person, job: STUDENT_JOB };
    }
    return person;
  });
}
