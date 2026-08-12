# Personal Growth Dashboard — Phase 1

## Purpose

The Personal Growth Dashboard is the private home for completed KalQLater reflections. It aggregates independent Insight records; it never computes an overall personality, intelligence, quality, or ranking score.

Phase 1 provides `/en/dashboard` and `/hi/dashboard` as server-rendered, `noindex` page shells with a client-side authenticated gate. The current cross-application authentication token lives in browser storage, so server rendering cannot safely identify the signed-in account. The dashboard therefore renders no private result data on the server, validates the existing session in the browser, and redirects unauthenticated visitors to the existing login route.

## Phase 1 data boundary

No new backend persistence or analyzer change is introduced. The dashboard reads only records it can prove are present in the current browser:

- Personality: the existing legacy `kalqlater_latest_personality_type_v1` browser value. It is shown as available context without an invented completion date or result link.
- Communication: the existing browser session record plus its protected result endpoint. Its real result ID, version, locale, timestamp, summary, and current Weekly Experiment are used.
- Decision: the same browser-session/result pattern when a valid completed result is available.

Missing browser data stays missing. The timeline includes only real result timestamps, and the Weekly Growth placeholder does not manufacture a streak or completed-experiment count.

## Future account-owned model

The backend persistence phase should introduce an account-owned `insight_results` record with this shape:

| Field | Meaning |
| --- | --- |
| `id` | Stable dashboard record ID |
| `account_id` | Private owner reference, never publicly serialized |
| `type` | `personality`, `communication`, `decision`, or future module key |
| `version` | Immutable analyzer/content version |
| `completed_at` | Server timestamp |
| `language` | Result locale |
| `confidence` | Qualitative band only; never an aggregate score |
| `result_id` | Reference to the protected source result |
| `title`, `summary` | Safe result-preview fields |

It should be populated only after explicit account claiming or an authenticated completion flow. Existing anonymous results must not be silently attached to an account.

## Weekly Experiment storage

Future `weekly_experiment_assignments` records should contain:

| Field | Meaning |
| --- | --- |
| `experiment_id` | Authored experiment identifier |
| `insight_type` | Source Insight |
| `week_assigned` | ISO week/date boundary |
| `completed` | Boolean, default false |
| `completed_at` | Optional completion timestamp |
| `notes` | Reserved for a later private journal feature |

Phase 1 renders the newest real result’s authored Weekly Experiment only. It does not create assignments, streaks, notes, notifications, or habit tracking.

## Timeline model

Future `growth_timeline_events` should support `completed_insight`, `retake`, `future_milestone`, and `community_joined` event types. Events must include an actor-owned timestamp and optional source record reference. Phase 1 only renders `completed_insight` entries backed by protected result timestamps.

## Extension contract

Conflict, Leadership, and Learning plug in by registering a module key, localized display metadata, a protected result route builder, and an account-owned record type. They do not need to alter the dashboard layout or any other Insight’s scoring.

## SEO and privacy

Dashboard routes are `noindex, nofollow` and are excluded from the sitemap. Result data is acquired client-side only after the existing authentication check and through the existing protected result endpoints. No private data is added to public SSR HTML.
