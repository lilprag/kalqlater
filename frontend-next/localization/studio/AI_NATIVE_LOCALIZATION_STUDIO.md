# AI Native Localization Studio

The Studio is a provider-neutral editorial workflow. It does not call a model by default and contains no credentials. A future approved adapter receives one stage brief at a time and returns a structured, auditable result.

## Pipeline

1. Meaning extraction isolates psychological, UX, SEO, audience, and tone intent.
2. Psychology Guardian rejects any scientific, scoring, behavioural, clinical, deterministic, or exaggerated drift.
3. Native Editorial Writer creates original locale prose from meaning.
4. SEO Localization Expert authors search-intent metadata and schema wording.
5. UX Writer covers UI language.
6. Terminology Guardian checks approved locale vocabulary.
7. Cultural Adaptation checks local context without stereotypes or theory changes.
8. Accessibility Reviewer checks clear reading and RTL wording.
9. Brand Guardian protects KalQLater voice.
10. SEO Validator checks technical and content SEO contracts.
11. Localization Validator checks residue, mixed language, placeholders, and locale correctness.
12. Editorial Scoring produces quality evidence.

## Human publication control

Pipeline success returns `needs_human_review`, never `published`. Publication requires documented approvals for psychology, editorial, SEO, accessibility, localization, and brand plus at least 90 in every quality dimension. Human edits and approved terminology are append-only memory and always supersede generated drafts.

## Update impact

When an English master content ID changes, `affectedLocaleBlocks()` marks only the matching published locale blocks `pending_update`. It does not regenerate an entire locale.

## Review package

The pipeline trail is the human review package: source revision, stage outputs, terminology decisions, changed examples, warnings, scores, and unresolved blockers. Reviewers approve or reject each gate independently.

## Reporting

`studioLocaleReport()` exposes page-family coverage, review backlog, pending updates, and publishability. It is reporting-only and cannot change locale activation.
