# Vercel Compute Cleanup Audit

Date: 2026-09-05
Scope: `frontend-next` on `release/insights-live`
Status: audit and recommendations only; no application behavior changed

## Executive summary

The current production build sends almost every App Router page through Vercel compute. The primary cause is not authentication, bandwidth, image handling, or database access. `app/layout.jsx` calls `headers()` solely to obtain `x-kalqlater-locale`. Because every page inherits that layout, Next.js marks all 45 page routes as dynamic. Only `robots.txt` and the main `sitemap.xml` are emitted as static resources.

The second broad trigger is `proxy.js`. Its `/:locale/:path*` matcher is effectively a blanket first-segment matcher, so canonical localized pages and many non-localized paths enter the Node proxy even when the function only adds a locale header and returns `NextResponse.next()`. That header is then consumed by the root layout, coupling locale presentation to request-time execution.

This creates a plausible two-stage compute pattern for a normal public request: proxy execution followed by dynamic page rendering. No exact share of the reported invocations can be assigned without Vercel route-level logs, but the architecture is consistent with Function Invocations exceeding Edge Requests.

FR and JA add a significant CPU multiplier. Their page and chrome loaders call `validateLocalePackage()` and read the full expected JSON package from disk. With dynamic rendering and no memoized/prevalidated runtime artifact, those validation and filesystem operations can recur during requests. Compare magnifies the exposure through 120 canonical pairs per published locale.

The desired target is achievable: 44 of the 46 source-defined dynamic route families can become static/pre-rendered shells or content. Live job detail and the job sitemap should remain data-aware, but use CDN caching/ISR or scheduled generation instead of uncached execution on each request.

## Build route summary

The Next.js 16 production build reports:

- Static (`○`): 2 — `/robots.txt`, `/sitemap.xml`
- SSG (`●` or equivalent): 0
- Dynamic (`ƒ`): 47 — 45 page routes, the generated `/_not-found` route, and `/sitemap-jobs.xml`
- Proxy: one additional `ƒ Proxy (Middleware)` entry

There are 48 source-defined route families: 45 page files, one route handler, and two metadata routes. Excluding the framework-generated `/_not-found` entry and the proxy from the family count:

- Static now: 2
- Dynamic now: 46
- Dynamic but capable of static/pre-rendered delivery: 44
- Data-aware dynamic/cached routes required: 2

## Global dynamic triggers

| File | Affected routes | Trigger | Runtime effect | Required? |
|---|---|---|---|---|
| `frontend-next/app/layout.jsx` | Every App Router page and not-found response | `await headers()` | Opts the entire inherited tree into request-time rendering | No. It is used only for `<html lang>`, direction, and localized skip-link copy. Replace with a static-capable locale/root-layout design. |
| `frontend-next/proxy.js` | All localized routes and many first-segment paths | Broad `/:locale/:path*` matcher plus `NextResponse.next({ request: { headers } })` | Runs proxy compute and injects `x-kalqlater-locale` for the root layout | No for canonical published pages. Retain only narrowly scoped preview, legacy, and redirect behavior until those are migrated. |
| `frontend-next/proxy.js` | Legacy application routes | `fetch(..., { cache: 'no-store' })` | Vercel fetches and streams the legacy CRA response for every request | Transitional only. Remove after legacy route migration. |
| `frontend-next/app/not-found.jsx` | Global 404 | `dynamic = 'force-dynamic'`, `headers()` | Every unmatched URL requires compute | No. Use a static generic 404 or route-local static 404 presentation. |
| `frontend-next/app/[locale]/not-found.jsx` | Localized 404 | `dynamic = 'force-dynamic'`, `headers()` | Bot typo/invalid-route traffic invokes compute | No. Locale is already represented by the route tree; avoid request headers. |
| `frontend-next/app/[locale]/jobs/page.jsx` | `/{locale}/jobs` | `force-dynamic`, server `searchParams`, `headers()`, cookie forwarding, uncached backend fetch | Personalized/search SSR on every request | Not required. Use a static browse shell and browser-to-Render search; optionally pre-render/cache the default public listing. |
| `frontend-next/app/[locale]/jobs/[slug]/page.jsx` | `/{locale}/jobs/{slug}` | `force-dynamic`; uncached backend fetch in metadata and page, plus related-job fetch | Live SEO/data SSR; the primary job can be fetched more than once per request | Data freshness is required, uncached per-request rendering is not. Use request deduplication plus ISR/CDN caching and invalidation. |
| `frontend-next/app/sitemap-jobs.xml/route.js` | `/sitemap-jobs.xml` | route handler and backend `cache: 'no-store'` | Function executes when the CDN does not satisfy the request | Fresh data required. Preserve the existing 15-minute CDN policy, add backend/Next caching or scheduled generation. |
| Multiple allowlisted dynamic routes | Dynamic segments | `dynamicParams = true` | Unknown or unsupported values can reach runtime code before returning 404 | Usually no. After generating every supported path, fail closed with `dynamicParams = false` where preview behavior does not require on-demand paths. |
| FR/JA locale runtime | Published FR/JA content routes | `loadLocalePage()` / `loadLocaleChrome()` validate and read packages | Large schema, residue, placeholder, and filesystem work can run during requests | Validation belongs in build/CI. Runtime should import a prevalidated immutable artifact or a process memo. |

