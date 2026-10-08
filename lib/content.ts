import { getMigratedContent, type MigratedContent } from "@/content";
import { sanityClient, sanityConfigured } from "@/lib/sanity/client";
import { sanityImageUrl } from "@/lib/sanity/image";
import { allContentQuery } from "@/lib/sanity/queries";
import { unstable_noStore as noStore } from "next/cache";
import type {
  AboutPage,
  AlumniRecord,
  ApplyPage,
  CareersPage,
  ContactPage,
  EventsPage,
  ExperiencePage,
  HomePage,
  PostgraduatePage,
  SiteSettings,
  Slide,
  TeamMember,
  Testimonial,
} from "@/types/content";
import { cache } from "react";

type Doc = Record<string, unknown>;

function text(value: unknown, fallback: string) {
  return value ? String(value) : fallback;
}

function strings(value: unknown, fallback: string[]) {
  return Array.isArray(value) && value.length ? value.map((item) => String(item)) : fallback;
}

function seo(value: unknown, fallback: { title: string; description: string; ogImage?: string }, version?: unknown) {
  const doc = (value || {}) as Doc;
  return {
    title: text(doc.title, fallback.title),
    description: text(doc.description, fallback.description),
    ogImage: sanityImageUrl(doc.ogImage, fallback.ogImage || "", version),
  };
}

function mapSlides(raw: unknown, fallback: Slide[], version?: unknown): Slide[] {
  if (!Array.isArray(raw) || !raw.length) return fallback;
  const slides = raw
    .map((item, index) => {
      const slide = (item || {}) as Doc;
      return {
        src: sanityImageUrl(slide, text(slide.src, fallback[index]?.src || ""), version),
        alt: text(slide.alt, fallback[index]?.alt || ""),
      };
    })
    .filter((slide) => slide.src);
  return slides.length ? slides : fallback;
}

function mapHome(doc: Doc, fallback: HomePage): HomePage {
  const features = Array.isArray(doc.features)
    ? (doc.features as Doc[]).map((feature, index) => ({
        eyebrow: text(feature.eyebrow, fallback.features[index]?.eyebrow || ""),
        title: text(feature.title, fallback.features[index]?.title || ""),
        image: sanityImageUrl(feature.image, text(feature.imageSrc, fallback.features[index]?.image || ""), doc._updatedAt),
        imageAlt: text(feature.imageAlt, fallback.features[index]?.imageAlt || ""),
        imageOn: (feature.imageOn === "right" ? "right" : "left") as "left" | "right",
      }))
    : fallback.features;
  const partners = Array.isArray(doc.partners)
    ? (doc.partners as Doc[]).map((partner, index) => ({
        src: sanityImageUrl(partner.image, text(partner.src, fallback.partners[index]?.src || ""), doc._updatedAt),
        alt: text(partner.alt, fallback.partners[index]?.alt || ""),
      }))
    : fallback.partners;
  return {
    ...fallback,
    seo: seo(doc.seo, fallback.seo, doc._updatedAt),
    heroTitle: text(doc.heroTitle, fallback.heroTitle),
    heroLine1: text(doc.heroLine1, fallback.heroLine1),
    heroLine2: text(doc.heroLine2, fallback.heroLine2),
    heroCtaLabel: text(doc.heroCtaLabel, fallback.heroCtaLabel),
    heroCtaHref: text(doc.heroCtaHref, fallback.heroCtaHref),
    heroBackground: sanityImageUrl(doc.heroBackground, text(doc.heroBackgroundSrc, fallback.heroBackground), doc._updatedAt),
    heroSlides: mapSlides(doc.heroSlides, fallback.heroSlides, doc._updatedAt),
    introTitle: text(doc.introTitle, fallback.introTitle),
    introText: text(doc.introText, fallback.introText),
    features: features.length ? features : fallback.features,
    testimonialsTitle: text(doc.testimonialsTitle, fallback.testimonialsTitle),
    testimonialsSubtitle: text(doc.testimonialsSubtitle, fallback.testimonialsSubtitle),
    partners: partners.length ? partners : fallback.partners,
  };
}

