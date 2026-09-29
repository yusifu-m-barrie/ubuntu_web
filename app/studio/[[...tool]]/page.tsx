"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export default function StudioPage() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId || projectId === "placeholder") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <h1 className="font-serif text-3xl text-navy">Sanity Studio</h1>
        <p className="mt-4 text-muted">
          Create a Sanity project, then set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET
          in your environment. Until then, the public site reads migrated WordPress content from the local
          content layer.
        </p>
      </div>
    );
  }
  return <NextStudio config={config} />;
}
