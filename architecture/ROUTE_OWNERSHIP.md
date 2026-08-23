# KalQLater Route Ownership Contract

Audited at commit `6ca8b91`. This document and `route-registry.json` describe current behavior; they do not activate, redirect, or remove routes.

## Authority rules

1. `frontend-next` owns localized public knowledge, current assessment UI, Insights, the external Jobs marketplace, and the transitional Dashboard.
2. `legacy-frontend` owns authentication and functional Community until their planned migration.
3. `backend` owns APIs and data contracts, never a crawlable product page.
4. The current localized route is the canonical owner whenever a legacy and current public content route overlap.
5. A route may become indexable only after the SEO release policy passes.
6. Route existence, locale publication, content localization, API availability, sitemap presence, and CTA exposure are separate decisions.

## Current ownership summary

| Product area | Current owner | Legacy overlap | Target owner | Status |
|---|---|---|---|---|
| Home | frontend-next | legacy root | frontend-next | current |
| Personality test/result | split | `/test`, `/result/:id`, `/report/:id` | frontend-next plus durable backend | duplicate, P0 |
| Personality guides | frontend-next | `/types`, `/types/:code` | frontend-next | current; exact `/types` duplicate |
| Compare | frontend-next | legacy aliases | frontend-next | redirects substantially complete |
| Insights | frontend-next + backend | none | same plus account claiming | current/transitional |
| Careers | frontend-next | none | frontend-next under a Careers hub | current content, missing hub |
| Community | legacy-frontend | current localized landing | frontend-next | transitional |
| Jobs | frontend-next + backend | legacy Community Jobs | frontend-next + backend | duplicate product meaning |
| Auth | legacy-frontend + backend | none | frontend-next + backend | legacy |
| Dashboard | frontend-next | browser activity state | account-backed frontend-next | transitional |
| About | legacy-frontend | none | frontend-next | legacy |
| Contact/legal | both | root and localized routes | frontend-next | duplicate |

## Route-family inventory

The machine-readable registry contains 47 route families. Families group routes only when their ownership, access, SEO behavior, data source, and migration plan are the same. The four Insights analyzers and the 120 Compare pairs remain individually governed by their entity/publication registries.

### Current localized public knowledge

- `/{locale}`
- `/{locale}/types`
- `/{locale}/personality/{type}`
- `/{locale}/personality/{type}/careers`
- `/{locale}/compare`
- `/{locale}/compare/{pair}`
- `/{locale}/insights`
- `/{locale}/insights/{analyzer}`
- `/{locale}/community` (landing only)
- `/{locale}/jobs`
- `/{locale}/jobs/{slug}`
- `/{locale}/contact`, `privacy`, and `terms`

### Current private or noindex product flow

- `/{locale}/test`
- Insights start, session, and result routes
- Jobs profile, saved, and applications
- Dashboard
- Editorial localization workbench

### Legacy-owned functionality

- Personality test/result/report
- Community directory, own profile, member profiles, connections, and messages placeholder
- Community Jobs browse/post/manage/apply-intent
- Login, Signup, recovery, and reset
- About
- Root Contact, Privacy, and Terms

### Backend API families

- Personality submissions/statistics
- Authentication
- Community profiles/connections/legacy jobs
- Current Jobs marketplace and candidate activity
- Analyzer sessions/results
- Localization review and QA operations
- Contact delivery

## Target information architecture

```text
PUBLIC KNOWLEDGE
/{locale}
├── personality
│   ├── {type}
│   └── {type}/careers
├── compare
│   └── {pair}
├── insights
│   └── {analyzer}
├── careers                    (target hub; not implemented)
├── jobs
│   └── {slug}
└── community

PRIVATE PRODUCT
/{locale}/account
├── dashboard
├── profile
├── assessments
├── connections
└── jobs
    ├── profile
    ├── saved
    └── applications
```

Existing high-value canonical URLs, especially type career guides, should not be changed merely to make the tree visually uniform.

## Target internal-link graph

```text
Home
├── Personality hub → Type guides → Career guides → Jobs
│                       ↕
│                    Compare hub ↔ Compare pairs
│                       ↘
│                        Insights hub → Analyzer landings
├── Careers hub → Career guides → Jobs
├── Community → public profiles → account/connection action
└── Jobs → job details → career-profile improvement when relevant
```

Linking requirements:

