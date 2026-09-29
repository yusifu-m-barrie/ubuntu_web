import { alumni } from "@/content/alumni";
import { galleryImages } from "@/content/gallery";
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
} from "@/content/pages";
import { teamMembers, testimonials } from "@/content/team";

export function getMigratedContent() {
  return {
    settings: siteSettings,
    navigation,
    home: homePage,
    about: aboutPage,
    apply: applyPage,
    contact: contactPage,
    careers: careersPage,
    experience: experiencePage,
    eventsList: eventsListPage,
    postgraduate: postgraduatePage,
    gallery: { ...galleryPage, images: galleryImages },
    team: teamMembers,
    testimonials,
    alumni,
  };
}

export type MigratedContent = ReturnType<typeof getMigratedContent>;
