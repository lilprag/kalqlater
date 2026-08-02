# INTJ Career Page Prototype — Editorial Redesign

## Scope

Only the existing static Next.js prototype routes are redesigned:

- `/en/personality/intj/careers`
- `/hi/personality/intj/careers`

No other personality career page is generated. No backend, CRA, Community, jobs API,
hosting, deployment, or hybrid routing file is changed.

## What changed

The former report-like page had many equal-weight card grids, a dense seven-column table,
and supporting advice that appeared before the central career recommendation. The redesign
uses an editorial sequence that answers the main question immediately:

1. illustrated two-column hero;
2. five prominent career directions, with Software Engineering as the primary feature;
3. Career Compass infographic;
4. grouped Career Path Explorer;
5. compact five-direction comparison;
6. four-axis work-environment spectrum;
7. remote, hybrid, and office mini-guides;
8. connected skill path and toolkit;
9. career-stage choices plus one five-question checklist;
10. six industry tiles, a static future-jobs fallback, FAQ, and final action area.

Values, frustrations, growth edges, broad stage guidance, and the former checklist were
merged into the Career Compass, concise career facts, skills path, and stage guide. The
large comparison table and repetitive snapshot cards were removed.

## Content and language

`frontend-next/data/intj-careers.js` contains aligned English and Hindi INTJ content for
twelve concise career directions and eight visible FAQ items. The page uses exploratory
language only: working-style alignment is not eligibility, ability, a hiring signal, or a
prediction. It contains no salaries, demand claims, company claims, fit scores, or other
unsupported factual assertions.

The live Jobs API is intentionally not called. The page includes a polished static empty
state with links to the existing Jobs, posting, and Community destinations; future jobs
integration can be isolated without changing the editorial content.

## Visual and performance design

The page uses server components only. It adds no client components, chart libraries,
animation libraries, raster assets, or runtime API requests. Visuals are lightweight inline
SVGs: a hero systems/strategy illustration, profession glyphs, compass/format/industry
icons, and CSS spectrum bands. The largest inline SVG is the hero illustration; it is
decorative and hidden from assistive technology.

Core content stays in raw server HTML, including all explorer directions, FAQ answers,
comparison content, and bilingual labels. Responsive grids collapse at mobile widths. The
comparison becomes vertical cards below the `md` breakpoint, so it cannot cause page-level
horizontal scrolling.

## SEO and access

Existing `pageMetadata` produces locale-specific title, description, canonical, Open
Graph, Twitter and hreflang tags. BreadcrumbList and FAQPage JSON-LD mirror visible page
content. Both prototype routes remain in the sitemap and the contextual INTJ parent-page
link remains in place. Unsupported routes such as `/en/personality/intp/careers` remain
404.

Accessibility includes one H1, semantic breadcrumbs, a captioned desktop comparison table,
text equivalents around non-textual visuals, keyboard-native FAQ disclosure controls with
visible focus treatment, non-colour text labels, and decorative SVGs marked `aria-hidden`.

## Validation

Run from `frontend-next`:

```bash
npm run lint
npm run build
npm test
git diff --check
```

The crawlability test validates both locales, visible server-rendered career/table/FAQ
content, metadata, JSON-LD parsing, sitemap entries, parent link, and unsupported-route
404 behavior.

## Recommendation

Review this one INTJ page at desktop and mobile widths before approving the information
architecture for the remaining fifteen types. Keep any future live Jobs integration as a
small isolated enhancement rather than moving core guide content to the client.
