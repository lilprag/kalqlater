# Hybrid / Legacy Route Strategy

## Current ownership audit

| Current route | Current owner | Classification | Recommended ownership |
|---|---|---|---|
| `/community` | Legacy CRA directory entry | B — interactive application route | Keep CRA; noindex. Public discovery moves to `/en/community` and `/hi/community`. |
| `/community/me` | Legacy CRA account routing | C — private/authenticated | Keep CRA; noindex; never add to sitemap. |
| `/community/profile` | Legacy CRA profile setup | C — private/authenticated | Keep CRA; noindex; never add to sitemap. |
| `/community/member/:username` | Legacy CRA public member detail | D — public detail route | Keep CRA/noindex until a data-backed SSR profile design is approved. |
| `/community/connections` | Legacy CRA connections | C — private/authenticated | Keep CRA; noindex. |
| `/community/jobs` | Legacy CRA jobs directory | B — interactive application route | Keep CRA; noindex. Public discovery moves to `/en/jobs` and `/hi/jobs`. |
| `/community/jobs/new` | Legacy CRA post-job form | C — authenticated mutation | Keep CRA; noindex. |
| `/community/jobs/mine` | Legacy CRA owner dashboard | C — private/authenticated | Keep CRA; noindex. |
| `/community/jobs/:id` | Legacy CRA job detail | D — public detail route | Keep CRA/noindex until individual SSR job pages are data-backed and reviewed. |
| `/community/jobs/:id/edit` | Legacy CRA edit form | C — authenticated mutation | Keep CRA; noindex. |
| `/connections` | No current route declaration | Not an owned route | Do not add or redirect in this sprint. Use `/community/connections` for the existing app. |

## Redirect decision

Do **not** redirect `/community` or `/community/jobs` in this sprint. They are live application entry points with established deep links, session behaviour, API usage, posting flows, profile setup, job detail, and owner actions. A redirect would either make the existing application inaccessible or require an unreviewed path migration.

Instead:

- `/en/community` and `/hi/community` are the indexable SSR Community discovery pages.
- `/en/jobs` and `/hi/jobs` are the indexable SSR Jobs discovery pages.
- The existing CRA application routes remain stable and receive `X-Robots-Tag: noindex, nofollow` through the Next proxy configuration.
- The sitemap lists only the localized public discovery routes, never the legacy application entries.

This avoids redirect loops, retains authenticated sessions and deep links, and cleanly separates public discovery from the interactive application.

## Future job-detail SEO plan

Individual public job routes currently exist only as CRA paths: `/community/jobs/:id`. They should not receive `JobPosting` structured data until KalQLater can render the visible job content server-side from authoritative current data.

Recommended future path: `/en/jobs/[slug]` and `/hi/jobs/[slug]`, with a stable slug plus an internal immutable identifier. Before release, implement:

1. SSR retrieval of only public, active job fields.
2. Self-canonical localized URL and reciprocal hreflang.
3. `JobPosting` JSON-LD that exactly matches visible title, company, location, employment type, date, application path, and expiry.
4. Expiry behaviour: remove from sitemap at close/expiry; return 404 for deleted/never-public jobs and a clear 410 policy for permanently removed indexed jobs.
5. Noindex for drafts, owner edits, member-only roles, and application-intent routes.
6. Explicit privacy review so member identity and private application data never enter SSR output or schema.

No detail migration is included in this sprint.
