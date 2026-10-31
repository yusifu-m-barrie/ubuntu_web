import { createClient } from "@sanity/client";
import { applyPage } from "../content/pages";
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

async function main() {
  await client
    .patch("applyPage")
    .set({
      heroTitle: applyPage.heroTitle,
      intro: applyPage.intro,
      whoTitle: applyPage.whoTitle,
      whoBody: applyPage.whoBody,
      expectTitle: applyPage.expectTitle,
      expectBody: applyPage.expectBody,
      documentsTitle: applyPage.documentsTitle,
      documents: applyPage.documents,
      documentsNote: applyPage.documentsNote,
      processTitle: applyPage.processTitle,
      processBody: applyPage.processBody,
      readyTitle: applyPage.readyTitle,
    })
    .commit();
  console.log("Updated applyPage in Sanity production.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
