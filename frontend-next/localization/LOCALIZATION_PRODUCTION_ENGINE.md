# Localization Production Engine

## Purpose

This layer operationalises the KGLI constitution. It does not translate or publish content. English is the immutable master; every locale is an independently authored editorial package that preserves KalQLater’s psychology, scoring, routes, and APIs.

## Content model

`content-registry.js` holds stable master IDs, not prose. IDs represent editorial intent across all page families. Locale packages own their authored values and never inherit English prose. A master change is recorded against its ID; the affected locale block moves to `pending_update` until its review gates are repeated.

`packages.js` is the locale-package index. Each package reserves an isolated `localization/locales/{locale}` editorial namespace, status matrix, source revision, and review records. Package values are intentionally absent until native authoring; no empty package may be activated. `validation.js` supplies the pre-publication residue and missing-block guardrails.

## Package lifecycle

`draft` → `in_review` → `approved` → `published` → `deprecated`

Any source-content change moves a published localized block to `pending_update`. The package cannot remain publishable until terminology, editorial, SEO, accessibility, and localization QA are approved again.

## Required workflow

1. English author assigns a stable content ID and source revision.
2. A native-language draft is written for intent, psychology, UX, SEO, and local culture—not sentence structure.
3. The locale terminology dictionary is updated or explicitly reviewed.
4. Native psychology/editorial, UX, SEO, and accessibility reviewers approve the affected blocks.
5. Automated validation checks package status, SEO contracts, locale code/direction, language residue, duplicate metadata, and route availability.
6. Editorial preview verifies SSR, metadata, schema, hreflang, language switching, and RTL where applicable.
7. Only a complete locale package can be marked `published` and made eligible for routing, sitemap, and hreflang.

## Publication contract

A locale must complete homepage, navigation, Personality, Career, Compare, Insights, Community, Jobs, Contact, Privacy, Terms, metadata/schema, and all review gates. Partial locale publication is prohibited. New locale URLs remain unavailable until this contract passes.

## Translation memory

`terminology.js` contains only editor-approved terms. It may guide consistency but never supplies automatic prose. Unapproved locales contain no source-language content.

## Preview contract

`previewEligibility()` permits only a fully publishable locale with authenticated editorial access. Public routing remains governed by `publishedLocales`; preview implementation belongs to the protected editorial environment, not public production routes.

## Batches

Batch 1: Spanish, French, German, Portuguese Brazil, Arabic, Japanese, Korean, Chinese Simplified, Russian, Bengali.

Batch 2: remaining configured locales, only after the same complete per-locale publication contract.

## Reporting

Run `npm run localization:report` for the current status. It reports package, family, review, and publishability counts without treating configuration as publication.
