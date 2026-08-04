# Behavior Intelligence Engine

## Executive summary

The Behavior Intelligence Engine is a reusable, versioned assessment platform for KalQLater’s scenario-based behavioural reflection tools. Its job is to turn authored scenarios and response options into transparent multidimensional signals, evidence-aware interpretations, coaching choices, a weekly practice, and—when a user opts in—private reassessment history.

It is **not** a diagnosis engine, a hiring screen, an employee-monitoring tool, or a label generator. The first module is the Communication Style Analyzer described in `COMMUNICATION_ANALYZER_PRODUCT_SPEC.md`. Future analyzers—Conflict Reflection, Leadership Style, Decision Style, Team Dynamics, Meeting Style, Negotiation Style, Learning Style, Productivity Style, and a Relationship Conversation Planner—should use the same content, session, scoring, interpretation, and privacy contracts rather than bespoke quiz logic.

The recommended delivery path is deliberately modest: authored versioned content, deterministic server-side scoring, a guest-first session flow, qualitative confidence, and rule-based interpretations. Adaptive testing, benchmarks, AI, historical comparisons, and group features come only after validation, consent, and operational foundations exist.

## 1. Non-negotiable system principles

| Principle | Product and implementation constraint |
|---|---|
| Behavioural reflection, not diagnosis | Describe self-reported tendencies in a stated context. Never infer clinical status, ability, eligibility, truthfulness, or compatibility. |
| Scenario-based input | Use concrete situations and plausible actions; prohibit self-praise statements such as “I am a good listener.” |
| Multidimensional outputs | Do not reduce a person to one type, grade, rank, or universal overall score. |
| Uncertainty is visible | Every result carries evidence confidence; mixed or sparse evidence changes wording and recommendations. |
| Coaching, not judgment | Surface trade-offs, repair moves, and voluntary experiments—not defects to correct. |
| Accessibility by design | Keyboard operation, screen-reader semantics, high contrast, reduced motion, readable language, pause/resume, and non-time-pressured completion are release criteria. |
| Privacy by design | Collect only what the current experience needs; separate identity from responses; minimise logs; support export and deletion. |
| Modularity | Analyzers are configuration/content plus a shared engine. No analyzer-specific scoring code in a UI component. |
| Explicit versioning | Content, scoring, interpretation, locale, and results are tied to immutable versions. Retakes never silently re-score history with new rules. |
| Transparent scoring | Explain inputs, confidence, and limitations in plain language. Do not claim scientific validity until validation research supports it. |
| Bilingual from the model onward | Shared stable identifiers support English/Hindi content parity; Hindi is authored and reviewed as a locale, not string-substituted. |
| No high-stakes use | Terms, product controls, and data contracts prohibit hiring eligibility, performance ratings, clinical decisions, discipline, surveillance, and public ranking. |

## 2. Domain model

The following is a logical model, not a prescription for one collection per entity. “Content” is immutable authored configuration. “Persistent” is user/session data. “Derived” can be regenerated from an immutable result snapshot.

