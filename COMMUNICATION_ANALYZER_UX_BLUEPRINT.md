# Communication Style Analyzer — UX Blueprint

## Experience promise

This should feel like a quiet, well-designed conversation—not a test, dashboard, or personality quiz. The user moves through one believable situation at a time, sees a considered reflection of their choices, and leaves with one small communication practice they can actually try.

The product should consistently communicate: **“There is no right way to communicate. We are noticing your patterns, together.”**

## 1. End-to-end user journey

| Stage | Purpose | Intended emotion | Primary CTA | Likely abandonment | Friction reduction |
|---|---|---|---|---|---|
| Landing | Establish purpose, safety, and value in under 20 seconds | Curious, unpressured | “Explore your style” | Feels like another quiz; fear of judgement | Lead with behavioural reflection, time estimate, privacy, and no-right-answer statement. |
| Introduction | Explain scenarios, pacing, and privacy | Safe, prepared | “Begin” | Unclear effort or data use | Say “about 8 minutes,” “you can pause,” and “you will see your result before any signup prompt.” |
| Expectations | Let user choose relevant contexts, optionally | Seen, in control | “Continue” | Too many settings | Defaults to a balanced mix; context choices remain optional. |
| Scenario flow | Gather behavioural choices without fatigue | Engaged, recognised | Select one response | Repetition, anxiety, self-doubt | One situation per screen, familiar language, back/skip/pause, gentle pacing. |
| Midpoint transition | Restore energy and signal progress | Encouraged | “Continue” | User doubts usefulness | Acknowledge the time invested; preview that patterns are beginning to emerge. |
| Analysis | Create a credible, meaningful pause before results | Anticipation, trust | Automatic continuation | Feels fake or slow | Tie each message to real completed work; maximum 3–5 seconds when scoring is immediate. |
| Results story | Make the user feel understood before exposing analytics | Recognised, reflective | “See your communication map” | Chart anxiety; overinterpretation | Begin with warm summary, conditional language, and evidence explanation. |
| Coaching | Turn reflection into one practical next action | Motivated, capable | “Choose this week’s practice” | Too much advice | Reveal one insight at a time; give two choices only when useful. |
| Weekly practice | Create a concrete return point | Hopeful, autonomous | “Keep this practice” | Feels like homework | Keep to 2–10 minutes, make it optional, show a safe context note. |
| Optional account | Save value after it has been delivered | In control | “Save my reflection” | Forced registration | Continue-without-account is equally visible; signup never blocks first result. |
| Return journey | Support deliberate reflection over score-chasing | Gently supported | “Check in next month” | Spam, pressure, unclear benefit | Opt-in cadence, one reminder, context-aware retake framing. |

## 2. Screen inventory

The MVP uses a focused 21-screen experience. Scenarios reuse a single screen pattern; the count below describes the narrative sequence, not 12 distinct implementations.

