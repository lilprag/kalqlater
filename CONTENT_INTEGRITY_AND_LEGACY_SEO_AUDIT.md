# Content Integrity and Legacy SEO Audit

Audit date: 2026-08-09
Scope: `nextjs-migration` only. No backend, engine, environment, proxy-origin, Render, or deployment changes were made.

## Executive finding

The reported duplication was confirmed as a content-model and renderer problem, not three isolated editorial mistakes. The local corrective work separates relationship contexts, gives role cards structured role-level content, and assigns Compare decision behaviour at the personality-type level. The legacy SEO observations were independently confirmed against current production and are documented as a follow-up strategy, not changed in this sprint.

## 1. Confirmed root causes

### Personality Guides

`frontend-next/app/[locale]/personality/[type]/page.jsx` rendered all four cards—Friendship, Romantic relationships, Family, and Teamwork—from `p.relationshipStyle`. `personalityProfile()` populated that value from one field: `data/types.js → TYPES[type][locale].relationships`.

There were no context-specific source fields and no wrong-field selection: the schema had one general relationship summary and the renderer deliberately repeated it four times. This affected all 16 types in English and Hindi: **32 pages and 128 visible context cards**.

Fix: `data/personality-contexts.js` supplies four substantive, semantically distinct fields per type and locale. The personality renderer now selects the matching context, retaining the former general summary only as a defensive legacy fallback.

Before (INTJ, every context): “Architects want deep, intellectual relationships…”
After: friendship covers shared ideas and a small trusted circle; romance covers affection and expectations; family covers autonomy and obligations; teamwork covers strategy, meeting purpose, and critique.

### Career Guides

`data/career-guides.js` held only six type-level values: a lens, translated lens, 12 role labels, translated labels, one skill, and translated skill. `CareerGuide.jsx` then applied `guide.lens` and `guide.skill` to the featured role cards, explorer entries, comparison rows, work settings, formats, skills, stages, and industries.

Unique role copy did not exist, so this was primarily a schema/content-generation gap (with renderer-level amplification), not a dormant content field or an accidental fallback. It affected **32 Career Guides, 384 role entries, and 32 each of the stage, industry, and work-setting collections**.

Fix: every listed role now resolves to structured `reason`, `demand`, and `skill` content. The role-specific focus derives from the work itself (for example, coding and edge-case testing for software engineering; evidence and uncertainty for data science; public consequence and implementation for policy work). Industry, career-stage, work-format, work-setting, and skills sections now cite the guide’s particular role directions instead of echoing one generic type lens.

### Compare V2

`data/comparison.js` assigned `decisionA` and `decisionB` from `decisionLenses[group]`. Types in the same broad group therefore received the same decision sentence—for example INTJ and INTP both inherited the strategist sentence.

This was a group-level source model being used in a section that requires personality-level contrast. It affected same-group canonical pairs: 24 English/Hindi pages (12 canonical pair paths × 2 locales) had identical A/B decision reasoning; broader pair content remains intentionally pair/group-informed where that is a legitimate high-level interaction observation.

Fix: `typePatterns` provides distinct bilingual decision reasoning for every type. Compare retains group-level relationship dynamics for the pair label and shared attraction/conflict framing, but each side’s decision paragraph now comes from its own type pattern.

## 2. Programmatic duplication audit and safeguards

New `frontend-next/scripts/check-content-integrity.mjs` renders and inspects all generated local pages:

| Content family | Scope checked | Protection |
| --- | --- | --- |
| Personality relationship cards | 16 types × 2 locales | Exactly four substantive cards; normalized text must be unique within the page. |
| Career roles | 16 types × 2 locales × 12 roles | Every role must expose reason, demand, and skill; normalized reasons and challenges must be unique within that guide; old type-lens fallback phrase is forbidden. |
| Compare decisions | 120 canonical pairs × 2 locales | Both types must be visible in the decision section and the normalized A/B statement may not be identical. |

Normalization lowercases text and removes HTML, punctuation, symbols, and whitespace so cosmetic variations cannot bypass a failure. It intentionally does not police standard navigation, disclaimers, CTA labels, or the rationale for avoiding compatibility percentages.

Current local result: **32 Personality Guides, 32 Career Guides, and 240 localized Compare pages pass**.

## 3. Sitemap production audit

Production endpoint: `https://kalqlater.com/sitemap.xml`

| Check | Evidence | Result |
| --- | --- | --- |
| Status | HTTP 200 | Pass |
| Content-Type | `application/xml` | Pass |
| Content-Disposition | `inline; filename="sitemap.xml"` | Informational |
| Encoding / parse | Standard XML parser successfully parsed the document | Pass |
| URL count | 322 `<url>` entries | Pass |
| Bare root | `https://kalqlater.com` absent | Pass |
| Localized roots | `/en` and `/hi` present | Pass |
| Legacy noindex routes | `/community`, `/community/jobs` absent | Pass |

