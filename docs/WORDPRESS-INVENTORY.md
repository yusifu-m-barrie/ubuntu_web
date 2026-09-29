# WordPress inventory — Ubuntu Afrika

Source of truth: https://ubuntuafrika-sl.com/ (audited 28 Sep 2026)

Platform: WordPress + Elementor + Themovation Stratus. Images via Optimole; originals under `/wp-content/uploads/`.

## Live navigation

- Home → `/`
- About (dropdown)
  - About Us → `/about-us`
  - Ubuntu Postgraduate → `/ubuntu-postgraduate`
  - Ubuntu Experience → `/ubuntu-experience`
  - Careers → `/careers`
- Events & Gallery (dropdown)
  - Gallery → `/events`
  - Events → `/events-2`
- Contact Us → `/contact`
- Apply Now (accent CTA) → `/apply-now`

## Footer

1. About Us — “Ubuntu means to be able to understand that what is beneficial for the whole society makes us better as human beings.”
2. Contact Info — `d.salifu@ubuntuafrika.com`, `+23278-662815`, 4 Azzolini Highway NP Area, Makeni City, Bombali District, Northern Province, Sierra Leone, West Africa
3. Socialize — Facebook (`#0`), Twitter (`#`), LinkedIn `https://www.linkedin.com/company/ubuntu-afrika/`
4. Copyright — © Copyright 2026 UBUNTU. All rights reserved — Made with heart by Ubuntu Afrika - Sierra Leone

## Live pages to rebuild

| URL | Title | Notes |
|---|---|---|
| `/` | Ubuntu Afrika (WP title Home – SaaS) | Hero, features, testimonials, partner logos |
| `/about-us` | About Us | Mission, key areas, team |
| `/ubuntu-postgraduate` | Ubuntu Postgraduate | Cohorts + alumni bios |
| `/ubuntu-experience` | Ubuntu Experience | Title only in WP (empty Elementor body) |
| `/careers` | Careers | Foundation copy, training courses, photo carousel |
| `/events` | Events & Gallery | Photo galleries |
| `/events-2` | Events | Title only in WP (empty Elementor body) |
| `/apply-now` | Apply Now | 5th cohort scholarship call |
| `/contact` | Contact | Details, WPForms, Google Map |

## Theme residue (migrated, flagged for editorial review)

- Homepage SaaS leftover: “Everything has been intentionally designed…”, “Get Softwares quickly”, “Available 24/7 / Backed by an amazing support team”
- Contact intro lorem: “Etiam cursus sapien quis ligula rhoncus…”
- Careers hero leftover: “We build amazing products”
- Dummy blog posts (2015 Stratus lorem) — **not published** on the new site
- ~57 unused demo URLs (Shop, Cart, Home – Cryptocurrency, etc.) — **301 to /** 

## Contact form (WPForms 753)

- First name *
- Last name *
- Email *
- Comment or Message *
- Submit

Destination emails on the contact page: `d.salifu@ubuntuafrika.com`, `l.nieto@ubuntuafrika.com`, `contact@ubuntuafrika.com`

Phone variants in WP: footer `+23278-662815`, contact page `+23278-668-215` — both preserved in CMS.

## Media

Originals downloaded to `public/images/` from live page HTML (logo, team, alumni, gallery, partners). Theme-only demo media is not copied.