function mapAbout(doc: Doc, fallback: AboutPage): AboutPage {
  const capabilities = Array.isArray(doc.capabilities)
    ? (doc.capabilities as { title?: string }[]).filter((item) => item.title).map((item) => ({ title: item.title! }))
    : fallback.capabilities;
  return {
    ...fallback,
    seo: seo(doc.seo, fallback.seo, doc._updatedAt),
    heroTitle: text(doc.heroTitle, fallback.heroTitle),
    heroSubtitle: text(doc.heroSubtitle, fallback.heroSubtitle),
    heroSlides: mapSlides(doc.heroSlides, fallback.heroSlides, doc._updatedAt),
    intro: strings(doc.intro, fallback.intro),
    aimTitle: text(doc.aimTitle, fallback.aimTitle),
    aimText: text(doc.aimText, fallback.aimText),
    missionTitle: text(doc.missionTitle, fallback.missionTitle),
    missionText: text(doc.missionText, fallback.missionText),
    keyAreasTitle: text(doc.keyAreasTitle, fallback.keyAreasTitle),
    keyAreas: strings(doc.keyAreas, fallback.keyAreas),
    impactImage: sanityImageUrl(doc.impactImage, text(doc.impactImageSrc, fallback.impactImage), doc._updatedAt),
    impactImageAlt: text(doc.impactImageAlt, fallback.impactImageAlt),
    capabilities: capabilities.length ? capabilities : fallback.capabilities,
    teamTitle: text(doc.teamTitle, fallback.teamTitle),
    teamIntro: text(doc.teamIntro, fallback.teamIntro),
  };
}

function mapApply(doc: Doc, fallback: ApplyPage): ApplyPage {
  return {
    ...fallback,
    seo: seo(doc.seo, fallback.seo, doc._updatedAt),
    headline: text(doc.headline, fallback.headline),
    scholarship: text(doc.scholarship, fallback.scholarship),
    documentsTitle: text(doc.documentsTitle, fallback.documentsTitle),
    documents: strings(doc.documents, fallback.documents),
    sendTo: text(doc.sendTo, fallback.sendTo),
    closingDate: text(doc.closingDate, fallback.closingDate),
    ctaLabel: text(doc.ctaLabel, fallback.ctaLabel),
    ctaMailto: text(doc.ctaMailto, fallback.ctaMailto),
    heroImage: sanityImageUrl(doc.heroImage, text(doc.heroImageSrc, fallback.heroImage), doc._updatedAt),
  };
}

function mapContact(doc: Doc, fallback: ContactPage): ContactPage {
  const labels = (doc.formLabels || {}) as Doc;
  return {
    ...fallback,
    seo: seo(doc.seo, fallback.seo, doc._updatedAt),
    title: text(doc.title, fallback.title),
    intro: text(doc.intro, fallback.intro),
    callTitle: text(doc.callTitle, fallback.callTitle),
    emailTitle: text(doc.emailTitle, fallback.emailTitle),
    visitTitle: text(doc.visitTitle, fallback.visitTitle),
    formLabels: {
      firstName: text(labels.firstName, fallback.formLabels.firstName),
      lastName: text(labels.lastName, fallback.formLabels.lastName),
      email: text(labels.email, fallback.formLabels.email),
      message: text(labels.message, fallback.formLabels.message),
      submit: text(labels.submit, fallback.formLabels.submit),
    },
  };
}

function mapCareers(doc: Doc, fallback: CareersPage): CareersPage {
  const courses = Array.isArray(doc.courses)
    ? (doc.courses as Doc[]).map((course, index) => ({
        title: text(course.title, fallback.courses[index]?.title || ""),
        description: text(course.description, fallback.courses[index]?.description || ""),
        icon: text(course.icon, fallback.courses[index]?.icon || ""),
      }))
    : fallback.courses;
  return {
    ...fallback,
    seo: seo(doc.seo, fallback.seo, doc._updatedAt),
    heroTitle: text(doc.heroTitle, fallback.heroTitle),
    heroSubtitle: text(doc.heroSubtitle, fallback.heroSubtitle),
    heroCta: text(doc.heroCta, fallback.heroCta),
    heroCtaHref: text(doc.heroCtaHref, fallback.heroCtaHref),
    heroVideoId: text(doc.heroVideoId, fallback.heroVideoId),
    heroPoster: sanityImageUrl(doc.heroPoster, text(doc.heroPosterSrc, fallback.heroPoster), doc._updatedAt),
    intro: strings(doc.intro, fallback.intro),
    whyTitle: text(doc.whyTitle, fallback.whyTitle),
    whyText: text(doc.whyText, fallback.whyText),
    coursesTitle: text(doc.coursesTitle, fallback.coursesTitle),
    courses: courses.length ? courses : fallback.courses,
    slides: mapSlides(doc.slides, fallback.slides, doc._updatedAt),
  };
}

