# Migration checklist

Compare the live WordPress site (https://ubuntuafrika-sl.com/) against this Next.js + Sanity implementation.

Do not mark an item complete until it has been verified in the running app.

## Pages

- [ ] Homepage `/`
- [ ] About Us `/about-us`
- [ ] Ubuntu Postgraduate `/ubuntu-postgraduate`
- [ ] Ubuntu Experience `/ubuntu-experience` (WordPress body was empty)
- [ ] Careers `/careers`
- [ ] Events & Gallery `/events`
- [ ] Events `/events-2` (WordPress body was empty)
- [ ] Apply Now `/apply-now`
- [ ] Contact `/contact`
- [ ] Footer
- [ ] Navigation + dropdowns + mobile menu

## Content

- [ ] Homepage hero, intro, four feature blocks, testimonials, partner logos
- [ ] About intro, aim, mission, key areas, capabilities, full team
- [ ] All postgraduate alumni records by cohort
- [ ] Apply Now scholarship copy, documents, closing date, mailto CTA
- [ ] Contact details, both phone numbers, three emails, address, map
- [ ] Careers intro, why join us, training courses, photo slider
- [ ] Theme residue kept (homepage SaaS lines, contact lorem, careers hero leftover)

## Media

- [ ] Logo `nuevo-logo-ubuntu-2-3_enano.jpg`
- [ ] Homepage slider/partners (UNIMAK, Vitaly) and testimonial photos
- [ ] About / team photographs
- [ ] Alumni photographs
- [ ] Events gallery (637A* + 2024 gallery JPEGs)
- [ ] Apply Now hero image
- [ ] Careers carousel images

## Sanity

- [ ] Studio reachable at `/studio` after project ID is set
- [ ] Site settings editable
- [ ] Navigation editable
- [ ] Pages editable
- [ ] Team / alumni / testimonials / gallery editable
- [ ] SEO fields editable
- [ ] Publish/unpublish via Sanity document actions

## Functionality

- [ ] Desktop navigation
- [ ] Mobile menu
- [ ] Cohort tabs
- [ ] Gallery lightbox
- [ ] Careers slider
- [ ] Contact form validation + success/error
- [ ] Apply Now mailto
- [ ] Social links (Facebook `#0`, Twitter `#`, LinkedIn company URL as on WordPress)
- [ ] External links

## SEO

- [ ] Routes preserved for live Ubuntu pages
- [ ] Metadata / Open Graph
- [ ] `/sitemap.xml`
- [ ] `/robots.txt`
- [ ] Canonical URLs
- [ ] Organization JSON-LD on homepage

## Redirects (old WordPress URL → new)

Implemented in `next.config.ts` as 301 to `/` unless noted.

- [ ] `/events-2` kept as its own route (in live nav as Events)
- [ ] Theme demo homepages, pricing, shop, cart, checkout, dummy blog posts → `/`

## Flags for editorial review

- Homepage leftover SaaS copy: “Everything has been intentionally designed…”, “Get Softwares quickly”, “Available 24/7”
- Contact leftover lorem intro
- Careers leftover “We build amazing products”
- Alumni public cards hide age/family/personal phones; full text is in `content/alumni.ts` and the Sanity `alumni` schema
- 2025–2026 listings for Moses Lamin Massaquoi and Saidu T. H. Kamara duplicate Abdul Bangura’s contact details (as on WordPress)
- Dummy 2015 blog posts were not republished
- Facebook and Twitter footer hrefs were placeholders on WordPress (`#0` / `#`)

## Final question

Can the company move from the existing WordPress website to this Next.js/Sanity website without losing any important live Ubuntu content, images, pages, functionality, or SEO structure?

- [ ] Yes, after verification above
