# KalQLater Next.js App Router Migration Plan

## 1. Executive summary

**Recommendation: build a sibling `frontend-next/` application and cut over only after route-by-route parity. Do not convert `frontend/` in place.** The deployed application is a React 19 Create React App application customised through CRACO, with React Router, client-side lazy route chunks, Tailwind CSS, Framer Motion, and a FastAPI REST backend. Its public HTML is the generic CRA shell; route titles, robots directives, canonical URLs, Open Graph data, and JSON-LD are principally applied after hydration. Consequently, crawlers and social-preview fetchers cannot reliably receive route-specific content or metadata.

The migration should create a server-rendered public web layer first, preserving the existing CRA application and FastAPI/MongoDB services until the Next.js application achieves parity. The first production cutover should cover only the deployed `origin/main` baseline, `103808d9509b11c61dc44c48326e3f80a8a37f91` (`Fix job form URLs and creation flow`). Local commit `b8d4e2b` is unfinished Community Phase 2 work and is explicitly out of scope.

## 2. Audit baseline and safeguards

| Item | Recorded value |
| --- | --- |
| Original local branch / HEAD | `main` / `b8d4e2b Community Phase 2 - Profiles Messaging Connections` |
| Original local relation | `ahead 1` of `origin/main` |
| Production baseline | `origin/main` = `103808d9509b11c61dc44c48326e3f80a8a37f91` |
| Audit checkout | Detached clean worktree at `kalqlater-release/kalqlater-next-audit` |
| Production changes / deployment | None |

The audit was performed only in the clean worktree. No reset, restore, clean, merge, rebase, cherry-pick, push, deployment, Vercel change, or backend change was performed.

### Unreleased local work — not part of parity

`b8d4e2b` adds an early messaging/conversation and notification/presence foundation, a non-placeholder Messages page/service, Header navigation changes, and connection UI adjustments. Rich-profile work remains incomplete. These are future work: they must not be represented as currently deployed routes or included in the first cutover's route-parity definition.

## 3. Current architecture and crawlability findings

- **Framework:** CRA via `@craco/craco` 7.1.0 / `react-scripts` 5.0.1, React 19.0.0, React Router DOM 7.15.0.
- **Styling:** Tailwind 3.4.17, CSS custom properties, `tailwindcss-animate`, Google-hosted Outfit/Hind/Philosopher/Tiro Devanagari Hindi fonts, Lucide icons, Framer Motion 11.18.0.
- **Routing:** `BrowserRouter` in `frontend/src/App.js`; every page is `React.lazy()` loaded behind one `Suspense` fallback.
- **Backend:** FastAPI routes are mounted under `/api`; the frontend uses Axios services and `REACT_APP_BACKEND_URL` to resolve `API_URL`.
- **Auth:** a JWT is stored in `localStorage` (`kalqlater_auth_token`) and copied into an `Authorization: Bearer` header by `authService`. Session restoration calls `/api/community/me` in a browser effect.
- **Language:** English initial state, persisted browser selection in `localStorage`; translation strings and type data are held in client imports. There is no locale in the current URL.
- **SEO:** `public/index.html` contains homepage defaults. `RouteMeta`, `ComparisonSeo`, `MemberProfile`, and `JobDetail` modify head tags after client hydration. The generated sitemap lists a mix of indexable and inappropriate entries, including `/test`.
- **Critical finding:** the CRA HTML template has only `<div id="root"></div>` for every route, so it cannot meet the required raw-HTML content, metadata, canonical, social preview, or structured-data goals.

## 4. Complete production route inventory

Classification: **A** static public/indexable; **B** dynamic public/indexable; **C** public/noindex; **D** authenticated/private/noindex; **E** compatibility redirect.