| Entity | Purpose and key fields | Relationships / versioning | Sensitivity / home |
|---|---|---|---|
| **Analyzer** | Stable product identity: `id`, `slug`, purpose, status, supported locales, safety category, owner. | Has many AnalyzerVersions; stable across releases. | Low sensitivity; content registry. |
| **AnalyzerVersion** | Immutable published contract: `id`, semantic version, analyzer id, content/scoring/interpretation versions, publish/retire dates, compatibility flags. | Owns dimensions, scenarios, rules, and locale manifests. A session pins one version. | Low sensitivity; content registry/Git for MVP. |
| **Dimension** | Stable conceptual axis: `id`, slug, display order, polarity statement, prohibited interpretations. | Reused only when meaning remains stable; versioned definitions may change wording. | Low sensitivity; content registry. |
| **DimensionDefinition** | Version-specific meaning: definition, high/low descriptions, blind spots, coaching boundaries. | Belongs to AnalyzerVersion and Dimension. | Low sensitivity; locale content. |
| **Scenario** | Behavioural prompt: `id`, category, difficulty, sensitivity tier, applicable contexts, estimated time, locale content key. | Belongs to one version; contains options; may be retired but remains available for historical rendering. | Low sensitivity; content registry. |
| **ResponseOption** | Plausible action: `id`, scenario id, response text, optional “not applicable”, ambiguity and social-desirability flags. | Has many ScoringRules. IDs remain stable inside a version. | Low sensitivity; locale content. |
| **ScoringRule** | Author-defined contribution: option id, dimension id, signed/partial weight, evidence strength, balancing signal, category tag. | Version-pinned. Never mutate after publish. | Low sensitivity; content/scoring registry. |
| **AssessmentSession** | In-progress attempt: opaque id, analyzer/version ids, owner state, locale, question plan, status, timestamps, expiry, nonce. | Has responses; yields one or zero snapshots. | Pseudonymous/personal; persistent short-lived storage. |
| **AssessmentResponse** | Chosen option, scenario id, display order, optional typicality, answer timestamp, response revision count. | Belongs to session and pinned content version. | Sensitive behavioural data; persistent with strict access. |
| **DimensionResult** | Derived per-dimension raw/normalised score, direction band, context sub-results, coverage. | Belongs to a ResultSnapshot; reproducible from responses and rules. | Sensitive derived data; snapshot. |
| **EvidenceConfidence** | Derived confidence band and explanation: coverage, context diversity, convergence, skips, caveats. | Per dimension and overall; algorithm version pinned. | Sensitive derived data; snapshot. |
| **InterpretationRule** | Authored condition and template mapping for summaries, interactions, caveats, and safety language. | Version-pinned; evaluated after scoring. | Low sensitivity; content registry. |
| **CoachingRecommendation** | Authored action: id, applicable dimensions/contexts, effort level, contraindications, locale text. | Selected into a snapshot, not generated freely. | Low sensitivity; content registry. |
| **WeeklyChallenge** | A selected recommendation instance: challenge id, user wording, context, completion state, due window. | May belong to guest session or account. | Personal behavioural data; persistent only with consent. |
| **ResultSnapshot** | Immutable completed result: opaque id, session id, analyzer/version ids, rendered data model, disclosures, generated timestamp. | Primary historical record; never retroactively overwrite. | Sensitive; persistent and access-controlled. |
| **ProgressRecord** | Optional longitudinal event: snapshot comparison, selected challenge, completion, private reflection note. | Links to an authenticated account or claimed guest result. | Sensitive; persistent, separately deletable. |
| **PersonalityContext** | Optional reference to a saved KalQLater personality result/version and user opt-in flag. | May annotate a snapshot; cannot affect analyzer score. | Sensitive preference data; authenticated storage. |
| **LocaleContent** | Localised authored fields keyed by stable content ids: prompt, responses, interpretation templates, accessibility labels. | Version, locale, translation-review status, parity checksum. | Low sensitivity; content registry. |
| **ConsentRecord** | Scope, version, timestamp, actor/session, withdrawal status: storage, account claim, personality overlay, reminders, AI later, team sharing later. | Attached to session/account/result as needed. | Sensitive compliance data; persistent audit record. |
| **GroupContext / TeamAssessment** | Future aggregate-only cohort metadata, participation consent, threshold, organisation scope. | Must never expose individual responses to managers; separate from individual result. | Highly sensitive; future-only persistent domain. |

### Relationships

`Analyzer → AnalyzerVersion → {Dimensions, Scenarios, ScoringRules, InterpretationRules, CoachingLibrary, LocaleContent}`

`AssessmentSession → AssessmentResponses → ResultSnapshot → {DimensionResults, EvidenceConfidence, SelectedInterpretations, Recommendations}`

`Authenticated account → claimed ResultSnapshots / ProgressRecords / optional PersonalityContext`

The session and result model should retain source version identifiers for every derived value. Historical snapshots render with the version that produced them, even after an analyzer evolves.

## 3. Content schema

For MVP, authored content belongs in reviewed, versioned files in Git within the new Next-oriented product area—not in a live admin interface. A build-time schema validator should reject malformed or incomplete content before release.

