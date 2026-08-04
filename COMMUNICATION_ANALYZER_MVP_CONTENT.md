# Communication Style Analyzer — MVP Content and Scoring Package

## Release identity and scope

- **Analyzer:** Communication Style Analyzer
- **Content version:** `communication-analyzer@1.0.0-draft`
- **Status:** Authored draft; requires human review before implementation or publication.
- **Dimensions/scenarios/scoring/interpretation/locales:** `1.0.0-draft`
- **MVP:** 10 dimensions, fixed 12 scenarios, four plausible actions per scenario, deterministic server-side scoring, qualitative evidence confidence, rule-composed private result, and one voluntary weekly challenge.
- **Excluded:** overall score, benchmarks, population comparisons, adaptive logic, AI, free-text analysis, team tools, manager access, and clinical/hiring claims.

## 1. Final dimensions

| Stable ID | English / Hindi | Definition and both ends | Benefits and blind spots | Coaching direction | Prohibited interpretation |
|---|---|---|---|---|---|
| `message-clarity` | Message clarity / संदेश की स्पष्टता | Tendency to make purpose, context, ownership, and next step explicit. Stronger: names the point and action. Weaker: lets meaning emerge or remain implicit. | Stronger can reduce coordination loss; can over-structure. Weaker can leave room for exploration; can create avoidable ambiguity. | State purpose, decision, owner, and next step in one short sequence. | Not intelligence, competence, or truthfulness. |
| `directness-with-tact` | Directness with tact / संवेदनशील स्पष्टता | Tendency to name difficult points plainly while protecting dignity. Stronger: says the hard thing clearly. Weaker: softens, delays, or approaches indirectly. | Stronger can build clarity; can land as abrupt. Weaker can preserve harmony; can obscure needs. | Pair one observation with impact and a curious question. | Not courage, honesty, aggression, or cultural superiority. |
| `receptive-listening` | Receptive listening / सक्रिय सुनना | Tendency to seek, reflect, and check another person’s meaning before advancing one’s own view. Stronger: summarises and asks. Weaker: moves quickly to response, advice, or action. | Stronger can build understanding; can over-process. Weaker can create momentum; can miss intent. | Reflect one key point before offering a view. | Not empathy level, caring, or introversion. |
| `emotional-transparency` | Emotional transparency / भावनात्मक स्पष्टता | Tendency to share relevant feelings, needs, and stakes with appropriate boundaries. Stronger: names relevant internal context. Weaker: keeps emotion private or communicates it indirectly. | Stronger can make stakes legible; can over-disclose. Weaker can preserve privacy; can appear detached. | Name one relevant feeling and one workable request. | Not emotional maturity, stability, or mental-health status. |
| `collaborative-inquiry` | Collaborative inquiry / सहयोगी जिज्ञासा | Tendency to test assumptions and invite perspectives through genuine questions. Stronger: asks what is missing. Weaker: forms a view independently first. | Stronger broadens insight; can slow closure. Weaker can bring focus; can narrow input. | Ask one open question before choosing a solution. | Not intelligence, agreeableness, or indecision. |
| `constructive-assertion` | Constructive assertion / रचनात्मक आग्रह | Tendency to state a preference, request, boundary, or dissent without dominating or retreating. Stronger: makes a clear ask or limit. Weaker: accommodates, hints, or defers. | Stronger protects needs; can feel controlling. Weaker can be flexible; can build resentment. | Use “I can do X; I cannot do Y; here is an alternative.” | Not leadership potential, confidence, or likeability. |
| `feedback-exchange` | Feedback exchange / प्रतिक्रिया का आदान-प्रदान | Tendency to give, receive, and use specific developmental feedback. Stronger: seeks examples and discusses impact. Weaker: avoids, defends against, or dilutes feedback. | Stronger supports learning; can create too much signal. Weaker can reduce discomfort; can leave growth unclear. | Separate observation, impact, and invitation. | Not performance quality or employability. |
| `conflict-navigation` | Conflict navigation / मतभेद सँभालना | Tendency to raise, stay with, pause, and repair disagreement productively. Stronger: addresses tension with structure. Weaker: avoids, escalates, or postpones tension. | Stronger can prevent resentment; can force timing. Weaker can lower immediate heat; can let issues linger. | Agree on the issue and a safe next conversation step. | Not relationship health, safety, or abuse risk. |
| `audience-adaptability` | Audience adaptability / श्रोता के अनुसार ढलना | Tendency to adjust channel, detail, pace, and language to a receiver’s needs. Stronger: deliberately adapts delivery. Weaker: uses a consistent default style. | Stronger can improve access; can feel inauthentic. Weaker can feel consistent; can miss receiver needs. | Ask what format or level of detail would help. | Not masking ability, professionalism, or social status. |
| `decision-alignment` | Decision alignment / निर्णय में सामंजस्य | Tendency to make criteria, trade-offs, ownership, dissent, and commitment visible around decisions. Stronger: explains what is decided and why. Weaker: shares outcome or assumes alignment. | Stronger supports execution; can over-explain. Weaker can move fast; can leave hidden disagreement. | State decision, reason, owner, and review point. | Not decisiveness, authority, or management suitability. |

