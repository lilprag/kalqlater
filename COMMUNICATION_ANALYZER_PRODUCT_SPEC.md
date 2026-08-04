# Communication Style Analyzer

## Product decision

KalQLater’s Communication Style Analyzer is a behavioural reflection experience: a practical way for people to notice the habits they use when they explain, listen, disagree, decide, set boundaries, and repair misunderstandings. It is not an MBTI quiz, a clinical instrument, a performance assessment, or a measure of “good” communication.

The product should leave a user with three things:

1. A nuanced picture of their present communication patterns.
2. Language for the trade-offs those patterns create with different people and contexts.
3. One small, observable practice to try this week.

## 1. Core philosophy

### Principles

- **Behaviour over identity.** Ask what someone tends to do in a recognisable situation, not whether they are a certain kind of person.
- **Patterns, not verdicts.** Scores describe a current tendency on a continuum. None is inherently better.
- **Context matters.** A person can be direct at work and indirect at home; each scenario must name its context.
- **Reflection before prescription.** Results should first explain the pattern, then offer optional experiments.
- **Agency and dignity.** Users can skip questions, revisit an answer, decline personality comparison, and delete their history.
- **Useful uncertainty.** The product should say when it has limited evidence rather than simulate precision.
- **No diagnostic, hiring, or relationship prediction claims.** This tool supports self-reflection; it does not determine capability, mental health, compatibility, or employability.

### Product positioning

The analyzer complements a KalQLater personality guide. Personality content provides broad preferences and vocabulary; this analyzer describes self-reported, situation-specific communication choices. The latter remains primary whenever the two appear to differ.

## 2. Target audience

| Audience | Primary job to be done | Moment of use |
|---|---|---|
| Early-career professionals | Communicate ideas and feedback with more confidence | Before reviews, meetings, interviews, or a difficult conversation |
| Managers and emerging leaders | Lead with clarity while retaining trust | Before one-to-ones, delegation, or performance conversations |
| Remote and cross-functional workers | Reduce ambiguity across channels and time zones | When collaboration feels slow or misaligned |
| Partners, friends, and family members | Understand recurring misunderstandings without blame | After friction or before an important conversation |
| Coaches and facilitators | Create a shared language for development | As a starting point for a coaching session |
| Returning KalQLater users | Turn an abstract personality profile into a practical habit | After completing a personality result |

The first release should serve individual users. Team, manager, and coach applications should be opt-in later products, not an inferred use of an individual’s answers.

## 3. Core user journey

1. **Entry and consent.** Explain the tool in one screen: 10–12 minutes, scenario-based, no right answers, and not a diagnosis or assessment.
2. **Optional context.** Let the user select contexts they want reflected (work, close relationships, leadership, remote work). They may continue with all contexts.
3. **Baseline scenarios.** Present 40 core scenarios in a deliberately mixed order. Each has four plausible actions and an optional “this situation is uncommon for me.”
4. **Adaptive depth.** Present 12–20 follow-up scenarios where evidence is thin or patterns conflict. Never tell users they are being tested for consistency.
5. **Optional reflection.** Ask up to three low-friction prompts: “Which answer felt most aspirational?” and “Where do you want to improve?” These are not scored.
6. **Results reveal.** Lead with a Communication Map and a plain-language style narrative, then strengths, friction patterns, and a weekly experiment.
7. **Apply.** Offer a downloadable conversation preparation card and a private saved challenge.
8. **Return.** Invite a reassessment after 30 days or after a meaningful context change. Do not create pressure loops or punitive streaks.

### Completion design

- Show progress by scenario count, not a misleading “accuracy” meter.
- Allow back, skip, and pause/resume.
- Use plain language and keyboard-friendly controls.
- Avoid countdowns, trick questions, and forced disclosure.

## 4. Communication dimensions

The recommended model has ten independent, non-moralised dimensions. Results should describe the high and low ends as useful tendencies, not rankings.

