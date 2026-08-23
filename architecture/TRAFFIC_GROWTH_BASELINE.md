# KalQLater Traffic Growth Baseline

This baseline describes P0 implementation batch 1. It does not invent demand, rankings, or traffic forecasts; Search Console must supply those inputs before the 100K monthly-organic target is allocated by cluster and locale.

## Existing organic page families

- Personality: localized Types hub plus 16 type guides per published locale.
- Compare: localized hub plus 120 canonical pair pages per locale.
- Careers: 16 localized type-career guides per locale; no dedicated Careers hub yet.
- Insights: localized hub and four analyzer landings; sessions/results remain private and noindex. Communication runs in EN/HI/FR/JA; Conflict, Leadership, and Learning run in EN/HI only.
- Jobs: English directory and active details are indexable. HI/FR/JA routes remain usable but noindex until genuinely localized.

## Current scale and discovery

The sitemap contains 657 canonical URLs: 12 shared static/hub paths across four locales, one English Jobs directory, 64 personality guides, 64 career guides, and 480 comparisons. Types contributes four newly covered hub URLs. Job details are not yet in the sitemap.

Static pages omit `lastmod` because no trustworthy page-level authored dates exist. This is preferable to artificial build-time freshness. A future Jobs sitemap may use a documented inventory timestamp such as `last_verified_at`.

The major public families have no strict orphan routes in the source graph. Compare and Personality have strong hub coverage. Careers is weakest because it has no hub. Active Job details depend on the directory. FR/JA contextual recommendation coverage is weaker than EN/HI. The modeled average meaningful hub depth for sitemap URLs is about 2.04 clicks (home 0; hubs 1; Personality/Compare/Insights landings 2; Careers 3). This batch keeps modeled depth stable while improving Types and locale discovery.

Existing recommendation blocks already connect personality → career/Compare/Insights, career → Jobs/Insights, Compare → both personality types, and Insights → related exploration. Duplicating those sections would add noise rather than value.

Known blockers are legacy/current duplicate ownership, absent active-job sitemap coverage, incomplete non-English Jobs UI, the missing Careers hub, legacy auth continuity, and incomplete FR/JA assessment capability outside Communication.

## 100K traffic model

Growth should come from measured optimization of existing pages, stronger hubs, useful contextual links, genuine multilingual parity, later Careers expansion, fresh verified Jobs inventory, Search Console opportunity mining, and evidence-led refresh cycles. Do not allocate forecasts until query/page impressions, clicks, position, and indexation data are available.

First levers: improve high-impression low-CTR snippets; strengthen Careers discovery; add eligible active Jobs to a timestamp-trustworthy sitemap; resolve legacy duplicate ownership after parity; complete Jobs localization before exposing locale variants; and refresh pages where query evidence shows intent gaps.

## KPIs

SEO: organic clicks, impressions, CTR, average position, indexed canonicals, discovered-not-indexed, crawled-not-indexed, non-brand clicks, and clicks by cluster and locale.

Engagement: assessment start/completion rates, landing-to-deeper-content rate, type-to-career CTR, career-to-Jobs CTR, and Insight start rate.

Jobs: directory-to-detail CTR, save rate, and apply-click rate.

Retention: signup conversion, returning authenticated users, and saved-result claims.

The existing analytics stack distinguishes normalized page/organic landing routes, guide/career/Compare/Insight views, assessment start/completion and answer latency, job detail views, saves, applies, recommendation journeys, and bookmarks. Signup start/completion remain on the legacy auth surface and must be preserved and reconciled next.

## Next batch: auth, signup, and login smoothing

Keep the backend auth API while moving UI from legacy React into locale-aware `frontend-next` routes. Introduce a server-managed Secure, HttpOnly, SameSite cookie session rather than expanding localStorage JWT usage. Validate return targets against allowlisted same-origin localized routes.

Flow: interrupted guest action → localized login/signup → minimum credentials → server session → validated original action. Resume Jobs save/apply and Insights result claiming through short-lived server-side continuation state. Defer skills, LinkedIn, role, and career enrichment to progressive profile completion using canonical profile fields. Defer Community username until first Community participation.

Auth, recovery, account, and continuation routes stay noindex and outside sitemap/hreflang. Expected files are new `frontend-next/app/[locale]/(auth)` routes, shared auth/session helpers and middleware, Jobs/Insights continuation adapters, focused API/session tests, and route/profile registry updates. Blockers are legacy JWT/localStorage, cross-shell returns, cookie issuance/rotation, and result-claim ownership.