| # | Screen | Goal and content | Primary / secondary action | Typical time |
|---:|---|---|---|---:|
| 1 | Welcome | Title, one-sentence promise, “not a diagnosis or test,” estimated time | Explore your style / Learn how it works | 15 sec |
| 2 | How it works | Three simple principles: situations, no right answers, practical reflection | Continue / Back | 20 sec |
| 3 | Your pace and privacy | Pause/resume, skip, guest-first value, privacy summary | Begin / Back | 15 sec |
| 4 | Optional context lens | Work, close relationships, leadership, remote collaboration; “Use a balanced mix” default | Continue / Skip preferences | 20 sec |
| 5 | Scenario opening | “Imagine this situation…” and first low-stakes prompt | Choose a response / Pause | 30–45 sec |
| 6 | Scenario rhythm | Repeated one-decision screen, mixed scenario categories | Choose a response / Back, skip, pause | 30–45 sec each |
| 7 | Gentle midpoint | “You’re building a picture across different moments.” No claim of a result yet | Continue / Pause | 10 sec |
| 8 | Scenario rhythm, second half | Slightly more emotionally nuanced prompts; never pressure disclosure | Choose a response / Back, skip, pause | 30–45 sec each |
| 9 | Last scenario | “One last situation.” Acknowledge completion rather than celebrate a score | Choose a response / Back | 30 sec |
| 10 | Reflection transition | “You’ve looked at situations from work, connection, and pressure.” | See what emerged / Review answers | 10 sec |
| 11 | Analysis | Brief, truthful pattern-processing moment | Automatic / Back to answers | 3–5 sec |
| 12 | Result opening | Plain-language summary and evidence caveat | “See your communication map” / “How this was formed” | 30 sec |
| 13 | Communication map | Accessible horizontal dimensions with evidence markers | Explore strengths / Back to summary | 45 sec |
| 14 | Strengths | Three conditional, evidence-backed patterns | Continue / See map | 45 sec |
| 15 | Where messages may get lost | Up to three possible blind spots, presented softly | Continue / See strengths | 60 sec |
| 16 | Common misunderstandings | Two “someone may experience…” cards and repair language | See practical ideas / Back | 45 sec |
| 17 | Conversation ideas | Three short scripts or practices | Choose a weekly practice / Back | 45 sec |
| 18 | Weekly practice | One recommended small experiment, plus “choose another” | Keep this practice / Choose another, skip | 30 sec |
| 19 | Optional personality context | Opt-in only; connects rather than determines | Add my personality context / Not now | 20 sec |
| 20 | Save your reflection | Guest account invitation after full value; continue without account first-class | Save my reflection / Continue without an account | 20 sec |
| 21 | Return invitation | Optional 30-day check-in, private sharing controls, finish | Finish / Set a reminder | 15 sec |

## 3. Information architecture and result storytelling

### The reveal order

Never lead with a chart. The recommended order is:

1. **A meaningful summary:** “Your responses suggest that you often value clarity and thoughtful communication.”
2. **A useful nuance:** “In more emotionally charged moments, you may move toward solutions before checking what the other person needs.”
3. **A confidence explanation:** “This is a useful signal from the situations you answered—not a verdict on you.”
4. **The Communication Map:** a visual aid after the story has meaning.
5. **Strengths and trade-offs:** what helps, what can be misunderstood.
6. **Practical coaching:** three concise possibilities.
7. **One weekly practice:** the smallest credible next step.

### Exact MVP result structure

1. Eyebrow: “Your communication reflection” / “आपका संवाद चिंतन”.
2. Result title: a calm, descriptive phrase, never a type label—e.g., “Clear thinker, context-aware collaborator.”
3. Two-sentence narrative summary using “your responses suggest” and only supported context claims.
4. Evidence confidence explainer with a link to “How this was formed.”
5. Communication Snapshot: ten accessible horizontal indicators with labels such as “more often explicit ↔ more often indirect.”
6. Three likely strengths.
7. Three possible blind spots or trade-offs.
8. Two common misunderstandings.
9. Three conversation tips.
10. One Weekly Practice.
11. Optional personality-context note.
12. Retake guidance, related future tools, disclosure, sharing/privacy controls.

## 4. Microcopy system

### Tone rules

- Speak with the user, not at them.
- Use “may,” “often,” “in these situations,” and “your responses suggest.”
- Prefer concrete verbs over abstract claims.
- Never say “correct,” “wrong,” “weak,” “bad,” “failed,” “score,” “diagnosis,” or “perfect communicator.”
- Keep buttons short and active; make secondary paths reassuring rather than apologetic.