No calls to `cookies()`, `draftMode()`, `connection()`, `unstable_noStore()`, `noStore()`, `revalidate = 0`, `force-no-store`, or server actions were found. There are zero `"use server"` files. Several client components have local helper functions named `headers`; they are not `next/headers` and do not affect rendering mode.

## Complete route inventory

All page routes below currently show `ƒ` because they inherit the root `headers()` call. “GSP” includes locale parameters supplied by the parent locale layout. “Static target” means safe after removing the shared dynamic trigger and completing the noted parameter/locale work.

| URL pattern | Route file | GSP | Metadata | Route-specific runtime input | Classification | Static target |
|---|---|---:|---:|---|---|---:|
| `/` | `app/page.jsx` | No | No | Server `permanentRedirect`; duplicate of `next.config` redirect | Dynamic unnecessary | Yes; config redirect only |
| `/{locale}` | `app/[locale]/page.jsx` | Locale layout: EN/HI | Yes | Authored/local package content only | Dynamic unnecessary | Yes; generate all published locales |
| `/{locale}/careers` | `app/[locale]/careers/page.jsx` | EN | Yes | Authored data only | Dynamic unnecessary | Yes |
| `/{locale}/community` | `app/[locale]/community/page.jsx` | EN/HI | Yes | Static landing/local package only | Dynamic unnecessary | Yes |
| `/{locale}/compare` | `app/[locale]/compare/page.jsx` | EN/HI | Yes | Authored comparison directory and client selector | Dynamic unnecessary | Yes; generate published locales |
| `/{locale}/compare/{pair}` | `app/[locale]/compare/[pair]/page.jsx` | 240 EN/HI plus Spanish preview; FR/JA omitted | Yes | Authored/application or locale-package content; reverse redirect | Dynamic unnecessary | Yes; prebuild canonical published pairs and move reverse redirects to static config |
| `/{locale}/contact` | `app/[locale]/contact/page.jsx` | Locale layout | Yes | Static form shell; browser posts directly to Render | Dynamic unnecessary | Yes |
| `/{locale}/dashboard` | `app/[locale]/dashboard/page.jsx` | EN/HI/FR/JA | Yes | Client auth and browser/session storage; browser fetches Render results | Dynamic unnecessary | Yes; private static shell |
| `/{locale}/editorial/localization` | `app/[locale]/editorial/localization/page.jsx` | Locale layout | Yes | Client workbench/browser API | Dynamic unnecessary | Yes; protect access independently if required |
| `/{locale}/forgot-password` | `app/[locale]/forgot-password/page.jsx` | Locale layout | Yes | Client `useSearchParams`; browser auth call to Render | Dynamic unnecessary | Yes |
| `/{locale}/guides` | `app/[locale]/guides/page.jsx` | EN | Yes | Authored content only | Dynamic unnecessary | Yes |
| `/{locale}/guides/{slug}` | `app/[locale]/guides/[slug]/page.jsx` | 3 EN paths | Yes | Three-entry authored allowlist | Dynamic unnecessary | Yes; set `dynamicParams = false` |
| `/{locale}/insights` | `app/[locale]/insights/page.jsx` | EN/HI | Yes | Authored content only | Dynamic unnecessary | Yes; generate published locales |
| `/{locale}/insights/communication` | `app/[locale]/insights/communication/page.jsx` | EN/HI | Yes | Authored/local package content only | Dynamic unnecessary | Yes |
| `/{locale}/insights/communication/start` | `app/[locale]/insights/communication/start/page.jsx` | Locale layout | Yes | Client starts session against Render | Dynamic unnecessary | Yes; static private shell |
| `/{locale}/insights/communication/session/{sessionId}` | `app/[locale]/insights/communication/session/[sessionId]/page.jsx` | No session IDs | Yes | ID validation server-side; all assessment data fetched by client from Render | Dynamic unnecessary by architecture | Static shell via rewrite/query/client ID parsing; otherwise lightweight runtime |
| `/{locale}/insights/communication/result/{resultId}` | `app/[locale]/insights/communication/result/[resultId]/page.jsx` | No result IDs | Yes | ID validation server-side; client retrieves Render result | Dynamic unnecessary by architecture | Static shell via rewrite/query/client ID parsing; otherwise lightweight runtime |
| `/{locale}/insights/conflict` | `app/[locale]/insights/conflict/page.jsx` | EN/HI | Yes | Authored/local package content only | Dynamic unnecessary | Yes |
| `/{locale}/insights/conflict/start` | `app/[locale]/insights/conflict/start/page.jsx` | Locale layout | Yes | Client starts session against Render | Dynamic unnecessary | Yes |
| `/{locale}/insights/conflict/session/{sessionId}` | `app/[locale]/insights/conflict/session/[sessionId]/page.jsx` | No session IDs | Yes | Client retrieves/submits Render session | Dynamic unnecessary by architecture | Same static-shell strategy |
| `/{locale}/insights/conflict/result/{resultId}` | `app/[locale]/insights/conflict/result/[resultId]/page.jsx` | No result IDs | Yes | Client retrieves Render result | Dynamic unnecessary by architecture | Same static-shell strategy |
| `/{locale}/insights/leadership` | `app/[locale]/insights/leadership/page.jsx` | EN/HI | Yes | Authored/local package content only | Dynamic unnecessary | Yes |
| `/{locale}/insights/leadership/start` | `app/[locale]/insights/leadership/start/page.jsx` | Locale layout | Yes | Client starts session against Render | Dynamic unnecessary | Yes |
| `/{locale}/insights/leadership/session/{sessionId}` | `app/[locale]/insights/leadership/session/[sessionId]/page.jsx` | No session IDs | Yes | Client retrieves/submits Render session | Dynamic unnecessary by architecture | Same static-shell strategy |
| `/{locale}/insights/leadership/result/{resultId}` | `app/[locale]/insights/leadership/result/[resultId]/page.jsx` | No result IDs | Yes | Client retrieves Render result | Dynamic unnecessary by architecture | Same static-shell strategy |
| `/{locale}/insights/learning` | `app/[locale]/insights/learning/page.jsx` | EN/HI | Yes | Authored/local package content only | Dynamic unnecessary | Yes |
| `/{locale}/insights/learning/start` | `app/[locale]/insights/learning/start/page.jsx` | Locale layout | Yes | Client starts session against Render | Dynamic unnecessary | Yes |
| `/{locale}/insights/learning/session/{sessionId}` | `app/[locale]/insights/learning/session/[sessionId]/page.jsx` | No session IDs | Yes | Client retrieves/submits Render session | Dynamic unnecessary by architecture | Same static-shell strategy |
| `/{locale}/insights/learning/result/{resultId}` | `app/[locale]/insights/learning/result/[resultId]/page.jsx` | No result IDs | Yes | Client retrieves Render result | Dynamic unnecessary by architecture | Same static-shell strategy |
| `/{locale}/jobs` | `app/[locale]/jobs/page.jsx` | Locale layout | Yes | `force-dynamic`, server query/cookie/backend fetch | Dynamic unnecessary | Yes; public shell/default cache + client search |
| `/{locale}/jobs/{slug}` | `app/[locale]/jobs/[slug]/page.jsx` | No job slugs | Yes | `force-dynamic`; live Render data in HTML/metadata/schema | Dynamic required/cached | No full static guarantee; use ISR/CDN cache |
| `/{locale}/jobs/applications` | `app/[locale]/jobs/applications/page.jsx` | Locale layout | Static metadata | Client auth and Render CRUD | Dynamic unnecessary | Yes; private static shell |
| `/{locale}/jobs/profile` | `app/[locale]/jobs/profile/page.jsx` | Locale layout | Static metadata | Client auth and Render profile CRUD | Dynamic unnecessary | Yes; private static shell |
| `/{locale}/jobs/saved` | `app/[locale]/jobs/saved/page.jsx` | Locale layout | Static metadata | Client auth and Render fetch | Dynamic unnecessary | Yes; private static shell |
| `/{locale}/login` | `app/[locale]/login/page.jsx` | Locale layout | Yes | Client auth call and `useSearchParams` | Dynamic unnecessary | Yes |
| `/{locale}/personality/{type}` | `app/[locale]/personality/[type]/page.jsx` | 32 EN/HI; FR/JA omitted | Yes | Authored/local package content only | Dynamic unnecessary | Yes; prebuild 16 × published locales |
| `/{locale}/personality/{type}/careers` | `app/[locale]/personality/[type]/careers/page.jsx` | 32 EN/HI; FR/JA omitted | Yes | Authored/local package content; client Jobs widget may call Render | Dynamic unnecessary | Yes; prebuild 16 × published locales |
| `/{locale}/personality/{type}/characters` | `app/[locale]/personality/[type]/characters/page.jsx` | 4 EN | Yes | Four-entry authored allowlist | Dynamic unnecessary | Yes; set `dynamicParams = false` |
| `/{locale}/privacy` | `app/[locale]/privacy/page.jsx` | Locale layout | Yes | Authored/local package content only | Dynamic unnecessary | Yes |
| `/{locale}/reset-password` | `app/[locale]/reset-password/page.jsx` | Locale layout | Yes | Client token/search params and Render auth call | Dynamic unnecessary | Yes |
| `/{locale}/signup` | `app/[locale]/signup/page.jsx` | Locale layout | Yes | Client auth call to Render | Dynamic unnecessary | Yes |
| `/{locale}/terms` | `app/[locale]/terms/page.jsx` | Locale layout | Yes | Authored/local package content only | Dynamic unnecessary | Yes |
| `/{locale}/test` | `app/[locale]/test/page.jsx` | Locale layout | Yes | Fully client-side questions, scoring, result, and browser storage | Dynamic unnecessary | Yes |
| `/{locale}/types` | `app/[locale]/types/page.jsx` | Locale layout | Yes | Authored data only | Dynamic unnecessary | Yes |
| `/compare` | `app/compare/page.jsx` | No | Static metadata | Legacy selector page, although proxy/config also redirect this URL | Dynamic unnecessary | Yes; keep one config redirect owner |
| `/robots.txt` | `app/robots.js` | N/A | Metadata route | No request data | Static | Already static |
| `/sitemap.xml` | `app/sitemap.js` | N/A | Metadata route | Build-time registries only | Static | Already static |
| `/sitemap-jobs.xml` | `app/sitemap-jobs.xml/route.js` | N/A | Route handler | Uncached Render fetch; CDN response headers | Dynamic required/cached | Keep data-aware; cache or generate on schedule |

