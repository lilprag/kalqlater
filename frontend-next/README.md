# KalQLater Next.js — Phase 1

This is an isolated Next.js App Router foundation created from production baseline `103808d`. It does not replace `../frontend/`, is not connected to production, and must be deployed to a separate preview project first.

## Local setup

1. Copy `.env.example` to `.env.local` and set only public values.
2. Run `npm install`.
3. Run `npm run dev` and open `http://localhost:3000/en`.
4. Run `npm run build`, then `npm run start -- -p 3100`.
5. In another terminal run `npm test` to verify raw server-rendered HTML.

## Environment variables

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: GA4 measurement ID. GA loads only when `NODE_ENV=production` and this value is present.
- `NEXT_PUBLIC_BACKEND_URL`: public FastAPI origin, without a trailing slash. The client contact form sends to `${NEXT_PUBLIC_BACKEND_URL}/api/contact`.
- `NEXT_PUBLIC_SITE_URL`: canonical public origin. Use the preview origin for preview validation; production will use `https://kalqlater.com` at cutover.
- `LEGACY_CRA_ORIGIN`: server-only stable CRA Vercel origin used by fallback rewrites. It must be a public, non-redirecting deployment alias; never point it at `kalqlater.com`, or a proxy loop will result.

These variables are public configuration values, not secret storage. Resend credentials remain exclusively in the FastAPI/Render environment.

## Routes and locale policy

Phase 1 implements `/en`, `/hi`, `/en|hi/privacy`, `/en|hi/terms`, and `/en|hi/contact`. `/` redirects deliberately to `/en`; there is no browser-language redirect. The locale switch preserves the equivalent Phase 1 pathname. Application links such as test, compare, community, jobs, and login intentionally point to the existing CRA production application until their Next.js routes migrate.

## Metadata, robots, and sitemap

`lib/metadata.js` is the single route metadata builder. It emits server-rendered title, description, canonical, English/Hindi/x-default alternates, Open Graph, Twitter, and robot metadata. WebSite/Organization JSON-LD is on the homepage; legal/contact pages use visible BreadcrumbList JSON-LD. `app/robots.js` and `app/sitemap.js` include only Phase 1 routes. Later phases must add pages only when they are live and indexable.

The existing Google Search Console file is unchanged at `public/google41232c0c0c01eadd.html` and resolves at the site root.

## Analytics

`components/Analytics.jsx` uses the provider-neutral privacy envelope in `lib/analytics.js`. The GA4 adapter inserts its script only once, only in production, and receives explicit privacy-validated `page_view` events with local duplicate prevention. See `ANALYTICS_PRIVACY_ENVELOPE.md` before adding an event or provider.

## Crawlability verification

`npm test` assumes a production server at `http://127.0.0.1:3100`; set `CRAWL_BASE_URL` to use another address. The script checks server HTML, `lang`, title, description, canonical, h1, visible text, links, robots, sitemap, Search Console file, and 404 behavior.

## Vercel preview settings

- Root Directory: `frontend-next`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: Next.js default (leave unset)
- Preview variables: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BACKEND_URL`, and optionally `NEXT_PUBLIC_GA_MEASUREMENT_ID` (leave GA unset for preview if analytics is not desired).
  Add `LEGACY_CRA_ORIGIN` to Preview and Production when hybrid routing is enabled.

Do not change the existing CRA Vercel project, its root directory, routes, or environment variables.

## Phase 2 public routes

Phase 2 adds static public content at `/en|hi/personality/[type]` for all 16 supported type codes, plus `/en|hi/compare/[pair]` for all 120 unordered type pairs. Pair order is canonical according to the production type order; a valid reversed URL receives a 308 redirect to its canonical URL. Invalid types, malformed pairs, and identical pairs return 404.

Type pages use normalized server-only adapters over approved CRA `types`, `leadership`, and `communication` datasets. Comparison pages use the approved qualitative Relationship Intelligence dataset; no numeric compatibility score is generated. The sitemap now has 280 URLs: 8 Phase 1 pages, 32 type pages, and 240 comparison pages.

## Current limits and next phase

No assessment, results, reports, auth, community, jobs, profiles, connections, messages, or notifications have been migrated. Phase 3 should migrate the assessment shell and private personalized results while retaining strict noindex and cache-isolation rules.