## 2. Fixed MVP scenario set

All options are intentionally plausible. A contribution is a directional signal, not a reward or penalty. `+3` means strong evidence toward the more explicit/active end of the named dimension; `-2` means evidence toward the less explicit/active end. Each scenario has evidence strength `1.0`; no single scenario determines a dimension.

| ID / category | Prompt (English / Hindi) | Dimensions | Difficulty / sensitivity | Rationale |
|---|---|---|---|---|
| `meeting-unclear-update-01` / meeting | **EN:** A colleague’s update is difficult to follow and the meeting is nearly over. What do you most often do? **HI:** किसी सहकर्मी का अपडेट समझना मुश्किल है और मीटिंग लगभग खत्म होने वाली है। आप अक्सर क्या करते हैं? | clarity, listening, inquiry | Basic / standard | Separates clarification, reflection, examples, and deferral without privileging one. |
| `remote-deadline-shift-01` / remote work | **EN:** A shared deadline moves without an explanation in the project channel. **HI:** प्रोजेक्ट चैनल में साझा समयसीमा बिना कारण बताए बदल जाती है। | clarity, assertion, decision alignment | Basic / standard | Tests remote coordination without assuming authority. |
| `feedback-brief-miss-01` / feedback | **EN:** A teammate’s work does not meet the agreed brief. **HI:** सहकर्मी का काम तय ब्रीफ के अनुसार नहीं है। | directness, feedback, listening | Moderate / standard | Uses peer feedback, not a power-heavy review. |
| `friend-plan-cancel-01` / friendship | **EN:** A friend has cancelled plans several times. **HI:** एक दोस्त ने कई बार योजनाएँ रद्द की हैं। | assertion, emotional transparency, conflict | Moderate / personal | Explores needs and repair without implying abandonment or blame. |
| `leadership-disagreement-01` / leadership | **EN:** Two people on your team disagree strongly about a plan. **HI:** आपकी टीम के दो लोग किसी योजना पर तीव्र असहमति रखते हैं। | inquiry, decision alignment, conflict | Moderate / standard | Tests facilitation behaviours, not a “right leader” answer. |
| `customer-delay-01` / customer/service | **EN:** A customer’s request cannot be met by the promised date. **HI:** ग्राहक का अनुरोध वादा की गई तारीख तक पूरा नहीं हो सकता। | clarity, directness, adaptability | Moderate / standard | Covers service communication without requiring a specific industry. |
| `partner-quiet-01` / close relationship | **EN:** Someone close to you is quiet after a difficult day. **HI:** आपका कोई करीबी व्यक्ति कठिन दिन के बाद चुप है। | listening, inquiry, emotional transparency | Basic / personal | Avoids labels such as partner/spouse and respects need for space. |
| `stress-sharp-message-01` / stress | **EN:** A written message feels sharper than you expected while you are already stressed. **HI:** जब आप पहले से तनाव में हों, तो कोई लिखित संदेश अपेक्षा से अधिक तीखा लगे। | conflict, emotional transparency, inquiry | Moderate / personal | Captures pause, clarification, withdrawal, and escalation choices. |
| `meeting-dissent-01` / disagreement | **EN:** You disagree with a proposal that the group seems ready to accept. **HI:** आप उस प्रस्ताव से असहमत हैं जिसे समूह स्वीकार करने को तैयार दिखता है। | directness, assertion, decision alignment | Moderate / standard | Distinguishes public dissent, questions, silence, and later escalation. |
| `family-boundary-01` / family | **EN:** A family member asks a personal question you do not want to answer. **HI:** परिवार का कोई सदस्य आपसे निजी सवाल पूछता है जिसका आप उत्तर नहीं देना चाहते। | assertion, directness, inquiry | Basic / personal | Avoids assumptions about family structure and asks no private disclosure. |
| `remote-channel-preference-01` / remote work | **EN:** A colleague prefers calls, while you prefer written updates. **HI:** एक सहकर्मी कॉल पसंद करता है, जबकि आप लिखित अपडेट पसंद करते हैं। | adaptability, assertion, clarity | Moderate / standard | Tests channel flexibility and mutual coordination. |
| `feedback-tone-impact-01` / feedback | **EN:** Someone says your tone felt dismissive. **HI:** कोई व्यक्ति कहता है कि आपका लहजा उसे उपेक्षापूर्ण लगा। | listening, feedback, emotional transparency | Advanced / personal | Tests response to impact without assuming intent or fault. |

