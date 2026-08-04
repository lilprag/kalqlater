# Communication Insights MVP — pre-publication review

**Review date:** 2026-08-04
**Reviewed version:** `communication-analyzer@1.0.0-draft` (status: `review`)
**Recommended status:** **REVISIONS REQUIRED — do not create an RC or publish**

## Executive verdict

The public discovery experience is clear, calm, bilingual, server-rendered, and distinct from a personality quiz. The generic engine correctly protects unpublished content in normal mode and the local test override was isolated from production behavior.

It is **not ready for an RC**. Three material issues need resolution first:

1. The scenario-page **Back** control returns to the start page rather than safely resuming the current session or showing a deliberate leave-session choice. The completed answer remains server-side, but the start screen creates a new session and offers no resume affordance.
2. Several scenarios present an obviously socially desirable response beside passive, unsafe, or needlessly dismissive alternatives. This weakens behavioural validity and can invite answer optimisation.
3. Result coverage is too thin for some valid response patterns. A mixed profile produced zero strengths and zero misunderstandings; even a uniformly high pattern rendered empty blind-spot and misunderstanding cards. All tested profiles received only one practical suggestion.

No analyzer content, score weights, draft status, or production setting was changed in this review.

## Local experience evidence

An isolated FastAPI instance was started with `AssessmentService(allow_test_drafts=True)` on localhost only. The normal mounted application was not changed and still rejects draft sessions. The Next production build was temporarily configured to call that local service.

- English and Hindi landing pages render substantive server HTML and explain the tool within the opening viewport.
- The English start page has useful expectations, privacy language, and a clear no-right-answer reminder.
- A browser session completed all 12 scenarios, completed analysis, and retrieved a private result.
- Reloading the private result succeeded in the same browser session.
- Scenario flow uses labelled radio controls, disabled Continue until selection, accessible progress semantics, and a saving state.
- The browser Back test failed the intended resume expectation: after answering scenario 1 and reaching scenario 2, the in-product Back button returned to `/en/insights/communication/start`.
- Console review recorded no errors. Local API traffic was confined to `127.0.0.1:8001` for this review.

## Landing-page review

**Verdict: approved with minor copy consistency changes.**

The promise is understandable in under five seconds, the “behavioural reflection tool” label makes it distinct from the personality test, and the ten-dimension section provides sufficient visible SEO content. The visual hierarchy feels premium without a heavy dashboard. Safety language is present but not overwhelming. The page is somewhat long, but sections answer distinct user questions and do not feel repetitive.

The Hindi landing is natural in tone. Before publication, align the names used in landing copy with the names emitted by result content; for example, “receptive listening”, emotional transparency, and constructive assertion currently have differing Hindi terms across frontend copy and the analyzer configuration.

## Scenario review