The framework-generated `/_not-found` route is also dynamic because both not-found components explicitly use request headers and `force-dynamic`.

## Public SEO rendering audit

| Public surface | Current build | Backend during SSR | Safe target |
|---|---|---|---|
| `/`, `/en` | Dynamic | No | Static/config redirect and static homepage |
| `/en/types` | Dynamic | No | Static |
| `/en/personality/{type}` | Dynamic | No | SSG |
| `/en/personality/{type}/careers` | Dynamic | No for page body; Jobs enhancement can remain client-side | SSG |
| `/en/personality/{type}/characters` | Dynamic | No | SSG |
| `/en/guides`, `/en/guides/{slug}` | Dynamic | No | SSG |
| `/en/compare` | Dynamic | No | SSG |
| `/en/compare/{pair}` | Dynamic | No | SSG |
| `/sitemap.xml` | Static | No | Keep static |
| `/robots.txt` | Static | No | Keep static |

These public content routes receive no user-specific server data. Their current runtime status is caused by the root layout/proxy design, not their content.

## Authentication impact

Authentication is not what forces public pages dynamic:

- No server component calls `cookies()` or a server session helper.
- `Header` renders an `AuthStatusProvider` client component.
- After hydration, that provider calls the Render endpoint `/api/auth/session` directly through `NEXT_PUBLIC_BACKEND_URL` and reads compatibility state from browser storage.
- Login, signup, recovery, dashboard, saved jobs, applications, and career profile are already client-controlled shells.
- The provider validates on initial mount, auth changes, storage changes, and window focus. This can add substantial Render traffic but not Vercel Function CPU when the public backend URL points directly to Render.

