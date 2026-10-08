import { defineField, defineType } from "sanity";

const seoFields = [
  defineField({ name: "title", title: "SEO title", type: "string" }),
  defineField({ name: "description", title: "SEO description", type: "text", rows: 3 }),
  defineField({ name: "ogImage", title: "Open Graph image", type: "image" }),
];

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "companyName", type: "string", validation: (r) => r.required() }),
    defineField({ name: "shortName", type: "string" }),
    defineField({ name: "tagline", type: "string" }),
    defineField({ name: "logo", type: "image", options: { hotspot: true } }),
    defineField({ name: "logoUrl", title: "Logo path (migration)", type: "string", hidden: true }),
    defineField({ name: "favicon", type: "image" }),
    defineField({ name: "faviconUrl", title: "Favicon path (migration)", type: "string", hidden: true }),
    defineField({ name: "phoneFooter", title: "Phone (footer)", type: "string" }),
    defineField({ name: "phoneContact", title: "Phone (contact page)", type: "string" }),
    defineField({ name: "emails", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "addressLines", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "addressFull", type: "text", rows: 3 }),
    defineField({
      name: "socials",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string" },
            { name: "href", type: "string" },
          ],
        },
      ],
    }),
    defineField({ name: "footerAboutTitle", type: "string" }),
    defineField({ name: "footerAboutText", type: "text", rows: 3 }),
    defineField({ name: "footerContactTitle", type: "string" }),
    defineField({ name: "footerSocialTitle", type: "string" }),
    defineField({ name: "copyright", type: "string" }),
    defineField({ name: "credit", type: "string" }),
    defineField({ name: "mapEmbedUrl", type: "url" }),
    defineField({ name: "seo", type: "object", fields: seoFields }),
  ],
});

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({
      name: "items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string" },
            { name: "href", type: "string" },
            { name: "accent", type: "boolean" },
            {
              name: "children",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "label", type: "string" },
                    { name: "href", type: "string" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
});

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", type: "string" }),
    defineField({ name: "heroLine1", type: "text" }),
    defineField({ name: "heroLine2", type: "text" }),
    defineField({ name: "heroCtaLabel", type: "string" }),
    defineField({ name: "heroCtaHref", type: "string" }),
    defineField({ name: "heroBackground", type: "image" }),
    defineField({ name: "heroBackgroundSrc", title: "Hero background path", type: "string", hidden: true }),
    defineField({
      name: "heroSlides",
      type: "array",
      of: [{ type: "image", fields: [{ name: "alt", type: "string" }, { name: "src", type: "string" }] }],
    }),
    defineField({ name: "introTitle", type: "string" }),
    defineField({ name: "introText", type: "text" }),
    defineField({
      name: "features",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "eyebrow", type: "string" },
            { name: "title", type: "string" },
            { name: "image", type: "image" },
            { name: "imageSrc", type: "string", hidden: true },
            { name: "imageAlt", type: "string" },
            {
              name: "imageOn",
              type: "string",
              options: { list: ["left", "right"] },
            },
          ],
        },
      ],
    }),
    defineField({ name: "testimonialsTitle", type: "string" }),
    defineField({ name: "testimonialsSubtitle", type: "text" }),
    defineField({
      name: "partners",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "src", type: "string" },
            { name: "alt", type: "string" },
            { name: "image", type: "image" },
          ],
        },
      ],
    }),
    defineField({ name: "seo", type: "object", fields: seoFields }),
  ],
});

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", type: "string" }),
    defineField({ name: "heroSubtitle", type: "string" }),
    defineField({
      name: "heroSlides",
      type: "array",
      of: [{ type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string", title: "Alt text" }, { name: "src", type: "string" }] }],
    }),
    defineField({ name: "intro", type: "array", of: [{ type: "text" }] }),
    defineField({ name: "aimTitle", type: "string" }),
    defineField({ name: "aimText", type: "text" }),
    defineField({ name: "missionTitle", type: "string" }),
    defineField({ name: "missionText", type: "text" }),
    defineField({ name: "keyAreasTitle", type: "string" }),
    defineField({ name: "keyAreas", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "impactImage", type: "image", options: { hotspot: true } }),
    defineField({ name: "impactImageSrc", type: "string", hidden: true }),
    defineField({ name: "impactImageAlt", type: "string" }),
    defineField({
      name: "capabilities",
      type: "array",
      of: [{ type: "object", fields: [{ name: "title", type: "string" }] }],
    }),
    defineField({ name: "teamTitle", type: "string" }),
    defineField({ name: "teamIntro", type: "text" }),
    defineField({ name: "seo", type: "object", fields: seoFields }),
  ],
});

export const applyPage = defineType({
  name: "applyPage",
  title: "Apply page",
  type: "document",
  fields: [
    defineField({ name: "headline", type: "string" }),
    defineField({ name: "scholarship", type: "string" }),
    defineField({ name: "documentsTitle", type: "string" }),
    defineField({ name: "documents", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "sendTo", type: "string" }),
    defineField({ name: "closingDate", type: "string" }),
    defineField({ name: "ctaLabel", type: "string" }),
    defineField({ name: "ctaMailto", type: "string" }),
    defineField({ name: "heroImage", type: "image" }),
    defineField({ name: "heroImageSrc", type: "string", hidden: true }),
    defineField({ name: "seo", type: "object", fields: seoFields }),
  ],
});

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "intro", type: "text" }),
    defineField({ name: "callTitle", type: "string" }),
    defineField({ name: "emailTitle", type: "string" }),
    defineField({ name: "visitTitle", type: "string" }),
    defineField({
      name: "formLabels",
      type: "object",
      fields: [
        { name: "firstName", type: "string" },
        { name: "lastName", type: "string" },
        { name: "email", type: "string" },
        { name: "message", type: "string" },
        { name: "submit", type: "string" },
      ],
    }),
    defineField({ name: "seo", type: "object", fields: seoFields }),
  ],
});