| Dimension | Definition and why it matters | Higher tendency | Lower tendency | Common blind spot | Coaching opportunity |
|---|---|---|---|---|---|
| **Message clarity** | How explicitly someone frames purpose, context, next step, and ownership. Clarity prevents avoidable coordination loss. | Names the point, decision, and action. | Leaves meaning implicit or develops ideas aloud. | “I thought that was obvious.” | Start with purpose, then ask for a shared summary. |
| **Directness with tact** | Willingness to name a difficult point while protecting dignity. It shapes trust in feedback and conflict. | States the issue plainly and respectfully. | Softens, delays, or circles around difficult points. | High: can feel abrupt. Low: can create ambiguity. | Pair one direct observation with impact and a question. |
| **Receptive listening** | How actively someone seeks, checks, and integrates another person’s meaning. It improves understanding before response. | Reflects, clarifies, and makes space. | Moves quickly to response, solution, or own experience. | High: may over-process; low: may miss intent. | Summarise before solving. |
| **Emotional transparency** | How clearly someone names feelings, needs, and stakes without oversharing. It helps others read context. | Shares relevant internal state. | Keeps emotion private or expresses it indirectly. | High: may burden the wrong audience; low: can appear detached. | Name one relevant feeling plus one request. |
| **Collaborative inquiry** | Tendency to explore perspectives and assumptions through questions. It supports learning and inclusion. | Invites viewpoints and tests assumptions. | Prefers to form a view independently before discussion. | High: can slow decisions; low: can narrow input. | Ask one genuine “what am I missing?” question. |
| **Constructive assertion** | Ability to state a preference, boundary, or disagreement without domination or retreat. | Makes a clear request and holds a boundary. | Accommodates, delays, or yields under pressure. | High: may over-control; low: can build resentment. | Use: “I can do X; I cannot do Y; here is an alternative.” |
| **Feedback exchange** | How someone gives, receives, and acts on developmental feedback. It affects psychological safety and learning. | Specific, timely, and curious about impact. | Avoids feedback or treats it as a verdict. | High: too much feedback; low: too little signal. | Separate observation, effect, and invitation. |
| **Conflict navigation** | How someone raises, stays with, and repairs disagreement. It determines whether friction becomes useful. | Addresses tension early and seeks repair. | Withdraws, escalates, postpones, or seeks allies first. | High: may force timing; low: lets issues calcify. | Agree on the issue, then the next conversation step. |
| **Audience adaptability** | Ability to adapt channel, detail, pace, and language to another person’s needs without losing authenticity. | Adjusts explanation and medium deliberately. | Uses a consistent default style across audiences. | High: can feel inauthentic; low: can miss the receiver. | Ask “what format would help?” before a complex update. |
| **Decision alignment** | How someone communicates reasoning, trade-offs, dissent, and commitment around decisions. | Makes criteria, ownership, and commitment visible. | Assumes alignment or communicates only the outcome. | High: over-explains; low: leaves hidden disagreement. | Say what is decided, why, who owns it, and what changes now. |

## 5. Question framework

### Design rules

- Every item is a concrete scenario with four actions that a reasonable person might take.
- Responses should differ in trade-off, not virtue. Avoid one obviously “correct” answer.
- Avoid jargon, cultural idioms, gendered assumptions, and workplace-only examples.
- Include work, family, friendship, leadership, customers, partners, remote work, meetings, conflict, and stress.
- Each response contributes to one primary and up to two secondary dimensions. It can raise one tendency while lowering another; no answer should mean “bad communicator.”
- Use a five-point optional typicality check after selected items: “Not at all typical” to “Very typical.” This qualifies confidence, not the response’s worth.
- Pilot with diverse users and use cognitive interviews to remove ambiguous language before any scoring claims are made.

### Scenario library (60 items)

Weights are contribution points per answer to the named dimensions: **P** = primary (3), **S** = secondary (1). Difficulty means interpretive complexity, not user ability.