### Scenario quality annotations

| Scenario | Social-desirability risk | Ambiguity note |
|---|---|---|
| `meeting-unclear-update-01` | Medium: clarification may look “best,” so deferral is framed as protecting meeting flow. | Different meeting norms may make interruption appropriate or not. |
| `remote-deadline-shift-01` | Medium: explicit update-seeking may look ideal. | Authority, timezone, and ownership may alter the best real-world action. |
| `feedback-brief-miss-01` | Medium-high: direct feedback may look professionally preferred. | Rewriting can be caring in a true emergency; context is intentionally absent. |
| `friend-plan-cancel-01` | Medium: sharing impact may look healthiest. | Repeated cancellation can have many causes; no cause is inferred. |
| `leadership-disagreement-01` | Medium-high: facilitation is socially valued. | User may not have formal authority; “on your team” includes informal leadership. |
| `customer-delay-01` | Medium: transparent options may look preferred. | Policy or contractual constraints may reasonably require internal escalation first. |
| `partner-quiet-01` | Medium: asking preferences can look ideal. | “Someone close” may want privacy; no option is treated as proof of care. |
| `stress-sharp-message-01` | Medium-high: pausing may look ideal. | The message could be genuinely urgent; this measures default response, not safety. |
| `meeting-dissent-01` | Medium-high: public dissent can look brave. | Psychological safety and role risk vary; later dissent is not a moral failure. |
| `family-boundary-01` | Medium: explicit boundary-setting can look ideal. | Cultural norms and safety can change what is workable; no confrontation is required. |
| `remote-channel-preference-01` | Medium: compromise can look ideal. | Accessibility needs, bandwidth, and documentation requirements can make a preferred channel legitimate. |
| `feedback-tone-impact-01` | High: asking for an example may look most reflective. | Tone feedback may be unsafe or bad-faith; results must not require disclosure or agreement. |

### Bilingual response and scoring matrix