export const careersPage = defineType({
  name: "careersPage",
  title: "Careers page",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", type: "string" }),
    defineField({ name: "heroSubtitle", type: "text" }),
    defineField({ name: "heroCta", type: "string" }),
    defineField({ name: "heroCtaHref", type: "string" }),
    defineField({ name: "heroVideoId", title: "YouTube video ID", type: "string" }),
    defineField({ name: "heroPoster", type: "image" }),
    defineField({ name: "heroPosterSrc", type: "string", hidden: true }),
    defineField({ name: "intro", type: "array", of: [{ type: "text" }] }),
    defineField({ name: "whyTitle", type: "string" }),
    defineField({ name: "whyText", type: "text" }),
    defineField({ name: "coursesTitle", type: "string" }),
    defineField({
      name: "courses",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string" },
            { name: "description", type: "text" },
            { name: "icon", type: "string" },
          ],
        },
      ],
    }),
    defineField({
      name: "slides",
      type: "array",
      of: [{ type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string" }, { name: "src", type: "string" }] }],
    }),
    defineField({ name: "seo", type: "object", fields: seoFields }),
  ],
});

export const experiencePage = defineType({
  name: "experiencePage",
  title: "Ubuntu Experience",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "body", type: "text" }),
    defineField({ name: "gallery", type: "array", of: [{ type: "image" }] }),
    defineField({ name: "seo", type: "object", fields: seoFields }),
  ],
});

export const eventsPage = defineType({
  name: "eventsPage",
  title: "Events listing page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "body", type: "text" }),
    defineField({ name: "seo", type: "object", fields: seoFields }),
  ],
});

export const postgraduatePage = defineType({
  name: "postgraduatePage",
  title: "Ubuntu Postgraduate",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "heroSubtitle", type: "text" }),
    defineField({
      name: "heroSlides",
      type: "array",
      of: [{ type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string", title: "Alt text" }, { name: "src", type: "string" }] }],
    }),
    defineField({ name: "intro", type: "array", of: [{ type: "text" }] }),
    defineField({
      name: "highlights",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string" },
            { name: "text", type: "text" },
          ],
        },
      ],
    }),
    defineField({ name: "cohorts", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "ctaLabel", type: "string" }),
    defineField({ name: "ctaHref", type: "string" }),
    defineField({ name: "seo", type: "object", fields: seoFields }),
  ],
});

export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "photo", type: "image", options: { hotspot: true } }),
    defineField({
      name: "photoUrl",
      title: "Photo URL (migration fallback)",
      type: "string",
      hidden: true,
      description: "Used until a Sanity image is uploaded. Example: /images/lorenzo-1-1.jpg",
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn profile URL",
      type: "url",
      description: "Full LinkedIn profile, e.g. https://www.linkedin.com/in/...",
    }),
    defineField({ name: "order", type: "number" }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "cohort", type: "string" }),
    defineField({ name: "quote", type: "text" }),
    defineField({ name: "image", type: "image" }),
    defineField({ name: "imageUrl", title: "Image path (migration)", type: "string", hidden: true }),
    defineField({ name: "order", type: "number" }),
  ],
});

export const alumni = defineType({
  name: "alumni",
  title: "Alumni",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "cohort", type: "string" }),
    defineField({ name: "photo", type: "image" }),
    defineField({ name: "photoUrl", title: "Photo path (migration)", type: "string", hidden: true }),
    defineField({ name: "order", type: "number" }),
    defineField({ name: "job", title: "Public role", type: "string" }),
    defineField({ name: "organization", type: "string" }),
    defineField({
      name: "publicOnSite",
      title: "Show full biography publicly",
      type: "boolean",
      initialValue: false,
      description: "When off, the site shows name, photo, cohort, role and organisation only.",
    }),
    defineField({ name: "residence", type: "string" }),
    defineField({ name: "birthPlace", type: "string" }),
    defineField({ name: "familyPlace", type: "string" }),
    defineField({ name: "socialHelp", type: "text" }),
    defineField({ name: "contact", type: "string" }),
    defineField({ name: "family", type: "text" }),
    defineField({ name: "age", type: "string" }),
    defineField({ name: "grade", type: "string" }),
    defineField({
      name: "internalNotes",
      type: "text",
      description: "Not shown on the public website.",
    }),
  ],
  preview: { select: { title: "name", subtitle: "cohort" } },
});

export const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery image",
  type: "document",
  fields: [
    defineField({ name: "image", type: "image" }),
    defineField({ name: "src", title: "Image path (migration)", type: "string", hidden: true }),
    defineField({ name: "alt", type: "string" }),
    defineField({ name: "order", type: "number" }),
  ],
});

export const galleryPage = defineType({
  name: "galleryPage",
  title: "Events & Gallery page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "heroSlides",
      type: "array",
      of: [{ type: "image", fields: [{ name: "alt", type: "string" }, { name: "src", type: "string" }] }],
    }),
    defineField({ name: "seo", type: "object", fields: seoFields }),
  ],
});

export const post = defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({ name: "excerpt", type: "text" }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "seo", type: "object", fields: seoFields }),
  ],
});

export const schemaTypes = [
  siteSettings,
  navigation,
  homePage,
  aboutPage,
  applyPage,
  contactPage,
  careersPage,
  experiencePage,
  eventsPage,
  galleryPage,
  postgraduatePage,
  teamMember,
  testimonial,
  alumni,
  galleryImage,
  post,
];
