# Content Entity and Availability Contracts

This document defines the configuration-backed content entity contract introduced in PR-001. It does not create routes, APIs, UI, recommendation delivery, or locale guards.

## Entity model

Each entity has a canonical `type:key` ID, matching `type` and `key` fields, a global `publicationState`, and an explicit availability state for every configured locale.

Supported entity types are:

- `personality-guide`
- `career-guide`
- `compare`
- `insight`
- `community`
- `jobs`
- `language`

Canonical IDs are lowercase. Examples: `personality-guide:intj`, `career-guide:intj`, `compare:intj-vs-enfp`, and `insight:communication`.

## Availability model

Locale availability is one of:

- `published`: renderable and public when later route/SEO guards are implemented.
- `preview`: renderable for authorized preview contracts but not public or indexable.
- `planned`: intentionally not renderable yet.
- `unavailable`: configured but not available for that entity.
- `deprecated`: permanently retired and not renderable.

Every entity must explicitly list every configured locale. Omitted locales are rejected during registry creation; no fallback is inferred.

`resolveEntityAvailability()` returns the entity, locale, state, `isRenderable`, and `isPublic`. It rejects unknown entity IDs and unknown locales.

## Publication model

Entity publication state is separate from locale availability:

- `draft`
- `in_review`
- `approved`
- `published`
- `deprecated`

Allowed transitions are explicitly validated. Deprecated records cannot transition again. A published entity must have at least one locale in `published` availability.

## Adding an entity

1. Use `canonicalEntityId(type, key)`.
2. Add a configuration record with matching `id`, `type`, and `key`.
3. Set a valid publication state.
4. Explicitly define availability for every locale in the configured registry.
5. Add contract fixtures to `scripts/check-content-entities.mjs`.
6. Do not expose the entity through routes, APIs, navigation, sitemap, hreflang, or recommendations until their dedicated PRs.

## Adding an entity type

`createEntityRegistry(records, { entityTypes })` accepts an extended type list. New types must use lowercase kebab-case identifiers and receive their own fixtures. The default production registry remains limited to the supported PR-001 types.

## Adding a locale

Adding a locale to `localeRegistry` requires every entity record to receive an explicit availability state. The production configuration builder fills new locales as `planned` unless that entity has an explicitly configured published or preview state. Future publication logic belongs to PR-002 and PR-028, not this contract.

## Expected usage

```js
resolveEntityAvailability(contentEntityRegistry, 'compare:intj-vs-enfp', 'en');
// { availability: 'published', isRenderable: true, isPublic: true, ... }
```

Use this contract as the common source of truth for future route guards, recommendation eligibility, locale publication, analytics validation, and internal-link audits.

## Locale availability guard (PR-002)

`lib/locale-availability.js` is the shared publication-policy consumer for the
registry. It resolves a locale and route to its governing entity and exposes
these outcomes:

- **published** — routable and public; safe for navigation, sitemap, and
  hreflang.
- **preview** — routable only at an explicit configured preview path; never
  emitted by public navigation, sitemap, or hreflang.
- **planned**, **unavailable**, and **deprecated** — not routable and fail
  closed.

The proxy uses `resolveLocaleRoute(locale, pathname)` before admitting an
unpublished preview route. The sitemap uses `publicLocalesForEntity(id)`, and
metadata uses the same list when constructing hreflang alternates. Header,
footer, and language-selector visibility use public-only helpers.

### Adding a future locale

1. Add the locale to `lib/locales.js` with its language metadata.
2. Add its explicit state to every affected entity configuration. A missing
   state is invalid configuration, never an implicit fallback.
3. Add preview routing only when the entity is `preview`; promote to
   `published` only when it is ready for public navigation and SEO.
4. Extend `scripts/check-locale-availability.mjs` with routing, sitemap,
   hreflang, and language-selector expectations.
