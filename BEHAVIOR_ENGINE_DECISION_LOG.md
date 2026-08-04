# Behavior Intelligence Engine — Decision Log

This log records the architecture choices for the shared engine. Decisions are recommendations until implementation is explicitly approved.

| Decision | Recommendation | Rationale | Alternative / trade-off | Revisit trigger |
|---|---|---|---|---|
| Scoring location | Run scoring and interpretation server-side in FastAPI. | Keeps rules authoritative, prevents tampering, protects incomplete content, and gives reproducible snapshots. | Client scoring is faster offline but exposes rules and risks divergence. | Offline-first requirement or a validated edge-compute need. |
| Content storage | Use reviewed, versioned Git files for MVP; validate at build/release time. | Lowest operational complexity and strongest review trail for one analyzer. | Admin CMS enables non-engineers but adds approval, rollback, and security complexity. | More than two analyzers or frequent non-engineering releases. |
| Session persistence | Guest sessions use opaque server records plus expiring signed capability; do not encode responses in URLs/local storage. | Supports guest value while protecting behavioural data. | Require account before start simplifies ownership but harms value-first conversion. | Legal requirement for authenticated-only storage. |
| Account claiming | Offer save/signup only after complete result; atomically bind an unclaimed guest snapshot with explicit consent. | Preserves return state and avoids forced signup. | Anonymous results only, or signup before results. | Abuse/fraud signals or identity-provider constraints. |
| Versioning | Pin every session and result to immutable analyzer/content/scoring/interpretation/locale versions. | Historical results remain intelligible and reproducible. | Always render latest content is simpler but rewrites history. | Never relax; only improve migration tooling. |
| Confidence model | Use qualitative bands: Emerging evidence, Useful signal, Consistent signal. | Avoids false precision and supports transparent wording. | Numeric reliability score appears scientific but misleads without validation. | Validated measurement study supports a user-safe metric. |
| Benchmarking | No population comparisons or percentiles in MVP. | No representative consented dataset or validated norming. | “Compared with many INTJs” is attractive but unsupported. | Representative dataset, governance, validation, and fairness review exist. |
| Randomisation | Fixed balanced plan for MVP; constrained randomisation later. | Easier to test, explain, localise, and compare. | Randomisation reduces repetition but complicates coverage. | Retake experience needs freshness and coverage tests exist. |
| Adaptive testing | Defer. Use only after content bank scale and evidence research justify it. | Adaptive logic can create opaque, uneven experiences. | Early adaptive flow may shorten assessments but adds risk. | Validated item bank, coverage controls, and transparency review. |
| Free text | Exclude from MVP. | Free text is sensitive, hard to secure, and changes safety/AI obligations. | Reflection notes can be useful but require separate consent/deletion model. | Privacy controls, support policy, and value evidence are ready. |
| AI | Defer to V4; only opt-in drafting/rehearsal/reflection. | Core value must work without AI; avoid clinical or inferential overreach. | Early AI coach could increase engagement but magnifies safety/privacy risk. | Safety evaluation, granular consent, governance, and escalation design are complete. |
| Team features | Defer until V3; aggregate-only, consented, thresholded. | Individual reflection must not become surveillance. | Team sharing may drive revenue but creates power-dynamic risk. | Legal, organisational, privacy, and anti-reidentification controls mature. |
| Overall score | Do not create one. | The model describes trade-offs across dimensions; one number implies ranking. | A simple score is easier to market but misleading. | Only if a defensible, user-understandable construct is validated. |
| Personality integration | Optional, contextual overlay; never affects communication score. | Preserves independent behavioural evidence and avoids deterministic type claims. | Use type to pre-fill/re-weight questions would contaminate assessment. | Benchmarking exists and users explicitly ask for broader comparisons. |
| Monetisation boundary | Keep first useful result free; monetise depth, history, coaching tools, and consented products later. | Prevents paywalling self-understanding and reduces coercive data practices. | Gate full result before signup/payment. | Evidence that free value cannot sustain safe operation. |
| Localisation | Author English/Hindi as equivalent but culturally adapted content with shared stable IDs. | Direct translation can change scenario meaning and scoring. | String-only localisation is faster but unsafe. | A new locale requires dedicated review and parity tests. |
| Analytics | Measure aggregate funnel and engagement only; never emit raw answers, free text, identity, or sensitive behavioural data. | Product learning without surveillance. | Detailed event payloads enable analysis but create privacy risk. | Privacy review approves a narrowly scoped, de-identified study. |
| Admin tooling | No admin UI in MVP; use Git review and immutable releases. | Prevents unreviewed live scoring/content changes. | CMS accelerates operations but needs permissions/audit/rollback. | Content volume and review throughput become a bottleneck. |

## Mandatory architecture guardrails

- No hiring, performance, disciplinary, clinical, relationship-safety, or manager-surveillance use.
- No collection of raw conversations, diagnoses, or sensitive free text by default.
- No user result sharing without an explicit, revocable action.
- No silent re-scoring of history after a content/scoring update.
- No public ranking, leaderboards, “ideal” answer key, or improvement score.
- No benchmark or scientific-validation claim without real, documented research.

## MVP release gate

Before any implementation release, confirm:

1. Content schema and version identifiers are validated.
2. Deterministic scoring/result fixtures pass.
3. English/Hindi parity and accessibility review are complete for shipped content.
4. Guest expiry, claim, export, deletion, and consent flows are designed and tested.
5. Analytics/logging tests prove raw behavioural data is excluded.
6. Scenario, coaching, and safety content have documented human review.

---

**Status: ENGINE ARCHITECTURE READY**