| Moment | Recommended microcopy |
|---|---|
| Landing headline | “Notice how you communicate when it matters.” |
| Landing subhead | “A short reflection on how you explain, listen, disagree, and reconnect.” |
| Primary start | “Explore your style” |
| Safety note | “There are no right answers here—only the responses that feel most like you.” |
| Time | “Usually about 8 minutes. You can pause whenever you need.” |
| Scenario opening | “Imagine this situation…” |
| Scenario transition | “Here’s another moment.” |
| Progress | “You’re building a picture across different situations.” |
| Midpoint | “You’re halfway through the reflection.” |
| Near finish | “A couple more moments, then we’ll look at what emerged.” |
| Pause | “Take your time. This reflection will be here when you return.” |
| Skip | “Skip this situation” |
| Skip confirmation | “That’s okay. We’ll work with the moments that feel relevant.” |
| Incomplete return | “Pick up where you left off” |
| Analysis | “Finding patterns in your responses…” |
| Analysis secondary | “Looking across different situations…” |
| Analysis tertiary | “Turning patterns into something practical…” |
| Results opening | “Here’s what your responses suggest.” |
| Confidence | “This is a reflection from the situations you answered—not a fixed label.” |
| Strengths title | “What may already work well for you” |
| Blind spots title | “Where a message can get lost” |
| Misunderstanding title | “How others might sometimes read it” |
| Tips title | “Small moves that can help” |
| Weekly practice title | “This week’s practice” |
| Challenge choose | “Try this practice” |
| Alternate challenge | “Show me another option” |
| Challenge success prompt | “What did you notice?” |
| Save value | “Keep this reflection for later” |
| Signup value | “Create an account to save this privately.” |
| Continue guest | “Continue without an account” |
| Save state | “Saving your reflection…” |
| Saved | “Your reflection is saved privately.” |
| Retry | “Try again” |
| Network error | “We couldn’t finish that just now. Your answers are still here—please try again.” |
| Session expired | “This reflection has expired to protect your privacy. You can begin a new one whenever you’re ready.” |
| Retake | “Revisit this after a meaningful month or a change in context.” |
| Reminder | “Remind me in a month” |

## 5. Scenario experience

### Anatomy of a scenario screen

1. Small category cue: “At work,” “With someone close,” or “Under pressure.” It provides emotional orientation, not a test classification.
2. Transition line: “Imagine this situation…” or “Here’s another moment.”
3. One prompt in a calm, large reading width.
4. Four response cards, each with enough whitespace to read before choosing.
5. A low-emphasis utility row: Back, Skip this situation, Pause.
6. A small journey indicator with time estimate—not a loud percentage or score.

### Interaction rules

- Selecting a response provides a subtle pressed/selected state, then advances after a short 250–350ms acknowledgement. Include an explicit Continue control for keyboard and reduced-motion users.
- Do not show why an answer was selected, what it “means,” or a running score during the questions.
- Preserve answer state when navigating back. Never punish revision.
- Optional “This situation is uncommon for me” belongs behind Skip or an overflow affordance, not as a fifth competing answer.
- Mix lower-stakes and higher-reflection contexts. Do not place two personal/high-sensitivity scenarios consecutively.

### Emotional rhythm

- Start with a low-stakes meeting or everyday coordination moment.
- Alternate professional, relational, and remote contexts.
- Place the most reflective stress/feedback item after the user understands the tone of the experience.
- End with a bounded, practical scenario—not a high-conflict or family-boundary scenario.
- The midpoint transition gives the user a breath without interpreting them early.

## 6. Progress design

### Recommended pattern: a journey indicator

Use a thin, calm line with four named landmarks, not a dominant percentage:

`Starting point → Everyday moments → Different pressures → Your reflection`

- The active landmark is announced to assistive technology.
- A small companion line gives realistic time: “About 5 minutes left.”
- If the estimate changes, say “A few moments left,” not an exact second count.
- Keep numeric progress available in a compact accessibility label such as “Situation 5 of 12,” but do not make it the visual headline.

### Milestone messages

- After 3: “You’re looking at more than one kind of moment now.”
- After 6: “You’re building a picture across different situations.”
- After 9: “A few more moments, then we’ll bring the patterns together.”
- After 12: “You’ve given this reflection enough context to become useful.”