function mapSimplePage(doc: Doc, fallback: ExperiencePage): ExperiencePage {
  return {
    ...fallback,
    seo: seo(doc.seo, fallback.seo, doc._updatedAt),
    title: text(doc.title, fallback.title),
    body: text(doc.body, fallback.body),
  };
}

function mapPostgraduate(doc: Doc, fallback: PostgraduatePage): PostgraduatePage {
  const highlights = Array.isArray(doc.highlights)
    ? (doc.highlights as Doc[]).map((item, index) => ({
        title: text(item.title, fallback.highlights[index]?.title || ""),
        text: text(item.text, fallback.highlights[index]?.text || ""),
      }))
    : fallback.highlights;
  return {
    ...fallback,
    seo: seo(doc.seo, fallback.seo, doc._updatedAt),
    title: text(doc.title, fallback.title),
    heroSubtitle: text(doc.heroSubtitle, fallback.heroSubtitle),
    heroSlides: mapSlides(doc.heroSlides, fallback.heroSlides, doc._updatedAt),
    intro: strings(doc.intro, fallback.intro),
    highlights: highlights.length ? highlights : fallback.highlights,
    cohorts: strings(doc.cohorts, fallback.cohorts),
    ctaLabel: text(doc.ctaLabel, fallback.ctaLabel),
    ctaHref: text(doc.ctaHref, fallback.ctaHref),
  };
}

function mapGallery(doc: Doc, images: unknown, fallback: EventsPage): EventsPage {
  const galleryImages = Array.isArray(images)
    ? (images as Doc[])
        .map((item, index) => ({
          src: sanityImageUrl(item.image, text(item.src, fallback.images[index]?.src || ""), item._updatedAt),
          alt: text(item.alt, fallback.images[index]?.alt || ""),
        }))
        .filter((item) => item.src)
    : fallback.images;
  return {
    ...fallback,
    seo: seo(doc.seo, fallback.seo, doc._updatedAt),
    title: text(doc.title, fallback.title),
    heroSlides: mapSlides(doc.heroSlides, fallback.heroSlides, doc._updatedAt),
    images: galleryImages.length ? galleryImages : fallback.images,
  };
}

function mapSettings(doc: Doc, fallback: SiteSettings): SiteSettings {
  const socials = Array.isArray(doc.socials)
    ? (doc.socials as Doc[]).map((social) => ({
        label: text(social.label, ""),
        href: text(social.href, ""),
      }))
    : fallback.socials;
  return {
    ...fallback,
    companyName: text(doc.companyName, fallback.companyName),
    shortName: text(doc.shortName, fallback.shortName),
    tagline: text(doc.tagline, fallback.tagline),
    logo: sanityImageUrl(doc.logo, text(doc.logoUrl, fallback.logo), doc._updatedAt),
    favicon: sanityImageUrl(doc.favicon, text(doc.faviconUrl, fallback.favicon), doc._updatedAt),
    phoneFooter: text(doc.phoneFooter, fallback.phoneFooter),
    phoneContact: text(doc.phoneContact, fallback.phoneContact),
    emails: strings(doc.emails, fallback.emails),
    addressLines: strings(doc.addressLines, fallback.addressLines),
    addressFull: text(doc.addressFull, fallback.addressFull),
    socials: socials.filter((item) => item.label).length ? socials : fallback.socials,
    footerAboutTitle: text(doc.footerAboutTitle, fallback.footerAboutTitle),
    footerAboutText: text(doc.footerAboutText, fallback.footerAboutText),
    footerContactTitle: text(doc.footerContactTitle, fallback.footerContactTitle),
    footerSocialTitle: text(doc.footerSocialTitle, fallback.footerSocialTitle),
    copyright: text(doc.copyright, fallback.copyright),
    credit: text(doc.credit, fallback.credit),
    mapEmbedUrl: text(doc.mapEmbedUrl, fallback.mapEmbedUrl),
    defaultSeo: seo(doc.seo, fallback.defaultSeo, doc._updatedAt),
  };
}