Therefore auth can remain functional while public HTML becomes static. A separate optimization should deduplicate/reduce focus-time session validation and use one app-level client session cache, but that is a Render/API concern rather than the primary Vercel issue.

The exception is the Jobs directory: its server component reads the incoming cookie and forwards it to Render, making its SSR response potentially user-specific. Remove personalized SSR from the browse page before caching it.

## API and route-handler inventory

There is no `frontend-next/app/api` directory and no Vercel-hosted application API implementation.

One route handler exists:

| Endpoint | Owner | Called by | Duplicate FastAPI endpoint | Keep on Vercel? |
|---|---|---|---|---|
| `GET /sitemap-jobs.xml` | Next/Vercel route handler | Search crawlers and sitemap discovery | It consumes Render `GET /api/jobs/sitemap`; it does not duplicate its database logic | Keep only as a cached XML adapter, or generate/publish the XML on a schedule. Never proxy general Jobs API traffic through it. |

Browser-facing Next components already call Render directly for:

- `/api/auth/*`
- `/api/contact`
- `/api/community/*`
- `/api/jobs*`
- `/api/analyzers/*`, `/api/analyzer-sessions/*`, `/api/analyzer-results/*`

`next.config.mjs` nevertheless rewrites `/api/:path*` to `LEGACY_CRA_ORIGIN`. This is not an API implementation, but requests to the primary Vercel domain can still traverse the Next proxy/rewrite layer and then another Vercel CRA deployment. Confirm production clients use explicit Render origins, then remove this fallback.