```json
{
  "analyzer": {
    "id": "communication-style",
    "slug": "communication-style",
    "version": "1.0.0",
    "status": "published",
    "locales": ["en", "hi"],
    "purpose": "Behavioural reflection on communication habits",
    "safety": { "notClinical": true, "notForHiring": true }
  },
  "dimensions": [{
    "id": "directness-with-tact",
    "range": { "low": "more indirect", "high": "more explicit" },
    "definitions": { "en": "…", "hi": "…" },
    "coachingBounds": ["Do not treat directness as universally better"]
  }],
  "scenarios": [{
    "id": "meeting-unclear-update-01",
    "category": "meeting",
    "contexts": ["work", "leadership"],
    "difficulty": "basic",
    "sensitivity": "standard",
    "evidenceStrength": 1,
    "content": { "en": { "prompt": "…", "responses": [] }, "hi": { "prompt": "…", "responses": [] } },
    "options": [{
      "id": "ask-decision-needed",
      "scoring": [
        { "dimensionId": "message-clarity", "contribution": 3, "role": "primary" },
        { "dimensionId": "collaborative-inquiry", "contribution": 1, "role": "secondary" }
      ],
      "ambiguity": "low",
      "socialDesirabilityRisk": "medium"
    }]
  }],
  "interpretationRules": [],
  "coachingLibrary": [],
  "challengeLibrary": [],
  "disclosures": { "en": ["…"], "hi": ["…"] }
}
```

### Authored versus calculated fields

**Authored:** IDs, descriptions, prompts, response text, scoring contributions, scenario metadata, interpretation conditions, coaching content, challenge content, safeguards, translation status.

**Calculated:** selected question plan, raw points, normalised values, coverage, convergence, confidence band, contextual differences, selected interpretation/recommendation IDs, and result snapshots.

### Schema safeguards

- Stable IDs are never reused for changed meaning.
- Every published English item must have a Hindi parity record or be explicitly unavailable in Hindi; do not fall back silently.
- Every scenario declares a sensitivity tier, category, dimensions measured, and review owner.
- Weights are bounded, documented, and independently reviewed.
- A balancing/reverse signal is metadata for confidence and bias checks; it is not a trick question or a penalty.

## 4. Scoring engine

### Recommendation

Use a **hybrid, deterministic model** for MVP:

1. signed multidimensional weighted sums;
2. normalisation by answered available evidence;
3. qualitative evidence confidence;
4. rule-based interpretation composition.

This is transparent, testable, bilingual, and appropriate before large validation datasets exist. Do not use Bayesian inference, normative percentile ranks, machine-learned classification, or a single overall communication score in MVP.

| Approach | Recommendation | Trade-off |
|---|---|---|
| Raw weighted sums | Necessary internal basis | Cannot compare dimensions with uneven item counts. |
| Normalised weighted sums | MVP default | Still reflects authored assumptions; show ranges, not precision theatre. |
| Bayesian evidence aggregation | Later, only with validated priors | Handles uncertainty elegantly but creates opacity and requires defensible data. |
| Rule-based interpretation | MVP default | Requires thoughtful content operations; avoids black-box prose. |
| ML/predictive scoring | Do not use for this product | High bias/overclaiming risk and no need for flagship value. |

### Calculation

For a dimension `d`:

`raw(d) = Σ(optionContribution × scenarioEvidenceStrength × optionalTypicalityFactor)`

`available(d) = Σ(maximum applicable contribution for answered scenarios)`

`normalised(d) = bounded transform of raw(d) / available(d)`

The user-facing output is a direction band—e.g., “often more explicit,” “balanced/mixed,” or “often more indirect”—with the underlying value used only for stable rule evaluation. Typicality must be optional and lightly bounded; it qualifies evidence, not “goodness.”

### Missing, skips, and randomisation

- Skipped/non-applicable items contribute neither points nor denominator.
- A dimension below minimum coverage returns “not enough evidence,” not a fabricated midpoint.
- A randomised subset must meet per-dimension and per-category coverage quotas before adding variety.
- Session plans are persisted so refresh/retry does not change questions or permit replay manipulation.
- A retake uses a fresh plan where possible while preserving comparable anchor scenarios for trend interpretation.

### Contradictory signals and bias

- Mixed responses reduce confidence only when comparable contexts and item meanings truly conflict.
- Context-specific variation is a finding, not inconsistency: e.g., direct in meetings, less direct in close relationships.
- Track repeated identical choices, implausibly fast completion, and response revisions as **quality flags**, never as deception labels and never as automated rejection.
- Social-desirability risk comes from item metadata and balanced alternatives; it adjusts interpretation certainty, not moral judgement.
- Acquiescence and extreme-answer bias are not primary risks with four-action scenario items, but pilots should test option-position and wording effects.

### Worked example

Scenario: “A colleague’s update is unclear.” The selected option is “Ask what decision they need.”

- Message clarity: +3
- Collaborative inquiry: +1
- Scenario evidence strength: 1.0

