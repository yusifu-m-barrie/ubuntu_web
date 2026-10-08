"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schema";

export default defineConfig({
  name: "ubuntu-afrika",
  title: "Ubuntu Afrika",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "fqbjzdy8",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/studio",
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
  scheduledPublishing: { enabled: false },
  scheduledDrafts: { enabled: false },
  releases: { enabled: false },
});