| Scenario | A | B | C | D |
|---|---|---|---|---|
| `meeting-unclear-update-01` | **Ask what decision is needed.** / “कौन-सा निर्णय चाहिए?” `clarity +3, inquiry +1` | **Let them finish, then summarise what you heard.** / “पहले पूरा सुनकर, फिर अपनी समझ दोहराऊँगा/दूँगी।” `listening +3, clarity +1` | **Ask for one concrete example.** / “एक ठोस उदाहरण पूछूँगा/पूछूँगी।” `inquiry +3, clarity +1` | **Read the notes later rather than interrupt.** / “बीच में रोकने के बजाय नोट्स बाद में पढ़ूँगा/पढ़ूँगी।” `clarity -2, assertion -1` |
| `remote-deadline-shift-01` | **Ask what changed, the impact, and the new owner.** / “क्या बदला, असर क्या है और नया जिम्मेदार कौन है?” `clarity +3, alignment +2` | **Wait for more information.** / “और जानकारी की प्रतीक्षा करूँगा/करूँगी।” `assertion -2, clarity -1` | **Raise it in the next group meeting.** / “अगली समूह मीटिंग में उठाऊँगा/उठाऊँगी।” `alignment +1, assertion -1` | **Work around it quietly.** / “चुपचाप काम समायोजित कर लूँगा/लूँगी।” `clarity -2, assertion -2` |
| `feedback-brief-miss-01` | **Name the mismatch and ask how they see it.** / “अंतर बताकर उनकी राय पूछूँगा/पूछूँगी।” `directness +3, feedback +2` | **Rewrite it yourself.** / “इसे स्वयं फिर से लिख दूँगा/दूँगी।” `feedback -2, directness -1` | **Start with positives, then explain the gap.** / “पहले सकारात्मक बात, फिर कमी समझाऊँगा/समझाऊँगी।” `feedback +2, directness +1` | **Send the brief again without comment.** / “ब्रीफ फिर से भेज दूँगा/दूँगी, टिप्पणी नहीं करूँगा/करूँगी।” `feedback -2, clarity -1` |
| `friend-plan-cancel-01` | **Ask whether something has changed.** / “पूछूँगा/पूछूँगी कि क्या कुछ बदल गया है।” `inquiry +2, conflict +1` | **Stop initiating plans.** / “योजनाएँ बनाना बंद कर दूँगा/दूँगी।” `assertion -2, conflict -2` | **Say it is fine, though disappointed.** / “निराश होकर भी कहूँगा/कहूँगी कि कोई बात नहीं।” `emotional -1, assertion -2` | **Share the pattern and how it affects you.** / “पैटर्न और उसका असर बताऊँगा/बताऊँगी।” `emotional +3, assertion +2, conflict +1` |
| `leadership-disagreement-01` | **Ask each person for evidence and decision criteria.** / “दोनों से प्रमाण और निर्णय के मानदंड पूछूँगा/पूछूँगी।” `inquiry +3, alignment +2` | **Choose quickly to end tension.** / “तनाव खत्म करने के लिए जल्दी चुनूँगा/चुनूँगी।” `conflict -1, alignment -1` | **Set a follow-up with a clear decision owner.** / “स्पष्ट निर्णय-स्वामी के साथ अगली चर्चा तय करूँगा/करूँगी।” `alignment +3, conflict +1` | **Let the discussion continue without structure.** / “बिना संरचना चर्चा चलने दूँगा/दूँगी।” `alignment -2, clarity -1` |
| `customer-delay-01` | **Explain the constraint and offer options.** / “सीमा बताकर विकल्प दूँगा/दूँगी।” `clarity +3, adaptability +2` | **Promise to try without detail.** / “बिना विवरण के कोशिश का वादा करूँगा/करूँगी।” `clarity -2, directness -1` | **Escalate internally before replying.** / “जवाब से पहले आंतरिक रूप से आगे भेजूँगा/भेजूँगी।” `directness -1, clarity -1` | **State only what is possible.** / “सिर्फ क्या संभव है, यह बताऊँगा/बताऊँगी।” `directness +2, adaptability -1` |
| `partner-quiet-01` | **Ask whether they want listening, ideas, or space.** / “पूछूँगा/पूछूँगी कि वे सुनना, सुझाव या जगह चाहते हैं।” `listening +3, inquiry +2` | **Offer solutions immediately.** / “तुरंत समाधान सुझाऊँगा/सुझाऊँगी।” `listening -2, clarity +1` | **Give them space without asking.** / “बिना पूछे उन्हें जगह दूँगा/दूँगी।” `inquiry -2, emotional -1` | **Share your concern and ask what happened.** / “अपनी चिंता बताकर पूछूँगा/पूछूँगी कि क्या हुआ।” `emotional +2, inquiry +2` |
| `stress-sharp-message-01` | **Pause, then ask for clarification.** / “रुककर स्पष्टता पूछूँगा/पूछूँगी।” `conflict +3, inquiry +2` | **Reply immediately with frustration.** / “झुंझलाहट में तुरंत जवाब दूँगा/दूँगी।” `conflict -2, emotional +1` | **Ignore it until later.** / “बाद तक अनदेखा करूँगा/करूँगी।” `conflict -2, assertion -1` | **Ask a third person what it meant.** / “किसी तीसरे से अर्थ पूछूँगा/पूछूँगी।” `inquiry +1, conflict -1` |
| `meeting-dissent-01` | **State the concern and an alternative.** / “चिंता और विकल्प बताऊँगा/बताऊँगी।” `directness +3, assertion +2` | **Ask questions until the issue emerges.** / “सवालों से मुद्दा सामने लाऊँगा/लाऊँगी।” `inquiry +2, directness +1` | **Stay quiet after the group leans one way.** / “समूह झुकने पर चुप रहूँगा/रहूँगी।” `assertion -3, alignment -1` | **Raise it after the meeting.** / “मीटिंग के बाद उठाऊँगा/उठाऊँगी।” `directness -1, assertion -1` |
| `family-boundary-01` | **Say you would rather not discuss it.** / “कहूँगा/कहूँगी कि इस पर बात नहीं करना चाहता/चाहती।” `assertion +3, directness +2` | **Answer briefly despite discomfort.** / “असहज होकर भी छोटा जवाब दूँगा/दूँगी।” `assertion -2, emotional -1` | **Joke and move on.** / “मज़ाक कर आगे बढ़ जाऊँगा/जाऊँगी।” `directness -2, emotional -1` | **Ask why they want to know.** / “पूछूँगा/पूछूँगी कि वे क्यों जानना चाहते हैं।” `inquiry +2, assertion +1` |
| `remote-channel-preference-01` | **Agree on a short call plus written recap.** / “छोटी कॉल और लिखित सार पर सहमत होऊँगा/होऊँगी।” `adaptability +3, clarity +2` | **Insist on your preferred channel.** / “अपने पसंदीदा माध्यम पर अड़ूँगा/अड़ूँगी।” `adaptability -3, assertion +1` | **Avoid the conversation.** / “बात से बचूँगा/बचूँगी।” `assertion -2, clarity -1` | **Use their channel every time.** / “हर बार उनका माध्यम अपनाऊँगा/अपनाऊँगी।” `adaptability +1, assertion -2` |
| `feedback-tone-impact-01` | **Ask for an example and reflect it back.** / “उदाहरण माँगकर अपनी समझ दोहराऊँगा/दोहराऊँगी।” `listening +3, feedback +3` | **Explain your intent immediately.** / “तुरंत अपना इरादा समझाऊँगा/समझाऊँगी।” `feedback -1, emotional +1` | **Apologise without discussing details.** / “बिना विवरण के माफी माँगूँगा/माँगूँगी।” `feedback -2, conflict -1` | **Disagree because the content was correct.** / “सामग्री सही थी इसलिए असहमत होऊँगा/हूँगी।” `feedback -3, directness +1` |