## Jobs

### Directory

`/{locale}/jobs` is the strongest route-specific source of avoidable runtime work:

- `force-dynamic`
- awaits server `searchParams`
- reads `headers()` and forwards cookies
- performs an uncached Render request
- then hydrates a client that already knows how to query Render directly

Recommended target: pre-render an indexable static shell and either (a) cache a public default 30-day listing with ISR, or (b) load listings from Render after hydration. Handle `q`, work mode, and age filters in the browser. Load personalized matching only after client authentication.

### Job detail

Job detail SSR is valuable because title, description, canonical, robots, and `JobPosting` schema depend on live status. However:

- `job(slug)` is called independently by `generateMetadata()` and the page.
- `fetchJobs()` defaults to `cache: 'no-store'`.
- active pages also fetch related jobs.

Use React/Next request memoization for the primary job, a short `revalidate` window or tagged cache, and on-demand invalidation after ingestion/status changes. This preserves SEO and freshness while shifting repeat hits to CDN/cache.

### Private Jobs routes

Career profile, saved jobs, and applications are client-side authenticated shells. They can be emitted statically and call Render directly. They need `noindex`, not SSR.

### Job sitemap

The handler sets `s-maxage=900, stale-while-revalidate=3600`, which is directionally correct, but its backend fetch is explicitly uncached. Confirm Vercel CDN hit behavior from response logs. Prefer a cached fetch/tag or scheduled static XML publication so repeated crawler requests do not reach both Vercel compute and Render.

## Community

The localized `/{locale}/community` route is only a static discovery landing and should be SSG.

The actual Community product remains in the legacy CRA:

- `/community`
- `/community/me`
- `/community/profile`
- `/community/member/{username}`
- `/community/connections`
- `/community/messages` (placeholder)

Those routes are proxied or rewritten through Vercel while the browser calls Render Community endpoints. This violates the desired clean split because Vercel is acting as both frontend host and an origin-streaming gateway to another frontend deployment.

Target ownership:

- Vercel: static Community landing and static/private app shells
- Render: auth, profiles, posts, comments, connections, chat, jobs APIs, database access
- Browser: authenticated API calls directly to Render
- Public member profiles, if indexed later: cached/ISR HTML with explicit consent, quality gates, canonical ownership, deletion behavior, and invalidation

Do not migrate the `/community/messages` placeholder as if it were a working chat product.

## Personality test and Insights

The personality assessment is fully client-side:

- questions are bundled data
- answers and resume state use `localStorage`
- scoring runs in `computePersonalityResult()` in the browser
- result presentation is part of the client component

It requires no Vercel runtime. The test route should be a static shell.

Communication, Conflict, Leadership, and Learning landing pages are authored content and can be SSG. Their start/session/result components make browser-to-Render requests and store access tokens/session references in browser storage. Start pages can be static immediately. ID-bearing session/result URLs need either a lightweight dynamic shell or a route design that serves one static shell while parsing/validating the ID in the client. They do not require server-side backend calls today.

## Sitemap and crawler amplification

`/sitemap.xml` is static and has no backend dependency. It does not itself consume a Function invocation in the current build.

The current sitemap expands to approximately 666 public URL entries from code-defined inventories:

- 480 localized Compare pair URLs (120 × EN/HI/FR/JA)
- 64 personality pages (16 × four locales)
- 64 career pages (16 × four locales)
- localized home/legal/types/Compare/Insights/Community routes
- English-only Careers/Guides/Character/Jobs additions

The exact sitemap is deterministic from registries; no `lastmod` is fabricated for the main sitemap. Bots following those URLs currently reach the blanket proxy and then a dynamic page function. Invalid or reversed URLs can also reach dynamic proxy/not-found handling. Crawl activity is therefore a high qualitative amplification risk even though no request-count attribution is possible from the repository alone.

`/sitemap-jobs.xml` is dynamic and depends on Render. Its CDN headers mitigate repeat traffic, but cache-miss/revalidation behavior still invokes compute.

## Multilingual cost

Published content exists for EN, HI, FR, and JA. Multilingual support contributes in three ways:

1. It multiplies the indexable personality, career, Compare, and content URL surface.
2. EN/HI are partly included in `generateStaticParams`, while FR/JA frequently rely on `dynamicParams = true` and runtime package loading.
3. FR/JA package rendering validates the package schema/content and reads many JSON files without an application-level cache.

Removing languages is not required to solve the immediate root-layout problem. Before any language retirement, preserve SEO with verified traffic/backlink inventory, sitemap/hreflang removal, and carefully selected 308 redirects or 410 responses. Do not silently serve English at old localized URLs.

## Compare cost

Compare currently owns:

- `/compare` legacy redirect/selector behavior
- `/{locale}/compare`
- 120 canonical unordered pairs per published locale
- reverse-pair redirects through the proxy/page logic
- Spanish preview paths

The pair content is authored and requires no backend at request time, so canonical pair pages should be SSG/CDN assets. Today the root layout makes them dynamic, the proxy examines canonical and reverse URLs, and FR/JA package data can be validated/read during requests. The 480 published canonical sitemap URLs make Compare the largest crawler-visible compute surface.

Future removal must start with Search Console/analytics/backlink inventory and a URL-level redirect map. Remove internal links and sitemap entries first, then redirect only where a genuinely equivalent destination exists. Avoid mass-redirecting unrelated pair intent to the homepage.

## Legacy CRA fallback

`LEGACY_CRA_ORIGIN` is used in two mechanisms.

### Proxy-fetched, no-store legacy application routes

The proxy directly fetches and streams these route families with `X-Robots-Tag: noindex, nofollow`:

- `/community` and descendants
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/result` and descendants
- `/report` and descendants
- `/premium-report` and descendants

### `next.config.mjs` beforeFiles rewrites

- `/test/:path*`
- `/result/:path*`
- `/report/:path*`
- `/premium-report/:path*`
- `/types/:path*`
- `/about/:path*`
- `/privacy/:path*`
- `/terms/:path*`
- `/contact/:path*`
- `/compare/:path+`
- `/community/:path*`
- `/login/:path*`
- `/signup/:path*`
- `/forgot-password/:path*`
- `/reset-password/:path*`
- `/api/:path*`
- `/static/:path*`
- `/asset-manifest.json`, `/manifest.json`, `/favicon.ico`, `/service-worker.js`, `/index.html`

`/types/{type}` and `/compare`/`/compare/{pair}` also have special proxy redirect/404 logic before fallback. The overlap between App Router pages, proxy rules, and rewrites creates multiple ownership paths and makes compute/cache behavior harder to reason about.

## Ranked compute suspects

### CRITICAL — Shared request-bound root layout

- Source: `app/layout.jsx`
- Routes: every page
- Why: `headers()` disables static optimization across the tree
- Fix: replace header-derived locale with static root-layout/locale routing; pre-render published locales
- Risk: `<html lang>`, `dir`, preview locale, and skip-link localization must remain correct

### CRITICAL — Blanket Node proxy matcher

- Source: `proxy.js`
- Routes: canonical localized pages plus many non-localized paths
- Why: routes pass through compute just to add a locale header or continue
- Fix: stop injecting locale headers; narrow matcher to transitional legacy/preview/redirect paths, then replace redirects with build-time config where possible
- Risk: reverse Compare redirects, legacy noindex, and preview fail-closed behavior require dedicated tests

### HIGH — Request-time FR/JA package validation

- Source: `localization/runtime.js`, `translation/validator.js`, `GenericLocaleChrome.jsx`
- Routes: FR/JA homepage, personality, career, Compare, Insights, Community, legal/contact
- Why: whole-package validation and filesystem loading can repeat during dynamic requests and both layout/page may load it
- Fix: validate in CI/build, emit/import a prevalidated immutable bundle, and memoize any server lookup
- Risk: stale or invalid localization must continue to fail closed

### HIGH — Dynamic Compare surface

- Source: Compare hub/pair routes plus proxy reverse handling
- Routes: 480 published canonical pairs plus reverse/invalid attempts
- Why: large crawl surface currently invokes proxy and SSR despite static authored content
- Fix: SSG canonical pages; static redirect map; `dynamicParams = false` for closed inventories
- Risk: canonical/hreflang and redirect-chain regressions

### HIGH — Jobs uncached SSR

- Source: Jobs list/detail and `fetchJobs()`
- Routes: `/en/jobs`, job detail URLs
- Why: list forwards request cookies and every fetch defaults to no-store; detail may fetch the primary record twice plus related jobs
- Fix: static list shell/client search; cache and deduplicate detail data; tagged invalidation
- Risk: stale status or schema must never leave inactive jobs indexable

### HIGH — Legacy CRA proxy/fallback

- Source: `proxy.js`, `next.config.mjs`, `LEGACY_CRA_ORIGIN`
- Routes: Community/auth/result/report and multiple old public/assets/API paths
- Why: Vercel dynamically streams or rewrites to another Vercel frontend, with explicit no-store on key paths
- Fix: migrate necessary shells, point browser API traffic directly to Render, then remove fallback route-by-route
- Risk: authenticated continuation and old inbound URLs

### MEDIUM — Dynamic not-found and open dynamic params

- Source: both not-found components; `dynamicParams = true`
- Routes: bot typos, unsupported locale/type/guide/pair paths
- Why: invalid traffic invokes compute before failing
- Fix: static 404 and closed allowlists after pre-generation
- Risk: preview route availability must remain explicit

### LOW for Vercel, relevant for Render — Client auth validation

- Source: `AuthStatusProvider`
- Routes: every localized page after hydration and on focus
- Why: repeated direct `/api/auth/session` calls
- Fix: one cached client session state with controlled refresh
- Risk: stale login/logout UI; this does not explain Vercel Function CPU when configured directly to Render

## Target architecture

```text
Visitor / crawler
        |
        v
Vercel CDN
  - static English public pages
  - static assessment/auth/community/private-app shells
  - cached/ISR public job details only where SEO needs HTML
        |
        v (browser API calls; no Vercel proxy)
api.kalqlater.com on Render
  - auth and sessions
  - profiles/community/posts/comments/connections/chat
  - assessments and persisted results
  - jobs search, matching, saves, applications, ingestion
        |
        v