| Current URL | Current component | Class | Content/API/auth | Current metadata | Next.js target / priority |
| --- | --- | --- | --- | --- | --- |
| `/` | `pages/Landing.jsx` | A | i18n plus submission count; public | global static defaults | locale static page; count client/server cached; P1 |
| `/test` | `pages/Test.jsx` | C | questions, local draft, POST submissions | global default | server shell + client assessment; noindex; P3 |
| `/result/:id` | `pages/Result.jsx` | C | submission API, browser location/local state | client `noindex` | client/private personalised page; P3 |
| `/types` | `pages/Types.jsx` | A | local 16-type data | global default | redirect to locale personality index; P2 |
| `/types/:code` | `pages/TypeDetail.jsx` | A | local bilingual type data | global default | static `/[locale]/personality/[type]`; P2 |
| `/about` | `pages/About.jsx` | A | i18n data | global default | localized static page; P1 |
| `/privacy` | `pages/Privacy.jsx` | A | i18n data | global default | localized static page; P1 |
| `/terms` | `pages/Terms.jsx` | A | inline English | global default | localized static page once Hindi copy exists; P1 |
| `/report/:id` | `pages/PremiumReport.jsx` | C | submission API / print CSS | client `noindex` | noindex client/print route; P3 |
| `/compare` | `pages/Compare.jsx` | E | query compatibility input | rewrite to `/api/legacy-compare` | redirect selected pair to localized canonical; P2 |
| `/compare/:pair` | `pages/Compare.jsx` | A | local relationship intelligence data | `ComparisonSeo` after hydration | static `/[locale]/compare/[pair]`; P2 |
| `/contact` | `pages/Contact.jsx` | A | POST `/api/contact` | global default | static content + client form; P1 |
| `/community` | `pages/community/Community.jsx` | B | paginated profile directory | global default | public, server-rendered first page/revalidated; P4 |
| `/community/me` | `pages/community/MyProfile.jsx` | D | session profile API | client noindex | client route; P5 |
| `/community/profile` | `pages/community/ProfileSetup.jsx` | D | authenticated profile CRUD | client noindex | client route; P5 |
| `/community/member/:username` | `pages/community/MemberProfile.jsx` | B | public/member visibility profile API | client Person SEO | server-render public-only view; private response client/noindex; P4 |
| `/community/connections` | `pages/community/Connections.jsx` | D | authenticated connections API | client noindex | client route; P5 |
| `/community/jobs` | `pages/community/Jobs.jsx` | B | paginated/filterable public jobs API | global default | dynamic/revalidated directory; P4 |
| `/community/jobs/new` | `pages/community/JobForm.jsx` | D | authenticated job create API | client noindex | client route; P5 |
| `/community/jobs/mine` | `pages/community/MyJobs.jsx` | D | authenticated owner job API | client noindex | client route; P5 |
| `/community/jobs/:id/edit` | `pages/community/JobForm.jsx` | D | authenticated owner job update API | client noindex | client route; P5 |
| `/community/jobs/:id` | `pages/community/JobDetail.jsx` | B/C | public job API; owner actions client | client JobPosting SEO | dynamic active public page, non-public/closed noindex; P4 |
| `/community/messages` | `pages/community/MessagesPlaceholder.jsx` | D | auth only; production placeholder | client noindex | client noindex placeholder; P5 |
| `/login` | `pages/Auth.jsx` mode login | D | auth API | client noindex | client noindex; P5 |
| `/signup` | `pages/Auth.jsx` mode signup | D | auth API | client noindex | client noindex; P5 |
| `/forgot-password` | `pages/Auth.jsx` mode forgot | D | auth API | client noindex | client noindex; P5 |
| `/reset-password` | `pages/Auth.jsx` mode reset | D | auth API/token query | client noindex | client noindex; P5 |
| `*` | `pages/NotFound.jsx` | C | none | inherited default | localized `not-found`; noindex; P1 |

**Route count:** 27 concrete routes plus one catch-all. `/community/people` is not present on deployed `origin/main`; it must not be assumed in initial parity.

## 5. Target URL, locale, canonical, and redirect policy

Use route-prefixed locales: `/en/...` and `/hi/...`. Keep every localized public document self-canonical; do not canonicalize Hindi to English. Emit reciprocal `hreflang="en-IN"`, `hreflang="hi-IN"`, and `hreflang="x-default"` (English) alternates when equivalent published translation content exists.

| Current | Proposed canonical |
| --- | --- |
| `/` | `/en` (then an explicit language choice/switcher) |
| `/types` | `/en/personality` |
| `/types/INTJ` | `/en/personality/intj` |
| `/compare/intj-vs-enfp` | `/en/compare/intj-vs-enfp` |
| `/community/jobs` | `/en/community/jobs` |
| `/community/jobs/:id` | `/en/community/jobs/:id` |
| `/community/member/:username` | recommended non-localized `/community/member/:username` |

Public member profile content is authored by members and may not have a language-equivalent representation. Keep those URLs non-localized, canonical to themselves, and label visible content with the profile language where available. Keep private/application pages unlocalized initially if that avoids duplicate private routes; locale can be persisted as a preference and applied to UI. Do not browser-language redirect bots. Root `/` can be a minimal negotiation/English landing redirect only after measuring impacts; safest initial rule is permanent redirect to `/en` for legacy public routes, with a visible language switcher rather than automatic Hindi detection.