Progress never suggests that faster completion is better. There are no streaks, points, achievements, or ranking cues during the assessment.

## 7. The analysis moment

### Purpose

The analysis screen gives the user a short breath between answering and receiving meaning. It may only last as long as real completion/scoring/persistence work requires. If scoring returns immediately, maintain a minimum 900ms transition for orientation and a maximum of 3–5 seconds total.

### Visual concept

A soft “signal constellation” appears: a few calm dots connect into lines, then settle into a simple path. It is not a brain, DNA, radar, spinning wheel, or scientific-looking instrument. The motion is low-amplitude, can be reduced or disabled, and has a static equivalent.

### Message sequence

1. “Finding patterns in your responses…”
2. “Looking across different situations…”
3. “Turning patterns into something practical…”

Only move through messages while actual processing is occurring. Do not fake a prolonged analysis or imply psychological inference. On a slow network, keep the same honest state and add “This is taking a little longer than usual. Your answers are safe.”

## 8. Result visuals and hierarchy

| Section | Visual treatment | Interaction / accessibility |
|---|---|---|
| Overall summary | Large text, quiet coloured accent, no score badge | Readable as a standalone text block. |
| Communication Snapshot | Horizontal “signal bars” with written low/high tendency labels and confidence chip | Bar is supplementary; each dimension has full text and keyboard focus. |
| Dimension card | One dimension at a time: summary, helpful context, possible trade-off, one suggestion | Expand/collapse native disclosure; never hide critical caveat. |
| Strengths | Three spacious cards with a helpful-context phrase | No trophy icons or superiority signals. |
| Blind spots | Softer “Where a message can get lost” cards | Warm neutral/amber accent, never danger red; clear repair move. |
| Misunderstandings | Paired “You may mean / someone may hear” layout | Clearly conditional; avoid claiming others’ intent. |
| Conversation tips | Small script cards, copied only by explicit user action | Use large touch targets and text alternatives. |
| Weekly Practice | One highlighted, bounded card with time/setting/safety note | “Try this practice,” “Show another,” and “Not now.” |
| Related tools | Quiet future-facing row at the bottom | No upsell interruption before first practice selection. |
| Retake | Calendar-like 30-day invitation, not a score comparison | Opt-in reminder only. |

## 9. Weekly practice: recommended naming and flow

**Use “This week’s practice.”** It feels lighter and more self-directed than “challenge,” more concrete than “experiment,” and less clinical than “intervention.” “Conversation experiment” can be a secondary label inside a practice detail.

### Practice card

- Title: “Ask before advising.”
- Why now: “Your responses suggest you may move quickly into solutions in close conversations.”
- Do: “Once this week, ask: ‘Would listening, ideas, or space help?’”
- Bound: “About 2 minutes.”
- Safety/context note: “Respect a ‘not now.’ This is not for a conversation that feels unsafe.”
- Reflection on completion: “What did you notice?”

The system offers one recommended practice and at most two alternatives. “Not now” is always available. Completion is a private reflection, not a claim of improvement.

## 10. Guest-save and account experience

### Value first

The full result is available to guests before any account invitation. Account creation never interrupts the initial story, map, strengths, or weekly practice.

### Placement

Place the primary save invitation after the user has chosen or dismissed a weekly practice, and repeat a quiet save link in the result footer.

### Save sheet

**Headline:** “Keep this reflection for later.”

**Body:** “Create an account to save this privately, revisit your practice, and compare future reflections. Your first result is already yours.”

Actions, in this order:

1. **Create a private account** — primary.
2. **Continue without an account** — equal clarity, secondary.
3. **How privacy works** — text link.

After signup/login, return the user to the same result and show: “Your reflection is now saved privately.” No repeated permission prompt; personality-context consent remains a separate optional step.

## 11. Mobile experience

### Layout and thumb reach

