# Recommendation Graph Domain Model

PR-004 defines a reusable graph of canonical content entities. It contains no
recommendation generation, ranking, heuristics, UI behavior, APIs, or delivery
logic.

## Nodes

Every node is an entity from `contentEntityRegistry`, such as a Personality
Guide, Career Guide, Compare page, Insight, Community directory, Jobs
directory, or Language. Future entity types work once they are registered in
the content entity contract.

## Edges

Each directed edge has:

- `from` and `to` canonical entity IDs;
- a registered `relationshipType`;
- bounded integer `weight` and `priority` values (0–100);
- a publication state; and
- an explicit availability state for every configured locale.

Supported relationship types are `related_to`, `continue_to`, `learn_before`,
`learn_after`, `recommended_after`, `supports`, `expands`, `contrasts_with`,
`similar_to`, `career_for`, and `compare_with`.

The graph exposes incoming and outgoing edge indexes, not a traversal or
ranking algorithm. Weight and priority are validated domain metadata for a
later consumer; this PR does not interpret them.

## Validation

The graph rejects duplicate edges, self-references, unknown entities,
unregistered relationship types, invalid priority/weight values, incomplete or
unknown locale availability, publication conflicts, and cycles for directed
progression relationships (`learn_before`, `learn_after`, `continue_to`, and
`recommended_after`). Associative relationships may be cyclic.

A published edge requires published source and target entities. An edge may be
published or preview in a locale only when both endpoints have a compatible
state there.

## Adding nodes and relationships

1. Add an entity through the PR-001 entity registry.
2. Add a complete edge configuration to a future graph configuration change.
3. Explicitly set every locale availability and a valid publication state.
4. Add coverage to `scripts/check-recommendation-graph.mjs`.

Do not add UI behavior or selection rules to the graph. A later PR may consume
these validated edges through a separate recommendation policy.