| # | Category / scenario | Four realistic responses | Dimensions measured | Weight / difficulty |
|---:|---|---|---|---|
| 1 | Meeting: a colleague’s update is unclear. | A. Ask what decision they need. B. Let them finish, then summarise what you heard. C. Ask for examples. D. Say you will read the notes later. | Clarity, Listening, Inquiry | P3/S1 · Basic |
| 2 | Remote work: a deadline moves without explanation. | A. Send a concise message asking for impact and new owner. B. Wait for more information. C. Raise it in the next group meeting. D. Start working around it silently. | Clarity, Assertion, Decision alignment | P3/S1 · Basic |
| 3 | Feedback: a teammate’s work misses the brief. | A. State the mismatch and ask how they see it. B. Rewrite it yourself. C. Give only positive comments first. D. Send the brief again without comment. | Directness, Feedback, Listening | P3/S1 · Moderate |
| 4 | Family: a relative makes a hurtful joke. | A. Name the impact privately. B. Laugh it off. C. Change the topic. D. Address it publicly in the moment. | Directness, Emotional transparency, Conflict | P3/S1 · Moderate |
| 5 | Friendship: plans are repeatedly cancelled. | A. Ask whether something has changed. B. Stop initiating plans. C. Say it is fine, though disappointed. D. Send a direct message about the pattern. | Assertion, Emotional transparency, Conflict | P3/S1 · Moderate |
| 6 | Leadership: two people disagree in a meeting. | A. Ask each to state evidence and decision criteria. B. Choose quickly to end tension. C. Ask to continue one-to-one later. D. Let the discussion run without intervention. | Inquiry, Decision alignment, Conflict | P3/S1 · Moderate |
| 7 | Customer: a request cannot be met on time. | A. Explain the constraint and offer options. B. Promise to try without detail. C. Escalate internally before replying. D. Focus only on what is possible, not why. | Clarity, Directness, Adaptability | P3/S1 · Moderate |
| 8 | Partner: they are quiet after a hard day. | A. Ask whether they want listening, ideas, or space. B. Offer solutions immediately. C. Leave them alone without asking. D. Share your worry and ask what happened. | Listening, Inquiry, Emotional transparency | P3/S1 · Basic |
| 9 | Stress: a message feels sharper than intended. | A. Pause, then ask for clarification. B. Reply immediately with your own frustration. C. Ignore it until later. D. Ask a third person what they think it meant. | Conflict, Emotional transparency, Inquiry | P3/S1 · Moderate |
| 10 | Meeting: you disagree with the proposed plan. | A. State your concern and an alternative. B. Ask questions until others notice the issue. C. Stay quiet after the group leans one way. D. Raise it after the meeting. | Directness, Assertion, Decision alignment | P3/S1 · Moderate |
| 11 | Work: you need help but are behind. | A. State what is blocked and make a specific request. B. Work late alone. C. Hint that workload is heavy. D. Ask generally if anyone is free. | Clarity, Assertion, Adaptability | P3/S1 · Basic |
| 12 | Friendship: a friend gives advice you did not want. | A. Thank them and say you wanted listening. B. Follow the advice to avoid awkwardness. C. Explain why the advice upset you. D. Change the subject. | Assertion, Emotional transparency, Listening | P3/S1 · Basic |
| 13 | Remote work: a long thread becomes confusing. | A. Post a recap with questions and owner. B. Start a new thread with your view. C. Wait for someone senior to resolve it. D. Move it to a short call. | Clarity, Adaptability, Decision alignment | P3/S1 · Moderate |
| 14 | Leadership: a high performer interrupts others. | A. Set a meeting norm and redirect in the moment. B. Speak to them privately later. C. Let it continue because ideas are strong. D. Ask quieter people for input after the meeting. | Assertion, Listening, Feedback | P3/S1 · Moderate |
| 15 | Family: a boundary is ignored. | A. Restate the boundary and consequence calmly. B. Explain it at greater length. C. Give in this time. D. Avoid the next interaction. | Assertion, Directness, Conflict | P3/S1 · Moderate |
| 16 | Customer: a customer is angry about an error. | A. Acknowledge impact, clarify facts, propose a remedy. B. Explain why the team was not at fault. C. Escalate immediately. D. Offer a remedy without acknowledging emotion. | Listening, Emotional transparency, Clarity | P3/S1 · Advanced |
| 17 | Meeting: your idea is overlooked, then repeated by someone else. | A. Link the idea back to your earlier point and build on it. B. Say nothing. C. Correct them sharply. D. Mention it privately afterward. | Assertion, Directness, Conflict | P3/S1 · Moderate |
| 18 | Partner: you want more time together. | A. Name the need and suggest a concrete plan. B. Wait for them to notice. C. Say you are “fine” but become distant. D. Compare them with another couple. | Emotional transparency, Clarity, Assertion | P3/S1 · Moderate |
| 19 | Work: an instruction seems risky. | A. Share the risk, evidence, and a safer option. B. Follow it exactly. C. Ask another colleague privately. D. Delay until more direction arrives. | Directness, Decision alignment, Inquiry | P3/S1 · Moderate |
| 20 | Stress: you are too overloaded to think clearly. | A. Say what you can decide now and what needs time. B. Keep responding as normal. C. Stop replying. D. Make a quick decision to clear the queue. | Emotional transparency, Clarity, Decision alignment | P3/S1 · Moderate |
| 21 | Friendship: two friends want opposite plans. | A. Surface both preferences and look for a workable option. B. Let the more vocal friend decide. C. Choose one person’s plan yourself. D. Opt out. | Inquiry, Assertion, Conflict | P3/S1 · Basic |
| 22 | Leadership: you must delegate an ambiguous task. | A. Explain outcome, constraints, authority, and check-in. B. Give the task and let them decide everything. C. Give detailed steps only. D. Keep it because it is faster. | Clarity, Adaptability, Decision alignment | P3/S1 · Advanced |
| 23 | Family: someone asks a personal question. | A. Say you would rather not discuss it. B. Answer briefly despite discomfort. C. Joke and move on. D. Ask why they want to know. | Assertion, Directness, Inquiry | P3/S1 · Basic |
| 24 | Remote work: a colleague prefers calls; you prefer writing. | A. Agree on a brief call plus written recap. B. Insist on your preferred channel. C. Avoid the conversation. D. Use whichever channel they choose every time. | Adaptability, Assertion, Clarity | P3/S1 · Moderate |
| 25 | Feedback: someone says your tone felt dismissive. | A. Ask for an example and reflect back what you hear. B. Explain your intent immediately. C. Apologise without discussion. D. Disagree because the content was correct. | Listening, Feedback, Emotional transparency | P3/S1 · Advanced |
| 26 | Meeting: there is no time for every viewpoint. | A. Name the time limit and collect dissent asynchronously. B. Let only senior voices speak. C. Extend the meeting without agreement. D. Decide privately after. | Decision alignment, Listening, Adaptability | P3/S1 · Advanced |
| 27 | Customer: requirements are contradictory. | A. Make the trade-off explicit and ask them to choose. B. Choose what seems best. C. Ask them to send a clearer brief. D. Promise both outcomes. | Clarity, Assertion, Decision alignment | P3/S1 · Moderate |
| 28 | Partner: an argument is escalating. | A. Name the pattern and request a timed pause. B. Keep arguing until resolved. C. Leave without saying when you will return. D. Agree just to end it. | Conflict, Emotional transparency, Clarity | P3/S1 · Advanced |
| 29 | Work: a coworker gives vague praise. | A. Ask what specifically worked. B. Accept it and move on. C. Downplay it. D. Ask whether there is hidden criticism. | Inquiry, Feedback, Emotional transparency | P3/S1 · Basic |
| 30 | Stress: your manager asks for an immediate answer. | A. Give your current view, uncertainty, and next check. B. Guess confidently. C. Say nothing until fully certain. D. Redirect the question. | Clarity, Decision alignment, Assertion | P3/S1 · Advanced |
| 31 | Friendship: you have been talking more than listening. | A. Notice it and invite their update. B. Keep sharing because they did not interrupt. C. Apologise repeatedly. D. Ask a broad question, then return to your story. | Listening, Inquiry, Emotional transparency | P3/S1 · Basic |
| 32 | Leadership: a team member challenges your decision. | A. Ask them to state the risk, then clarify what is still open. B. Defend the decision immediately. C. Reopen the entire decision. D. Ask them not to challenge you publicly. | Listening, Decision alignment, Conflict | P3/S1 · Advanced |
| 33 | Family: you need to decline an invitation. | A. Decline warmly with a brief reason and alternative. B. Invent an excuse. C. Do not respond. D. Say yes and cancel later. | Assertion, Directness, Adaptability | P3/S1 · Basic |
| 34 | Remote work: a teammate writes very detailed updates. | A. Ask for a headline plus a linked detail section. B. Ignore most of it. C. Reply with equally detailed updates. D. Tell them to be concise without examples. | Adaptability, Clarity, Feedback | P3/S1 · Moderate |
| 35 | Feedback: you must tell a peer about a recurring issue. | A. Share a pattern, its impact, and invite their view. B. Mention only the latest incident. C. Ask someone else to tell them. D. Wait for a formal review. | Feedback, Directness, Listening | P3/S1 · Advanced |
| 36 | Meeting: a decision is made but you still disagree. | A. State dissent once, confirm commitment, and ask for review criteria. B. Continue arguing after a decision. C. Undermine it privately. D. Withdraw from the work. | Decision alignment, Conflict, Assertion | P3/S1 · Advanced |
| 37 | Customer: jargon is confusing a non-expert customer. | A. Reframe in plain language and check understanding. B. Repeat the technical explanation. C. Send documentation. D. Ask a specialist to take over. | Adaptability, Clarity, Listening | P3/S1 · Moderate |
| 38 | Partner: you feel misunderstood. | A. Explain what you meant and ask what they heard. B. Repeat yourself louder. C. Stop talking. D. Focus on why they should have known. | Clarity, Listening, Emotional transparency | P3/S1 · Moderate |
| 39 | Work: another team misses a dependency. | A. Name impact, ask what changed, and agree a recovery plan. B. Copy senior leaders immediately. C. Fix it quietly. D. Send a frustrated message. | Conflict, Clarity, Decision alignment | P3/S1 · Advanced |
| 40 | Stress: you receive criticism in public. | A. Thank them, ask to discuss specifics later, then follow up. B. Defend yourself in detail. C. Stay silent and disengage later. D. Criticise them in return. | Conflict, Feedback, Emotional transparency | P3/S1 · Advanced |
| 41 | Friendship: a friend shares something sensitive. | A. Ask whether they want support, ideas, or confidentiality. B. Share a similar story immediately. C. Give advice. D. Tell someone else who may help. | Listening, Inquiry, Boundaries | P3/S1 · Moderate |
| 42 | Leadership: priorities change mid-week. | A. Explain what changed, what stops, and how success is judged. B. Announce the new priority only. C. Let each person infer the impact. D. Wait until next week. | Clarity, Decision alignment, Adaptability | P3/S1 · Advanced |
| 43 | Family: someone is visibly upset but says “nothing.” | A. Say you notice and are available without pressing. B. Insist they explain. C. Leave immediately. D. Continue normally. | Listening, Emotional transparency, Adaptability | P3/S1 · Moderate |
| 44 | Remote work: messages keep being misread. | A. Propose a channel norm and use explicit tone/intent cues. B. Write even shorter messages. C. Move every issue to a call. D. Ask people to be less sensitive. | Adaptability, Clarity, Conflict | P3/S1 · Advanced |
| 45 | Feedback: your suggestion is rejected. | A. Ask what criteria made it a poor fit. B. Argue until accepted. C. Withdraw future suggestions. D. Agree without understanding. | Feedback, Inquiry, Emotional transparency | P3/S1 · Moderate |
| 46 | Meeting: a quiet expert has not contributed. | A. Invite them in with a specific, optional question. B. Call on them without warning. C. Assume they agree. D. Ask them afterward only. | Listening, Adaptability, Leadership | P3/S1 · Moderate |
| 47 | Customer: they ask for an exception to policy. | A. Explain the boundary and explore permitted alternatives. B. Say “policy is policy.” C. Promise an exception. D. Avoid responding. | Assertion, Clarity, Adaptability | P3/S1 · Advanced |
| 48 | Partner: you need to revisit an unresolved issue. | A. Ask for a calm time and name the topic. B. Raise it during another argument. C. Wait indefinitely. D. Send a long message late at night. | Conflict, Clarity, Adaptability | P3/S1 · Moderate |
| 49 | Work: you notice an assumption nobody has named. | A. State the assumption and ask the group to test it. B. Keep it to yourself. C. Mention it only to a trusted colleague. D. Present it as fact. | Inquiry, Directness, Decision alignment | P3/S1 · Advanced |
| 50 | Stress: a colleague asks how you are when you are struggling. | A. Share a bounded, relevant answer and what support helps. B. Say “fine” automatically. C. Share every detail. D. Change the topic. | Emotional transparency, Assertion, Adaptability | P3/S1 · Moderate |
| 51 | Friendship: you disagree about a value, not a plan. | A. Explain your view and stay curious about theirs. B. Avoid the topic forever. C. Try to win. D. End the conversation abruptly. | Inquiry, Conflict, Directness | P3/S1 · Advanced |
| 52 | Leadership: a report contains an error you approved. | A. Own it, correct it, and explain the prevention step. B. Say the team prepared it. C. Fix it without comment. D. Explain why the error was understandable. | Feedback, Emotional transparency, Clarity | P3/S1 · Advanced |
| 53 | Family: two people expect you to mediate. | A. Clarify your role and encourage direct conversation. B. Carry messages between them. C. Pick a side. D. Refuse without explanation. | Boundaries, Conflict, Clarity | P3/S1 · Advanced |
| 54 | Remote work: an urgent issue arrives outside work hours. | A. State availability and the fastest safe next step. B. Reply immediately every time. C. Ignore it entirely. D. Send a vague acknowledgement. | Assertion, Clarity, Boundaries | P3/S1 · Moderate |
| 55 | Feedback: a direct report asks for career advice. | A. Ask their goals, share observations, co-create next steps. B. Tell them exactly what to do. C. Give generic encouragement. D. Avoid a promise of support. | Listening, Inquiry, Feedback | P3/S1 · Advanced |
| 56 | Meeting: the group is stuck in detail. | A. Restate the decision and park nonessential questions. B. Add more detail. C. End the meeting without a next step. D. Let the group continue. | Clarity, Decision alignment, Assertion | P3/S1 · Advanced |
| 57 | Customer: a customer seems hesitant but agrees. | A. Ask what would make the decision easier. B. Treat agreement as final. C. Repeat the offer. D. Lower the price immediately. | Listening, Inquiry, Adaptability | P3/S1 · Moderate |
| 58 | Partner: you need time alone after conflict. | A. Request space, say when you will reconnect, and keep that commitment. B. Leave without explanation. C. Stay though overwhelmed. D. Ask them to leave. | Emotional transparency, Conflict, Clarity | P3/S1 · Advanced |
| 59 | Work: a new hire misinterprets your short message. | A. Clarify intent and adapt the next message. B. Say they should ask if unsure. C. Keep messages equally brief. D. Stop using written messages. | Adaptability, Clarity, Feedback | P3/S1 · Moderate |
| 60 | Stress: a conversation is no longer productive. | A. Name the loop, pause, and agree a return point. B. Continue until someone gives in. C. End it permanently. D. Bring in other people immediately. | Conflict, Clarity, Emotional transparency | P3/S1 · Advanced |

