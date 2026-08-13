# Recommendation Rule Resolver

PR-005 consumes the PR-004 graph and returns a domain-only recommendation
contract. It has no API, UI, persistence, personalization, scoring, or copy.

## Input

`resolveRecommendations({ sourceContext, sourceEntityId, locale, mode }, graph)`
accepts one of five source contexts: `result`, `personality-guide`,
`career-guide`, `compare`, or `insight`. The source entity must be a valid
graph node. `mode` is `public` by default or explicit `preview`.

## Output

The result is `{ primary, secondary }`: one primary candidate or `null`, and
zero to two secondary candidates. Every candidate carries only graph-safe
domain fields: target entity identity, relationship type, priority, weight,
reason code, locale, availability, publication state, and eligibility mode.
It never contains user data or presentation copy.

## Deterministic editorial rules

Each source context has an explicit relationship-order table. Within the same
editorial relationship order, candidates sort by descending priority,
descending weight, then canonical target ID. Duplicate targets retain their
best ordered edge. Any registered future entity type can be returned only when
an explicit, eligible graph edge names it. No behavior is inferred beyond the
explicit graph edges.

## Eligibility

The resolver fails closed when source, target, locale, or edge configuration is
missing. Public mode requires published source, edge, and target availability
and publication. Preview mode accepts only compatible published or preview
availability and approved/published publication states. Planned, unavailable,
deprecated, private, self, duplicate, and cross-locale targets are excluded.

## Extending the resolver

Add a source context only with a documented target-type and relationship-order
configuration plus fixture coverage. Add editorial edges through the PR-004
graph configuration. Do not add text, ranking heuristics, AI, or UI behavior
to this module.
