# Next.js Phase 1 Implementation Report

## Baseline and isolation

Implemented in the clean detached worktree based on `origin/main` commit `103808d9509b11c61dc44c48326e3f80a8a37f91`. The existing CRA `frontend/` directory was not edited. Unfinished local Community Phase 2 commit `b8d4e2b` was not merged, copied, or modified.

## Implemented routes

- `/` → deliberate redirect to `/en`
- `/en`, `/hi`
- `/en/privacy`, `/hi/privacy`
- `/en/terms`, `/hi/terms`
- `/en/contact`, `/hi/contact`
- localized and root 404/error/loading boundaries
- `/robots.txt`, `/sitemap.xml`, and `/google41232c0c0c01eadd.html`

## Architecture

Server components render layouts, navigation shells, homepage, legal text, contact page content, metadata, and JSON-LD. Client components are limited to the mobile menu, locale switcher, GA4 route tracking, and contact form. Locale middleware sets the locale request header used by the root layout to produce the server HTML `lang` attribute. Invalid locale segments resolve through the localized not-found boundary.

`lib/metadata.js` produces route-specific canonical, en/hi/x-default alternates, Open Graph, Twitter, and robots metadata. The homepage emits WebSite and Organization data; legal/contact pages emit BreadcrumbList only. Sitemap/robots include only implemented public pages.

The contact form submits to the existing FastAPI `/api/contact` endpoint through `NEXT_PUBLIC_BACKEND_URL`; it preserves client validation, honeypot forwarding, loading/error/success states, and never embeds Resend configuration.

## Validation completed

- `npm install` completed and created `package-lock.json`.
- `npm run lint` completed with zero warnings and zero errors.
- `npm run build` completed successfully with Next.js 16.2.12. The first sandboxed build could not create a Turbopack worker process; the permitted production build passed cleanly. The obsolete `middleware` convention warning was resolved by using Next 16's `proxy` convention.
- A production server ran at `http://127.0.0.1:3100`; `npm test` passed its raw HTML checks for `/en`, `/hi`, `/en/privacy`, `/en/terms`, and `/en/contact`, plus robots, sitemap, Search Console verification, and 404 behavior.
- `/` returned the intended 307 redirect to `/en`; `/xx` returned 404. The verification file was byte-for-byte matched to the existing CRA public file.
- Browser checks found no console warnings/errors on the homepage or contact page. At a 320px viewport the home and contact pages had `scrollWidth === clientWidth === 320`; the mobile menu exposed the expected accessible navigation links.

The build output is approximately 9.3 MB on disk including server artifacts. The only major Phase 1 client components are the mobile navigation, locale switcher, GA4 route tracker, and contact form; static page content remains server-rendered.

## Known gaps

The existing production legal pages contain concise content; Phase 1 preserves its meaning but future legal review should supply final long-form bilingual policy text before cutover. Google Fonts are retained via a stylesheet for visual parity; self-hosting/`next/font` should be evaluated before the production switch. Header/footer application links are intentionally absolute links to the current CRA application. No authentication state is rendered in Phase 1.

## Recommended Phase 2

Migrate the 16 approved personality pages and comparison pages as static locale routes; add coverage validation, server-rendered internal links, canonical/hreflang tests, and safe social previews. Keep the CRA application live while preview parity is reviewed.
