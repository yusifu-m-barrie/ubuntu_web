import type {
  AboutPage,
  ApplyPage,
  CareersPage,
  ContactPage,
  EventsPage,
  ExperiencePage,
  HomePage,
  PostgraduatePage,
  SiteSettings,
} from "@/types/content";

export const siteSettings: SiteSettings = {
  companyName: "Ubuntu Afrika",
  shortName: "Ubuntu Africa",
  tagline: "I am Because We Are",
  logo: "/images/nuevo-logo-ubuntu-2-3_enano.jpg",
  favicon: "/images/nuevo-logo-ubuntu-2-3_enano.jpg",
  phoneFooter: "+23278-662815",
  phoneContact: "+23278-668-215",
  emails: [
    "d.salifu@ubuntuafrika.com",
    "l.nieto@ubuntuafrika.com",
    "contact@ubuntuafrika.com",
  ],
  addressLines: [
    "4 Azzolini Highway NP Area",
    "Makeni City",
    "Bombali District",
    "Northern Province",
    "Sierra Leone",
    "West Africa",
  ],
  addressFull:
    "4 Azzolini Highway NP Area, Makeni City Bombali District Northern Province Sierra Leone West Africa.",
  socials: [
    { label: "Facebook", href: "#0" },
    { label: "Twitter", href: "#" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/ubuntu-afrika/" },
  ],
  footerAboutTitle: "About Us",
  footerAboutText:
    "Ubuntu means to be able to understand that what is beneficial for the whole society makes us better as human beings.",
  footerContactTitle: "Contact Info",
  footerSocialTitle: "Socialize",
  copyright: "© Copyright 2026 UBUNTU. All rights reserved",
  credit: "Made with love by Ubuntu Afrika - Sierra Leone",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=4%20Azzolini%20Highway%20NP%20Area%2C%20Makeni%20City&t=m&z=10&output=embed&iwloc=near",
  defaultSeo: {
    title: "Ubuntu Afrika",
    description:
      "Ubuntu Afrika is a nonprofit postgraduate software engineering programme in Makeni, Sierra Leone. I am because we are.",
    ogImage: "/images/nuevo-logo-ubuntu-2-3_enano.jpg",
  },
};

export const navigation = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about-us",
    children: [
      { label: "About Us", href: "/about-us" },
      { label: "Ubuntu Postgraduate", href: "/ubuntu-postgraduate" },
      { label: "Ubuntu Experience", href: "/ubuntu-experience" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    label: "Events & Gallery",
    href: "/events",
    children: [
      { label: "Gallery", href: "/events" },
      { label: "Events", href: "/events-2" },
    ],
  },
  { label: "Contact Us", href: "/contact" },
  { label: "Apply Now", href: "/apply", accent: true },
];

export const homePage: HomePage = {
  seo: {
    title: "Ubuntu Afrika",
    description:
      "Ubuntu means to be able to understand that what is beneficial for the whole society makes us better as human beings.",
  },
  heroTitle: "Ubuntu Africa",
  heroLine1:
    "Ubuntu means to be able to understand that what is beneficial for the whole society makes us better as human beings.",
  heroLine2:
    "Our project is design to create knowledge relationships based on transparency & honesty.",
  heroCtaLabel: "Read More",
  heroCtaHref: "/about-us",
  heroBackground: "/images/Header-bg.png",
  heroSlides: [
    {
      src: "/images/637A8328-Enhanced-NR.jpg",
      alt: "Ubuntu Afrika cohort seated around a table with laptops in the Makeni training room",
    },
    {
      src: "/images/MG_2377.jpg",
      alt: "Ubuntu Afrika team in purple shirts with a programme banner at 4 Azzolini Highway, Makeni",
    },
    {
      src: "/images/IMG-20190517-WA0116.jpg",
      alt: "Ubuntu Afrika visitors with pupils at R.C. Bendukura Primary School",
    },
    {
      src: "/images/MG_2352.jpg",
      alt: "Ubuntu Afrika cohort in purple programme shirts, group portrait indoors",
    },
    {
      src: "/images/FA02D049-73C2-4B69-9B1B-41B39309F53F_1_105_c.jpeg",
      alt: "Ubuntu Afrika students and mentors standing together in the training room",
    },
    {
      src: "/images/IMG-20211209-WA0066.jpg",
      alt: "Ubuntu Afrika cohort holding certificates after a training session",
    },
  ],
  introTitle: "I am Because We Are",
  introText:
    "Everything has been intentionally designed to include the features you want, right where you need them - without being overly complicated.",
  features: [
    {
      eyebrow: "Intuitive",
      title: "Get Softwares quickly",
      image: "/images/637A8425.jpg",
      imageAlt: "Two Ubuntu Afrika developers reviewing code together on laptops",
      imageOn: "left",
    },
    {
      eyebrow: "Work together",
      title: "We are a dedicated team of software developers",
      image: "/images/637A8485.jpg",
      imageAlt: "Ubuntu Afrika developers collaborating at desks in the Makeni office",
      imageOn: "right",
    },
    {
      eyebrow: "Web and apps",
      title: "Our Products are Accessible on all your devices",
      image: "/images/637A8597.jpg",
      imageAlt: "Two Ubuntu Afrika developers working on a laptop and tablet",
      imageOn: "left",
    },
    {
      eyebrow: "Available 24/7",
      title: "Backed by an amazing support team",
      image: "/images/637A8422.jpg",
      imageAlt: "Ubuntu Afrika team member working on a laptop with headphones",
      imageOn: "right",
    },
  ],
  testimonialsTitle: "What beneficiaries are saying",
  testimonialsSubtitle:
    "I AM BECAUSE YOU ARE, YOU ARE BECAUSE OF ME, TOGETHER WE ARE UBUNTU",
  partners: [
    { src: "/images/unimak-1.jpeg", alt: "UNIMAK" },
    { src: "/images/vitaly-1.png", alt: "Vitaly" },
  ],
};

export const aboutPage: AboutPage = {
  seo: {
    title: "About Us – Ubuntu Afrika",
    description:
      "Ubuntu Africa is a platform in which investors sharing a common thought about how to run businesses get together to invest and manage projects in Africa developing countries.",
  },
  heroTitle: "We build modern web applications",
  heroSubtitle: "Creative user interface design from a world-class team",
  heroSlides: [
    {
      src: "/images/637A8485.jpg",
      alt: "Ubuntu Afrika developers collaborating at desks in the Makeni office",
    },
    {
      src: "/images/637A8567.jpg",
      alt: "Four Ubuntu Afrika team members reviewing work together",
    },
    {
      src: "/images/637A8476.jpg",
      alt: "Ubuntu Afrika developers gathered around a laptop",
    },
    {
      src: "/images/637A8361.jpg",
      alt: "Ubuntu Afrika cohort at the training table with programme laptops",
    },
  ],
  intro: [
    "Ubuntu Africa is a platform in which investors sharing a common thought about how to run businesses get together to invest and mange projects in Africa developing countries.",
    "We are interested in bosting the business sector and forming new competitive companies, as a way to help developing countries to reach better economic, social and health standards.",
    "After paying our shareholders, the extra cash from the projects will be invested in new companies in the country. Thus a masterful circle is created by which the larger the profitability, the greater the number of projects to be finance",
  ],
  aimTitle: "Our Aim",
  aimText:
    "Our aim is to support local initiatives looking for the universality of the technological knowledge",
  missionTitle: "Our Mission",
  missionText:
    "To support knowledge relationships among local agent, companies, and foreign investors with transparency, consensus and joint ventures",
  keyAreasTitle: "Key Areas",
  keyAreas: [
    "Software Engineering",
    "Web Development",
    "Mobile Application Development",
    "Data Science",
  ],
  impactImage: "/images/Picture4.png",
  impactImageAlt:
    "Each project will have relevant and stable impact in 3 levels of the social systems: Individual, Family, Community",
  capabilities: [
    { title: "Full Stack Development" },
    { title: "Web Apps Development" },
    { title: "Mobile Development" },
  ],
  teamTitle: "Our Team",
  teamIntro: "I am because we are — the people building Ubuntu Afrika in Makeni and Spain.",
};

export const applyPage: ApplyPage = {
  seo: {
    title: "Apply Now – Ubuntu Afrika",
    description:
      "Call for Applications for the 5th Cohort Training in Software Engineering. FULL 100% SCHOLARSHIP.",
  },
  headline: "Call for Applications for the 5th Cohort Training in Software Engineering",
  scholarship: "FULL 100% SCHOLARSHIP",
  documentsTitle: "APPLICATION DOCUMENTS",
  documents: [
    "DEGREE (Computer Science /IT/ICT)",
    "CV, Cover Letter and Transcript",
    "Send all Applications to : d.salifu@ubuntuafrika.com",
    "Closing Date: 21 April, 2025",
  ],
  sendTo: "d.salifu@ubuntuafrika.com",
  closingDate: "21 April, 2025",
  ctaLabel: "SEND YOUR APPLICATION NOW",
  ctaMailto:
    "mailto:d.salifu@ubuntuafrika.com?subject=5th%20Cohort%20Software%20Engineering%20Application",
  heroImage: "/images/Ubuntu-scaled.jpg",
};

export const contactPage: ContactPage = {
  seo: {
    title: "Contact Us – Ubuntu Afrika",
    description:
      "Contact Ubuntu Afrika in Makeni, Sierra Leone. Phone, email, and visit our office at 4 Azzolini Highway.",
  },
  title: "Contact Us",
  intro:
    "Etiam cursus sapien quis ligula rhoncus, quis sollicitudin dolor ultricies.",
  callTitle: "Give us a call",
  emailTitle: "Send us an email",
  visitTitle: "Drop by and talk",
  formLabels: {
    firstName: "First",
    lastName: "Last",
    email: "Email",
    message: "Comment or Message",
    submit: "Submit",
  },
};

export const careersPage: CareersPage = {
  seo: {
    title: "Careers – Ubuntu Afrika",
    description:
      "Join Ubuntu Africa Foundation. Postgraduate training on software engineering and web applications development.",
  },
  heroTitle: "We build amazing products",
  heroSubtitle:
    "We're a fast growing company looking for talented individuals who can help us make software better.",
  heroCta: "View Openings",
  heroCtaHref: "#courses",
  heroVideoId: "7b07tvwC1uQ",
  heroPoster: "/images/MG_2334.jpg",
  intro: [
    "The Ubuntu Africa Foundation is a non-profit organization that has a long-lasting impact on its heritage in the pursuit of the general interest goals that are now detailed, mainly developing its activities in Africa.",
    "Among its aims are the promotion of research in the field of innovation and technology and its transfer to the productive fabric. The promotion of social and economic development of African countries and others in the process of development is through the postgraduate training on software engineering and web applications development.",
    "To achieve its aims, it carries out, among other activities, in Africa, training programs, training and workshops, training professionals or future professionals seeking excellence or scholarship to students who need it for their full training.",
  ],
  whyTitle: "Why join us?",
  whyText:
    "We provide a platform to learn and improves skills across technology, design and more. This skills are taught by experts.",
  coursesTitle: "Our Training Courses",
  courses: [
    {
      title: "Complete Java Master Class",
      icon: "/images/courses/java.svg",
      description:
        "Object-oriented Java from first principles through practical application building — the core language of the postgraduate software engineering programme.",
    },
    {
      title: "The Ultimate MYSQL",
      icon: "/images/courses/mysql.svg",
      description:
        "Design, query, and administer MySQL databases so web applications can store, retrieve, and protect data reliably.",
    },
    {
      title: "Git Complete",
      icon: "/images/courses/git.svg",
      description:
        "Version control with Git: commits, branches, and collaboration so every project stays organised and reviewable.",
    },
    {
      title: "Gradle",
      icon: "/images/courses/gradle.svg",
      description:
        "Automate Java builds, tests, and dependencies with Gradle so training projects compile and run consistently.",
    },
    {
      title: "Spring Framework & SpringBoot",
      icon: "/images/courses/spring.svg",
      description:
        "Build backend services and APIs with Spring Framework and Spring Boot for web applications development.",
    },
    {
      title: "Angular",
      icon: "/images/courses/angular.svg",
      description:
        "Create interactive web applications with Angular — components, routing, and client-side architecture.",
    },
    {
      title: "Prompt Engineering for AI",
      icon: "/images/courses/prompt.svg",
      description:
        "Write effective prompts and apply AI tools as part of modern software engineering and web development practice.",
    },
  ],
  slides: [
    {
      src: "/images/MG_2334.jpg",
      alt: "Ubuntu Afrika developers working together at laptops in the Makeni training room",
    },
    {
      src: "/images/MG_2326.jpg",
      alt: "Ubuntu Afrika team members collaborating during a training session",
    },
    {
      src: "/images/20220613_130759.jpg",
      alt: "Ubuntu Afrika classroom during postgraduate software training",
    },
    {
      src: "/images/MG_2330.jpg",
      alt: "Ubuntu Afrika cohort working at desks with programme laptops",
    },
  ],
};

export const experiencePage: ExperiencePage = {
  seo: {
    title: "Ubuntu Experience – Ubuntu Afrika",
    description: "Ubuntu Experience at Ubuntu Afrika in Makeni, Sierra Leone.",
  },
  title: "Ubuntu Experience",
  body: "",
};

export const eventsListPage: ExperiencePage = {
  seo: {
    title: "Events – Ubuntu Afrika",
    description: "Events at Ubuntu Afrika in Makeni, Sierra Leone.",
  },
  title: "Events",
  body: "",
};

export const postgraduatePage: PostgraduatePage = {
  seo: {
    title: "Ubuntu Postgraduate – Ubuntu Afrika",
    description:
      "Ubuntu Postgraduate is a fully sponsored scholarship-based software engineering programme in partnership with the University of Makeni.",
  },
  title: "Ubuntu Postgraduate",
  heroSubtitle:
    "Fully sponsored scholarship based training programs for professionals or future professionals.",
  heroSlides: [
    {
      src: "/images/637A8328-Enhanced-NR.jpg",
      alt: "Ubuntu Afrika cohort seated around a table with laptops in the Makeni training room",
    },
    {
      src: "/images/637A8361.jpg",
      alt: "Ubuntu Afrika cohort at the training table with programme laptops",
    },
    {
      src: "/images/MG_2352.jpg",
      alt: "Ubuntu Afrika cohort in purple programme shirts, group portrait indoors",
    },
    {
      src: "/images/IMG-20211209-WA0066.jpg",
      alt: "Ubuntu Afrika cohort holding certificates after a training session",
    },
    {
      src: "/images/FA02D049-73C2-4B69-9B1B-41B39309F53F_1_105_c.jpeg",
      alt: "Ubuntu Afrika students and mentors standing together in the training room",
    },
    {
      src: "/images/637A8476.jpg",
      alt: "Ubuntu Afrika developers gathered around a laptop",
    },
  ],
  intro: [
    "The Ubuntu Africa Foundation, based in Spain and Sierra Leone, is a non-profit organization that promotes projects in Sierra Leone with the fundamental objective of contributing to the economic development of Sierra Leone and generating a social impact. One of the fundamental projects promoted is Ubuntu Postgraduate, for whose implementation needs the collaboration of a solid partner and University of Makeni (UniMak) was selected.",
    "The project aims to contribute through a Postgraduate training of UNIMAK students and other competent students from other universities & Colleges within Sierra Leone who have successfully completed their Undergraduate Training in IT specialty. On the other hand, the Project will pursue the creation of a computer consulting services, under the Ubuntu Tech Project based in Sierra Leone, but with the possibility of offering its services both locally and to other countries, mainly Spain.",
    "The Ubuntu philosophy is applied to both the Ubuntu Postgraduate and Ubuntu Tech Project which seeks to optimize costs, because 100% sustainability is generated in cash flows towards social projects.",
    "To achieve its aims, it carries out, fully sponsored scholarship based training programs for professionals or future professionals.",
  ],
  highlights: [
    {
      title: "University of Makeni (UniMak)",
      text: "One of the fundamental projects promoted is Ubuntu Postgraduate, for whose implementation needs the collaboration of a solid partner and University of Makeni (UniMak) was selected.",
    },
    {
      title: "Ubuntu Tech Project",
      text: "The Project will pursue the creation of a computer consulting services, under the Ubuntu Tech Project based in Sierra Leone, but with the possibility of offering its services both locally and to other countries, mainly Spain.",
    },
    {
      title: "Fully sponsored scholarships",
      text: "To achieve its aims, it carries out, fully sponsored scholarship based training programs for professionals or future professionals.",
    },
  ],
  cohorts: ["2018 - 2019", "2021 - 2022", "2022 - 2023", "2023 - 2024", "2025 - 2026"],
  ctaLabel: "Apply Now",
  ctaHref: "/apply",
};

export const galleryPage: EventsPage = {
  seo: {
    title: "Events & Gallery – Ubuntu Afrika",
    description: "Photographs from Ubuntu Afrika events, training, and community gatherings in Makeni.",
  },
  title: "Events & Gallery",
  heroSlides: [
    {
      src: "/images/637A8328-Enhanced-NR.jpg",
      alt: "Ubuntu Afrika cohort seated around a table with laptops in the Makeni training room",
    },
    {
      src: "/images/637A8361.jpg",
      alt: "Ubuntu Afrika cohort at the training table with programme laptops",
    },
    {
      src: "/images/637A8485.jpg",
      alt: "Ubuntu Afrika developers collaborating at desks in the Makeni office",
    },
    {
      src: "/images/637A8476.jpg",
      alt: "Ubuntu Afrika developers gathered around a laptop",
    },
    {
      src: "/images/637A8567.jpg",
      alt: "Four Ubuntu Afrika team members reviewing work together",
    },
    {
      src: "/images/637A8597.jpg",
      alt: "Two Ubuntu Afrika developers working on a laptop and tablet",
    },
  ],
  images: [],
};
