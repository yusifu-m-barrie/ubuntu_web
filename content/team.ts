import type { TeamMember, Testimonial } from "@/types/content";

function roleRank(role: string) {
  const value = role.toLowerCase();
  if (value.includes("president")) return 0;
  if (value.includes("project manager") || value.includes("coordinator")) return 1;
  if (value.includes("head of technology")) return 2;
  if (value.includes("team head")) return 3;
  if (value.includes("senior") && value.includes("level 2")) return 10;
  if (value.includes("senior") && value.includes("level 1")) return 11;
  if (value.includes("senior")) return 12;
  if (value.includes("junior") && value.includes("level 2")) return 20;
  if (value.includes("junior") && value.includes("level 1")) return 21;
  if (value.includes("junior")) return 22;
  if (value.includes("postgraduate")) return 30;
  if (value.includes("clean") || value.includes("support")) return 40;
  return 50;
}

function juniorLevelOneNameRank(name: string) {
  const value = name.toLowerCase();
  if (value.includes("yusifu")) return 0;
  if (value.includes("isatu") || value.includes("magdalene")) return 1;
  if (value.includes("amadu")) return 2;
  return 10;
}

export function sortTeamMembers(members: TeamMember[]): TeamMember[] {
  return members
    .map((member) => {
      const name = member.name.toLowerCase();
      const role = member.role.toLowerCase();
      if (name.includes("yusifu") || name.includes("isatu") || name.includes("magdalene")) {
        return { ...member, role: "Junior Software Developer Level 1" };
      }
      if (name.includes("augustine") || name.includes("lukeman")) {
        return { ...member, role: "Senior Software Developer Level 2" };
      }
      if (name.includes("alhaji") || name.includes("gibrilla") || name.includes("brato") || (name.includes("abdulai") && name.includes("kamara"))) {
        return { ...member, role: "Senior Software Developer Level 1" };
      }
      if (name.includes("john") || name.includes("momoh") || name.includes("andrew")) {
        return { ...member, role: "Junior Software Developer Level 2" };
      }
      if (role.includes("coordinator") || (name.includes("daniel") && role.includes("project"))) {
        return { ...member, role: "Project Manager" };
      }
      return member;
    })
    .sort((left, right) => {
      const byRole = roleRank(left.role) - roleRank(right.role);
      if (byRole !== 0) return byRole;
      if (roleRank(left.role) === 21) return juniorLevelOneNameRank(left.name) - juniorLevelOneNameRank(right.name);
      return 0;
    });
}

