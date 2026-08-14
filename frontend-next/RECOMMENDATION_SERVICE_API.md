# Recommendation Service API

PR-006 exposes the PR-005 resolver as an internal, pure application service.
It is not an HTTP endpoint and does not render UI or persist data.

## Request

```js
recommendationService.get({
  sourceType: 'personality-guide',
  sourceEntityId: 'personality-guide:intj',
  locale: 'en',
  mode: 'public', // or explicit 'preview'
});
```

`sourceType` is one of the PR-005 source contexts. It must match the source
entity type except for `result`, which represents a completed context rather
than a new entity class. The service rejects an unknown locale or context and
returns an empty response for a missing or ineligible source entity.

## Response

The immutable response contains `primary`, up to two `secondary` items, and
request metadata. Each item contains only safe presentation metadata already
derived from the graph: canonical entity ID/type/key, configured localized
path, canonical-key title, relationship type, reason code, priority, weight,
availability, locale, and eligibility mode. No user data, authored UI copy,
or private state is present.

## Caching

Each service instance memoizes immutable output by source type, source entity,
locale, and mode. There is no database, persistence, background work, or
cross-request cache.

## Extensions

Register a future entity type through PR-001, add graph edges through PR-004,
and supply an explicit safe path configuration when creating the service. An
entity without path configuration is excluded rather than exposed. A future
HTTP or UI consumer must use this service rather than duplicate resolver
eligibility logic.

## Related Content consumer

PR-007's server-rendered `RelatedContent` component accepts `sourceEntityId`,
`sourceType`, `locale`, and `mode`. It uses this service and renders nothing
when no valid targets are available. It cannot create editorial edges. Its
analytics events contain only source and target entity types, an edge kind, and
locale—never entity IDs, user state, result data, or free text.