- One-column screen, 16–20px side padding at 375px, 16px at 320px only if readable.
- Primary response cards occupy the reachable central/lower area; fixed bottom action area never obscures content.
- Back, pause, and skip stay in the top utility bar or an accessible overflow sheet; they do not compete with answers.
- Use 48px minimum touch targets, visible focus rings, and no hover-only affordance.

### Question cards

- Four full-width cards with ample vertical spacing; no two-column response grid on mobile.
- Allow natural content height for Hindi text; never truncate or force equal card heights.
- Keep the selected state high contrast and distinct without colour alone.

### Motion and orientation

- Prefer opacity/position transitions under 350ms; respect `prefers-reduced-motion` with instant state changes.
- Avoid parallax, auto-scrolling, confetti, or timed swipes.
- Landscape: maintain a reading-width constraint and let the page scroll; no forced landscape layout.

### Accessibility

- Announce scenario transition and selection status without reading the entire screen repeatedly.
- Keep DOM order aligned with visual order.
- Native buttons/disclosures; no gesture-only input.
- Ensure 200% text zoom and mobile screen-reader use retain access to every action.

## 12. Design system direction

### Visual character

Premium, contemplative, and warm. The analyzer borrows KalQLater’s established polish but has a quieter, more intimate rhythm than the broader personality report.

| Element | Recommendation |
|---|---|
| Typography | Editorial display face for a short headline; highly legible sans serif for prompts and options. Body 16–18px minimum, generous line height. |
| Spacing | 8px base rhythm; 24–32px between content groups; 48–72px section breathing room on results. |
| Corners | 16–20px for main cards, 12–14px for response cards; avoid excessive pills. |
| Cards | Soft surface elevation, thin translucent border, restrained shadow. Never stack dense dashboard tiles. |
| Illustration | Abstract scenes of exchange—paths, speech rhythms, connecting points—not people stereotypes, brains, or typology avatars. |
| Icons | Familiar, line-based, descriptive icons with text labels; no icon-only critical actions. |
| Colour | Calm neutral background, one primary KalQLater accent, one supportive secondary accent. Colour conveys hierarchy, never score quality. |
| Success / warning | Success is a quiet green/teal confirmation; reflection/trade-off uses warm amber; errors use accessible red with text. |
| Motion | Gentle fade/slide, low amplitude, 180–350ms. Analysis motion is optional and never blocks results. |
| Sound | Future opt-in only, off by default; never use sound to signal correctness. |
| Dark mode | True semantic tokens, not inverted colours; maintain contrast, reduced glare, and chart readability. |

## 13. Emotional design by stage

| Stage | User may feel | UI must communicate |
|---|---|---|
| Landing | Curious, sceptical, self-conscious | “This is safe, brief, and not judging you.” |
| Questions | Reflective, occasionally uncertain | “Choose what is most like you; you can take your time.” |
| Analysis | Anticipatory | “We are looking across what you shared, not diagnosing you.” |
| Results | Hopeful, vulnerable, defensive, relieved | “Here is a useful reflection with room for context and change.” |
| Coaching | Motivated or overwhelmed | “One small practice is enough.” |
| Signup | Protective of privacy | “You already received value; saving is your choice.” |

## 14. Return and retention journey

### Next week

If a user saves a practice, offer one optional check-in: “Did you get a chance to try your practice?” Responses: “Yes, reflect,” “Not yet,” “Stop reminders.” No streak loss.

### Monthly

After 30 days, offer: “A month can change the situations you are navigating. Would a fresh reflection be useful?” Explain that it compares self-reported situations, not a better/worse score.

### Future tools

Related tools should appear only after the result/practice flow and only as a gentle next possibility—e.g., “Explore how you approach disagreement.” No cross-sell during questions.

### Anti-spam rules

- Reminders are opt-in, frequency-capped, and one-tap stoppable.
- No urgency language, streak loss, “people like you,” or social comparison.
- No retake nudge sooner than 30 days unless user explicitly starts one.

## 15. Delight that supports reflection

