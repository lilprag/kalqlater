# Editorial Workbench

## Security model

The workbench is private, noindex, and unlinked. Its UI uses the existing KalQLater session token, while every request is separately protected by server-side authorization. `LOCALIZATION_REVIEWER_EMAILS` is a comma-separated backend-only reviewer allowlist; browser state and submitted reviewer identities are never trusted.

With no allowlist, all workbench endpoints return `403`. Configure it only in the backend’s secure environment—never in the frontend.

## Capabilities

Authorized reviewers can create a private draft, save a human edit, approve, reject, request a rewrite, lock approved wording, restore a prior human edit, and add review comments. Every action records reviewer email and UTC timestamp.

There is no generation endpoint, model key, publish action, locale activation, sitemap update, or public preview path. The workbench cannot circumvent the KGLI publication contract.

## Provider integration

An approved provider adapter may add an AI draft after the staged Studio pipeline completes. `backend/localization_provider.py` defines the provider-neutral request/result contract and empty registry; no provider is registered or called by default. The browser never proxies a provider, so credentials remain backend-only.
