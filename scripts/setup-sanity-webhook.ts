import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

function loadEnv() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return file;
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
  return file;
}

function productionSiteUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  if (envUrl.startsWith("http") && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/$/, "");
  }
  return "https://ubuntu-afrika.vercel.app";
}

async function main() {
  const envFile = loadEnv();
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

  if (!process.env.SANITY_REVALIDATE_SECRET) {
    const secret = crypto.randomBytes(24).toString("hex");
    process.env.SANITY_REVALIDATE_SECRET = secret;
    fs.appendFileSync(envFile, `\nSANITY_REVALIDATE_SECRET=${secret}\n`);
    console.log("Created SANITY_REVALIDATE_SECRET in .env.local");
  } else {
    console.log("SANITY_REVALIDATE_SECRET already set");
  }

  if (!projectId || !token) {
    console.error("Missing Sanity project id or token.");
    process.exit(1);
  }

  const hookUrl = `${productionSiteUrl()}/api/revalidate`;
  const api = `https://${projectId}.api.sanity.io/v2021-10-04/hooks/projects/${projectId}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const existing = await fetch(api, { headers });
  const existingText = await existing.text();
  if (existing.ok) {
    try {
      const hooks = JSON.parse(existingText) as Array<{ name?: string; url?: string }>;
      if (hooks.some((hook) => hook.url === hookUrl || hook.name === "Revalidate Next.js site")) {
        console.log("Sanity webhook already exists for the live site.");
        return;
      }
    } catch {
      console.log("Could not parse existing webhooks list.");
    }
  } else {
    console.log(`List webhooks ${existing.status}: ${existingText.slice(0, 300)}`);
  }

  const body = {
    type: "document",
    name: "Revalidate Next.js site",
    description: "Refresh ubuntu-afrika.vercel.app when published content changes",
    url: hookUrl,
    httpMethod: "POST",
    apiVersion: "v2021-03-25",
    includeDrafts: false,
    dataset,
    headers: {
      Authorization: `Bearer ${process.env.SANITY_REVALIDATE_SECRET}`,
    },
    rule: {
      on: ["create", "update", "delete"],
      filter: "!(_id in path('drafts.**'))",
    },
  };

  const response = await fetch(api, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) {
    console.log(`Webhook API ${response.status}: ${text.slice(0, 400)}`);
    console.log(`Add this webhook URL in Sanity Manage → API → Webhooks: ${hookUrl}`);
    process.exitCode = 0;
    return;
  }
  console.log("Created Sanity webhook for instant site updates.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
