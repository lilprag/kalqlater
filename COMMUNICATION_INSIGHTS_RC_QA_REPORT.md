# Communication Insights — Release-candidate QA report

Date: 2026-08-04  
Branch: `feature/behavior-engine-mvp`  
Baseline: `7d5f0b19ef1ea234ca79d996e1c8543a3a72efd0`  
Analyzer: `communication-analyzer@1.0.0-draft` (`review` only)

## Scope and environment

All checks were local only. An isolated FastAPI router was started with the explicit `allow_test_drafts=True` override, and the Next.js production build pointed only to that local router. Production domains, Vercel, Render, environment files, Community, Jobs, and the preserved Community stash were not changed.

## Journey QA

### English

- Public landing and start pages rendered with the expected explanation, safety framing, FAQ, and CTA.
- A full twelve-scenario journey completed successfully.
- Mouse selection worked. The response group is a native labelled radio group and a keyboard focus pass reached the first radio; the in-app-browser key injector did not toggle the focused native radio, so this last activation detail still needs manual assistive-technology/browser confirmation.
- First-scenario Back displayed the leave confirmation. Staying retained the selected answer.
- Back on a later scenario restored its selected response. Changing it used the active-session update endpoint and continued to the next scenario.
- Completion navigated to a protected result that included strengths, growth edges, misunderstandings, three practical suggestions, a separate Weekly Experiment, and the optional save CTA.
- A fresh-tab result URL showed the private-result-unavailable state without the browser-session access credential.
- Browser console: no error-level entries across the landing, flow, result, and mobile checks.

### Hindi

- A full twelve-scenario journey completed successfully, including first-step confirmation, restored answer, and response revision.
- Result headings, progress copy, Weekly Experiment, optional-save CTA, direction labels, and confidence labels rendered in Hindi.
- The earlier English leaks (`message clarity`, `higher`, `clear-pattern`, and internal confidence keys) were corrected. The approved glossary terms — ध्यान से सुनना, भावनात्मक स्पष्टता, मिलकर जिज्ञासा, स्पष्ट लेकिन सम्मानजनक आग्रह, and मतभेद सँभालना — appeared in the verified result.
- A native Hindi editorial owner should still approve final idiom and tone before publication; automated QA cannot replace that review.

### Error and session states

- Source and API tests cover expired sessions, invalid session IDs, invalid/unauthorized result access, retries, response validation, idempotency, and completion freeze.
- The UI maps expired, unavailable, timeout, and general service failures to retry/start-again states. Network-failure timing itself was not induced in the browser during this run; it remains a manual smoke-test item before any public release.
- Completed sessions are frozen: update and submit after completion raise a conflict in the tested service.

## Responsive and accessibility QA

| Viewport | Result |
| --- | --- |
| 320 px | No horizontal overflow on the Hindi result or active scenario; response cards remained 246 px wide and 114 px high. |
| 375 px | No horizontal overflow. |
| Tablet (768 px) | No horizontal overflow. |
| Desktop (1440 px) | No horizontal overflow. |

- Native radio-group semantics, fieldset/legend, labelled progressbar, selected visual state, visible focus CSS, skip link, alert dialog, and error association are present.
- FAQ uses native `details`/`summary` controls.
- Reduced-motion CSS disables transition and animation duration under `prefers-reduced-motion`.
- Primary action targets meet the shared 51 px minimum. The text-only Back control measured 20 px tall at 320 px; this is a non-blocking accessibility follow-up because its surrounding interaction remains usable, but it should be increased to a 44 px target before publication.
- A manual screen-reader pass (VoiceOver/NVDA + current browser) is required to approve radio-state announcements and all keyboard activation details.

## Six-profile scoring review

All six deliberate response patterns completed deterministically and produced:

| Profile | Strengths | Growth edges | Misunderstandings | Suggestions | Unique IDs | Weekly separate |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| Direct/assertive, lower emotional expression | 3 | 3 | 2 | 3 | Yes | Yes |
| Listening-oriented, lower assertiveness | 3 | 3 | 2 | 3 | Yes | Yes |
| Conflict-avoidant, emotionally expressive | 3 | 3 | 2 | 3 | Yes | Yes |
| Curious/adaptable, slower-processing scenario | 3 | 3 | 2 | 3 | Yes | Yes |
| Mixed/context-dependent | 3 | 3 | 2 | 3 | Yes | Yes |
| Contradictory/limited evidence | 3 | 3 | 2 | 3 | Yes | Yes |

