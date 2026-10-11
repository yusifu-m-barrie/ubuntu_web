import { createClient } from "@sanity/client";
import { homePage } from "../content/pages";
import { sortTeamMembers, teamMembers } from "../content/team";
import fs from "node:fs";
import path from "node:path";

function loadEnv() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and a Sanity token with write access in .env.local.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token,
  useCdn: false,
});

function normalizeName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function nameTokens(name: string) {
  return normalizeName(name).split(" ").filter((part) => part.length > 1);
}

function matchMember<T extends { name: string }>(haystack: T[], name: string) {
  const wanted = nameTokens(name);
  const exact = haystack.find((item) => normalizeName(item.name) === normalizeName(name));
  if (exact) return exact;
  return haystack.find((item) => {
    const have = nameTokens(item.name);
    const last = wanted[wanted.length - 1];
    const first = wanted[0];
    return have.includes(first) && have.includes(last);
  });
}

function canonicalRole(name: string, currentRole: string, fallbackRole: string) {
  const role = currentRole.toLowerCase();
  if (role.includes("coordinator") || (name.toLowerCase().includes("daniel") && role.includes("project"))) {
    return "Project Manager";
  }
  if (role.includes("clean")) return currentRole;
  if (role.includes("support")) return currentRole;
  return fallbackRole;
}

async function main() {
  const desired = sortTeamMembers(teamMembers);
  const [existing, home] = await Promise.all([
    client.fetch<Array<{ _id: string; name: string; role: string; order?: number }>>(
      `*[_type == "teamMember"]{_id,name,role,order} | order(order asc)`,
    ),
    client.fetch<{ _id: string; testimonialsSubtitle?: string } | null>(
      `*[_type == "homePage"][0]{_id,testimonialsSubtitle}`,
    ),
  ]);

  console.log("Current Sanity team:");
  for (const member of existing) {
    console.log(`  ${member.order ?? "-"} ${member.name} — ${member.role}`);
  }

  const unmatched = desired.filter((member) => !matchMember(existing, member.name));
  if (unmatched.length) {
    console.error("Could not match local members in Sanity:", unmatched.map((item) => item.name).join(", "));
    process.exit(1);
  }

  const unused = existing.filter((member) => !desired.some((item) => matchMember([member], item.name)));
  if (unused.length) {
    console.warn(
      "Sanity members not in local list (left unchanged):",
      unused.map((item) => item.name).join(", "),
    );
  }

  const transaction = client.transaction();

  for (const [index, member] of desired.entries()) {
    const doc = matchMember(existing, member.name);
    if (!doc) continue;
    const role = canonicalRole(doc.name, doc.role, member.role);
    const order = index + 1;
    if (doc.role === role && doc.order === order) continue;
    transaction.patch(doc._id, { set: { role, order } });
    console.log(`Patch ${doc.name}: ${doc.role} #${doc.order} -> ${role} #${order}`);
  }

  const slogan = homePage.testimonialsSubtitle;
  if (home && home.testimonialsSubtitle !== slogan) {
    transaction.patch(home._id, { set: { testimonialsSubtitle: slogan } });
    console.log(`Patch slogan: ${home.testimonialsSubtitle} -> ${slogan}`);
  }

  const result = await transaction.commit();
  console.log(`Committed ${result.results.length} Sanity mutations.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