Legacy paths should receive permanent redirects only after every target has parity. Preserve query parameters relevant to search/filter state. Redirect `/compare?type1=INTJ&type2=ENFP` to `/en/compare/intj-vs-enfp`; invalid or identical selections redirect to `/en/compare`. Personalized result/report URLs must not be redirected to public type pages because their content is private.

## 6. Rendering and data strategy

- **Static generation:** homepage, about, privacy, terms, contact shell, personality index, all 16 type pages, and every structured comparison page. Regenerate only on content releases.
- **Static + client island:** test page (semantic explanatory shell and questions intro rendered on server, interaction/draft/submission in a client component), contact form, language switcher, headers requiring auth state, Framer Motion-rich portions.
- **Dynamic server rendering/revalidation:** public job directory/detail and public profiles. Use server-side `fetch` to FastAPI with `next: { revalidate: ... }` for public data; bypass caching or use a short tag-based revalidation model for job visibility changes. Public profile data must be fetched via a deliberately unauthenticated endpoint so member-only fields cannot leak into HTML/cache.
- **Client-only/private/noindex:** result, report/PDF, auth, profile editor, connections, My Jobs, job editor, and production messages placeholder. Do not put JWT-derived private data in server-component output or shared caches.
- **Redirect:** legacy CRA URLs once the Next implementation passes parity and automatic redirect tests.

## 7. Content audit: type coverage and schema

`data/types.js` contains all 16 required codes with English and Hindi identity/name, headline, description, strengths, weaknesses, careers, and relationship text. Insight modules have code coverage for every type: leadership, communication, cognitive, growth, dashboard, and DNA. However dashboard/growth/DNA map groups of four types to shared records, and comparison data uses reusable archetype/trait logic rather than 120 individually authored pair narratives. This is useful for UI continuity but should be reviewed by content owners before it is treated as evergreen indexable editorial content.

Missing or incomplete for direct static type pages: a first-class structured schema for decision-making, learning style, FAQ entries, dedicated career pages, and dedicated relationship pages. Some richer insight areas exist only in personalized Result components and many contain client-only interaction. Do not fabricate any missing claims.

Recommended source schema:

```text
typeProfile[locale][type] = {
  slug, displayName, group, color, summary, strengths[], watchOuts[],
  workStyle, communication, leadership, decisionMaking, learningStyle,
  careerThemes[], relationshipStyle, growth, faq[]
}
comparison[locale][orderedPair] = { title, summary, sections[], faq[] }
```

Keep the data framework-neutral, validate coverage in CI, and permit a deliberate `published` flag so incomplete fields do not render as claims.

## 8. SEO, social, analytics, and structured data

`RouteMeta`, `ComparisonSeo`, `MemberProfile`, and `JobDetail` currently alter `document.head` after JavaScript runs. Replace them with Next `metadata` exports and `generateMetadata` on server-rendered public routes. Use a single `lib/seo` source for production origin, canonical constructors, Open Graph, Twitter, noindex defaults, and alternates.

- Root: WebSite and Organization JSON-LD; preserve the existing Search Console verification HTML file in `public/` exactly.
- Type/comparison: BreadcrumbList + WebPage; only FAQPage where the visible server-rendered page actually exposes those questions/answers.
- Profile: Person schema only from public fields.
- Active job: JobPosting only while active, non-expired, and publicly visible; omit owner-private details.
- Never use medical/quiz schema; never serialize illustrative/private result content into public structured data.
- Implement `app/sitemap.ts` and `app/robots.ts`; dynamic sitemap entries need a backend-safe public listing strategy, partitioning if volume grows. Exclude test, results, reports, auth, member-only/private routes, and closed/hidden jobs.
- Preserve GA4 via one client analytics provider, loaded only in production. Track pathname changes once through App Router navigation state and retain the current dedupe semantics. Do not send names, emails, usernames, answers, or message data.
- Generate route-specific OG images only after static metadata parity; use `opengraph-image` for type/comparison/job/profile where data is public. Never produce OG images for personalized results.

## 9. API/auth migration analysis

No backend replacement is required. The FastAPI inventory covers submissions, auth/password reset, profile/directory, connections, jobs/application intents, and contact. The browser service layer currently has a good boundary but assumes `localStorage` and Axios intercept-like header composition.

Public server-side fetches can call `https://kalqlater.onrender.com/api/...` using a server-only backend base URL and explicit timeouts/error mapping. Next public pages must not forward browser authorization headers by default. For authenticated pages, retain client-side JWT requests initially within `use client` components; this preserves sessions without forcing an auth rewrite, but private content cannot be SSR-authenticated.

