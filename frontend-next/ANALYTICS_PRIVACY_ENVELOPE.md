# Analytics Privacy Envelope

PR-003 establishes the only permitted path for client analytics. Product code
uses the dispatcher in `lib/analytics.js`; provider calls are isolated inside a
provider adapter.

## Event lifecycle

1. Product code selects a registered event name and its exact allowlisted
   properties.
2. `validateAnalyticsEvent()` rejects unknown events, missing properties,
   unexpected properties, invalid values, and privacy-blocked names.
3. The dispatcher deduplicates an identical validated event within its running
   client instance.
4. In production, an enabled adapter receives the safe event. In development
   or disabled mode, no provider receives it; development may log the already
   validated event for local inspection.

## Privacy guarantee

The registry is an allowlist rather than a blocklist. No event can include a
name, email, phone number, IP address, free-text field, assessment answer,
session token, result ID, or arbitrary property. Page views retain only a
normalized pathname: query strings and opaque session/result identifiers are
removed before dispatch.

## Adding an event

1. Add the event and exact property validators to `ANALYTICS_EVENT_REGISTRY`.
2. Use finite product values such as locale, canonical entity ID, type, or
   route template; do not add free-form strings.
3. Add validation and deduplication cases to
   `scripts/check-analytics-privacy.mjs`.
4. Dispatch only through `createAnalyticsDispatcher()`.

## Providers and environments

`createAnalyticsDispatcher()` accepts an adapter implementing
`dispatch(eventName, safeProperties)`. `createGa4Adapter()` is the current
production adapter and owns all GA4 script and `gtag` calls. A future provider
must implement the same narrow adapter contract; application code must not
change.

Analytics dispatch is enabled only when all of the following are true:

- environment is `production`;
- analytics is explicitly enabled by configuration; and
- a non-empty provider measurement ID is available.

`NEXT_PUBLIC_GA_MEASUREMENT_ID` remains a public provider identifier, not a
secret. No credential is stored in client code.
