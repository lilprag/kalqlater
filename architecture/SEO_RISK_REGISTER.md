# KalQLater SEO Risk Register

Audited at commit `6ca8b91`. Severity reflects current production exposure, not implementation effort.

P0 batch 1 note: SEO-004, SEO-005, SEO-008, SEO-009, and SEO-010 are mitigated in the current working tree. SEO-006 is contained by noindexing and removing sitemap/hreflang eligibility for HI/FR/JA Jobs. SEO-007 and redirect-dependent duplicate risks remain open.

| ID | Issue | Affected URLs | Severity | SEO impact | User impact | Recommended action | Target phase | Validation method |
|---|---|---|---|---|---|---|---|---|
| SEO-001 | Two personality assessment architectures | `/test`, `/{locale}/test` | Critical | Conflicting intent, indexability, content and canonical ownership | Different results/persistence by entry | Establish one durable current assessment; no redirect before parity | Phase 1 | Route tests, rendered robots, canonical crawl, result parity E2E |
| SEO-002 | Exact legacy Types hub not redirected | `/types` vs `/{locale}/types` | High | Duplicate hub and split link equity | Different shell/content | Add locale-aware 308 after release approval | Phase 1 | HTTP redirect tests and Search Console consolidation |
| SEO-003 | Root legal/contact duplicates | `/contact`, `/privacy`, `/terms` and localized equivalents | High | Duplicate content and ambiguous canonical owner | Cross-shell inconsistency | Approve content parity then 308 roots | Phase 1 | Header/canonical tests and indexed-URL monitoring |
| SEO-004 | Legacy private results rely on client noindex | `/result/:id`, `/report/:id`, `/premium-report/*` | High | Private/thin URLs may be crawled before SPA metadata runs | Privacy and broken-result risk | Add server/proxy X-Robots-Tag before result migration | Phase 1 | Raw HTTP header test without JS |
| SEO-005 | FR/JA schema language drift | FR/JA Home, Insights and DiscoveryLanding pages | High | Search engines receive incorrect `inLanguage` | Reduced trust in localized experience | Use locale registry/hreflang language values consistently | Phase 1 | Inspect rendered JSON-LD; schema validator |
| SEO-006 | Jobs localized URLs contain English UI/metadata | `/hi/jobs*`, `/fr/jobs*`, `/ja/jobs*` | Critical | Duplicate/low-quality localized pages and incorrect language targeting | Locale promise is broken | Mark SEO_BLOCKED or fully localize before indexation | Phase 4 | Visible-string inventory, HTML lang, metadata, hreflang review |
| SEO-007 | Active job details absent from sitemap | `/{locale}/jobs/{slug}` | High | Slow or incomplete discovery of short-lived inventory | Fewer discoverable opportunities | Generate active-job sitemap with real timestamps | Phase 4 | Sitemap URL/API reconciliation and crawler test |
| SEO-008 | Types hub absent from sitemap | `/{locale}/types` | Medium | Hub receives weaker discovery signal | Minimal direct UX impact | Add after canonical decision; use real lastmod | Phase 1 | Sitemap assertion |
| SEO-009 | Fake sitemap freshness | All generated sitemap entries | High | Every URL appears newly changed on each generation | None directly | Use content/build/source timestamps, not `new Date()` | Phase 1 | Compare unchanged sitemap across builds |
| SEO-010 | Jobs API failure becomes empty 200 directory | `/{locale}/jobs` | High | Outage may be indexed as an empty marketplace | Users see no roles instead of failure | Distinguish API error from valid zero results; define status/cache policy | Phase 1 | Fault injection and rendered response assertion |
| SEO-011 | Inactive job lifecycle is not fully defined | `/{locale}/jobs/{slug}` | High | Stale JobPosting/index bloat or inconsistent removal | Users reach unavailable roles | Define active, expired, archived, 404 and 410 states; remove schema when inactive | Phase 4 | Time-based E2E and rich-result validation |
| SEO-012 | Community public profiles blanket-noindexed | `/community/member/:username` | Medium | No future people/profile discovery value | Safe now, but localized landing overpromises directory | Keep blocked until opt-in consent and quality thresholds exist | Phase 5 | HTTP robots, consent, completeness and deletion tests |
| SEO-013 | Public legacy SPA routes are client-rendered | `/about`, `/test`, `/types`, root legal/contact | High | Weaker metadata/rendering and inconsistent crawler responses | Slower, inconsistent experience | Migrate or redirect to current SSR routes | Phases 1 and 6 | Fetch HTML without JS; redirect coverage |
| SEO-014 | Job page metadata lacks hreflang contract | `/{locale}/jobs`, `/{locale}/jobs/{slug}` | High | Locale variants are not explicitly related at page level | Locale switching can be inconsistent | Adopt central metadata contract after localization readiness | Phase 4 | Metadata snapshot for all published locales |
| SEO-015 | Insight publication exceeds analyzer API locales | FR/JA Conflict, Leadership, Learning landing/start routes | High | Indexable landing can lead to unavailable conversion flow | Users hit unavailable assessments | Separate content publication from assessment-enabled CTA; align registry and visible actions | Phase 1 | Per-analyzer locale matrix and 200/422 E2E |
| SEO-016 | Locale lifecycle sources communicate different states | FR/JA locale registry, runtime policy comments/lists, manifests, entity registry | High | Future tooling may publish or block the wrong URLs | Release operators lack one truth | Make one registry authoritative in later implementation; validate all consumers | Phase 1 | Automated registry consistency check |
| SEO-017 | Localized Community CTA enters EN/HI legacy product | `/fr/community`, `/ja/community` → `/community` | Medium | Search landing language and destination diverge | Abrupt locale/shell change | Keep landing clear; migrate functional Community before stronger conversion claims | Phase 5 | Locale-preservation E2E |
| SEO-018 | Dashboard locale support contradicts global publication | `/fr/dashboard`, `/ja/dashboard` | Low | Private/noindex, so little crawl impact | Published-locale users lack parity | Keep noindex and add only during account migration | Phase 3 | Route availability and auth E2E |
| SEO-019 | Footer exposes only one alternate locale | All current public pages | Medium | Weaker crawlable cross-locale discovery than declared hreflang | Users cannot readily choose every language | Present all published eligible locales | Phase 1 | Link graph crawl and locale-switch test |
| SEO-020 | About has no current localized owner or sitemap entry | `/about` | Medium | Company/brand intent remains legacy and monolingual/bilingual | Cross-shell navigation | Migrate localized About, then redirect legacy | Phase 6 | Canonical, hreflang and sitemap assertion |
| SEO-021 | Active job detail can become 404 on upstream failure | `/{locale}/jobs/{slug}` | Medium | Temporary backend outage looks like content removal | Users lose a valid opportunity | Distinguish not-found from dependency failure | Phase 1 | Fault injection for 404 versus 5xx/retry state |
| SEO-022 | Missing Careers hub | Career guide family | High | Valuable children lack a dedicated intent-owning parent | Career discovery is indirect | Add `/{locale}/careers` after content/SEO design approval | Phase 4 | Three-click crawl, hub schema and sitemap test |

## Highest-risk dependencies

1. Assessment redirects depend on durable result parity.
2. Localized Jobs indexability depends on actual UI localization and a source-content language policy.
3. Community profile indexability depends on consent, completeness, privacy, deletion, and stable canonical ownership.
4. Legacy Jobs retirement depends on a product decision for member/employer posting data.
5. Locale publication depends on route, content, API, CTA, metadata, sitemap, and schema agreement—not any single boolean.

## Risk closure rule

A risk may be marked closed only when its validation method passes in rendered production-like output. A code change or configuration flag alone is not closure.