Longer term, move FastAPI-issued session credentials to secure, `HttpOnly`, `Secure`, `SameSite=Lax` cookies with CSRF protection and a safe session endpoint. That requires coordinated backend/CORS/cookie-domain work and a migration window that accepts the existing localStorage JWT until it expires or is reauthenticated. A BFF is not necessary for phase 1–4; only introduce one if cookie/session exchange or backend-origin concealment creates a demonstrated need.

## 10. Browser-only and dependency compatibility findings

High-risk browser access exists in Auth/Lang context, Test, Result, Compare, PremiumReport, Community pages, profile/job actions, analytics, sharing/clipboard, and several Result visualizations. It includes `window`, `document`, `localStorage`, `navigator`, `location`, and browser history/search APIs. These must be client components or restrict access to effects/event handlers. `FileReader`, canvas, media queries, and third-party widgets should be rechecked during source transfer even if not used on the route's initial render.

Likely client components: Header auth controls, LangProvider, AuthProvider, Test interaction, Result/report, forms, connections, all Framer Motion interactive widgets, charts/Recharts, clipboard/share controls, analytics, and client-only metadata replacements (which should be removed for public routes). Potential server components: route shells, legal/page copy, type/comparison content, static list sections, Footer, and noninteractive cards.

Keep React, Framer Motion, Lucide, Tailwind, Radix, React Hook Form, Zod, Axios, and SWR/React Query only after usage audit. Remove CRA/CRACO/react-scripts/cra-template, React Router, and the visual-edits CRACO integration only at the final cutover. `next-themes` is present but dark-mode implementation should be verified before transferring it. Recharts is client-only and should be dynamically imported where it affects performance.

## 11. Design-system and target repository structure

Tailwind config carries the brand palette, font families (including Hindi), radii, and animations and can be copied with content globs changed to `app`, `components`, and `src`. Preserve the Header, Footer, buttons, cards, forms, and existing responsive classes with minimal edits; replace React Router `Link`/hooks only at each route boundary. Do not redesign while migrating.

```text
frontend-next/
  app/
    [locale]/
      layout.jsx
      page.jsx
      personality/[type]/page.jsx
      compare/[pair]/page.jsx
      community/jobs/page.jsx
      community/jobs/[id]/page.jsx
      test/page.jsx
      result/[id]/page.jsx
      report/[id]/page.jsx
      contact/page.jsx
    community/member/[username]/page.jsx
    api/health/route.js
    sitemap.js
    robots.js
  components/{shared,public,client}/
  data/
  lib/{api,auth,seo,i18n}/
  public/
  middleware.js
  next.config.js
```

Use a sibling app so the current Vercel project and CRA release remain untouched. Attach a new preview project or preview-only branch for validation. Do not switch the existing production project/domain until phase 6.

## 12. Phased plan

| Phase | Scope / dependencies | Testing and done definition | Risk / rollout / rollback |
| --- | --- | --- | --- |
| 0 — audit | This report, route/content inventory, API contract capture, baseline screenshots | CI inventory and content-coverage script; owner approves URL policy | Low; docs only; no rollout needed |
| 1 — foundation | sibling Next app, Tailwind/fonts/design shell, locales, static home/legal/contact, metadata/robots/sitemap/verification/GA4 | raw HTML asserts, metadata/hreflang/robots/sitemap, contact regression, visual/mobile/a11y | Medium; preview deployment only; delete preview/keep CRA |
| 2 — evergreen content | personality index/16 type pages, 120 comparisons based on approved source data, internal links | static params coverage, schema validation, source HTML, social cards | Medium; preview and canonical review; leave CRA canonical live until approved |
| 3 — assessment/results | SSR test shell/client test, result/report noindex/client flows | submissions, local resume, print/PDF, private-cache checks | High; feature flag/preview; route-level fallback to CRA |
| 4 — public community | jobs, job details, public profile/directory server fetch and revalidation | visibility/CORS/cache isolation, JobPosting/Person schema, pagination/search | High; preview against production API; retain CRA routing until parity |
| 5 — private app | auth, editor, connections, My Jobs, messages placeholder; later Phase 2 messaging after it is finished | session restore, redirect preservation, mutation/API security, noindex | Highest; client-JWT bridge first, cookie migration separately; rollback CRA |
| 6 — cutover | parity audit, redirects, existing Vercel project configuration, monitored release | full E2E, Lighthouse/CWV, 404/redirect/social/GA4 checks | High; Vercel instant rollback to CRA deployment and redirect reversal plan |

## 13. Compatibility matrix

