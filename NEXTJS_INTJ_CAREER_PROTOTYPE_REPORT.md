# INTJ Career Page Prototype

## Scope

This prototype adds only these static Next.js routes:

- `/en/personality/intj/careers`
- `/hi/personality/intj/careers`

No other personality-type career route is generated. The existing CRA application,
backend, Community directory work, hosting configuration, and hybrid routing contract
remain untouched.

## Experience

The page is a server-rendered, bilingual career-exploration guide with:

- breadcrumb navigation and a premium INTJ hero;
- an eight-part qualitative work-style snapshot (no aptitude scores or predictions);
- values, frustrations, ten career directions with lightweight profession glyphs, a
  responsive seven-column comparison table, work-environment map, ten industry cards,
  and remote/hybrid/office guidance;
- a practical roadmap, growth edges, advice for six career stages, and a decision checklist;
- an explicit guide disclaimer, eight visible FAQ items, FAQ JSON-LD, and related actions.

Career content is intentionally exploratory. It does not make salary, hiring,
qualification, ability, or scientific-certainty claims. The live jobs area is linked as
an optional existing product destination; this prototype does not fetch jobs or add a
new client-side data dependency.

## SEO and access

Both pages use the existing `pageMetadata` helper for localized title, description,
canonical, Open Graph, Twitter, and hreflang metadata. Both are listed in the Next
sitemap. Their visible FAQ content is mirrored in JSON-LD. They are raw server HTML
and have no client-only data dependency.

The page uses server components only. Its visual elements are Tailwind/CSS cards,
responsive grids, table overflow containment, and lightweight decorative geometry—no
chart library, images, runtime API request, or new client component. This avoids layout
shift from remote data and keeps the career dataset on the server.

The INTJ personality page now includes a localized link to this guide. Unsupported
career routes, such as `/en/personality/intp/careers`, remain 404 through static route
generation.

## Validation required

Run from `frontend-next`:

```bash
npm install
npm run lint
npm run build
npm test
git diff --check
```

The project crawlability test covers both career pages, their metadata, self canonicals,
server-rendered featured careers/table/FAQ content, numerical-score guard, sitemap
entries, parent INTJ link, JSON-LD parsing, and an unsupported career-route 404.

## Accessibility and responsive review

The pages contain one H1, sequential section headings, visible breadcrumb navigation,
semantic table headers and caption, keyboard-native FAQ disclosure controls with visible
focus treatment, and text equivalents for visual indicators. Decorative hero geometry
and career glyphs are hidden from assistive technology. Grid layouts collapse at small
breakpoints; the wide table is contained in its own horizontal scroll region rather than
causing page overflow.

## Recommendation before scaling

Approve the visual hierarchy and bilingual editorial tone with product review before
creating the other fifteen content modules. Any future live-jobs panel should be a small
isolated client component with a safe empty state; it is intentionally not included here.