## 6. Scoring framework

### What a score means

Each dimension is a **current self-reported behavioural tendency**, scaled from 0–100 for ease of reading. The number should never appear alone: pair it with a descriptive range such as “more often prioritises explicit structure” or “usually leaves more space before asserting a preference.” Do not label results as superior, mature, healthy, or employable.

### Item scoring

- Every response receives a pre-piloted vector of 0–3 points for one primary and 0–1 for up to two secondary dimensions.
- Multiple answers may partially support a dimension. For example, asking a question can indicate inquiry and listening, while a clear request can indicate clarity and assertion.
- Negatively correlated choices do not create a moral penalty; they add evidence toward the opposite end of a continuum.
- Dimension raw score: `earned points / available points for answered, applicable items`.
- Convert raw scores to a 0–100 display scale only after sufficient coverage. Do not use population norms until a representative, consented dataset and documented validation exist.

### Adaptive question selection

- Start with 40 balanced core items, ensuring at least four observations per dimension across more than one context.
- Select 12–20 follow-ups when coverage is sparse, a dimension sits near the middle, or answers vary strongly by context.
- Do not over-focus on a sensitive topic. A user may skip without explanation; skipped items are excluded from the denominator.
- Stop when every dimension has adequate coverage or at 60 answered scenarios.