If the user provides similar signals in a remote-work thread and a leadership scenario, clarity coverage and convergence increase. If they select an indirect option in a family boundary scenario, the engine does **not** subtract “clarity” globally; it stores a possible context difference and lowers universal-confidence language.

## 5. Evidence confidence

### Inputs

- answered item count for the dimension;
- diversity of applicable contexts and categories;
- convergence across semantically related scenarios;
- strength and ambiguity of contribution rules;
- skips/non-applicable responses;
- optional typicality;
- non-diagnostic quality flags such as very rapid completion or repeated choice patterns.

### User-facing bands

| Band | Meaning | Wording rule |
|---|---|---|
| Emerging evidence | Sparse, narrow-context, or mixed signal | “Your answers offer an early signal…” |
| Useful signal | Adequate coverage and moderate convergence | “Your answers suggest…” |
| Consistent signal | Broad coverage and repeated pattern across contexts | “Across these scenarios, you often…” |

Confidence is not accuracy, truth, a clinical reliability coefficient, or a measure of self-awareness. Low confidence suppresses strong claims, cross-context generalisations, and prescriptive coaching. It should be visible near each dimension, explained in plain language, and available to screen readers.

## 6. Question-selection engine

### MVP: fixed, balanced sequence

- 12–15 core scenarios only, in a deterministic but mixed order.
- Each of 8–10 dimensions receives at least two observations; each major context has representation where practical.
- No adaptive logic, benchmark targeting, or hidden “consistency test.”
- Skip and resume are supported; the same plan returns on resume.

### Future: constrained adaptive selection

1. Establish minimum dimension and category coverage.
2. Select next scenario from under-covered dimensions, excluding recently shown and emotionally sensitive items unless user opted in.
3. Prefer a new context when current evidence is narrow.
4. Use discriminating follow-ups only when they improve useful confidence—not to maximise time or precision.
5. Enforce exposure caps so no dimension, context, or difficulty band dominates.
6. For retakes, rotate non-anchor scenarios and retain a small comparable anchor set.

Question plans are generated server-side from the pinned AnalyzerVersion and recorded in the session. The client only renders the plan; it does not choose or score it.

## 7. Interpretation engine

Numeric tendencies become helpful language through a composable hierarchy:

1. **Base dimension interpretation:** band + definition + useful context.
2. **Confidence modifier:** soften or defer claims when evidence is emerging.
3. **Cross-dimension pattern:** describe supported combinations (e.g., high clarity + lower emotional transparency).
4. **Context difference:** prefer “at work” / “in close relationships” over universal claims.
5. **Personality-context overlay:** optional and non-causal.
6. **Coaching selection:** choose effort-calibrated, behaviour-specific practices.
7. **Safety and uncertainty layer:** apply disclosures and prohibit harmful inferences.

Example composition:

> Base: “You often make the purpose and next step explicit.”
> Confidence: “This is a useful signal from work and remote scenarios.”
> Interaction: “Because you also selected concise responses under stress, some people may receive the action without the reasoning.”
> Coaching: “For one update this week, lead with the decision, then add one sentence on why it matters.”

The engine selects authored fragments and rules; it does not produce free-form psychological interpretations. Rules should include conditions, exclusion conditions, priority, locale template IDs, evidence requirements, and safety notes.

## 8. Results model

No overall communication score is recommended. A reusable `ResultSnapshot` should contain:

- overall pattern summary (not a grade);
- dimension profile and evidence confidence;
- three strengths and up to three possible blind spots;
- context differences when adequately supported;
- likely misunderstandings framed conditionally;
- practical suggestions, scripts, and one selected weekly challenge;
- related tools and retake recommendation;
- optional personality-context overlay;
- disclosures, analyzer version, and generated time.

### Visibility tiers

| Tier | Contents | Default |
|---|---|---|
| Shareable summary | Chosen title, selected strengths, optional challenge, no raw responses or granular dimensions by default | User initiates and can revoke. |
| Private detailed result | Full dimensions, caveats, interpretations, response-derived context notes, challenges | Available only to result owner. |
| Progress dashboard | Claimed snapshots, explicit comparisons, challenge history and reflections | Authenticated, opt-in. |

## 9. Progress and retention

### MVP

- Baseline result.
- One optional weekly challenge, local/session-persisted for guests and saved for authenticated users.
- An optional reminder after 30 days.
- No streaks, trends, leaderboards, or “improved score” language.

### Later