| Scenario ID | Category | English verdict | Hindi verdict | Desirability / ambiguity risk | Recommended revision | Release decision |
| --- | --- | --- | --- | --- | --- | --- |
| `meeting-unclear-update-01` | Meeting | Clear and realistic; options map to different strategies. | Natural and understandable. | Medium: option D is noticeably less constructive. | Make delayed follow-up a more viable, bounded option. | Revise before RC |
| `remote-deadline-shift-01` | Remote work | Relevant, but assumes authority to interrogate ownership. | Clear, although “नया जिम्मेदार” is more operational than conversational. | High: A is visibly ideal; B/D are passive. | Add role-safe alternatives such as an asynchronous clarification or checking the agreed workflow. | Revise before RC |
| `feedback-brief-miss-01` | Feedback | Plausible, though “start with positives” signals a taught best practice. | “तय ब्रीफ” is understandable but partially transliterated. | Medium. | Use a more context-neutral feedback option; consider “तय अपेक्षाओं” for Hindi. | Revise before RC |
| `friend-plan-cancel-01` | Friendship | Useful relationship context, but stopping initiation can be self-protective rather than a deficit. | Natural. | High: D reads as the intended healthy answer. | State no obligation to confront; distinguish boundary-setting from avoidance. | Revise before RC |
| `leadership-disagreement-01` | Leadership | Strong decision-context evidence, but only fits a facilitator/manager. | “निर्णय-स्वामी” is literal and awkward. | Medium. | Frame as “if you are facilitating”; replace with “निर्णय लेने वाला व्यक्ति”. | Revise before RC |
| `customer-delay-01` | Customer service | Clear for customer-facing roles. | Natural. | Medium: A is visibly ideal. | Add an option that acknowledges a need to verify facts before offering options. | Revise before RC |
| `partner-quiet-01` | Close relationship | Valuable but safety-sensitive; giving space can be appropriate. | Natural. | High: C is scored negatively despite potentially being respectful. | Add explicit safety/context caveat and avoid treating space as inherently poor listening. | Revise before RC |
| `stress-sharp-message-01` | Stress | Good context, but immediate frustrated reply is morally loaded. | “तीखा” is natural. | Medium-high. | Use less moralised alternatives and make clarification/pausing equally concrete. | Revise before RC |
| `meeting-dissent-01` | Disagreement | Meaningful, but silence or private follow-up can be safer under hierarchy. | Natural. | High: A/B look preferred, C/D look weak. | Add power-dynamic and safety-aware wording; score private follow-up contextually. | Revise before RC |
| `family-boundary-01` | Family | Boundary topic is valuable but needs strongest safety treatment. | Natural and direct. | High: D can be unsafe; A is visibly “correct”. | Explicitly allow no answer, leaving, or seeking support; avoid rewarding disclosure. | Revise before RC |
| `remote-channel-preference-01` | Remote work | Good channel-adaptation scenario. | Natural. | Medium: A is strongly optimal; D over-accommodates. | Add constraints such as accessibility, workload, or documentation needs. | Revise before RC |
| `feedback-tone-impact-01` | Feedback | Useful feedback-receiving evidence, but option A is clearly preferred. | “उपेक्षापूर्ण” is accurate but formal and accusatory in this context. | High. | Use: “उन्हें लगा कि आपके बोलने के ढंग में उनकी बात को कम महत्व मिला।” Consider a more equally plausible explanation-first option. | Revise before RC |

### Coverage finding

The set has strong workplace coverage but relatively thin non-work, low-power, and safety-aware variation. It does not measure “slower processing”; the requested deliberate profile can be approximated only by decision-alignment and inquiry choices. Publication copy should not imply that decision speed is measured.

## Scoring and result review

Six deliberate response profiles were evaluated through `AssessmentService(allow_test_drafts=True)`.

| Profile | Direction/confidence summary | Result quality | Verdict |
| --- | --- | --- | --- |
| Direct/assertive, lower emotional expression | Directness higher/clear; clarity and inquiry higher; several dimensions limited; feedback/audience lower. | Coherent direction, but the intended lower emotional-expression pattern remained limited because it has insufficient independent evidence. | Needs more evidence coverage |
| Listening-oriented, lower assertion | Listening higher/clear; assertion lower/clear; several strengths; one blind spot. | Most useful current result. Weekly experiment fits lower assertion. | Directionally sound |
| Conflict-avoidant, emotionally expressive | Emotional transparency higher/clear; conflict navigation, assertion, clarity lower. | Coherent and cautiously worded; only one strength and one suggestion. | Needs richer output coverage |
| Curious/adaptable, lower alignment | Inquiry/clarity/adaptability higher; alignment limited. | The tool cannot substantiate “slower processing”; this must not be claimed. | Scope limitation |
| Mixed/context-dependent | Inquiry balanced/mixed; several lower patterns; many dimensions limited. | **Zero strengths and zero misunderstandings.** Empty result sections reduce trust and feel unfinished. | Release blocker |
| Contradictory/low-evidence | A mix of higher/lower and limited results. | Confidence is cautious, but the result still supplies only one practical suggestion. | Needs richer low-confidence path |

The engine has no overall score or percentage, and personality context adds only a safe explanatory note; it does not change scoring. Those are approved behaviours.

### Required scoring/output revisions

- Guarantee a useful, cautious fallback item for each visible result section or conditionally omit empty sections in the UI.
- Author at least two to three practical suggestions that correspond to the selected pattern; do not repeat the weekly experiment verbatim as the only suggestion.
- Add independent scenario evidence for emotional transparency and other dimensions that often remain limited.
- Document and test the intent of every score-weight revision. Do not alter weights merely to force a desired profile.

## Result experience review

The summary hero, evidence explainer, qualitative pattern map, and optional save CTA are well placed. The result does not look like a corporate score dashboard. The account prompt follows the result, preserving guest-first value.