### Confidence and reliability

Use **evidence confidence**, not “accuracy.” It answers: “How stable is this reflection given the scenarios answered?”

Evidence confidence combines:

1. **Coverage:** number and spread of answered scenarios for each dimension.
2. **Context spread:** whether the signal appears across at least two relevant contexts.
3. **Response convergence:** whether related scenarios point in a similar direction.
4. **Typicality:** optional self-rating of how representative selected scenarios felt.

Display only three bands:

- **Emerging evidence:** insufficient scenarios or high variation; invite curiosity, not certainty.
- **Useful signal:** enough coverage for a tentative pattern.
- **Consistent signal:** broad, convergent self-report across contexts.

Conflicting answers reduce confidence, not the user’s score. They may signal healthy adaptation, changing circumstances, or an ambiguous item. The result should say, for example: “Your style appears more direct at work than in close relationships,” rather than treating variation as inconsistency to fix.

### Validation plan

Before premium or team use, establish a technical quality report covering completion patterns, item ambiguity, internal consistency by dimension, test–retest stability, accessibility outcomes, and subgroup fairness. Do not call a dimension “reliable” in-product until that research supports the claim. Version every scoring model and preserve the version alongside consented historical results.

## 7. Feedback framework

### Result narrative template

Each dimension should use this pattern:

> **What you may default to** → **when it helps** → **where it can be misread** → **one experiment**.

Example:

> You often make the decision path visible before moving forward. This can make cross-functional work calmer and faster. Under pressure, others may experience the detail as a decision already made. This week, end one decision update by asking: “What concern have we not surfaced yet?”

### Strengths

Show three well-evidenced strengths. State the observed pattern, its likely value, and an appropriate context. Avoid generic praise such as “excellent communicator.”

### Blind spots and misunderstandings

Show no more than three patterns, using conditional language:

- “People who prefer more context may experience your concise updates as abrupt.”
- “When you wait to raise concern, others may assume agreement.”

For each, include a repair move and a low-effort script.

### Coaching suggestions

Offer two choices per insight: a lower-energy action and a stretch action. Users select one, keeping the product developmental rather than prescriptive.

### Weekly challenge

One behaviour, one context, one observable completion condition. Examples:

- “In your next meeting, state the decision you need before sharing background.”
- “In one close conversation, ask whether the other person wants empathy, ideas, or space.”

## 8. Results experience and visual output

### Page hierarchy

1. **Communication snapshot.** A one-sentence behavioural style summary plus evidence confidence.
2. **Communication Map.** Default to an accessible horizontal bar chart with all ten dimensions. A radar view can be an optional visual mode only; it must not be the sole representation.
3. **Your strongest signals.** Three evidence-backed behavioural strengths.
4. **Where messages can get lost.** Likely misunderstandings and practical repair moves.
5. **Context lens.** Compare work, close relationships, leadership, and remote work only when adequate evidence exists.
6. **Conversation playbook.** Short scripts for feedback, disagreement, boundaries, and clarification.
7. **This week’s challenge.** User-selectable and saveable.
8. **Personality context.** Optional, carefully framed comparison with their KalQLater profile.
9. **Retake and progress.** Explain what changed, what is uncertain, and what was different about the context.

