# Communication Insights MVP implementation report

## Scope and routes

This local-only MVP adds a bilingual Communication Insights experience to the Next.js application:

- `/en/insights/communication` and `/hi/insights/communication` are indexable public discovery pages.
- `/[locale]/insights/communication/start` is a server-rendered private-flow shell with a client session-creation control.
- `/[locale]/insights/communication/session/[sessionId]` runs one scenario at a time.
- `/[locale]/insights/communication/result/[resultId]` renders a private result only after the browser supplies its opaque access token.

Only the two public discovery routes are in the sitemap. Start, session, and result routes use `noindex, nofollow` and do not emit result content in server HTML or social metadata.

## Architecture and API integration

`frontend-next/lib/communication-insights-api.js` is the only frontend API adapter. It calls the generic server-authoritative Behavior Intelligence Engine and applies a request timeout plus `AbortController` cancellation. It does not contain content weights, scoring rules, or interpretation logic.

The client stores only `sessionId`, opaque `accessToken`, locale, analyzer version placeholder, current step, and later `resultId` in `sessionStorage`. It never stores raw scenario responses in the browser. Requests send the opaque token only through `X-Assessment-Access`; it is never sent to analytics.

The small session component handles refresh/resume, stale request cancellation, invalid/expired sessions, locale mismatch, unavailable content, network timeout, rejected answers, and result retrieval failures with generic recovery copy. Answer submission is disabled while saving and uses an idempotency key.

## SSR and SEO

The landing page is a server component and includes in raw HTML: a single H1, product promise, audience, ten dimensions, example insights, visible FAQ, internal links, BreadcrumbList JSON-LD, and matching FAQPage JSON-LD. `pageMetadata` supplies locale-specific title, description, canonical URL, hreflang/x-default, Open Graph, Twitter, and index/follow directives. Sitemap includes exactly the English and Hindi landing pages.

## Accessibility and responsive design

The experience uses semantic headings, details/summary FAQ controls, radio-group semantics, visible focus styling, labelled progress semantics, status/error alerts, disabled saving state, and no auto-advance. It is built from responsive single-column-first layouts and avoids chart dependencies. The global reduced-motion setting applies to all new CSS transitions.

## Draft-content gate

The current analyzer remains `review` in `communication-analyzer.v1.draft.json`. Normal backend service construction intentionally rejects session creation for non-published content, including from this frontend. The UI surfaces a calm “not published yet” state rather than changing content status or bypassing the server gate.

To enable real production sessions, a reviewed analyzer version must meet the existing configured publication requirements (schema validity, bilingual parity approval, pilot completion, safety review, and deterministic fixtures) and then be explicitly published through the content governance process. A local test harness can use `AssessmentService(allow_test_drafts=True)`; that is not enabled by this UI or production service.

## Performance

The landing page is server rendered and ships no chart library. The scenario and result components are the only new client components. Result data is fetched only after navigation to the private result route. The assessment configuration and scoring rules remain server-side.

## Account integration point

The final result offers an optional, non-blocking “Save this for later” call-to-action. It deliberately does not implement claim/save functionality because the engine currently has no persistent account-claim contract.

## Validation to run

From the repository root:

```text
cd backend && python3 -m compileall . && python3 -m pytest
cd ../frontend-next && npm install && npm run lint && npm run build && npm test
git diff --check
```

No CRA code, deployment configuration, environment secrets, production services, or preserved Community-directory stash are part of this MVP.