However, empty titled cards (“Places to notice” and “Misunderstandings that can happen”) appeared in a high-pattern browser result, and the mixed profile produced both empty strengths and misunderstandings. This is a material comprehension and trust issue. The weekly experiment is promising but currently duplicates the sole practical suggestion. Result return-use is consequently not compelling enough for a public release.

## English and Hindi editorial gate

**English: not approved for RC.** Several answer sets need plausibility and safety revisions.

**Hindi: not approved for RC.** The prose is generally natural, but terminology is not consistent between the analyzer configuration and frontend result labels:

- `receptive-listening`: “सक्रिय सुनना” vs “ध्यान से सुनना”
- `emotional-transparency`: “भावनात्मक स्पष्टता” vs “भावनात्मक पारदर्शिता”
- `constructive-assertion`: “रचनात्मक आग्रह” vs “रचनात्मक दृढ़ता”
- `conflict-navigation`: “मतभेद सँभालना” vs “असहमति संभालना”

Recommended standard term for **Constructive assertion**: “स्पष्ट और सम्मानजनक आग्रह”. The flagged phrase **“Tone felt dismissive”** should use the less accusatory, more conversational wording proposed in the scenario table.

## Accessibility review

### Passing

- Public landing has one H1 and logical headings.
- Scenario choices are native radio controls within a labelled group.
- Continue is disabled until an option is selected.
- Progress has `role=progressbar` plus an accessible label and values.
- Visible global focus styling and reduced-motion CSS are present.
- FAQ uses native `details`/`summary` controls.
- Landing pages at 320 px show no horizontal overflow; Hindi headings render without clipping.

### Required revisions

- Replace or redesign in-flow Back. It is predictable as browser history, but not safe as an assessment action because it strands an existing session without a resume CTA.
- Associate rejected-response errors with the response group in addition to the generic alert.
- Verify all large option labels retain an approximately 44 px touch target at 320 px after final content edits.
- Add keyboard-only regression coverage for selecting a radio with Space and continuing with keyboard focus.

## Privacy and security review

### Passing

- Source review confirms the browser stores only opaque session/resume metadata in `sessionStorage`, not raw responses; nothing is written to `localStorage`.
- The token is sent only as `X-Assessment-Access` to the engine adapter and is not passed to analytics.
- Result access requires the opaque token; invalid access receives the generic unavailable response.
- The next-scenario API excludes score weights and scoring rules.
- Start, session, and result routes use `noindex, nofollow`; private paths are absent from the sitemap.
- Normal `AssessmentService()` rejects the draft configuration. Draft access used during this review was explicit and local only.

### Required confirmation before publication

- Add an automated assertion that application logs never include response payloads or result content once persistent production repositories are introduced.
- Define a server-side account-claim persistence contract before marketing “Save this result” as an available capability; current CTA appropriately says “Explore save options.”

## SEO review

Both public landing pages pass raw-HTML crawlability checks: locale-specific title and description, self-canonical, hreflang including `x-default`, H1, visible FAQ, BreadcrumbList and FAQPage JSON-LD, internal links, and sitemap inclusion. They are indexable and are not blank client shells.

The start, session, and result routes are noindex and omitted from sitemap. Their generic metadata avoids exposing private result content. No SEO blocker was found.

## Publication gate

| Mandatory approval | Status | Basis |
| --- | --- | --- |
| Product owner | APPROVED | Nikhil Shrivastava approved the reviewed RC1 scope on 2026-08-04. |
| English editorial | NOT APPROVED | Scenario plausibility and desirability revisions required. |
| Hindi editorial | NOT APPROVED | Terminology parity and two context-sensitive revisions required. |
| Scoring review | NOT APPROVED | Output coverage and evidence gaps required. |
| Accessibility review | NOT APPROVED | Back/resume flow must be corrected. |
| Privacy review | APPROVED WITH CHANGES | Current guest flow is sound; future persistent logging/claim requirements remain. |
| Safety review | NOT APPROVED | Family, relationship, dissent, and hierarchy contexts require revision. |
| Technical QA | NOT APPROVED | Empty result sections and Back/resume regression block release. |

## Required path to an RC

1. Preserve `communication-analyzer@1.0.0-draft` unchanged.
2. Author a separate immutable candidate, for example `communication-analyzer@1.0.0-rc1`, only after the content, result-coverage, and Back/resume fixes are reviewed.
3. Record candidate-specific approvals, locale parity, scoring/interpretation versions, and a content hash. Keep publication date unset until release approval.
4. Run deterministic profiles, full browser flow, accessibility regression, privacy/logging review, and all build/test checks again.
5. Change status to published only after every mandatory gate is approved.

