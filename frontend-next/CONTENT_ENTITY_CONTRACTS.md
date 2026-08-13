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
