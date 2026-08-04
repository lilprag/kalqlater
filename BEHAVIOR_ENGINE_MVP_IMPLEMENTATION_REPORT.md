# Behavior Engine MVP Implementation Report

## Implemented foundation

The reusable backend engine lives in `backend/behavior_engine/` and is independent of React, Community, Jobs, and MongoDB. It provides typed analyzer definitions, approved file content loading, fixed-session selection, server-authoritative scoring, qualitative confidence, deterministic rule composition, opaque guest sessions, private result access, and in-memory repositories for tests/local development.

## File structure

- `models.py` — Pydantic boundary and domain models.
- `content.py` — allowlisted internal configuration loader and validation.
- `repositories.py` — content/session/result repository protocols plus in-memory adapters.
- `scoring.py` — signed multidimensional evidence, bands, and confidence.
- `service.py` — sessions, response validation, idempotent completion, results, and placeholder result claim contract.
- `api.py` — minimal generic FastAPI router with no scoring internals in scenario responses.
- `test_behavior_engine.py` — isolated configuration, service, safety, and API tests.

`backend/server.py` mounts the router only; the engine does not query existing MongoDB collections or alter existing API behaviour.

## Content loading

`communication-analyzer.v1.draft.json` is loaded only from an allowlisted repository-owned location. The configuration is version pinned and validates IDs, bilingual text, dimensions, exact four-option MVP scenarios, bounded signed weights, confidence rules, challenge references, and interpretation references.

Draft/review content cannot start ordinary sessions. Tests explicitly enable draft content. A published configuration is required for normal local/production-style use.

## Scoring, confidence, and interpretation

The engine applies authored positive/negative contribution weights per selected option and keeps evidence separate per dimension. It produces direction bands and qualitative confidence: Clear pattern, Emerging pattern, Mixed evidence, or Limited evidence. It has no global score, percentile, benchmark, or scientific reliability percentage.

Interpretation composition is deterministic and version pinned: dimension signal → confidence caveat → authored cross-dimension rule → optional safe personality note → challenge recommendation → disclaimer. Personality context never changes scoring.

## Session and repositories

Sessions use UUID identifiers plus opaque access capabilities, fixed scenario order, expiry, status, idempotent response keys, frozen answers after completion, and idempotent completion. The interfaces are ready for future MongoDB adapters without changing the service API. No MongoDB collection, migration, or index was added in this sprint.

## Minimal local API surface

Mounted under `/api`:

- `GET /analyzers/{slug}`
- `POST /analyzers/{slug}/sessions`
- `GET /analyzer-sessions/{session_id}`
- `GET /analyzer-sessions/{session_id}/next`
- `POST /analyzer-sessions/{session_id}/responses`
- `POST /analyzer-sessions/{session_id}/complete`
- `GET /analyzer-results/{result_id}`

Result/session access requires the opaque assessment capability. Scenario payloads omit scoring weights, interpretation rules, challenge triggers, and author notes. Future rate-limiting should use the project’s existing server-side pattern before public enablement.

## Privacy and analytics boundaries

Only slug/version, session status, scenario count, duration bucket, error category, and generation timing are suitable future operational telemetry. Raw responses, tokens, full results, free text, email, and personality data tied to identity must not be logged or sent to analytics.

## SSR/SEO contract for the future frontend

Indexable landing pages: `/en/insights/communication` and `/hi/insights/communication`, implemented in Next.js with SSR/SSG, substantial HTML, unique metadata, canonical/hreflang/x-default, Breadcrumb JSON-LD, valid FAQ JSON-LD, sitemap entries, and one H1.

Interactive start routes (`/en|hi/insights/communication/start`) should use a server-rendered instruction shell plus a narrow client interaction island and remain noindex unless they later gain substantial standalone value. Private results are noindex/nofollow, absent from the sitemap, and capability- or account-protected. No frontend routes are created in this sprint.

## Known limitations and next step

- The approved content is `draft`, so regular endpoint sessions correctly reject it until human review publishes a version.
- Repositories are in-memory only; guest claim, account binding, deletion/export, rate limiting, and MongoDB adapters remain future work.
- The current content configuration has intentionally limited coverage for some dimensions; resulting confidence controls prevent overclaiming.
- The public UI, SSR landing pages, account flow, persistence, and analytics wiring are intentionally not implemented.

Next implementation step: publish a human-reviewed content version, add a MongoDB repository behind the existing protocols with privacy/deletion design, then build the Next.js public landing and noindex interactive shell.
