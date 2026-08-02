# Personality Guides Redesign

## Scope

All 32 localized main personality pages (`/en|hi/personality/{type}`) were rebuilt as
server-rendered KalQLater profile hubs. Career Guide routes remain unchanged and are linked
prominently from every profile.

## Restored depth and architecture

The previous pages had a large but sparse hero and repeated basic cards. The new structure
adds an illustrated type-specific hero, four-lens overview, core pattern, signature
strengths, constructive growth edges, communication map, decision pathway, learning,
relationships, leadership, stress/recovery, career preview, five-step growth plan,
misconceptions, comparison links, eight FAQs, and a final action area.

It uses the existing type-specific KalQLater personality, leadership, and communication
data. No second personality model or competitor material was added.

## Visual system

Each type code has an original inline SVG motif—systems, ideas, coordination, exploration,
care, craft, action, or engagement—using the existing warm cream, coral, teal, plum, and
charcoal palette. Cards vary by purpose and background rather than forming a uniform white
card wall. Decorative SVGs are hidden from assistive technology.

## Content, localization, and SEO

English and Hindi pages use localized headings, metadata, existing profile copy, eight
visible FAQs, matching FAQ JSON-LD, BreadcrumbList JSON-LD, canonical URLs, hreflang,
Open Graph, and Twitter metadata. The type FAQ helper now provides eight non-clinical,
reflection-oriented answers per locale. Career Guides, test, Jobs, Community, and relevant
comparison links remain live.

## Accessibility and performance

The redesign adds no client components, chart libraries, animation libraries, or raster
assets. Core content is static server HTML. Native `details` controls keep FAQs keyboard
operable; comparisons and visual summaries have text. Responsive samples showed no
horizontal overflow at 320px English or 375px Hindi.

## Validation

All 32 pages returned 200 with one H1 and eight FAQ disclosures. Rendered HTML ranged from
83,324 to 85,643 bytes (84,242 byte average). Lint, production build, full crawlability
tests, and diff checks passed. The existing Career Guide suite remained green.

## Limitation and deployment recommendation

This local-only redesign intentionally does not deploy or alter Career Guide production
state. It is ready for editorial and visual review. Review the expanded text with Hindi
readers before a combined future deployment; do not use any personality content for hiring
or screening decisions.
