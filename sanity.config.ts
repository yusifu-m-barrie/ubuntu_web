import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schema";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "ubuntu-afrika",
  title: "Ubuntu Afrika",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site settings")
              .id("siteSettings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.listItem()
              .title("Navigation")
              .id("navigation")
              .child(S.document().schemaType("navigation").documentId("navigation")),
            S.divider(),
            S.listItem()
              .title("Homepage")
              .id("homePage")
              .child(S.document().schemaType("homePage").documentId("homePage")),
            S.listItem()
              .title("About")
              .id("aboutPage")
              .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
            S.listItem()
              .title("Postgraduate")
              .id("postgraduatePage")
              .child(S.document().schemaType("postgraduatePage").documentId("postgraduatePage")),
            S.listItem()
              .title("Experience")
              .id("experiencePage")
              .child(S.document().schemaType("experiencePage").documentId("experiencePage")),
            S.listItem()
              .title("Careers")
              .id("careersPage")
              .child(S.document().schemaType("careersPage").documentId("careersPage")),
            S.listItem()
              .title("Apply now")
              .id("applyPage")
              .child(S.document().schemaType("applyPage").documentId("applyPage")),
            S.listItem()
              .title("Contact")
              .id("contactPage")
              .child(S.document().schemaType("contactPage").documentId("contactPage")),
            S.listItem()
              .title("Events listing")
              .id("eventsPage")
              .child(S.document().schemaType("eventsPage").documentId("eventsPage")),
            S.listItem()
              .title("Events & Gallery")
              .id("galleryPage")
              .child(S.document().schemaType("galleryPage").documentId("galleryPage")),
            S.divider(),
            S.documentTypeListItem("teamMember").title("Team"),
            S.documentTypeListItem("alumni").title("Alumni"),
            S.documentTypeListItem("testimonial").title("Testimonials"),
            S.documentTypeListItem("galleryImage").title("Gallery"),
            S.documentTypeListItem("post").title("Blog (unpublished)"),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
