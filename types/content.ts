export type SeoFields = {
  title: string;
  description: string;
  ogImage?: string;
};

export type NavChild = {
  label: string;
  href: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
  accent?: boolean;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type SiteSettings = {
  companyName: string;
  shortName: string;
  tagline: string;
  logo: string;
  favicon: string;
  phoneFooter: string;
  phoneContact: string;
  emails: string[];
  addressLines: string[];
  addressFull: string;
  socials: SocialLink[];
  footerAboutTitle: string;
  footerAboutText: string;
  footerContactTitle: string;
  footerSocialTitle: string;
  copyright: string;
  credit: string;
  defaultSeo: SeoFields;
  mapEmbedUrl: string;
};

export type Slide = {
  src: string;
  alt: string;
};

export type FeatureBlock = {
  eyebrow: string;
  title: string;
  image: string;
  imageAlt: string;
  imageOn: "left" | "right";
};

export type Testimonial = {
  quote: string;
  name: string;
  cohort: string;
  image: string;
};

export type HomePage = {
  seo: SeoFields;
  heroTitle: string;
  heroLine1: string;
  heroLine2: string;
  heroCtaLabel: string;
  heroCtaHref: string;
  heroBackground: string;
  heroSlides: Slide[];
  introTitle: string;
  introText: string;
  features: FeatureBlock[];
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  partners: { src: string; alt: string }[];
};

export type Capability = {
  title: string;
};

export type AboutPage = {
  seo: SeoFields;
  heroTitle: string;
  heroSubtitle: string;
  heroSlides: Slide[];
  intro: string[];
  aimTitle: string;
  aimText: string;
  missionTitle: string;
  missionText: string;
  keyAreasTitle: string;
  keyAreas: string[];
  impactImage: string;
  impactImageAlt: string;
  capabilities: Capability[];
  teamTitle: string;
  teamIntro: string;
};

export type TeamMember = {
  name: string;
  role: string;
  photo: string;
  linkedin?: string;
  photoFit?: "cover" | "contain";
};

export type ApplyPage = {
  seo: SeoFields;
  headline: string;
  scholarship: string;
  documentsTitle: string;
  documents: string[];
  sendTo: string;
  closingDate: string;
  ctaLabel: string;
  ctaMailto: string;
  heroImage: string;
};

export type ContactPage = {
  seo: SeoFields;
  title: string;
  intro: string;
  callTitle: string;
  emailTitle: string;
  visitTitle: string;
  formLabels: {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    submit: string;
  };
};

export type CareerCourse = {
  title: string;
  description: string;
  icon: string;
};

export type CareersPage = {
  seo: SeoFields;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  heroCtaHref: string;
  heroVideoId: string;
  heroPoster: string;
  intro: string[];
  whyTitle: string;
  whyText: string;
  coursesTitle: string;
  courses: CareerCourse[];
  slides: Slide[];
};

export type ExperiencePage = {
  seo: SeoFields;
  title: string;
  body: string;
};

export type EventsPage = {
  seo: SeoFields;
  title: string;
  heroSlides: Slide[];
  images: { src: string; alt: string }[];
};

export type AlumniRecord = {
  name: string;
  cohort: string;
  photo?: string;
  residence: string;
  birthPlace: string;
  familyPlace: string;
  job: string;
  organization: string;
  socialHelp: string;
  contact: string;
  family: string;
  age: string;
  grade: string;
  internalNotes?: string;
};

export type PublicAlumni = Pick<
  AlumniRecord,
  "name" | "cohort" | "photo" | "job" | "organization" | "socialHelp" | "grade"
>;

export type PostgraduateHighlight = {
  title: string;
  text: string;
};

export type PostgraduatePage = {
  seo: SeoFields;
  title: string;
  heroSubtitle: string;
  heroSlides: Slide[];
  intro: string[];
  highlights: PostgraduateHighlight[];
  cohorts: string[];
  ctaLabel: string;
  ctaHref: string;
};
