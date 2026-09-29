# Ubuntu Afrika — Next.js + Sanity

Modern rebuild of [ubuntuafrika-sl.com](https://ubuntuafrika-sl.com/), migrated from WordPress/Elementor. Editable content is modelled in Sanity. Until a Sanity project is connected, the site serves the migrated WordPress content from `content/`.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Sanity Studio

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage).
2. Set in `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=yourProjectId
NEXT_PUBLIC_SANITY_DATASET=production
```

3. Open [http://localhost:3000/studio](http://localhost:3000/studio).
4. Enter the migrated copy, photographs in `public/images/`, alumni, team, navigation, and SEO fields.

The studio is grouped for non-developers: Site settings, pages, people, gallery, and SEO.

Until those env vars are set, `/studio` shows setup instructions and the public site still renders the full migrated content.

## Contact form

The contact form matches the WordPress WPForms fields (first name, last name, email, message). It posts to `/api/contact`.

Set:

```
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=d.salifu@ubuntuafrika.com
```

Without `RESEND_API_KEY`, the form validates and returns a clear error rather than pretending to send mail.

Apply Now still uses `mailto:d.salifu@ubuntuafrika.com`.

## Netlify

1. Connect the repo.
2. Build command: `npm run build` (already in `netlify.toml`).
3. Add environment variables from `.env.example`.
4. Optional: Sanity webhook `POST /api/revalidate` with `Authorization: Bearer $SANITY_REVALIDATE_SECRET`.

Node 20 is specified in `netlify.toml`.

## Content source of truth

- Live WordPress audit: `docs/WORDPRESS-INVENTORY.md`
- Migration status: `MIGRATION-CHECKLIST.md`
- Downloaded originals: `public/images/`
- Structured migrated copy: `content/`

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run studio
```