- A single line of acknowledgement at the midpoint: “You’re noticing more than one version of yourself.”
- A subtle line animation when a user selects a practice, resolving into a small “saved for this week” state—not confetti.
- A short, unexpected but grounded insight: “A pause can be a form of clarity.”
- Optional copyable conversation starters with a soft “Copied for your next conversation” confirmation.
- An end-of-result moment: “You do not need to change everything. One small move is enough to notice something new.”

Delight must never imply correctness, manipulate completion, or distract from a sensitive topic.

## 16. Anti-patterns to avoid

- BuzzFeed-style labels, type badges, animal/archetype reveals, or “You are…” claims.
- Corporate dashboard density, KPIs, grades, speed metrics, performance language, and ranked charts.
- Radar charts as the only result visual; too many charts or a wall of cards.
- Fake analysis timers, brain scans, DNA metaphors, loading spinners that imply scientific measurement.
- Long lectures, dense paragraphs, jargon, or a scroll-heavy result before the first useful insight.
- Judgemental language: weak, avoidant, aggressive, unhealthy, bad listener, failed.
- Forced signup, paywalls before first result, coercive reminders, engagement streaks, or public sharing defaults.
- Red/green “good/bad” dimensions, score maximisation, and unearned certainty.
- Stereotyped illustrations of gender, culture, disability, relationship, or leadership.
- Motion, colour, hover, swipe, or sound as the only way to understand or operate the experience.

## 17. Experience reference analysis

The analyzer should learn from patterns, not copy visual language, wording, layouts, or interactions.

| Reference | Useful lesson | KalQLater distinction |
|---|---|---|
| 16Personalities | Clear explanatory sequencing and accessible type content | Avoid label-first identity claims, quizzes, compatibility scores, and its visual grammar. |
| Headspace | Calm pacing, low anxiety, one manageable action | Use practical behavioural scenarios, not wellness treatment language or meditation metaphors. |
| Duolingo | Immediate feedback, small daily action, clear progress | Avoid points, streak pressure, mascots, competition, and correctness framing. |
| Apple onboarding | Minimal choices, progressive disclosure, confident clarity | Use a warmer reflective tone and more explicit privacy/context controls. |
| Linear | Focus, hierarchy, deliberate interaction, reduced visual noise | Be more emotionally reassuring and less task-management-like. |

## 18. Ten flagship UX decisions, ranked

1. **Deliver value before signup.** Full first result remains open to guests.
2. **Lead results with a human summary, not a chart.** Meaning precedes measurement.
3. **Use scenario-based choices with no obvious “right” answer.** This protects trust and data quality.
4. **Make uncertainty visible and understandable.** Evidence confidence is a care feature, not a technical footnote.
5. **One moment, one decision, one screen.** Avoid quiz fatigue and cognitive overload.
6. **Turn every trade-off into a practical, voluntary next move.** Insight without action is incomplete; action without pressure is essential.
7. **Treat the weekly practice as the product’s emotional ending.** The user leaves with agency, not a label.
8. **Design mobile first for reading, pausing, and thumb reach.** Most personal reflection happens on a phone.
9. **Make privacy and consent visible at the exact decision point.** Do not bury reassurance in legal text.
10. **Preserve quiet premium restraint.** Fewer cards, fewer charts, less motion, more whitespace and precise language.

## UX acceptance criteria for implementation

- A new user can explain in their own words that this is behavioural reflection, not a personality test, before starting.
- A guest can complete, read, and choose a practice without creating an account.
- Every result claim includes appropriate uncertainty and context.
- A user can pause, skip, revise, and resume without losing dignity or data.
- Keyboard-only, screen-reader, reduced-motion, 320px, Hindi, and 200% zoom paths are first-class QA conditions.
- A user sees no score, rank, right answer, benchmark, hiring implication, or forced prompt.
- The experience ends with one manageable practice and an easy “not now.”

---

**Status: UX BLUEPRINT READY**
