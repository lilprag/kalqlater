# KalQLater SEO Release Policy

This policy applies to every route family and every locale. It is a release contract, not a suggestion.

## Release statuses

| Status | Meaning | Allowed discovery behavior |
|---|---|---|
| `SEO_BLOCKED` | Content, localization, data, ownership, or technical SEO is incomplete | Noindex; excluded from sitemap/hreflang/navigation claims that imply availability |
| `SEO_READY` | All checks pass in staging/production-like validation, but public activation is not approved | Remains non-public until explicit release decision |
| `INDEXABLE` | Approved public canonical page | Index/follow, canonical, sitemap and eligible hreflang/schema active |
| `NOINDEX_PRIVATE` | Authenticated, token-protected, personalized, result, session, internal, or otherwise non-search route | Noindex, excluded from sitemap and public hreflang |
| `REDIRECT_ONLY` | Compatibility URL with one approved canonical replacement | Server-side permanent redirect; never render a competing page |

## Required questions for every new indexable route

1. What unique search intent does it own?
2. What is its exact canonical URL pattern?
3. Which parent hub owns it?
4. Which pages link to it?
5. Which useful pages does it link to?
6. Is it included in the correct sitemap?
7. Which locales are genuinely eligible for hreflang?
8. Which schema type applies, and is every property supported by visible/current data?
9. Is there a legacy, query, parameter, reverse-order, or otherwise duplicate URL?
10. What response and visible page occur if the API or data source fails?
11. Does the server-rendered HTML contain meaningful localized content without client execution?
12. What is the expiry, archive, 404, 410, or redirect policy if the page is dynamic?

If any answer is missing, the route is `SEO_BLOCKED`.

## Mandatory technical gate

### Ownership

- One product owner and one canonical route owner are registered.
- Legacy equivalents and redirect dependencies are documented.
- Authentication and privacy classification are explicit.

### Search intent and content

- The page answers a distinct intent better than an existing page.
- Title, description, H1, body, controls, empty states, and errors are localized.
- Content is substantial enough to stand without boilerplate from sibling pages.
- Page purpose does not conflict with its parent or child routes.

### Canonical and status behavior

- A successful canonical page returns 200.
- Invalid entities return a true 404.
- Removed dynamic entities follow the approved 404/410/archive rule.
- Duplicates return a server-side permanent redirect or an approved canonical/noindex response.
- Private/session/result pages have server-rendered or HTTP-level noindex.
- API failure is distinguishable from valid empty data and missing content.

### Localization

- Locale registry, content package, entity availability, API capability, CTA state, metadata, sitemap and schema agree.
- No visible frontend-owned string falls back to English on a non-English indexable page.
- Source data that cannot be localized, such as employer-authored jobs, has an explicit language policy.
- HTML language, metadata locale, `inLanguage`, and hreflang codes are correct.
- `x-default` resolves to the approved default equivalent.

### Sitemap and internal linking

- The canonical URL is included exactly once if sitemap-eligible.
- `lastmod` reflects a real content/data change.
- The page is linked from its registered parent hub.
- Important pages are normally within three meaningful clicks of Home.
- Children and relevant lateral pages receive descriptive links.
- Expired/noindex/redirect URLs are excluded.

### Structured data

- Schema type matches visible page purpose.
- Data values match rendered content and current state.
- Breadcrumbs follow the registered hierarchy.
- JobPosting appears only for active eligible roles.
- Schema language is correct for every locale.
- Validation passes without critical errors.

### Rendering and quality

- The page has meaningful server-rendered HTML.
- Core metadata is present without client JavaScript.
- Loading, empty, error, unavailable, and expired states are intentional.
- Accessibility and mobile rendering pass the product release bar.
- Analytics do not expose private assessment or authentication credentials.

## Dynamic-page failure policy

| Condition | Required behavior |
|---|---|
| Valid entity, healthy data | 200 canonical page |
| Valid query with zero results | 200 useful empty state; directory remains meaningful |
| Dependency unavailable | Retry/error response appropriate to architecture; never silently claim no inventory |
| Unknown entity | 404 with noindex |
| Permanently removed entity | 410 or 404 according to approved family policy |
| Replaced entity/URL | 308 to closest equivalent, never an unrelated hub merely to avoid 404 |
| Inactive job retained for user value | 200 noindex, no JobPosting schema, clear unavailable state |
| Expired job removed | 404/410 and removal from job sitemap |

## Hreflang eligibility

A locale is eligible only when:

- The route is public in that locale.
- The content and visible UI are localized.
- Any required API supports the locale.
- The primary CTA does not lead to an unavailable or materially different-language product.
- Metadata and structured-data language are correct.
- The locale version is canonical and indexable.

Noindex, private, preview, draft, incomplete, and fallback-only pages must not be advertised as public equivalents.

## Legacy release gate

Before redirecting a legacy route:

1. Functional parity or an explicitly approved disposition exists.
2. Existing identifiers and deep links have a mapping.
3. Authentication and return targets survive.
4. Locale selection survives.
5. Data migration or archival is complete.
6. Canonical and sitemap updates deploy atomically with the redirect.
7. Backlinks and production traffic are measured.
8. Rollback behavior is known.

## Approval evidence

An `SEO_READY` or `INDEXABLE` change must include:

- Registry updates.
- Rendered metadata and HTTP-status snapshots.
- Sitemap/hreflang assertions.
- Structured-data validation where applicable.
- Internal-link crawl evidence.
- Failure-state tests.
- Locale completeness evidence.
- Product/content approval for search intent and copy.

## Review cadence

- Review the registries with every route, locale, auth, profile, assessment, or SEO change.
- Audit dynamic job lifecycle and sitemap output on each Jobs release.
- Audit legacy traffic and duplicate indexing throughout migration.
- Do not close risk entries based solely on implementation; validate production-like behavior.