No sitemap change is warranted. The external parse concern could not be reproduced.

## 4. Raw hreflang production audit

Raw production HTML includes alternate links serialized as `hrefLang` (React’s valid attribute casing). A standard HTML parser normalizes this to `hreflang` and found exactly one `en`, `hi`, and `x-default` link on each tested page. `x-default` consistently targets English.

Checked reciprocal pairs: `/en` + `/hi`; INTJ personality; INTJ Career Guide; INTJ/INTP Compare; Insights hub; Community discovery; Jobs discovery.

Representative parsed links for `/en/personality/intj`:

* `en → https://kalqlater.com/en/personality/intj`
* `hi → https://kalqlater.com/hi/personality/intj`
* `x-default → https://kalqlater.com/en/personality/intj`

No hreflang source change is warranted. Attribute casing alone is not an HTML semantic defect.

## 5. Legacy route audit: current production

All five routes returned a CRA shell (`You need to enable JavaScript to run this app`), no meaningful raw H1, no route-specific SSR content, and generic homepage title/description/canonical. They are therefore interactive legacy routes, not discovery pages.

| Route | Status | Canonical | X-Robots-Tag | Classification |
| --- | --- | --- | --- | --- |
| `/test` | 200 | `https://kalqlater.com/` | `noindex` | B — interactive application route |
| `/types` | 200 | `https://kalqlater.com/` | `noindex` | C — legacy directory/application route |
| `/about` | 200 | `https://kalqlater.com/` | `noindex` | C — legacy informational route |
| `/community` | 200 | `https://kalqlater.com/` | `noindex, nofollow` | B — legacy community application; localized SSR discovery pages already exist |
| `/community/jobs` | 200 | `https://kalqlater.com/` | `noindex, nofollow` | B — legacy jobs application; localized SSR discovery pages already exist |

The generic canonical is not an indexing issue while these routes remain noindex. It would become a problem only if their directives changed. No automatic redirect was made because the interactive test and legacy directory are still required.

## 6. `/test`, `/types`, and `/about` recommendation

Do not risky-migrate these routes in this content sprint.

1. Keep `/test` as the interactive, noindex CRA application until the actual test flow has a fully tested localized Next host or wrapper that can hand off state without breaking assessment sessions.
2. Add future SSR discovery routes `/en/types` and `/hi/types` that explain the framework and link to canonical Personality Guides; retain `/types` only for the interactive legacy directory until parity is proven.
3. Add future SSR `/en/about` and `/hi/about`, then redirect or demote `/about` once those pages carry equivalent public content.

This preserves working application behaviour and prevents indexability changes from disguising an incomplete migration.

## 7. Navigation and metadata findings

Next Header/Footer already use localized canonical links for Compare, Insights, Community, Jobs, Contact, legal pages, and language switching. Take Test, 16 Types, and About intentionally point to legacy routes through `productionAppUrl()`; this matches the staged hybrid architecture above. Login and Signup are application destinations rather than public discovery pages.

The sitemap-wide production crawl covered all 322 URLs: 0 non-200 responses, 0 missing titles, 0 missing descriptions, 0 missing canonicals, 0 missing H1s, 0 unexpected noindex directives, 0 duplicate title groups, and 0 duplicate description groups. No route in the sitemap had a canonical mismatch.

## 8. Validation

* `npm run lint` — pass, 0 warnings/errors.
* `npm run build` — pass, all 330 generated pages compiled.
* `npm test` — pass: existing content coverage, new content-integrity audit, and crawlability suite.
* `git diff --check` — pending final check before commit.

## 9. Remaining legitimate repetition and follow-up work

* Standard disclaimers, navigation, CTA labels, framework labels, and the no-percentage explanation repeat intentionally.
* Type-level career lenses remain as a high-level orientation, but no longer substitute for role-card reasoning.
* Pair-level attraction/conflict and relationship guidance deliberately remain group-informed. A future editorial pass can introduce richer pair-specific relationship, conflict, friendship, workplace, and FAQ prose; this is not a routing or metadata blocker.
* Legacy `/test`, `/types`, and `/about` need a separately scoped SSR migration/redirect decision before they should be considered public SEO discovery destinations.

## Conclusion

The P0 templated content defects identified in Personality, Careers, and Compare are corrected locally with automated regression safeguards. Sitemap and hreflang concerns were not reproduced in production. The outstanding work is a deliberate hybrid-migration decision for legacy noindex application routes, not a release-blocking technical SEO defect for currently indexed pages.
