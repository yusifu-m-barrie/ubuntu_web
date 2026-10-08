import { createClient } from "@sanity/client";
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
  console.error("Missing Sanity project id or token.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token,
  useCdn: false,
});

const IMAGE_KEYS = new Set([
  "logo",
  "favicon",
  "ogImage",
  "heroBackground",
  "heroPoster",
  "heroImage",
  "impactImage",
  "photo",
  "image",
]);

const IMAGE_ARRAY_KEYS = new Set(["heroSlides", "slides", "gallery"]);

const assetCache = new Map<string, string>();

async function uploadSrc(src?: string) {
  if (!src?.startsWith("/images/")) return undefined;
  const cached = assetCache.get(src);
  if (cached) return cached;
  const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  if (!fs.existsSync(filePath)) {
    console.warn(`Missing local file for ${src}`);
    return undefined;
  }
  const asset = await client.assets.upload("image", fs.createReadStream(filePath), {
    filename: path.basename(filePath),
  });
  assetCache.set(src, asset._id);
  return asset._id;
}

function imageRef(assetId: string, extra: Record<string, unknown> = {}) {
  return {
    _type: "image",
    asset: { _type: "reference", _ref: assetId },
    ...extra,
  };
}

type PatchMap = Record<string, unknown>;

async function repairValue(value: unknown, extra: Record<string, unknown> = {}) {
  if (typeof value !== "string" || !value) return undefined;
  const assetId = await uploadSrc(value);
  if (!assetId) return undefined;
  return imageRef(assetId, extra);
}

async function collectPatches(doc: Record<string, unknown>) {
  const patches: PatchMap = {};

  for (const key of IMAGE_KEYS) {
    if (typeof doc[key] === "string") {
      const next = await repairValue(doc[key]);
      if (next) patches[key] = next;
    }
  }

  const seo = doc.seo as Record<string, unknown> | undefined;
  if (seo && typeof seo.ogImage === "string") {
    const next = await repairValue(seo.ogImage);
    if (next) patches["seo.ogImage"] = next;
  }

  for (const key of IMAGE_ARRAY_KEYS) {
    const items = doc[key];
    if (!Array.isArray(items)) continue;
    let changed = false;
    const nextItems = await Promise.all(
      items.map(async (item, index) => {
        if (typeof item === "string") {
          const next = await repairValue(item, { _key: `${key}-${index}` });
          if (next) {
            changed = true;
            return next;
          }
        }
        return item;
      }),
    );
    if (changed) patches[key] = nextItems;
  }

  const nestedArrays: Array<[string, string]> = [
    ["features", "image"],
    ["partners", "image"],
  ];
  for (const [arrayKey, imageKey] of nestedArrays) {
    const items = doc[arrayKey];
    if (!Array.isArray(items)) continue;
    let changed = false;
    const nextItems = await Promise.all(
      items.map(async (item) => {
        if (!item || typeof item !== "object") return item;
        const record = item as Record<string, unknown>;
        if (typeof record[imageKey] !== "string") return item;
        const next = await repairValue(record[imageKey] as string);
        if (!next) return item;
        changed = true;
        return { ...record, [imageKey]: next };
      }),
    );
    if (changed) patches[arrayKey] = nextItems;
  }

  return patches;
}

async function run() {
  const docs = (await client.fetch(`*[_type in [
    "siteSettings","homePage","aboutPage","applyPage","contactPage","careersPage",
    "experiencePage","eventsPage","galleryPage","postgraduatePage","teamMember",
    "testimonial","alumni","galleryImage","post"
  ]]{_id,_type,logo,favicon,ogImage,heroBackground,heroPoster,heroImage,impactImage,photo,image,seo,heroSlides,slides,gallery,features,partners}`)) as Record<
    string,
    unknown
  >[];

  const mismatches: Array<{ id: string; type: unknown; fields: string[] }> = [];
  let patched = 0;

  for (const doc of docs) {
    const fields: string[] = [];
    for (const key of IMAGE_KEYS) {
      if (typeof doc[key] === "string") fields.push(`${key}=${doc[key]}`);
    }
    const seo = doc.seo as Record<string, unknown> | undefined;
    if (typeof seo?.ogImage === "string") fields.push(`seo.ogImage=${seo.ogImage}`);
    for (const key of IMAGE_ARRAY_KEYS) {
      const items = doc[key];
      if (Array.isArray(items) && items.some((item) => typeof item === "string")) fields.push(key);
    }
    for (const [arrayKey, imageKey] of [
      ["features", "image"],
      ["partners", "image"],
    ] as const) {
      const items = doc[arrayKey];
      if (Array.isArray(items) && items.some((item) => item && typeof (item as Record<string, unknown>)[imageKey] === "string")) {
        fields.push(`${arrayKey}.${imageKey}`);
      }
    }
    if (fields.length) mismatches.push({ id: String(doc._id), type: doc._type, fields });

    const patches = await collectPatches(doc);
    const keys = Object.keys(patches);
    if (!keys.length) continue;
    await client.patch(String(doc._id)).set(patches).commit();
    patched += 1;
    console.log(`Patched ${doc._type} ${doc._id}: ${keys.join(", ")}`);
  }

  console.log(
    JSON.stringify(
      {
        scanned: docs.length,
        mismatched: mismatches.length,
        patched,
        samples: mismatches.slice(0, 20),
      },
      null,
      2,
    ),
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
