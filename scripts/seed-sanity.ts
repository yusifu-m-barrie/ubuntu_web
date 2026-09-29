import { createClient } from "@sanity/client";
import { alumni } from "../content/alumni";
import { galleryImages } from "../content/gallery";
import {
  aboutPage,
  applyPage,
  careersPage,
  contactPage,
  eventsListPage,
  experiencePage,
  galleryPage,
  homePage,
  navigation,
  postgraduatePage,
  siteSettings,
} from "../content/pages";
import { teamMembers, testimonials } from "../content/team";
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
const token = process.env.SANITY_API_WRITE_TOKEN;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!projectId || projectId === "placeholder" || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local before seeding.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token,
  useCdn: false,
});

const assetCache = new Map<string, string>();

async function uploadSrc(src?: string) {
  if (!src?.startsWith("/images/")) return undefined;
  const cached = assetCache.get(src);
  if (cached) return cached;
  const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  if (!fs.existsSync(filePath)) return undefined;
  const asset = await client.assets.upload("image", fs.createReadStream(filePath), {
    filename: path.basename(filePath),
  });
  assetCache.set(src, asset._id);
  return asset._id;
}

function imageRef(assetId: string | undefined, extra: Record<string, unknown> = {}) {
  return {
    _type: "image",
    ...(assetId ? { asset: { _type: "reference", _ref: assetId } } : {}),
    ...extra,
  };
}

async function slideImages(slides: { src: string; alt: string }[]) {
  return Promise.all(
    slides.map(async (slide, index) =>
      imageRef(await uploadSrc(slide.src), {
        _key: `slide-${index}`,
        alt: slide.alt,
        src: slide.src,
      }),
    ),
  );
}

