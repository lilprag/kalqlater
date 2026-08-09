# Content Uniqueness Fix Report

Date: 2026-08-09
Scope: local `nextjs-migration` fix only. No push, deployment, backend, environment, proxy, or stash operation occurred.

## INTJ personality root cause

There was no second INTJ profile object and no INTJ-specific import path. All personality pages use `personalityProfile()` from `frontend-next/lib/personality.js`, which imports one `TYPES` dataset and one `RELATIONSHIP_CONTEXTS` dataset.

The real precedence defect was this renderer-level fallback:

```jsx
p.relationshipContexts?.[context] || p.relationshipStyle
```

`relationshipStyle` came from the legacy `TYPES[type][locale].relationships` field. For INTJ, that legacy field contains the reported “Architects want deep, intellectual relationships…” sentence. Any missing, stale, or incorrectly shaped context object could therefore collapse all four cards to that one paragraph. The same old field also fed the personality FAQ and Compare relationship prose.

Fix:

* `personalityProfile()` now requires all four authored contexts and throws when any is absent.
* `relationshipStyle` is derived from the authored friendship context only for concise non-card copy; it no longer reads the legacy one-paragraph field.
* The four-card renderer has no optional chaining or generic fallback.

No static-generation cache or alternate personality dataset was found. A fresh local production build renders all authored contexts; the prior observed INTJ-only result was consistent with the removed fallback being reached by an older/stale or incomplete data shape, not a shadowed INTJ object.

## Compare same-T/F root cause

`frontend-next/data/comparison.js` retained `decisionLenses`, a broad group-level fallback. Its strategist entry was the reported “tests leverage, logic, and long-term consequences” copy. Although `typePatterns` existed, the selection was:

```js
typePatterns[type] || decisionLenses[group]
```

That meant a missing type entry silently became a group sentence, allowing same-group/same-preference pairs to collapse into identical A/B decision copy.

Fix:

* Removed `decisionLenses` entirely.
* Decision A and B now resolve only from authored `typePatterns[typeA]` and `typePatterns[typeB]`.
* A missing profile throws instead of falling back to a T/F, E/I, S/N, J/P, or group-level sentence.

The compare renderer keeps shared pair framing where it is intentionally pair-level, while relationship, friendship, workplace, conflict, and growth prose source each type’s own profile strengths, growth areas, work style, and authored relationship context. The hard comparison gate verifies every canonical pair’s final A/B decision text, including all same-preference subsets.

## Fallback paths removed

| Area | Removed behavior | Replacement |
| --- | --- | --- |
| Personality cards | `relationshipContexts?.[context] || relationshipStyle` | Required `relationshipContexts[context]` |
| Personality summary/FAQ/Compare relationship source | legacy `TYPES.*.relationships` | Authored friendship context |
| Compare decision A/B | `typePatterns[type] || decisionLenses[group]` | Required type-specific decision profile |

## Build-time and SSR safeguards

`frontend-next/scripts/check-content-integrity.mjs` now fails when:

* a relationship context is missing, too short, or duplicates another context for the same type and locale;
* a career role’s reason, challenge, or skill repeats within a guide;
* a canonical Compare page has equal A/B decision content;
* either known legacy relationship or decision phrase appears in generated SSR HTML.

The NPM command `npm run check:content-integrity` now invokes this gate directly.

## Full-corpus results

| Audit | Count | Duplicate / fallback count |
| --- | ---: | ---: |
| Personality relationship contexts | 16 × 2 locales × 4 = 128 | 0 |
| Career Guides | 16 × 2 locales = 32 | 0 repeated role fields within a guide |
| Canonical localized Compare pages | 120 × 2 locales = 240 | 0 identical A/B decision fields |
| Known legacy fallback phrases in generated SSR | Named spot checks and full relevant corpus gate | 0 |

## Raw SSR spot checks

Fresh local production HTML was verified for English/Hindi INTJ personality, ENTJ, INTP, ISFJ, and ESTP personality pages; all four relationship contexts were distinct and neither legacy phrase appeared.

Fresh local production HTML was verified for INTJ/INTP, INTJ/ENTJ, INFJ/ENFJ, ISTJ/ISFJ, and INTJ/INFP Compare pages. Every A/B decision description was type-specific and distinct; neither legacy decision sentence appeared.

## Before / after

* Before: a missing context could make INTJ Friendship, Romance, Family, and Teamwork all display the old Architect relationship paragraph.
* After: a missing authored context is a failing condition; INTJ Friendship begins with shared ideas and reliable follow-through, Romance with care through planning and loyalty, Family with autonomy and obligations, and Teamwork with strategy and meeting purpose.
* Before: INTJ and INTP could both inherit the strategist decision sentence.
* After: INTJ maps long-term consequences before committing; INTP tests the model until its logic holds, sometimes delaying commitment for another question.