### Visual language

- Use a “signal map”: ten calm bars, not a competitive scorecard.
- Mark evidence confidence with a subtle dotted/solid fill treatment and readable labels, never colour alone.
- Use contextual cards with a situation icon and a concise “try this” action.
- Use warm neutral foundations with KalQLater’s existing premium palette; avoid red/green judgments.
- Give every visual a text equivalent, high contrast, keyboard navigation, and reduced-motion support.

## 9. Personality integration

### Integration principle

Personality type is optional context—not a prediction engine. The analyzer must never claim that a person communicates a certain way because they are INTJ, or that a result proves or invalidates a type.

### Safe comparison language

If a user has opted in and completed both experiences, use language such as:

> “Your current scenario responses suggest that you share more relevant emotion explicitly than the general INTJ guide typically emphasises. This is a comparison between two KalQLater reflection frameworks, not a scientific norm or a claim about INTJs as a group.”

Better still, anchor comparisons in the user’s own type-guide themes:

- “Your profile describes a preference for depth and independent thinking. Your responses here also show a collaborative inquiry pattern in meetings.”
- “Your profile may make concise communication feel natural. Your scenario responses indicate you often add context when decisions affect others.”

### Guardrails

- Do not use “compared with many INTJs” until a representative, consented benchmark exists and its limitations are disclosed.
- Default personality integration to off for new users.
- Let users remove personality context from the report without deleting either result.
- When two frameworks differ, present this as context-dependent behaviour, not a contradiction.

## 10. Retention without pressure

| Mechanism | Value | Guardrail |
|---|---|---|
| 30-day reassessment | Helps users notice intentional behaviour change over time | No score-chasing language; show uncertainty and changed contexts. |
| Private progress notes | Connects a challenge to a real situation | Notes are private by default and deletable. |
| Weekly challenges | Converts insight into an observable habit | Max one active challenge; no punitive streak loss. |
| Improvement streaks | Optional gentle consistency signal | Track practice completion, not “communication quality.” |
| Context check-ins | Lets users see work versus relationship patterns | Must never imply one context is the authentic self. |
| Reflection reminders | Brings users back at chosen cadence | Opt-in only, easy to pause. |

## 11. Monetisation path

### Premium individual

- Expanded context reports and deeper scenario modules.
- Personal communication playbooks and conversation preparation cards.
- Longitudinal reflections and a private export.
- Guardrail: core results and one practical challenge remain useful in the free experience.