Database (backend access only)
```

Vercel Functions should be exceptional:

- cached/ISR job-detail generation or revalidation
- cached job-sitemap generation if it cannot be published as a static artifact
- no general API proxy
- no request-time render for authored public content

## Cleanup plan

### Phase A — Stop unnecessary runtime compute

1. Add route-level Vercel observability: function name/path, cache status, user agent class, and duration without personal data.
2. Create a rendering-mode guard that fails when approved public content routes appear as `ƒ`.
3. Replace root `headers()` locale dependence with a static-capable root-layout design. Because `<html lang>` must remain correct, use separately generated locale root layouts/route groups or complete the approved English-only transition before fixing the root language to English.
4. Remove locale-header injection from canonical public requests and narrow `proxy.js` matchers.
5. Prevalidate FR/JA packages during build and import a frozen generated artifact; do not validate the entire package per request.
6. Generate every supported published locale/type/pair path and close allowlisted routes with `dynamicParams = false` where appropriate.
7. Make both 404 surfaces static.
8. Rebuild and verify public pages become `○`/`●`; compare Vercel route-level usage after deployment.

SEO safeguards: preserve status, canonical, hreflang, language attributes, structured data, rendered content, and redirect targets byte-for-byte where practical.

### Phase B — Simplify routes and product architecture

1. Establish one owner per URL in the route registry.
2. Convert test, auth, dashboard, private Jobs, and Insights start pages to explicit static shells.
3. Decide a single static-shell strategy for assessment session/result IDs.
4. Remove duplicate `/compare` page/redirect ownership and other App/legacy overlaps.
5. Keep all browser API calls on explicit `https://api.kalqlater.com` configuration.

### Phase C — Remove Compare safely

1. Export Search Console performance, backlinks, indexed URLs, and internal-link sources.
2. Freeze a URL-level keep/redirect/410 decision table for hub, canonical pairs, reverse pairs, and locales.
3. Remove new internal links and sitemap/hreflang entries.
4. Deploy direct single-hop redirects only to genuinely equivalent content; use 410 where no equivalent exists.
5. Retain monitoring and rollback capability through recrawl.

### Phase D — Remove multilingual safely

1. Inventory organic traffic, backlinks, conversions, and indexed URLs for HI/FR/JA.
2. Decide per route whether there is an equivalent English destination; never serve English under localized canonicals.
3. Remove locale navigation, hreflang, and sitemap entries in one coordinated release.
4. Apply direct 308 or 410 policies from an explicit map.
5. Once English-only ownership is approved, simplify the root layout, locale registry, and proxy without compromising historical URL handling.

### Phase E — Remove legacy CRA fallback

1. Inventory actual production hits for every fallback family.
2. Migrate auth/profile/Community shells that have real behavior and preserve return targets.
3. Confirm legacy CRA uses direct Render API configuration.
4. Remove `/api` and asset fallbacks first after dependency verification.
5. Remove proxy-fetched no-store routes one family at a time.
6. Retire `LEGACY_CRA_ORIGIN` only after all approved redirects/410s and auth flows pass.

### Phase F — Community-first architecture

1. Build static Community discovery and authenticated client shells on Vercel.
2. Keep identity, profiles, posts, comments, connections, chat, moderation, and Jobs data on Render.
3. Add public profile SSR/ISR only after explicit publishing consent, completeness, privacy, canonical, and deletion requirements exist.
4. Use API cache headers/WebSocket infrastructure appropriate to Render; do not introduce Vercel API duplication.
5. Measure product/API usage separately from anonymous content traffic.

## Recommended first fix

Fix the shared rendering boundary first: remove `headers()` from `app/layout.jsx` by adopting a static-capable locale root layout, and stop `proxy.js` from injecting `x-kalqlater-locale` on canonical public paths. In the same guarded change, pre-render all approved public locale paths and assert in CI that homepage, types, personality, careers, characters, guides, Compare, Insights landings, Community landing, legal/contact, test, auth, dashboard, and private Jobs shells are no longer `ƒ`.

Do not begin with Jobs or delete languages/Compare first. Those changes are larger and would leave the global per-request layout/proxy cost in place for everything else.

Expected qualitative impact: **VERY LARGE** reduction in Vercel active CPU for anonymous public traffic, subject to confirmation from route-level Vercel logs after deployment.

## Risks and validation gates

- Preserve exact canonical and hreflang ownership while changing render mode.
- Preserve `<html lang>` and `dir`; do not trade compute reduction for incorrect language markup.
- Ensure preview locales remain unavailable outside their allowlists.
- Keep reverse Compare redirects direct and chain-free until Compare retirement.
- Do not cache user-specific Jobs or auth responses in shared CDN storage.
- Inactive Jobs must become noindex/404 according to current policy immediately enough for `JobPosting` safety.
- Static private shells must retain `noindex` and perform authorization in the browser/backend, never by trusting the shell.
- Validate that `LEGACY_CRA_ORIGIN` never points back to the primary domain.
- Compare build output, route-level invocation counts, cache hit ratios, and Render request volume before and after each phase.