- Challenge completion and short pulse check.
- Private reflection notes.
- Monthly reassessment with version-aware comparison.
- Trends labelled “change in self-reported scenarios,” never improvement by default.
- Optional, non-punitive practice consistency indicator.
- Recommendation of a next tool only from user-selected goals, not inferred deficits.

## 10. Platform architecture

### Fit with KalQLater’s stack

- **Next.js:** preferred frontend for all new analyzer journeys, result pages, authenticated history, and public explainer/SEO pages.
- **CRA legacy:** remains untouched; provide full-document links to analyzer routes while hybrid migration continues. Do not add analyzer logic to CRA.
- **FastAPI:** authority for sessions, question plan issuance, response validation, scoring, result access/claiming, rate limiting, audit-safe analytics events, and deletion/export workflows.
- **MongoDB:** persistent sessions, responses, snapshots, consent, progress, and version-indexed content manifests when content outgrows Git-only delivery.
- **Vercel / Render:** continue existing deployment boundaries; no environment or proxy change is required by this design.

### Responsibilities

| Concern | Client | Server |
|---|---|---|
| Render prompts and accessibility state | Yes | Provides locale content/plan |
| Select questions | No | Yes, persisted plan |
| Validate response option belongs to plan/version | No | Yes |
| Score and interpret | No | Yes, deterministic engine |
| Cache static analyzer metadata | Yes, safely | Authoritative manifest/version |
| Persist guest ownership | Holds opaque, HttpOnly token/cookie where feasible | Validates signed, expiring session capability |
| Account claiming | Initiates user action | Atomically binds eligible guest result after authentication |

### Guest and account model

Guests receive an opaque session identifier plus a short-lived signed capability stored in a secure cookie where architecture permits. Do not expose raw response data in URLs or browser storage. A guest can see a completed result, then optionally create/sign into an account; a one-time claim token atomically attaches the result after explicit consent. Accounts may save history, connect personality context, and manage deletion/export.

### Operational safeguards

- Rate-limit start, response, completion, claim, and share actions by IP/device/session with privacy-respecting thresholds.
- Idempotency keys protect session creation, response submission, completion, claim, and challenge creation.
- Completion is replay-safe: same idempotency key returns same snapshot.
- Cache immutable published analyzer manifests by version and locale; never cache personal results publicly.
- Logs retain request IDs, status, and aggregate timings—not response choices, free text, tokens, or email.

## 11. Conceptual API contracts

These are contracts, not implementation instructions.

| Endpoint | Purpose / auth | Key request and response fields | Controls / failure states |
|---|---|---|---|
| `GET /api/analyzers/{slug}` | Public metadata and current published locale manifest | Locale, analyzer/version metadata, consent disclosure | Cacheable; 404 unavailable locale/version; no scoring rules if unnecessary client-side. |
| `POST /api/analyzers/{slug}/sessions` | Start guest or authenticated session | `locale`, optional context choices, consent receipt → `sessionId`, expiry, next cursor | Rate-limit; idempotency key; 409 active-session policy; 422 invalid locale/consent. |
| `GET /api/analyzer-sessions/{id}/next` | Get next planned scenario | Signed guest capability or owner auth → scenario display object, progress | No raw rules; 401/403 ownership; 410 expired. |
| `POST /api/analyzer-sessions/{id}/responses` | Save/revise one planned response | scenario id, option id, optional typicality, idempotency key → accepted revision/progress | Server validates plan/version; reject duplicate conflict, unknown option, expired/completed session. |
| `POST /api/analyzer-sessions/{id}/complete` | Score once and create snapshot | idempotency key → result id, summary, next actions | Replay-safe; requires plan minimum/skip handling; 409 already complete returns same snapshot. |
| `GET /api/analyzer-results/{id}` | Read private or deliberately shared result | Owner auth, guest capability, or scoped share token → tier-appropriate snapshot | Never return raw responses on a public share link. |
| `POST /api/analyzer-results/{id}/claim` | Bind guest result to authenticated user | one-time claim capability, consent → ownership confirmation | Auth required; atomic; 409 already claimed/expired. |
| `POST /api/analyzer-results/{id}/challenge` | Create/update selected weekly challenge | selected authored challenge id, context, idempotency key → challenge state | Owner/guest capability; no free-text in MVP. |
| `GET /api/users/me/analyzer-history` | Authenticated history | pagination, analyzer filter → private snapshot summaries | Auth required; pagination; excludes deleted/withdrawn records. |

