export const allContentQuery = `{
  "settings": *[_type == "siteSettings"][0],
  "navigation": *[_type == "navigation"][0],
  "home": *[_type == "homePage"][0],
  "about": *[_type == "aboutPage"][0],
  "apply": *[_type == "applyPage"][0],
  "contact": *[_type == "contactPage"][0],
  "careers": *[_type == "careersPage"][0],
  "experience": *[_type == "experiencePage"][0],
  "eventsList": *[_type == "eventsPage"][0],
  "postgraduate": *[_type == "postgraduatePage"][0],
  "gallery": *[_type == "galleryPage"][0],
  "team": *[_type == "teamMember"] | order(order asc),
  "alumni": *[_type == "alumni"] | order(order asc),
  "testimonials": *[_type == "testimonial"] | order(order asc),
  "galleryImages": *[_type == "galleryImage"] | order(order asc)
}`;