function mapTeam(docs: Doc[], fallback: TeamMember[]): TeamMember[] {
  if (!docs.length) return fallback;
  return docs
    .map((doc, index) => ({
      name: text(doc.name, ""),
      role: text(doc.role, fallback[index]?.role || ""),
      photo: sanityImageUrl(doc.photo, text(doc.photoUrl, fallback[index]?.photo || ""), doc._updatedAt),
      linkedin: doc.linkedin ? String(doc.linkedin) : fallback[index]?.linkedin,
    }))
    .filter((member) => member.name);
}

function mapTestimonials(docs: Doc[], fallback: Testimonial[]): Testimonial[] {
  if (!docs.length) return fallback;
  return docs.map((doc, index) => ({
    quote: text(doc.quote, fallback[index]?.quote || ""),
    name: text(doc.name, fallback[index]?.name || ""),
    cohort: text(doc.cohort, fallback[index]?.cohort || ""),
    image: sanityImageUrl(doc.image, text(doc.imageUrl, fallback[index]?.image || ""), doc._updatedAt),
  }));
}

function mapAlumni(docs: Doc[], fallback: AlumniRecord[]): AlumniRecord[] {
  if (!docs.length) return fallback;
  return docs.map((doc, index) => ({
    name: text(doc.name, ""),
    cohort: text(doc.cohort, fallback[index]?.cohort || ""),
    photo: sanityImageUrl(doc.photo, text(doc.photoUrl, fallback[index]?.photo || ""), doc._updatedAt),
    residence: text(doc.residence, fallback[index]?.residence || ""),
    birthPlace: text(doc.birthPlace, fallback[index]?.birthPlace || ""),
    familyPlace: text(doc.familyPlace, fallback[index]?.familyPlace || ""),
    job: text(doc.job, fallback[index]?.job || ""),
    organization: text(doc.organization, fallback[index]?.organization || ""),
    socialHelp: text(doc.socialHelp, fallback[index]?.socialHelp || ""),
    contact: text(doc.contact, fallback[index]?.contact || ""),
    family: text(doc.family, fallback[index]?.family || ""),
    age: text(doc.age, fallback[index]?.age || ""),
    grade: text(doc.grade, fallback[index]?.grade || ""),
    internalNotes: doc.internalNotes ? String(doc.internalNotes) : fallback[index]?.internalNotes,
  }));
}

export const loadContent = cache(async (): Promise<MigratedContent> => {
  noStore();
  const fallback = getMigratedContent();
  if (!sanityConfigured || !sanityClient) {
    return fallback;
  }

  try {
    const data = (await sanityClient.fetch(allContentQuery, {}, { cache: "no-store", next: { tags: ["sanity"] } })) as Doc;
    return {
      ...fallback,
      settings: data.settings ? mapSettings(data.settings as Doc, fallback.settings) : fallback.settings,
      navigation:
        Array.isArray((data.navigation as Doc | undefined)?.items) && ((data.navigation as Doc).items as unknown[]).length
          ? ((data.navigation as Doc).items as MigratedContent["navigation"])
          : fallback.navigation,
      home: data.home ? mapHome(data.home as Doc, fallback.home) : fallback.home,
      about: data.about ? mapAbout(data.about as Doc, fallback.about) : fallback.about,
      apply: data.apply ? mapApply(data.apply as Doc, fallback.apply) : fallback.apply,
      contact: data.contact ? mapContact(data.contact as Doc, fallback.contact) : fallback.contact,
      careers: data.careers ? mapCareers(data.careers as Doc, fallback.careers) : fallback.careers,
      experience: data.experience ? mapSimplePage(data.experience as Doc, fallback.experience) : fallback.experience,
      eventsList: data.eventsList ? mapSimplePage(data.eventsList as Doc, fallback.eventsList) : fallback.eventsList,
      postgraduate: data.postgraduate
        ? mapPostgraduate(data.postgraduate as Doc, fallback.postgraduate)
        : fallback.postgraduate,
      gallery: data.gallery ? mapGallery(data.gallery as Doc, data.galleryImages, fallback.gallery) : fallback.gallery,
      team: mapTeam(Array.isArray(data.team) ? (data.team as Doc[]) : [], fallback.team),
      testimonials: mapTestimonials(
        Array.isArray(data.testimonials) ? (data.testimonials as Doc[]) : [],
        fallback.testimonials,
      ),
      alumni: mapAlumni(Array.isArray(data.alumni) ? (data.alumni as Doc[]) : [], fallback.alumni),
    };
  } catch {
    return fallback;
  }
});

export function siteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path}`;
}