### Team

- Voluntary, aggregated communication agreements: preferred channels, feedback norms, decision rituals.
- No manager access to individual raw answers or individual scores.
- Aggregation thresholds and anti-reidentification controls are mandatory.

### Manager

- Manager learning modules on meeting design, feedback, and psychological safety.
- Team-level themes only when consented and sufficiently aggregated.
- Never use for promotion, performance rating, hiring, discipline, or monitoring.

### Coach

- Client-owned share link with explicit, revocable scope.
- Session discussion guide and before/after reflection prompts.
- Coaches can comment only with the client’s permission; no default access.

### HR

- Organisation-wide learning trends, not employee profiles.
- Data processing agreement, retention controls, union/works-council review where applicable, and independent ethics review before launch.

## 12. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Overinterpretation | Use conditional language, evidence confidence, clear non-diagnostic disclosures, and no employability claims. |
| Pseudoscientific framing | Publish methodology, validation status, and scoring-version notes. Do not call it scientifically validated before research supports that statement. |
| Cultural and language bias | Co-design and pilot across cultures, languages, disability communities, and relationship contexts. Localise meaning, not only words. |
| Workplace coercion | Keep individual results private by default; ban hiring/performance use in terms and product design. |
| Sensitive disclosures | Do not ask for trauma, diagnosis, or abuse details. Provide optional support resources where conflict prompts evoke distress. |
| Privacy leakage | Minimise data, encrypt in transit and at rest, separate identity from response data, provide export/delete, and prohibit secondary use without opt-in. |
| Gaming and social desirability | Use equally plausible responses, context variation, and confidence bands; never present “ideal” answer patterns. |
| Accessibility exclusion | Support keyboard-only navigation, screen readers, high contrast, reduced motion, plain language, and pause/resume. |
| Harmful team comparison | Prevent rank-ordering, public individual maps, and forced sharing. |

## 13. Roadmap

### MVP — Individual reflection foundation

- 40 core scenario questions, with up to 12 adaptive follow-ups.
- Ten-dimension Communication Map, evidence confidence, three strengths, three friction patterns, and one weekly challenge.
- English first; Hindi only after dedicated scenario localisation review.
- Optional connection to existing KalQLater result using safe, non-normative wording.
- Private save, resume, export, and delete controls.
- Research pilot, cognitive interviews, accessibility audit, and explicit validation-status page.

### V2 — Context and progress

- Full 60-item library and richer adaptive selection.
- Context lenses for work, close relationships, leadership, customer work, and remote collaboration.
- Challenge history, voluntary reminders, private notes, and 30-day reassessment.
- Improved evidence-confidence explanation and model versioning.
- Bilingual quality review and accessibility regression suite.

### V3 — Guided practice

- Scenario rehearsal: a user chooses a real upcoming conversation and receives non-generative structured prompts.
- Conversation preparation cards and repair-script library.
- Optional AI coaching only for drafting, role-play, and reflection—never for diagnosis, truth claims, or high-stakes advice.
- Coach sharing with granular, revocable consent.

### V4 — Consent-first collective learning

- Team communication agreements built from anonymous, thresholded aggregates.
- Manager and facilitator learning experiences that do not expose individual profiles.
- Enterprise controls: SSO, data residency options, retention policies, audit logs, DPA support, and independent fairness review.
- Ongoing psychometric, cultural-validity, and harm-monitoring programme.

## Future AI roadmap

AI should be introduced only after the core self-reflection experience proves useful without it. It may help users turn a selected insight into a practice plan, rehearse a difficult conversation, or translate a message for a stated audience. It must:

- disclose that it is generative guidance, not professional or clinical advice;
- use only user-authorised analyzer context;
- never infer hidden traits, diagnose, rank people, or make hiring/relationship predictions;
- never train on identifiable user content without explicit, separate opt-in;
- provide controls to edit context, delete transcripts, and turn AI features off;
- escalate to human-support resources when users raise safety or distress concerns.

## Success criteria

The MVP is ready to build only when pilot users can accurately paraphrase their result, identify one useful behaviour to try, understand the uncertainty label, and report that the output felt respectful rather than judgmental. Product success is demonstrated by informed return use and self-reported usefulness—not by pushing users toward a higher score.

---

**Status: PRODUCT SPEC READY**