## Validation record

- Backend compilation and full pytest suite: **14 passed** (existing framework deprecation warnings only).
- Next lint, production build, and crawlability/content test suite: passed during the MVP implementation; the local draft-mode build also compiled successfully for this review.
- `git diff --check`: required again before committing this review document.

## Final recommendation

**REVISIONS REQUIRED.** The analyzer must remain `review`/unpublished. No RC configuration was created, no scoring weights were changed, and no production access was enabled.

## Revision follow-up — 2026-08-04

The approved prepublication fixes were implemented while keeping `communication-analyzer@1.0.0-draft` unpublished:

- Active sessions now expose safe scenario order and a selected-answer view only to the holder of the opaque access token. A `PUT` response endpoint revises an active answer; completed sessions remain immutable.
- Scenario Back fetches the preceding server-held answer instead of relying on browser history. First-scenario Back shows an explicit leave confirmation.
- `friend-plan-cancel-01`, `partner-quiet-01`, `meeting-dissent-01`, `family-boundary-01`, and `feedback-tone-impact-01` were revised for safer trade-offs and lower desirability risk. Existing dimension intent was retained; no score values were changed in these revisions.
- Result composition now has generic, deterministic fallbacks: three constructive assets, three growth edges, two possible misunderstandings, three distinct recommendation IDs, and one separate weekly experiment for every completed result. Fallback wording remains provisional for mixed and limited evidence.
- `COMMUNICATION_ANALYZER_HINDI_GLOSSARY.md` is the approved terminology source. The contextual tone-feedback phrase and Constructive assertion label were aligned.

The remaining formal gates are product-owner, English editorial, Hindi editorial, scoring, accessibility, privacy, safety, and technical QA confirmation after the revised browser and six-profile regression run. The analyzer remains review-only until those approvals are recorded.

### Revised six-profile regression summary

The direct/assertive, listening-oriented, conflict-avoidant/emotionally expressive, curious/adaptable, mixed/context-dependent, and contradictory profiles each now produced at least three constructive assets, three growth edges, two possible misunderstandings, three unique recommendation IDs, and a separate weekly experiment. Mixed evidence uses provisional/context-aware fallback wording rather than a directional claim. The “slower processing” profile remains a scope limitation: this analyzer does not claim to measure processing speed.

## Final RC QA follow-up — 2026-08-04

The final local draft-mode browser QA identified and corrected Hindi result localization that had exposed English dimension IDs and internal score labels. Result direction and confidence labels now use the approved Hindi glossary, and generated fallback prose resolves dimension names from the localized analyzer definition rather than from internal IDs. No scoring weights, scenarios, or publication status changed.

The subsequent English and Hindi browser flows completed all twelve scenarios, exercised first-step leave confirmation, restored and revised a previous answer, completed to a protected result, and showed no browser console or hydration errors. The six deliberate profile fixtures continue to satisfy the result coverage and unique-recommendation requirements.

This engineering QA does not substitute for the named human approval roles. The analyzer remains review-only until product-owner, English editorial, Hindi editorial, scoring/content, accessibility, privacy/security, and safety/ethics approvals are explicitly recorded for the candidate.

### Final blocker follow-up — 2026-08-04

- The in-flow Back control now has a practical 44 px mobile target while retaining its text-style appearance. It measured 49 × 44 px at 320 px and 44 px high at 375 px, with no overlap or horizontal overflow.
- A local fault-injection proxy verified recovery after session creation, scenario fetch, answer submission, completion, and result-fetch failures. Completion recovery exposed a same-answer retry edge case; it was fixed so an already saved, same-choice response is safely idempotent. Result retrieval now provides an in-place Retry rather than requiring a new reflection.
- The available in-app browser did not provide a reliable native-radio Space/Arrow emulation and no manual VoiceOver/NVDA session was available. Accessibility therefore remains formally unapproved pending a real browser and assistive-technology pass.
- The formal approval register in `COMMUNICATION_INSIGHTS_RC_QA_REPORT.md` records unassigned human approvals rather than fabricating them. RC1 must not be created until every required reviewer is explicitly named and has approved or approved with non-blocking notes.