async function seed() {
  console.log("Uploading images and writing documents to Sanity...");

  const logoId = await uploadSrc(siteSettings.logo);
  const faviconId = await uploadSrc(siteSettings.favicon);

  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    companyName: siteSettings.companyName,
    shortName: siteSettings.shortName,
    tagline: siteSettings.tagline,
    logo: imageRef(logoId),
    logoUrl: siteSettings.logo,
    favicon: imageRef(faviconId),
    faviconUrl: siteSettings.favicon,
    phoneFooter: siteSettings.phoneFooter,
    phoneContact: siteSettings.phoneContact,
    emails: siteSettings.emails,
    addressLines: siteSettings.addressLines,
    addressFull: siteSettings.addressFull,
    socials: siteSettings.socials.map((social, index) => ({ _key: `social-${index}`, ...social })),
    footerAboutTitle: siteSettings.footerAboutTitle,
    footerAboutText: siteSettings.footerAboutText,
    footerContactTitle: siteSettings.footerContactTitle,
    footerSocialTitle: siteSettings.footerSocialTitle,
    copyright: siteSettings.copyright,
    credit: siteSettings.credit,
    mapEmbedUrl: siteSettings.mapEmbedUrl,
    seo: siteSettings.defaultSeo,
  });

  await client.createOrReplace({
    _id: "navigation",
    _type: "navigation",
    items: navigation.map((item, index) => ({
      _key: `nav-${index}`,
      label: item.label,
      href: item.href,
      accent: item.accent || false,
      children: item.children?.map((child, childIndex) => ({
        _key: `nav-${index}-${childIndex}`,
        ...child,
      })),
    })),
  });

  await client.createOrReplace({
    _id: "homePage",
    _type: "homePage",
    seo: homePage.seo,
    heroTitle: homePage.heroTitle,
    heroLine1: homePage.heroLine1,
    heroLine2: homePage.heroLine2,
    heroCtaLabel: homePage.heroCtaLabel,
    heroCtaHref: homePage.heroCtaHref,
    heroBackground: imageRef(await uploadSrc(homePage.heroBackground)),
    heroBackgroundSrc: homePage.heroBackground,
    heroSlides: await slideImages(homePage.heroSlides),
    introTitle: homePage.introTitle,
    introText: homePage.introText,
    features: await Promise.all(
      homePage.features.map(async (feature, index) => ({
        _key: `feature-${index}`,
        eyebrow: feature.eyebrow,
        title: feature.title,
        image: imageRef(await uploadSrc(feature.image)),
        imageSrc: feature.image,
        imageAlt: feature.imageAlt,
        imageOn: feature.imageOn,
      })),
    ),
    testimonialsTitle: homePage.testimonialsTitle,
    testimonialsSubtitle: homePage.testimonialsSubtitle,
    partners: await Promise.all(
      homePage.partners.map(async (partner, index) => ({
        _key: `partner-${index}`,
        src: partner.src,
        alt: partner.alt,
        image: imageRef(await uploadSrc(partner.src)),
      })),
    ),
  });

  await client.createOrReplace({
    _id: "aboutPage",
    _type: "aboutPage",
    seo: aboutPage.seo,
    heroTitle: aboutPage.heroTitle,
    heroSubtitle: aboutPage.heroSubtitle,
    heroSlides: await slideImages(aboutPage.heroSlides),
    intro: aboutPage.intro,
    aimTitle: aboutPage.aimTitle,
    aimText: aboutPage.aimText,
    missionTitle: aboutPage.missionTitle,
    missionText: aboutPage.missionText,
    keyAreasTitle: aboutPage.keyAreasTitle,
    keyAreas: aboutPage.keyAreas,
    impactImage: imageRef(await uploadSrc(aboutPage.impactImage)),
    impactImageSrc: aboutPage.impactImage,
    impactImageAlt: aboutPage.impactImageAlt,
    capabilities: aboutPage.capabilities.map((item, index) => ({ _key: `cap-${index}`, ...item })),
    teamTitle: aboutPage.teamTitle,
    teamIntro: aboutPage.teamIntro,
  });

  await client.createOrReplace({
    _id: "applyPage",
    _type: "applyPage",
    seo: applyPage.seo,
    headline: applyPage.headline,
    scholarship: applyPage.scholarship,
    documentsTitle: applyPage.documentsTitle,
    documents: applyPage.documents,
    sendTo: applyPage.sendTo,
    closingDate: applyPage.closingDate,
    ctaLabel: applyPage.ctaLabel,
    ctaMailto: applyPage.ctaMailto,
    heroImage: imageRef(await uploadSrc(applyPage.heroImage)),
    heroImageSrc: applyPage.heroImage,
  });

  await client.createOrReplace({
    _id: "contactPage",
    _type: "contactPage",
    seo: contactPage.seo,
    title: contactPage.title,
    intro: contactPage.intro,
    callTitle: contactPage.callTitle,
    emailTitle: contactPage.emailTitle,
    visitTitle: contactPage.visitTitle,
    formLabels: contactPage.formLabels,
  });

  await client.createOrReplace({
    _id: "careersPage",
    _type: "careersPage",
    seo: careersPage.seo,
    heroTitle: careersPage.heroTitle,
    heroSubtitle: careersPage.heroSubtitle,
    heroCta: careersPage.heroCta,
    heroCtaHref: careersPage.heroCtaHref,
    heroVideoId: careersPage.heroVideoId,
    heroPoster: imageRef(await uploadSrc(careersPage.heroPoster)),
    heroPosterSrc: careersPage.heroPoster,
    intro: careersPage.intro,
    whyTitle: careersPage.whyTitle,
    whyText: careersPage.whyText,
    coursesTitle: careersPage.coursesTitle,
    courses: careersPage.courses.map((course, index) => ({ _key: `course-${index}`, ...course })),
    slides: await slideImages(careersPage.slides),
  });

  await client.createOrReplace({
    _id: "experiencePage",
    _type: "experiencePage",
    seo: experiencePage.seo,
    title: experiencePage.title,
    body: experiencePage.body,
  });

  await client.createOrReplace({
    _id: "eventsPage",
    _type: "eventsPage",
    seo: eventsListPage.seo,
    title: eventsListPage.title,
    body: eventsListPage.body,
  });

  await client.createOrReplace({
    _id: "postgraduatePage",
    _type: "postgraduatePage",
    seo: postgraduatePage.seo,
    title: postgraduatePage.title,
    heroSubtitle: postgraduatePage.heroSubtitle,
    heroSlides: await slideImages(postgraduatePage.heroSlides),
    intro: postgraduatePage.intro,
    highlights: postgraduatePage.highlights.map((item, index) => ({ _key: `hl-${index}`, ...item })),
    cohorts: postgraduatePage.cohorts,
    ctaLabel: postgraduatePage.ctaLabel,
    ctaHref: postgraduatePage.ctaHref,
  });

  await client.createOrReplace({
    _id: "galleryPage",
    _type: "galleryPage",
    seo: galleryPage.seo,
    title: galleryPage.title,
    heroSlides: await slideImages(galleryPage.heroSlides),
  });

  for (const [index, member] of teamMembers.entries()) {
    await client.createOrReplace({
      _id: `teamMember.${index + 1}`,
      _type: "teamMember",
      name: member.name,
      role: member.role,
      photo: imageRef(await uploadSrc(member.photo)),
      photoUrl: member.photo,
      linkedin: member.linkedin || undefined,
      order: index + 1,
    });
  }

  for (const [index, item] of testimonials.entries()) {
    await client.createOrReplace({
      _id: `testimonial.${index + 1}`,
      _type: "testimonial",
      name: item.name,
      cohort: item.cohort,
      quote: item.quote,
      image: imageRef(await uploadSrc(item.image)),
      imageUrl: item.image,
      order: index + 1,
    });
  }

  for (const [index, person] of alumni.entries()) {
    await client.createOrReplace({
      _id: `alumni.${index + 1}`,
      _type: "alumni",
      name: person.name,
      cohort: person.cohort,
      photo: imageRef(await uploadSrc(person.photo)),
      photoUrl: person.photo,
      order: index + 1,
      publicOnSite: true,
      job: person.job,
      organization: person.organization,
      residence: person.residence,
      birthPlace: person.birthPlace,
      familyPlace: person.familyPlace,
      socialHelp: person.socialHelp,
      contact: person.contact,
      family: person.family,
      age: person.age,
      grade: person.grade,
      internalNotes: person.internalNotes,
    });
  }

  for (const [index, image] of galleryImages.entries()) {
    await client.createOrReplace({
      _id: `galleryImage.${index + 1}`,
      _type: "galleryImage",
      image: imageRef(await uploadSrc(image.src)),
      src: image.src,
      alt: image.alt,
      order: index + 1,
    });
  }

  console.log(
    `Seeded site settings, navigation, all pages, ${teamMembers.length} team members, ${testimonials.length} testimonials, ${alumni.length} alumni, and ${galleryImages.length} gallery photos.`,
  );
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