| Feature | Current | Next target / boundary | Reuse | Risk | Backend work | Phase |
| --- | --- | --- | --- | --- | --- | --- |
| Test | client React + local storage | SSR shell/client island | High | Medium | None | 3 |
| Results | API + client state | client/noindex | High | High | None | 3 |
| Compare | client local data/SEO | static localized pages | High data, medium UI | Medium | None | 2 |
| PDF report | client print view | client/noindex print route | High | Medium | None | 3 |
| Auth | localStorage JWT | client bridge, later HttpOnly cookies | Medium | High | Cookie work later | 5 |
| Profiles | client API | server public/client private | Medium | High | public server-safe contract verification | 4/5 |
| Directory | client pagination | dynamic/revalidated public page | Medium | High | cache/visibility review | 4 |
| Jobs | client API + head effects | dynamic public/client owner actions | Medium | High | cached public contract | 4/5 |
| Connections | client JWT | client/noindex | High | Medium | None | 5 |
| Messaging/notifications | unreleased only | later, not baseline | N/A | High | complete product first | post-cutover |
| Contact | client form/FastAPI | static + client form | High | Low | None | 1 |
| Analytics | DOM gtag utility | single client provider | High | Medium | None | 1 |
| Language | localStorage context | locale route + preference | Medium | Medium | None | 1 |
| Sharing | clipboard/client head | server metadata/OG images | Medium | Medium | None | 2/4 |
| Sitemap/GSC | build script/static file | metadata routes/public asset | High | Low | public listing API only if needed | 1 |

## 14. Testing, performance, security, and cutover

### Required verification

- Route-parity E2E tests for every inventory row; redirect, invalid parameter, and 404 tests.
- Raw HTML via `curl`, parser assertions, JavaScript-disabled browser, and View Source: heading, description, canonical, alternates, links, and appropriate JSON-LD must exist before hydration.
- Schema, sitemap, robots, canonical/hreflang, social-preview, noindex, GA4 dedupe, API/CORS, mobile 320px, keyboard/a11y, and visual regression tests.
- Authenticated mutations: session restore, original-destination redirect, profile/job ownership, member-only visibility, and no private cache leakage.
- Lighthouse/CWV targets: LCP <2.5s p75, INP <200ms p75, CLS <0.1 p75; establish CRA bundle and route-level transfer-size baselines before setting page budgets. Analyze production build output; dynamically load charts and noncritical animations.

### Security and privacy rules

Never cache authenticated/server-rendered private content; use `no-store` for private server fetches. Never render localStorage JWTs in HTML, pass them to public server fetches, index result/report/private routes, or include private fields in JSON-LD/OG/analytics. Filter public member/job API responses server-side before SSR. Maintain strict server/client environment separation: public browser variables are `NEXT_PUBLIC_*`; FastAPI/internal config remains server-only.

### Eventual Vercel cutover

Create a new preview-only Next deployment first, with independent environment values and no production-domain change. Keep Render unchanged. After all phases pass, either change the existing Vercel project's root directory/build settings in a scheduled release or connect the approved Next project to the production domain. Preload redirect mappings, verify cache headers and canonical origin, submit the new sitemap, and monitor 404s/CWV/Search Console. Preserve the last healthy CRA deployment and a documented one-click Vercel rollback; do not delete CRA until a full post-release observation window passes.

## 15. Risks, estimates, and immediate next task

Highest risks are: localStorage JWT versus SSR/private caching, dynamic public-profile visibility, personalized result/report privacy, locale URL canonical change, the current client-only metadata, and incomplete localized evergreen content. The current PostHog snippet and third-party visual-edit script in `public/index.html` also need an explicit consent/performance review before transfer; do not automatically copy browser scripts into server layouts.

Indicative effort, after design/content approval: Phase 1 one to two weeks; Phase 2 two to three weeks; Phase 3 one to two weeks; Phase 4 two to three weeks; Phase 5 two to four weeks; Phase 6 one to two weeks. Actual timing depends on tests, content approval, and whether cookie auth is bundled with private-route migration.

**Recommended immediate next task:** create a dedicated preview-only `frontend-next` scaffold on a new branch/worktree, with no production routing change, and implement only Phase 1 plus automated raw-HTML metadata tests. Before that, the owner must approve the locale/canonical policy (particularly legacy `/` and nonlocalized public profile URLs) and confirm whether all 16 type/comparison texts are approved for indexable SEO pages.

## 16. Completion confirmation

This plan was created from `origin/main` at `103808d9509b11c61dc44c48326e3f80a8a37f91`. The local Community Phase 2 commit remains untouched and was not migrated. No production code was changed, pushed, or deployed.