export const teamMembers: TeamMember[] = [
  { name: "Lorenzo Nieto Collado", role: "President", photo: "/images/lorenzo-1-1.jpg" },
  {
    name: "Daniel Salifu Samura",
    role: "Project Manager",
    photo: "/images/MG_2303.jpg",
    linkedin: "https://www.linkedin.com/in/samura-daniel",
  },
  {
    name: "Javier Montesinos",
    role: "Head of Technology",
    photo: "/images/montesinos.jpg",
    linkedin: "https://www.linkedin.com/in/javiermontesinosmorcillo",
  },
  {
    name: "Pablo Plasencia Rodriguez",
    role: "Team Head - Vitaly Spain",
    photo: "/images/preving.jpeg",
    linkedin: "https://www.linkedin.com/in/pablo-plasencia-rodr%C3%ADguez-5169a2b1",
  },
  { name: "Enmanuel Seguro Botega", role: "Senior Software Developer Level 2", photo: "/images/preving.jpeg" },
  {
    name: "Augustine S. Y. Matturi",
    role: "Senior Software Developer Level 2",
    photo: "/images/MG_2288-scaled.jpg",
    linkedin: "https://www.linkedin.com/in/augustine-matturi-293801b0",
  },
  {
    name: "Lukeman S. Kamara",
    role: "Senior Software Developer Level 2",
    photo: "/images/MG_2273-.jpg",
    linkedin: "https://www.linkedin.com/in/lukeman-s-kamara-660328143",
  },
  {
    name: "Alhaji M. Kanu",
    role: "Senior Software Developer Level 1",
    photo: "/images/MG_2299-scaled.jpg",
    linkedin: "https://www.linkedin.com/in/mohamed-kanu",
  },
  {
    name: "Abdulai B. Kamara",
    role: "Senior Software Developer Level 1",
    photo: "/images/MG_2270-scaled.jpg",
    linkedin: "https://www.linkedin.com/in/abdulai-brato-kamara-075232114",
  },
  {
    name: "Gibrilla Kanu",
    role: "Senior Software Developer Level 1",
    photo: "/images/MG_2295-scaled.jpg",
    linkedin: "https://www.linkedin.com/in/gi-kanu-b7262a247",
  },
  {
    name: "John A. Kamara",
    role: "Junior Software Developer Level 2",
    photo: "/images/MG_2280-scaled.jpg",
    linkedin: "https://www.linkedin.com/in/john-abdul-kamara-0a002753",
  },
  { name: "Momoh Sesay", role: "Junior Software Developer Level 2", photo: "/images/MG_2279-copy-scaled.jpg" },
  {
    name: "Andrew A. O. Kamara",
    role: "Junior Software Developer Level 2",
    photo: "/images/MG_2272-scaled.jpg",
    linkedin: "https://www.linkedin.com/in/kamara-abdul-a77841240",
  },
  {
    name: "Yusifu M. Barrie",
    role: "Junior Software Developer Level 1",
    photo: "/images/MG_2285.jpg",
    linkedin: "https://www.linkedin.com/in/yusifu-mohamed-barrie-1661a29b",
  },
  {
    name: "Isatu M. Kamara",
    role: "Junior Software Developer Level 1",
    photo: "/images/maggi-1.jpg",
    linkedin: "https://www.linkedin.com/in/isatu-magdalene-kamara-3a4267238",
  },
  {
    name: "Amadu W. Bah",
    role: "Junior Software Developer Level 1",
    photo: "/images/gggg-scaled.jpg",
    linkedin: "https://www.linkedin.com/in/amaduwbahofficial",
  },
  {
    name: "Philip A. Sesay",
    role: "Junior Software Developer",
    photo: "/images/MG_2289-scaled.jpg",
    linkedin: "https://www.linkedin.com/in/philip-adikali-sesay-27721510a",
  },
  {
    name: "Sullaiman Kamanda",
    role: "Postgraduate II",
    photo: "/images/kaman.jpg",
    linkedin: "https://www.linkedin.com/in/sullaiman-kamanda-6b2634200",
  },
  {
    name: "Mariama Mansaray",
    role: "Postgraduate II",
    photo: "/images/ggnnnn-scaled.jpg",
    linkedin: "https://www.linkedin.com/in/mariama-mansaray-28077422a",
  },
  {
    name: "Omaru C. Kamara",
    role: "Postgraduate II",
    photo: "/images/ca2-scaled.jpg",
    linkedin: "https://www.linkedin.com/in/omaru-calla-kamara-130532207",
  },
  {
    name: "Abdulai Turay",
    role: "Postgraduate III",
    photo: "/images/abdulai-turay-v2.jpg",
    linkedin: "https://www.linkedin.com/in/turay-abdulai-496814375",
  },
  {
    name: "Gifty Hemans",
    role: "Postgraduate III",
    photo: "/images/gifty-hemans.jpg",
    linkedin: "https://www.linkedin.com/in/gifty-hemans",
  },
  { name: "Samuel Lebbie", role: "Office Support Staff", photo: "/images/lebbie-scaled.jpg" },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "I didn’t prioritize software engineering until my training with Ubuntu Afrika, where I learned quickly. Switching to software engineering as a career meant a lot and I feel good about what I’m now.",
    name: "Christopher A Reffell",
    cohort: "Cohort 1: 2018-2019",
    image: "/images/1.jpg",
  },
  {
    quote:
      "The Ubuntu tech training helped me develop my fundamental knowledge in software engineering. It created a solid foundation that amplifies my software development skills and enhance my desire to pursue my masters’ studies in software engineering.",
    name: "Khadijatu Jalloh",
    cohort: "Cohort 2: 2021-2022",
    image: "/images/2.jpg",
  },
  {
    quote:
      "UBUNTU Afrika is the best place to be. I love the job and work environment. Since I started my software engineering career, I’ve never tried anything else.",
    name: "Isatu M Kamara",
    cohort: "Cohort 3: 2022-2023",
    image: "/images/4.jpg",
  },
  {
    quote:
      "Ubuntu Afrika has been instrumental in my journey as a software engineer. It gave me the tools, the platform, and the community to learn, collaborate, and grow while confidently sharing my ideas with others.",
    name: "Sullaiman Kamanda",
    cohort: "Cohort 4: 2023-2024",
    image: "/images/WhatsApp-Image-2026-02-11-at-15.13.45-1.jpeg",
  },
];