- Every indexable page must have a declared parent hub.
- Every indexable child should normally be reachable within three meaningful clicks from Home.
- Type guides link to their career guide, relevant Compare pairs, and Insights.
- Career guides pass role/search intent into Jobs rather than linking only to an unfiltered directory.
- Insight pages may link to relevant personality or career education, without implying diagnosis or deterministic fit.
- Jobs may suggest profile completeness or career education; it must not use personality as a hiring gate.
- Community links to account/profile only when authentication or editing is required.

## Current weak or orphan-prone routes

| Route | Condition | Required target |
|---|---|---|
| `/{locale}/jobs/saved` | Weakly surfaced | Account/Jobs navigation |
| `/{locale}/dashboard` | Not an authoritative activity hub | Account-backed Dashboard |
| `/community/messages` | Placeholder with no real data | Remove or defer |
| `/report/:id` | Legacy result-only entry | Current durable result/report |
| `/{locale}/personality/{type}/careers` | No Careers parent hub | Add Careers hub while preserving URL |
| Active job details | Listing-only discovery; absent from sitemap | Dynamic job sitemap and related links |
| Public Community member profiles | Legacy and blanket noindex | Keep private until opt-in quality policy exists |
| `/about` | Legacy-only CSR page | Localized current page |

## Canonical and redirect rules

- `/` permanently redirects to `/en`.
- Valid `/types/:code` routes permanently redirect to the localized current personality guide.
- `/compare` and valid pair aliases permanently redirect to current canonical Compare routes.
- Reverse localized Compare pairs permanently redirect to registry order.
- No further redirect is authorized by this Phase 0 contract.
- Assessment and result redirects must wait for functional/data parity.
- Legal redirects must wait for content-owner confirmation.
- Legacy Community and Jobs redirects must wait for data and action parity.

## P0/P1 SEO impact matrix

| Action | SEO impact | User impact | Technical risk | Migration risk | Crawl/indexation gain | Internal-link gain | Duplicate reduction | Structured-data impact |
|---|---|---|---|---|---|---|---|---|
| Canonical personality assessment/result | High | Very high | High | High | Removes conflicting assessment URLs | High | Very high | Medium |
| Durable account-claimable results | Low | Very high | High | Medium | Neutral | Medium | Medium | Low |
| Canonical profile ownership | Low | Very high | Medium | High | Neutral | Low | High in data layer | None |
| Redirect/noindex legacy public duplicates | Very high | Medium | Medium | Medium | Strong canonical consolidation | Medium | Very high | Low |
| Correct FR/JA schema language | High | Medium | Low | Low | Better language interpretation | Low | Low | High |
| Fix Jobs failure-state SEO | High | High | Medium | Medium | Prevents false empty pages | Low | Low | Medium |
| Current localized Auth | Medium | Very high | High | High | Better locale continuity; private routes stay noindex | Medium | Medium | None |
| Progressive profile onboarding | Low | Very high | Medium | Medium | Neutral | Medium | High in profile UX | None |
| Account-backed Dashboard | Low | Very high | High | Medium | Neutral | High for private journeys | Medium | None |
| Careers hub | High | High | Medium | Low | New strong hub and crawl path | Very high | Low | Medium |
| Career intent transfer to Jobs | Medium | High | Medium | Low | Stronger semantic journey | High | Low | Low |
| Fully localized Jobs metadata/UI | High | High | Medium | Medium | Makes locale URLs defensible | Medium | High | High |
| Active-job sitemap | High | Medium | Medium | Medium | Faster, more complete discovery | High | Low | High |
| Unified navigation | Medium | High | Medium | Low | Clearer crawl hierarchy | Very high | Medium | Low |

## Documentation drift

- `lib/locales.js`, manifests, and content entities publish FR/JA; runtime-policy comments and preview lists still describe their earlier preview lifecycle.
- Insights/Discovery schemas use EN/HI-only language branching.
- Jobs are sitemap-visible for four locales but visibly localized only in English.
- Dashboard uses EN/HI static parameters despite four published language routes elsewhere.
- All Insight landing entities are public for FR/JA, while the backend enables FR/JA assessment sessions only for Communication.
- `/{locale}/types` is indexable but absent from the sitemap.
- Job details are indexable while absent from the sitemap.
- Legacy private result/report routes rely on client metadata rather than the proxy-level noindex used for Community/Auth.

## Change-control checklist

Every route change must update, or explicitly confirm no change to:

1. `route-registry.json`
2. `locale-registry.json`
3. `legacy-migration-registry.json`
4. `SEO_RISK_REGISTER.md`
5. Canonical/hreflang/sitemap/schema behavior
6. Authentication and data ownership
7. Parent and child internal links
8. Failure and expiry behavior