All mutation responses use plain error codes and safe messages. They do not reveal whether another account owns a result or any private analyser state.

## 12. Guest and authenticated journeys

### Guest

1. Start immediately after disclosure acknowledgement—no signup wall.
2. Complete, receive a full useful private result in the same browser.
3. Offer account creation only after value: “Save this result and revisit your practice.”
4. Preserve return state through signup/login and present a clear claim confirmation.
5. Expire unclaimed behavioural responses on a short, disclosed schedule; allow deletion from the result screen.

### Authenticated

1. Start or resume a session.
2. Save history, a weekly challenge, and optional reflection notes.
3. Explicitly opt in to personality context; result remains complete without it.
4. Compare version-aware retakes only after enough time/context change.
5. Manage export, sharing, reminders, and deletion in account privacy controls.

Do not prompt signup before first result. The only earlier prompt should be a user-initiated pause/resume request that truly needs cross-device persistence.

## 13. Privacy, retention, and data classification

| Data | Sensitivity | Minimum retention recommendation |
|---|---|---|
| Scenario option selections | Sensitive behavioural reflection | Guest expiry (for example 30 days) unless claimed; account until deletion/retention policy. |
| Free-text reflections | High sensitivity | Do not collect in MVP; later opt-in, encrypted, separately deletable. |
| Personality type/context | Sensitive preference data | Store only after explicit overlay consent; remove independently. |
| Result summary / dimensions | Sensitive derived behavioural data | Same owner controls as responses; public shares are limited view. |
| Progress/challenge history | Sensitive behavioural data | Opt-in for persistence; delete independently. |
| Team aggregates | Highly sensitive workplace data | Future-only, thresholded, governed retention. |
| Future conversation samples for AI | Extremely sensitive | Never default-store; explicit, granular consent and short purpose-bound retention. |

Expect encryption in transit and at rest, strict access controls, auditable deletion, data export, and no secrets/private fields in analytics or logs. Account deletion must cascade or irreversibly de-identify claimable sessions, results, challenges, and notes according to disclosed retention requirements. Do not store raw personal conversations by default.

## 14. Bias, safety, and ethics

### Safeguards

- Diverse cultural, linguistic, disability, neurodiversity, gender, age, relationship, and workplace-context review before publishing scenarios.
- Explicit exclusions for hiring, promotion, discipline, clinical assessment, relationship safety judgement, and manager surveillance.
- Conflict/relationship prompts avoid asking users to reveal abuse; surface support resources and an exit path when appropriate.
- No “ideal” answer key, rank, compatibility prediction, or manager-visible individual profile.
- Scenario and coaching review includes a product owner, content designer, behavioural-science reviewer when available, Hindi editor, accessibility reviewer, and privacy/ethics reviewer for sensitive modules.
- Report and retire mechanism for harmful, ambiguous, culturally narrow, or stale content.

## 15. Localization architecture

English and Hindi share stable analyzer/scenario/option/rule IDs, but each locale owns natural prompts, response plausibility, examples, scripts, and disclosure language. Translation is not a post-release string task.

- Locale manifest includes translation status, reviewer, parity coverage, and content version.
- Scores use the same conceptual contribution graph only after localisation review confirms response equivalence; otherwise locale-specific scoring rules are allowed and versioned.
- UI supports text expansion, Devanagari typography, assistive technology labels, and no clipping at narrow widths.
- Future locales are additive manifests, not copied hardcoded components.
- Locale QA validates all stable IDs, option count, rules, disclosure presence, and culturally appropriate phrasing.

## 16. Content operations

### Authoring lifecycle

1. Product owner proposes dimension/use case.
2. Content designer drafts scenarios and responses.
3. Behavioural-science and bias review checks construct and harm risk.
4. Hindi/localisation review adapts scenario meaning.
5. Scoring review documents weights, balancing signals, and interpretation limits.
6. Pilot with cognitive interviews and usability/accessibility testing.
7. Revise, validate schema, publish immutable version.
8. Monitor completion, skips, quality flags, user feedback, and fairness signals.
9. Retire/replace content with migration notes; preserve history rendering.

For MVP, reviewed Git files and pull-request checklists are preferable to an admin tool. A future internal console may support version drafts, locale review, scoring preview, publish, rollback, content flags, scenario retirement, and aggregate performance metrics—never direct editing of a published version.

## 17. Privacy-safe analytics and experimentation

### Permitted event taxonomy

