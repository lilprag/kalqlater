# KalQLater production-readiness audit

## Improvements completed

- Added route-level lazy loading for all application pages, so the initial JavaScript bundle no longer eagerly contains every page.
- Added a keyboard-visible skip link and labelled/announced mobile-navigation state.
- Removed an unused Premium Report icon import and an unused Result-card prop.
- Moved Google Font loading out of CSS `@import` and into the document head to avoid an import-chain render delay.
- Added baseline Open Graph and Twitter card metadata plus `robots.txt`.
- Added a stable main-content landmark for keyboard navigation.

## Findings and recommended next work

### Highest priority

- Add a branded `og:image` asset and its dimensions/alt metadata. Canonical, Open Graph URL, and sitemap URLs now use `https://kalqlater.com`.
- Create dedicated social preview imagery and supply `og:image` dimensions/alt text.
- Replace the static PostHog public token and third-party Emergent scripts with environment-controlled production configuration; document consent and privacy behavior.
- Configure the server-only SMTP variables in `backend/.env` (using `.env.example`) and perform one monitored delivery test before launch. The Contact API intentionally returns a generic error when SMTP is unavailable.
- Add automated unit tests for scoring, URL validation, and insight-data completeness, plus end-to-end keyboard and mobile tests.

### Architecture and maintainability

- Result, PremiumReport, Compare, and several premium cards are now large presentational modules. Extract shared report primitives (section shell, insight list, data resolver, bilingual label helpers) before further feature work.
- The project contains a large unused `src/components/ui` scaffold. It is not bundled while unimported, but should be removed only after a deliberate import audit and ownership decision.
- Insight datasets repeat group-level information across several files. Consider a normalized type-profile schema and selectors once content editing needs increase.
- Consolidate repeated Tailwind card-shell and typography utilities into small design-system components or `@layer components` tokens.

### Accessibility and UX

- Perform manual screen-reader QA for animated cards, dashboard buttons, and dynamic copy-link feedback. Add live-region confirmation for clipboard actions.
- Verify contrast at all hover/focus states and at Hindi font weights with an automated accessibility scanner.
- Respect `prefers-reduced-motion` across Framer Motion-heavy premium sections.
- Add visible focus styling to every custom card button and test mobile touch targets on real devices.

### Performance and SEO

- The production bundle remains substantial because visual/report features and several large libraries are present. Use a bundle analyzer before removing dependencies or splitting insight modules further.
- Self-host or subset font files for stronger performance and offline resilience.
- Add server/edge rendering or prerendering if organic-search indexing becomes a priority; this is currently a client-rendered SPA.
- Provide image dimensions, responsive sources, and lazy loading for any future image assets.
