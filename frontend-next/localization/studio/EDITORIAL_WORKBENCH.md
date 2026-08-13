# Editorial Workbench

## Security model

The workbench is private, noindex, and unlinked. Its UI uses the existing KalQLater session token, while every request is separately protected by server-side authorization. `LOCALIZATION_REVIEWER_EMAILS` is a comma-separated backend-only reviewer allowlist. Entries are trimmed and matched case-insensitively; malformed entries, an unset variable, and non-allowlisted users all fail closed with `403`. Browser state and submitted reviewer identities are never trusted.

With no allowlist, all workbench endpoints return `403`. Configure it only in the backend’s secure environment—never in the frontend.

## Capabilities

Authorized reviewers can create a private draft, save a human edit, approve, reject, request a rewrite, lock approved wording, restore a prior human edit, and add review comments. Every action records reviewer email and UTC timestamp.

There is no generation endpoint, model key, publish action, locale activation, sitemap update, or public preview path. The workbench cannot circumvent the KGLI publication contract.

## Provider integration

An approved provider adapter may add an AI draft after the staged Studio pipeline completes. `backend/localization_provider.py` defines the provider-neutral request/result contract and an optional OpenAI Responses implementation. It stays disabled until the backend operator sets `LOCALIZATION_AI_PROVIDER=openai`, `OPENAI_API_KEY`, and `OPENAI_LOCALIZATION_MODEL`; `LOCALIZATION_PROVIDER_TIMEOUT_SECONDS` is optional (default `30`). The browser never proxies a provider, so credentials remain backend-only. Provider failures are safe, draft output is schema-validated, and failed generation cannot publish any locale.