The analyzer contains no overall score, diagnostic language, hiring/benchmarking claim, or personality-based score adjustment. The slower-processing label is outside the analyzer’s measurement scope and is treated only as a scenario profile name, not a result claim.

## Scenario and safety sign-off

The five revised scenarios (friendship plan cancellation, partner quietness, meeting dissent, family boundary, and tone feedback) were re-read in English and Hindi. Each retains four plausible behavioural trade-offs; none is presented as the clearly ideal, rude, or immature answer. Existing scoring values were not changed. Final formal behavioural-science and editorial sign-off remain required.

## Privacy, security, and SEO

- Source review confirms only opaque resume metadata is written to `sessionStorage`; raw answers are not written to `localStorage` or session storage.
- Access tokens are sent only as `X-Assessment-Access` to the local assessment API; no analytics integration receives them.
- Score weights and raw response values are absent from safe scenario API payloads.
- Result access with an absent/wrong token is deliberately indistinguishable as unavailable.
- Normal `AssessmentService()` rejects draft content; only the explicit local QA override accepted it.
- `/en/insights/communication` and `/hi/insights/communication` returned HTTP 200 with raw SSR HTML, locale-specific titles, descriptions, self-canonicals, hreflang/x-default alternates, one H1, visible FAQ, BreadcrumbList/FAQPage JSON-LD, internal links, and sitemap entries.
- Private start/session/result metadata is `noindex, nofollow`; those routes are absent from the sitemap and use generic metadata without result content.

## Validation

- Backend: `python3 -m pytest -q` — 15 passed. Existing FastAPI/starlette deprecation warnings remain outside this feature.
- Backend source: compilation passed under the normal test run; a restricted cache-directory permission prevented a redundant second `compileall behavior_engine` cache write, not a source compilation failure.
- Frontend: `npm run lint` passed. Production `npm run build` passed with all Communication Insights routes generated.
- Browser: no error-level console entries on English, Hindi, and mobile QA tabs.
- `git diff --check`: required again immediately before any local commit.

## Approval matrix

| Mandatory gate | Status | Evidence / remaining action |
| --- | --- | --- |
| Product owner | NOT REVIEWED | Formal owner approval was not supplied in this QA run. |
| English editorial | APPROVED WITH NON-BLOCKING NOTES | Scenario and result prose reviewed locally; named editorial approval still needs recording. |
| Hindi editorial | APPROVED WITH NON-BLOCKING NOTES | English leaks fixed and glossary verified; native-language editorial approval still needs recording. |
| Scoring/content review | APPROVED WITH NON-BLOCKING NOTES | Six-profile deterministic review and safety assertions pass; named reviewer must sign off. |
| Accessibility | NOT APPROVED | Manual screen-reader test and 44 px Back-target improvement remain. |
| Privacy/security | APPROVED WITH NON-BLOCKING NOTES | Protected access, safe payloads, no browser raw answers, noindex, and draft blocking verified. |
| Safety/ethics | APPROVED WITH NON-BLOCKING NOTES | No diagnosis, hiring, or fake-score language; formal safety reviewer approval remains. |
| Technical QA | APPROVED WITH NON-BLOCKING NOTES | Browser journeys, tests, lint, and build pass; network-failure retry remains a manual smoke-test item. |
| SEO/SSR | APPROVED | Local SSR, metadata, JSON-LD, robots, and sitemap checks pass. |

## RC decision and production-readiness requirements

**RC1 was not created.** The configuration remains `communication-analyzer@1.0.0-draft`, `review` status, unpublished. Creating `communication-analyzer@1.0.0-rc1` would be premature because the mandatory product-owner and accessibility gates are not approved.

Before a candidate can be created, record the named approvals, complete a manual screen-reader/browser keyboard pass, increase the Back control’s touch target, intentionally induce and verify the network-failure retry state, then rerun validation. The candidate must preserve the draft history, use an immutable content hash, retain `release_candidate` status with no publication date, and remain rejected by normal production session creation unless explicitly enabled for an RC test environment.