**Matrix conventions:** `alignment` = `decision-alignment`; `emotional` = `emotional-transparency`; `adaptability` = `audience-adaptability`. Options marked with two or three contributions are intentionally multidimensional. The option-level ambiguity is medium for all options unless specified in JSON; none is a “correct” choice. Repeated negative-direction signals contribute evidence toward a lower tendency; they do not subtract a moral score.

## 3. Deterministic scoring and confidence

### Accumulation and normalisation

1. Persist the pinned scenario plan and selected option IDs.
2. Add each option’s signed contributions to every referenced dimension.
3. Calculate each dimension against only its answered applicable contributions; skipped scenarios are excluded from numerator and denominator.
4. Convert the resulting directional signal to internal bands: `lower`, `balanced`, or `higher`. Do not display numerical dimensions in MVP.
5. Require at least **two scenario signals**, one of which must be strong (`abs(contribution) >= 2`), before a dimension can receive a direction band. Otherwise it is `limited`.

Incomplete sessions return no assessment result. A completed result may display `limited` dimensions; it does not invent a midpoint.

### Qualitative evidence-confidence bands

| Band | Requirements | Result wording / display | Coaching allowed | Prohibited |
|---|---|---|---|---|
| **Clear pattern** | 3+ signals, 2+ contexts where available, 70%+ directional convergence, no strong contradiction | “Across these scenarios, you often…”; solid evidence marker | One targeted challenge and interaction insight | Global claims or “you are…” labels. |
| **Emerging pattern** | 2+ signals with a directional lean, but narrow context or only moderate convergence | “Your answers suggest…”; light evidence marker | One low-effort experiment | Cross-context generalisation. |
| **Mixed evidence** | 2+ meaningful signals with neither direction reaching 70%, or a clear context split | “Your pattern appears mixed…”; split evidence marker | Context-specific reflection only | Calling the user inconsistent or assigning a fixed band. |
| **Limited evidence** | Fewer than 2 signals, mostly skipped items, or only low-weight evidence | “There is not enough evidence yet…”; muted marker | Optional general practice only | Dimension strength, blind spot, or comparison claim. |

### Worked patterns

1. **Clear message clarity:** Meeting A (+3), deadline A (+3), customer A (+3) across meeting/remote/customer. Result: higher clarity, Clear pattern. Wording: “Across several contexts, you often make the purpose and next step explicit.”
2. **Mixed assertion:** Friend D (+2), dissent C (-3), family A (+3), remote D (-2). Result: mixed evidence; possible work-versus-personal context discussion, no overall assertion label.
3. **Limited conflict navigation:** Friend A (+1), stress C (-2), with no other conflict item answered. Result: Limited evidence; no blind-spot claim, only “You may want to notice how you prefer to return to tension.”

## 4. Dimension coverage audit

| Dimension | Scenarios | Strong directional signals | Contexts | + / - evidence | Audit outcome |
|---|---:|---:|---:|---|---|
| Message clarity | 6 | 7 | 6 | Balanced | Adequate; no single item dominates. |
| Directness with tact | 4 | 5 | 4 | Balanced | Adequate. |
| Receptive listening | 3 | 4 | 3 | Balanced | Adequate for Emerging/Mixed only; do not show Clear in MVP. |
| Emotional transparency | 4 | 2 | 4 | Balanced | Adequate for Emerging/Mixed only; personal-context weighted, deliberately not diagnostic. |
| Collaborative inquiry | 7 | 9 | 7 | More positive paths but alternatives remain plausible | Adequate; review for desirability during pilot. |
| Constructive assertion | 6 | 11 | 6 | Balanced | Broadest coverage; no individual scenario contributes over 30% of max evidence. |
| Feedback exchange | 2 | 7 | 1 | Balanced | Emerging/Mixed only; no cross-context claim in MVP. |
| Conflict navigation | 4 | 4 | 4 | Balanced | Adequate. |
| Audience adaptability | 2 | 3 | 2 | Balanced | Emerging/Mixed only; no Clear pattern in MVP. |
| Decision alignment | 3 | 4 | 3 | Balanced | Adequate for Emerging/Mixed only; no Clear pattern in MVP. |