`analyzer_viewed`, `analyzer_started`, `scenario_answered`, `analyzer_completed`, `result_viewed`, `recommendation_opened`, `challenge_started`, `challenge_completed`, `result_claimed`, `retake_started`.

Events may include analyzer slug/version, locale, coarse session state, anonymous completion timing bucket, and non-identifying aggregate counters. They must not include response text, option IDs tied to identity, email, credentials, raw answers, personality type unless separately consented and non-identifying, or sensitive free text.

### Useful metrics

- start and completion rate;
- median time per scenario in aggregate;
- abandonment point by scenario version/category;
- result engagement and recommendation opening;
- post-value signup/claim rate;
- challenge return and retake rate;
- accessibility and locale completion parity;
- quality flags at population level.

Experiments must not covertly vary safety disclosures, alter scoring for a user without versioning, or test coercive signup patterns.

## 18. Testing strategy

| Test area | Example assertions |
|---|---|
| Schema validation | Published analyzer has unique IDs, complete locale manifest, bounded weights, and required disclosures. |
| Deterministic scoring | Given a pinned response fixture, raw values, bands, and confidence are exact and reproducible. |
| Snapshot rendering | A versioned result fixture renders the same dimensions, caveats, and selected rules after later versions publish. |
| Question coverage | Fixed/randomised plan meets minimum dimension, category, difficulty, and locale coverage. |
| Locale parity | Every active English stable ID has reviewed Hindi equivalent and valid option/rule references. |
| Accessibility | Keyboard completion, labels, error recovery, skip/resume, contrast, reduced motion, and screen-reader result equivalents. |
| API authorisation | Guest capability and account ownership prevent reading/mutating another result or raw responses. |
| Idempotency | Retrying start/response/complete/claim returns same safe outcome without duplicates. |
| Version migration | Existing results remain bound to old content; new sessions use only published version. |
| Privacy/logging | No response selection, token, free text, or identity appears in logs/analytics fixtures. |
| Performance | Manifest caching, response latency, completion concurrency, and no N+1 result loading. |
| Bias review | Checklist and pilot sign-off for every scenario/locale/coach rule. |

## 19. Strict MVP boundary

### Include

- One analyzer: Communication Style Analyzer.
- 8–10 dimensions.
- Fixed 12–15 scenario plan.
- Deterministic normalised weighted scoring.
- Qualitative evidence confidence.
- Rule-based private result with strengths, caveats, suggestions, and one weekly challenge.
- Guest completion, optional post-result signup/claim, English-first authored content with Hindi release only after parity review.
- Versioned content files, server-side scoring, safe analytics, deletion/expiry controls.

### Exclude

- Adaptive selection, population benchmarks, percentiles, overall score, and claims of psychometric validation.
- AI, free-text analysis, conversation uploads, team data, manager access, HR features, and coach portals.
- Progress dashboard, streaks, social sharing by default, public result profiles, and leaderboards.
- Deep CRA integration or any change to hybrid routing, Render, Vercel, MongoDB configuration, or legacy Community/Jobs flows.

## 20. Evolution roadmap

| Phase | Scope | Prerequisites |
|---|---|---|
| **MVP** | Communication Analyzer with fixed scenarios, deterministic scoring, qualitative confidence, guest result, optional claim, one challenge. | Content schema, version pinning, privacy controls, pilot review. |
| **V1.1** | Saved history, retakes, challenge persistence, version-aware comparison. | Account claim flow, deletion/export, stable anchors, no benchmark claims. |
| **V2** | Additional analyzers, constrained adaptive selection, private progress tracking. | Proven schema reuse, coverage testing, content operations maturity. |
| **V3** | Team Dynamics and group tools using consented, thresholded aggregates; manager safeguards. | Legal/privacy review, group governance, anti-reidentification architecture. |
| **V4** | Opt-in AI reflection/drafting, coaching workflows, enterprise controls. | AI consent model, safety evaluation, data governance, human escalation design. |

## 21. Open questions

1. What regulatory and geographic privacy requirements define the initial retention window?
2. Is Hindi part of MVP launch or a gated release after dedicated cognitive testing?
3. Which authenticated identity/session mechanism will be the canonical owner model as Next migration progresses?
4. What level of independent behavioural-science review is available before public “evidence confidence” wording ships?
5. What explicit user goal taxonomy should select coaching without inferring deficits?
6. Who owns content incident response and the decision to retire a published scenario?

---

**Status: ENGINE ARCHITECTURE READY**
