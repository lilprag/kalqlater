# Career Guides Release

## Routes and architecture

This release provides 32 localized career-guide routes: all sixteen KalQLater personality types in English and Hindi at `/{locale}/personality/{type}/careers`.

One server-rendered dynamic route generates every supported combination. It reads a structured bilingual guide provider in `frontend-next/data/career-guides.js`; `frontend-next/components/careers/CareerGuide.jsx` holds the shared editorial template. Invalid type slugs return 404 and no large JSX is duplicated across routes.

## Content schema and differentiation

Each type has a distinct English/Hindi working-style lens, growth skill, twelve career directions, unique title, description, hero summary, and eight FAQs. The shared guide uses that information in the hero, five featured directions, compass, four path groups, comparison, environment spectra, formats, skill path, career-stage guide, industry tiles, jobs fallback, and final CTA.

| Type | Example featured directions |
| --- | --- |
| INTJ | Software engineering, data science, systems architecture |
| INTP | Research, software, data analysis |
| ENTJ | Operations leadership, product strategy, entrepreneurship |
| ENTP | Innovation, product discovery, creative strategy |
| INFJ | Learning design, writing, social-impact strategy |
| INFP | Writing, visual design, advocacy research |
| ENFJ | People development, education, community leadership |
| ENFP | Creative strategy, communications, community building |
| ISTJ | Operations, compliance, quality engineering |
| ISFJ | Healthcare operations, education support, service design |
| ESTJ | Operations management, sales leadership, project delivery |
| ESFJ | People operations, healthcare services, community programmes |
| ISTP | Engineering, cybersecurity, diagnostics |
| ISFP | Visual design, craft, experience design |
| ESTP | Sales, field operations, business development |
| ESFP | Events, hospitality, media and facilitation |

The guides are exploratory: they contain no salary, demand, hiring, company-fit, certification, public-figure, or predictive claims.

## SEO, accessibility and performance

All 32 pages use the existing metadata helper for unique localized title, description, self-canonical, Open Graph, Twitter, and hreflang tags. Each has matching BreadcrumbList and FAQPage JSON-LD. The sitemap contains every lower-case guide URL, and every parent personality page has a contextual guide link.

All content is server-rendered. No new client components, chart or animation libraries, raster assets, or live Jobs API calls were added. Decorative inline SVGs are hidden from assistive technology. The desktop comparison is semantic and captioned; the mobile version uses cards so it does not need horizontal scrolling. FAQ controls are keyboard-native.

## Validation and next recommendation

The crawlability suite verifies all 32 guides for status, locale, title, description, canonical, hreflang, FAQ JSON-LD, eight visible FAQs, comparison content, no numeric score claims, sitemap coverage, unique metadata, parent links, and invalid-type 404 behavior.

The Current Opportunities area remains an intentionally static fallback. Before adding a new content cluster, review the bilingual career directions with editorial stakeholders and real users; these guides must not be used for hiring or screening.