**Coverage decision:** The MVP has 12 scenarios rather than 15 to protect completion time. `receptive-listening`, `emotional-transparency`, `feedback-exchange`, `audience-adaptability`, and `decision-alignment` cannot receive a Clear pattern under this fixed bank because they lack enough cross-context signals. They may receive Emerging, Mixed, or Limited evidence only. V1.1 should add feedback/customer, listening, and adaptability scenarios before any retake comparison is marketed.

## 5. Interpretation library

Each dimension uses the same evidence gate. “Strength” and “misunderstanding” are conditional—not evaluation.

| Dimension | Lower tendency | Balanced/context-dependent | Higher tendency | Mixed / limited evidence |
|---|---|---|---|---|
| Clarity | **Heading:** Meaning may emerge as you talk. **Strength:** room for exploration. **Misunderstanding:** others may not know the next step. **Try:** state one action before detail. | **Heading:** Clarity shifts with the situation. **Try:** notice where context makes your message clearer. | **Heading:** You often make the path visible. **Strength:** coordination. **Misunderstanding:** detail can feel pre-decided. **Try:** end with an open check. | Mixed: “Your clarity changes by context.” Limited: “More scenarios are needed.” |
| Directness | **Heading:** You may approach hard points gently. **Strength:** protects tone. **Misunderstanding:** need may remain unclear. **Try:** name one observation directly. | **Heading:** Your directness appears situational. **Try:** choose a level of directness before a hard conversation. | **Heading:** You may name difficult points quickly. **Strength:** candour. **Misunderstanding:** impact can feel abrupt. **Try:** add intent and a question. | Mixed/limited wording follows confidence rules. |
| Listening | **Heading:** You may move quickly toward response or action. **Strength:** momentum. **Misunderstanding:** others may feel unheard. **Try:** summarise first. | **Heading:** You shift between listening and action. **Try:** ask what the person needs. | **Heading:** You often seek meaning before responding. **Strength:** understanding. **Misunderstanding:** others may want a faster answer. **Try:** ask whether they want listening or ideas. | Mixed/limited wording follows confidence rules. |
| Emotional transparency | **Heading:** You may keep feelings private. **Strength:** boundaries. **Misunderstanding:** stakes may be hard to read. **Try:** share one relevant feeling and request. | **Heading:** Your disclosure appears context-sensitive. **Try:** choose what is useful to share, not everything. | **Heading:** You may name internal context readily. **Strength:** legible stakes. **Misunderstanding:** some audiences may need less detail. **Try:** match disclosure to purpose. | Mixed/limited wording follows confidence rules. |
| Inquiry | **Heading:** You may form a view before inviting input. **Strength:** focus. **Misunderstanding:** assumptions may stay untested. **Try:** ask “What am I missing?” | **Heading:** Your questioning changes with context. **Try:** notice when a question would improve the decision. | **Heading:** You often open space for perspectives. **Strength:** broader insight. **Misunderstanding:** decisions can stay open too long. **Try:** name when exploration ends. | Mixed/limited wording follows confidence rules. |
| Assertion | **Heading:** You may accommodate before naming your need. **Strength:** flexibility. **Misunderstanding:** agreement may be assumed. **Try:** make one specific request. | **Heading:** You assert differently by setting. **Try:** identify the boundary that matters most. | **Heading:** You often state preferences or limits. **Strength:** clear expectations. **Misunderstanding:** others may experience less room. **Try:** pair limit with an alternative. | Mixed/limited wording follows confidence rules. |
| Feedback | **Heading:** You may avoid or soften developmental feedback. **Strength:** lowers immediate discomfort. **Misunderstanding:** learning signal may be unclear. **Try:** share observation, impact, invitation. | **Heading:** Your feedback style appears situational. **Try:** ask how feedback is best received. | **Heading:** You often seek specific feedback. **Strength:** learning. **Misunderstanding:** frequent feedback can feel intense. **Try:** agree on timing. | Mixed/limited wording follows confidence rules. |
| Conflict | **Heading:** You may postpone or step away from tension. **Strength:** protects immediate calm. **Misunderstanding:** issue may remain unresolved. **Try:** name a safe return time. | **Heading:** You navigate tension differently by context. **Try:** identify what makes a conversation safe enough. | **Heading:** You may stay engaged with disagreement. **Strength:** repair and resolution. **Misunderstanding:** timing may feel forced. **Try:** ask whether now is a workable time. | Mixed/limited wording follows confidence rules. |
| Adaptability | **Heading:** You may prefer a consistent communication default. **Strength:** consistency. **Misunderstanding:** format may not fit the receiver. **Try:** ask their preference. | **Heading:** You adapt selectively. **Try:** choose the channel deliberately for one conversation. | **Heading:** You often adjust channel, pace, or detail. **Strength:** accessibility. **Misunderstanding:** adaptation can become over-accommodation. **Try:** keep one need visible. | Mixed/limited wording follows confidence rules. |
| Decision alignment | **Heading:** You may communicate outcome before process. **Strength:** speed. **Misunderstanding:** dissent or ownership may remain hidden. **Try:** add decision, reason, owner, review point. | **Heading:** Your alignment style shifts with stakes. **Try:** make trade-offs explicit when impact is broad. | **Heading:** You often make criteria and ownership visible. **Strength:** execution. **Misunderstanding:** discussion may feel prolonged. **Try:** signal when commitment begins. | Mixed/limited wording follows confidence rules. |

### Cross-dimension rules

| Conditions | Composed insight | Coaching boundary |
|---|---|---|
| Higher directness + lower emotional transparency, each Clear/Emerging | “Your answers suggest you may name the issue clearly while keeping personal stakes private. Some people may hear the point without understanding what matters to you.” | Suggest one relevant feeling plus a request; do not ask for vulnerability in unsafe settings. |
| Higher listening + lower assertion | “You may make room for others before making your own need visible. This can build understanding while leaving agreement assumed.” | Suggest a short request after reflection. |
| Higher clarity + lower adaptability | “You may bring useful structure through a preferred format. A receiver with another processing style may need a different channel or level of detail.” | Suggest asking format preference; never imply masking. |
| Higher conflict navigation + lower inquiry | “You may be willing to address tension quickly, while moving toward your own solution before fully exploring another view.” | Suggest one genuine question before proposing repair. |
| Higher inquiry + lower decision alignment | “You may create valuable exploration, while some conversations need a clearer point of closure.” | Suggest naming decision criteria and a closing time. |
| Lower conflict navigation + higher emotional transparency | “You may feel and express the stakes strongly while finding it harder to stay in a structured disagreement.” | Suggest a timed pause and return point; never frame as instability. |

## 6. Exact MVP results model

1. **Title:** “Your Communication Reflection” / “आपका संवाद चिंतन”.
2. **One-sentence pattern summary:** selected from highest-evidence dimensions; no overall score.
3. **Communication profile:** ten dimension cards/bars with direction band and confidence band.
4. **Three likely strengths:** highest-evidence authored patterns, max one from any scenario.
5. **Three possible blind spots:** only Clear/Emerging patterns, maximum one from personal context unless corroborated.
6. **Two common misunderstandings:** from safe cross-dimension rules or dimension templates.
7. **Three practical suggestions:** effort-calibrated authored actions.
8. **One weekly challenge:** selected from target dimension and user-visible trigger condition.
9. **Retake guidance:** “Revisit after a meaningful month or a change in context; results are self-reflection, not a grade.”
10. **Optional personality note:** “Your communication result adds another layer to your [TYPE] profile. It comes from these scenario responses and does not define what people with that type are like.”
11. **Safety disclosure:** not clinical, hiring, relationship-safety, or performance advice; seek qualified support for persistent distress or unsafe situations.

Dimension, confidence, interaction, and context rules vary the result. Saved personality type changes only the optional note; it never changes question selection, scoring, confidence, or coaching priority.

## 7. Weekly challenge library

| ID | English / Hindi title | Target / trigger | Instruction and reflection | Time / safety note |
|---|---|---|---|---|
| `clarify-next-step` | Clarify one next step / एक अगला कदम स्पष्ट करें | Clarity; lower/emerging | End one update with owner and next step. Reflect: what became easier? | 3 min; work or home. |
| `state-purpose-first` | State the purpose first / पहले उद्देश्य बताएं | Clarity | Begin one conversation with why it matters. Reflect: did it change the response? | 2 min; avoid urgent safety conversations. |
| `name-observation-kindly` | Name one observation kindly / एक अवलोकन संवेदनशीलता से कहें | Directness | Use “I noticed…” once, without judging motive. Reflect: was your point understood? | 5 min; no confrontation requirement. |
| `ask-before-advice` | Ask before advising / सलाह से पहले पूछें | Listening | Ask “Would listening, ideas, or space help?” Reflect: what did they choose? | 2 min; respect “no.” |
| `reflect-before-reply` | Reflect before replying / जवाब से पहले दोहराएं | Listening | Summarise one key point before your view. Reflect: did they correct or add anything? | 3 min. |
| `name-need-and-request` | Name a need and request / आवश्यकता और अनुरोध बताएं | Emotional transparency | Share one relevant feeling plus one small request. Reflect: did it feel proportionate? | 5 min; keep privacy boundaries. |
| `ask-what-missing` | Ask what is missing / पूछें क्या छूट रहा है | Inquiry | In one decision, ask “What might we be missing?” Reflect: what surfaced? | 3 min. |
| `make-one-clear-request` | Make one clear request / एक स्पष्ट अनुरोध करें | Assertion | Replace a hint with a specific request. Reflect: was the answer clearer? | 3 min; accept refusal. |
| `feedback-three-parts` | Use three-part feedback / तीन भागों में प्रतिक्रिया दें | Feedback | Share observation, impact, then invitation. Reflect: what would you refine? | 10 min; use low-stakes example first. |
| `receive-feedback-example` | Ask for a feedback example / प्रतिक्रिया का उदाहरण माँगें | Feedback | When given feedback, ask for one example before explaining intent. Reflect: what did you learn? | 5 min; pause if conversation feels unsafe. |
| `pause-and-return` | Pause and return / रुकें और लौटें | Conflict | In tension, ask for a pause and agree a return time. Reflect: did the return happen? | 5 min; not for unsafe relationships. |
| `surface-dissent-once` | Surface dissent once / असहमति एक बार रखें | Conflict/Assertion | State one concern and one alternative, then listen. Reflect: was dissent visible? | 5 min; choose safe setting. |
| `match-the-channel` | Match the channel / सही माध्यम चुनें | Adaptability | Ask whether a call, note, or message would help most. Reflect: what changed? | 2 min. |
| `decision-four-lines` | Align a decision in four lines / निर्णय को चार पंक्तियों में स्पष्ट करें | Decision alignment | Write decision, reason, owner, review point. Reflect: what question remained? | 5 min. |
| `invite-quieter-view` | Invite another view / एक और दृष्टिकोण आमंत्रित करें | Inquiry/Listening | Ask one person an optional, specific question. Reflect: did they have room to decline? | 3 min; do not single out publicly if uncomfortable. |

## 8. English/Hindi parity audit

- All 10 dimensions, 12 scenarios, 48 options, rules, and 15 challenges use shared stable IDs and identical contribution vectors.
- Hindi has been authored for natural, culturally neutral meaning; it does not depend on literal translation. Common terms such as “कॉल”, “प्रोजेक्ट”, and “फीडबैक” remain where they are natural.
- No option contains an untranslated UI label. Gender-neutral constructions use paired or neutral Hindi where needed.
- Perfect equivalence risk: the English phrase “tone felt dismissive” has no single exact Hindi equivalent. The chosen phrasing “लहजा … उपेक्षापूर्ण लगा” must be reviewed by a Hindi editor for register and naturalness.
- Perfect equivalence risk: “assertion” can sound forceful in Hindi. The display term “रचनात्मक आग्रह” needs Hindi-editor review against alternatives such as “स्पष्ट आग्रह”.
- No locale may ship if an option’s plausibility or desirability is materially different after review.

## 9. Bias and safety review

| Risk | Content decision / mitigation |
|---|---|
| Workplace hierarchy | Peer/customer/leadership scenarios do not require challenging a superior. Do not infer leadership potential. |
| Gender/family structure | Uses “someone close” and “family member”; no gender, marriage, parenthood, or nuclear-family assumptions. |
| Cultural/directness bias | Directness is presented as a trade-off; indirect options retain valid benefits and do not receive moral labels. |
| Class/education bias | No jargon-heavy, elite-profession, schooling, or technology-only requirement. |
| Neurodiversity/disability | Variation in channel, pace, and disclosure is not pathologised. Accessibility and pause/skip are mandatory. |
| Relationship safety | No abuse, reconciliation, disclosure, or confrontation prompt. Challenges explicitly say not to use in unsafe relationships. |
| Social desirability | Four plausible actions, mixed positive/negative contributions, and no “correct” option. Pilot review remains required. |
| Clinical overinterpretation | Definitions and results prohibit mental-health, empathy, maturity, diagnosis, or stability claims. |
| Hiring/manager misuse | Explicit prohibited-use language; no team/manager result in MVP. |
| Introversion/extroversion stereotypes | No dimension treats energy, sociability, or personality type as communication quality. |

## 10. Human review gate

| Reviewer | Must approve |
|---|---|
| Product owner | MVP boundary, user value, no dark patterns, weekly challenge selection. |
| English editor | Naturalness, option plausibility, plain language, nonjudgmental wording. |
| Hindi editor | Natural Hindi, cultural fit, register, equal option desirability, text expansion. |
| Behavioural-science reviewer | Construct distinctions, weight rationale, confidence limitations, no validation overclaim. |
| Accessibility reviewer | Keyboard flow, announcement strategy, text alternatives, contrast, motion, reading load. |
| Privacy reviewer | Guest expiry, consent, result sharing, analytics exclusions, deletion/export. |
| Engineering reviewer | Stable IDs, valid configuration, pinned versions, deterministic fixtures, server-only scoring plan. |

Publication requires all reviewers to sign off, JSON/schema validation to pass, and pilot feedback to resolve any option judged obviously preferable, culturally narrow, or harmful.

---

**Status: MVP CONTENT READY FOR REVIEW**
