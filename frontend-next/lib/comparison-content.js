import { priorityComparison } from './priority-comparisons';
import { testComparison } from './test-comparisons';
import { comparisonV3 } from './comparison-v3';

const icon = ['♡', '☻', '↔', '◇', '↺', '↗'];
const commonSearchNames = {
  INTJ: 'Architect', INTP: 'Logician', ENTJ: 'Commander', ENTP: 'Debater',
  INFJ: 'Advocate', INFP: 'Mediator', ENFJ: 'Protagonist', ENFP: 'Campaigner',
  ISTJ: 'Logistician', ISFJ: 'Defender', ESTJ: 'Executive', ESFJ: 'Consul',
  ISTP: 'Virtuoso', ISFP: 'Adventurer', ESTP: 'Entrepreneur', ESFP: 'Entertainer',
};

function first(values, fallback) { return values?.[0] || fallback; }
function second(values, fallback) { return values?.[1] || fallback; }
function searchName(profile, hi) { return hi ? profile.displayName : commonSearchNames[profile.code] || profile.displayName; }

export function comparisonContent({ firstProfile, secondProfile, insight, locale }) {
  const hi = locale === 'hi';
  const a = firstProfile;
  const b = secondProfile;
  const aStrength = first(a.strengths, hi ? 'उनकी सोच' : 'their perspective');
  const bStrength = first(b.strengths, hi ? 'उनकी सोच' : 'their perspective');
  const aEdge = first(a.growthAreas, hi ? 'उनकी अलग गति' : 'their different pace');
  const bEdge = first(b.growthAreas, hi ? 'उनकी अलग गति' : 'their different pace');
  const aWork = first(a.workStyle, hi ? 'काम की दिशा' : 'work direction');
  const bWork = first(b.workStyle, hi ? 'काम की दिशा' : 'work direction');
  const aHobby = second(a.strengths, aStrength);
  const bHobby = second(b.strengths, bStrength);
  const pair = `${a.code} and ${b.code}`;
  const pairHi = `${a.code} और ${b.code}`;

  if (hi) {
    return {
      eyebrow: 'रिश्ता • दोस्ती • तुलना',
      helper: `लोग इन्हें ${a.displayName} (${a.code}) और ${b.displayName} (${b.code}) के नाम से भी खोजते हैं।`,
      intro: `${pairHi} की तुलना अक्सर इसलिए की जाती है क्योंकि दोनों के पास अलग-अलग ताकतें हैं: ${a.code} में ${aStrength.toLowerCase()} और ${b.code} में ${bStrength.toLowerCase()} दिख सकती है। यह पृष्ठ रिश्ते, दोस्ती, काम, संवाद, मतभेद और विकास में उन अंतरों को उपयोगी बातचीत में बदलने के तरीके देता है।`,
      snapshot: [
        ['रिश्ता', insight.label, 'इरादे स्पष्ट हों तो अलग लय भी निकटता बना सकती है।'],
        ['दोस्ती', 'साझा खोज', `${aHobby} और ${bHobby} साझा अनुभवों का अच्छा शुरुआती बिंदु हैं।`],
        ['संवाद', 'इरादा पहले', 'बात के पीछे का कारण कहें; दूसरे को अनुमान न लगाने दें।'],
        ['निर्णय', 'दो गति, एक समीक्षा', 'सोचने और कार्रवाई करने की गति अलग हो सकती है; समीक्षा समय तय करें।'],
        ['संघर्ष के बाद', 'मरम्मत संभव', 'विराम के बाद एक ठोस अगला कदम भरोसा लौटाता है।'],
        ['विकास', 'पूरक दृष्टि', 'एक-दूसरे की गति को अपनाना दोनों की क्षमता बढ़ा सकता है।'],
      ].map((item, index) => ({ icon: icon[index], title: item[0], label: item[1], text: item[2] })),
      sections: [
        ['रिश्ते, डेटिंग और दीर्घकाल', `${a.code} और ${b.code} में आकर्षण अक्सर इस बात से शुरू होता है कि दोनों दुनिया को अलग कोण से देखते हैं। ${a.relationshipStyle} ${b.relationshipStyle} डेटिंग, साझेदारी या विवाह में भरोसा तब बढ़ता है जब स्नेह की भाषा, अकेले समय और जिम्मेदारियों पर खुलकर बात हो।`, `ताकत: ${insight.attraction} चुनौती: ${insight.conflict}`],
        ['दोस्ती का डायनामिक', `दोस्ती में ${a.code} को ${aHobby.toLowerCase()} और ${b.code} को ${bHobby.toLowerCase()} के आसपास साझा रुचि मिल सकती है। गलतफहमी तब बनती है जब शांत होना उदासीनता या उत्साह दबाव लगे। छोटी, सीधे कही गई योजनाएँ और मज़ेदार साझा अनुभव संबंध को हल्का रखते हैं।`, `मतभेद के बाद पहले अनुमान नहीं, एक छोटा संदेश भेजें: “मैं समझना चाहता/चाहती हूँ कि तुम्हारे लिए क्या महत्वपूर्ण था।”`],
        ['काम, नेतृत्व और साझेदारी', `सहकर्मी, प्रबंधक या सह-संस्थापक के रूप में ${a.code} ${aWork.toLowerCase()} की ओर और ${b.code} ${bWork.toLowerCase()} की ओर खिंच सकता है। बैठकों में भूमिका, निर्णय-स्वामी और समय-सीमा पहले तय करें। इससे अलग नेतृत्व शैली टकराव नहीं बल्कि उपयोगी कवरेज बनती है।`, `योजना का नियम: विकल्प लिखें, मालिक तय करें, फिर तय तारीख पर पुनरावलोकन करें।`],
        ['संवाद की गाइड', `${insight.communicationA} ${insight.communicationB} सुनते समय केवल निष्कर्ष नहीं, उस निष्कर्ष तक पहुंचने का कारण भी पूछें। टेक्स्ट पर कठिन बात बढ़ने लगे तो उसे आवाज़ या आमने-सामने की बातचीत में ले जाएँ।`, `फीडबैक सूत्र: पहले प्रभाव, फिर उदाहरण, फिर अगला अनुरोध।`],
        ['निर्णय लेना', `${insight.decisionA} ${insight.decisionB} इस फर्क को धीमापन या लापरवाही न मानें। जोखिम, प्रमाण, गति और बदलाव पर अलग राय आए तो निर्णय को उलटने योग्य और कठिन-से-उलटने योग्य हिस्सों में बाँटें।`, insight.decisions],
        ['मतभेद, तनाव और मरम्मत', `${insight.pressure} ${a.code} के लिए ${aEdge.toLowerCase()} और ${b.code} के लिए ${bEdge.toLowerCase()} दबाव में दिख सकते हैं। ट्रिगर के बारे में शांत समय में बात करें; बहस के दौरान जीतने के बजाय समझने और मरम्मत करने का लक्ष्य रखें।`, `मरम्मत का अभ्यास: विराम लें, अपना हिस्सा नाम लें, एक व्यावहारिक बदलाव प्रस्तावित करें।`],
        ['एक-दूसरे से क्या सीख सकते हैं', insight.growth, `यह तुलना किसी व्यक्ति की सीमा नहीं बताती। जीवन-चरण, मूल्य, अनुभव और व्यवहार हमेशा प्रकार से अधिक महत्वपूर्ण हैं।`],
      ],
      misconceptions: [
        [`मिथक: ${a.code} और ${b.code} बहुत अलग हों तो साथ नहीं चल सकते।`, 'वास्तविकता: अंतर स्पष्ट संवाद और साझा लक्ष्य के साथ पूरक हो सकते हैं।'],
        ['मिथक: एक लेबल रिश्ते का परिणाम तय कर देता है।', 'वास्तविकता: भरोसा, सम्मान, सीमाएँ और सीखने की इच्छा रिश्ते को आकार देते हैं।'],
        ['मिथक: पहले माफी मांगना कमजोर होना है।', 'वास्तविकता: मरम्मत शुरू करना संबंध की सुरक्षा में निवेश है।'],
      ],
      percentage: 'KalQLater संगतता प्रतिशत क्यों नहीं देता',
      percentageText: 'मानवीय रिश्तों को एक संख्या में नहीं समेटा जा सकता। संबंध संवाद, मूल्य, परिपक्वता, जीवन-चरण, व्यवहार और साझा लक्ष्यों से बनते हैं। प्रतिशत की जगह हम उन बातचीतों और आदतों पर ध्यान देते हैं जो इस जोड़ी को अधिक समझदारी से साथ काम करने में मदद कर सकती हैं।',
      faq: [
        [`क्या ${pairHi} संगत हैं?`, `${pairHi} का परिणाम किसी प्रतिशत से तय नहीं होता। ${insight.attraction} उनकी संगतता इस बात पर निर्भर करेगी कि वे संवाद, मूल्यों और दैनिक अपेक्षाओं को कैसे संभालते हैं।`],
        [`क्या ${pairHi} साथ निभा सकते हैं?`, `हाँ, यदि अलग गति को समस्या की जगह जानकारी की तरह देखें और ${insight.advice}`],
        [`क्या ${pairHi} शादी कर सकते हैं?`, 'वे कर सकते हैं, लेकिन किसी भी विवाह की तरह विश्वास, साझा जिम्मेदारियाँ, सीमाएँ और कठिन बातचीत की मरम्मत महत्वपूर्ण है।'],
        [`क्या ${pairHi} अच्छे दोस्त हो सकते हैं?`, `दोस्ती तब बेहतर चलती है जब दोनों साझा अनुभव बनाते हैं और अलग सामाजिक या भावनात्मक गति का सम्मान करते हैं।`],
        [`क्या वे अच्छे सहकर्मी हो सकते हैं?`, `हाँ। ${aStrength} और ${bStrength} को भूमिकाओं में बदलने से टीम को व्यापक दृष्टि मिल सकती है।`],
        [`कौन पहले माफी मांगता है?`, 'व्यक्तित्व प्रकार से यह तय नहीं होता। स्वस्थ मरम्मत वही शुरू करता है जो अपने हिस्से को पहचानने के लिए तैयार हो।'],
        [`वे निर्णय कैसे लेते हैं?`, `${insight.decisionA} ${insight.decisionB}`],
        [`वे बहस कैसे रोक सकते हैं?`, 'विराम लें, एक समय में एक मुद्दा चुनें, और अगला व्यावहारिक कदम लिखें।'],
        [`क्या वे साथ व्यवसाय शुरू कर सकते हैं?`, 'हाँ, यदि निर्णय अधिकार, जोखिम सीमा, संचार की लय और जवाबदेही पहले से स्पष्ट हो।'],
        [`क्या अलग प्रकार के लोग एक-दूसरे को बदल देते हैं?`, 'लोग एक-दूसरे से सीख सकते हैं, पर किसी को बदलना लक्ष्य नहीं होना चाहिए। लक्ष्य बेहतर समझ और विकल्प है।'],
        ['KalQLater प्रतिशत क्यों नहीं देता?', 'क्योंकि रिश्ते संवाद, मूल्य, परिपक्वता, जीवन-चरण, व्यवहार और साझा लक्ष्यों से बनते हैं—एक काल्पनिक अंक से नहीं।'],
      ],
    };
  }

  const base = {
    eyebrow: 'Compatibility • Relationship • Comparison',
      helper: `People also search for ${searchName(a, hi)} (${a.code}) and ${searchName(b, hi)} (${b.code}). These are secondary reference names; KalQLater keeps the focus on behaviour, context, and choice.`,
    intro: `People compare ${pair} because the pair can bring different strengths into the same relationship, friendship, or team: ${a.code} may lead with ${aStrength.toLowerCase()}, while ${b.code} may bring ${bStrength.toLowerCase()}. This guide turns those differences into practical conversations about connection, work, communication, conflict, and growth.`,
    snapshot: [
      ['Relationship', insight.label, 'Different rhythms can create closeness when intentions are explicit.'],
      ['Friendship', 'Shared discovery', `${aHobby} and ${bHobby} can create a natural starting point for shared experiences.`],
      ['Communication', 'Intent first', 'Name the reason behind the message instead of leaving the other person to infer it.'],
      ['Decision-making', 'Two speeds, one review', 'Different paces work better with an agreed review point.'],
      ['Conflict recovery', 'Repair is possible', 'A pause followed by one concrete next step can rebuild trust.'],
      ['Growth', 'Complementary perspective', 'Each person can expand the other’s range without becoming someone else.'],
    ].map((item, index) => ({ icon: icon[index], title: item[0], label: item[1], text: item[2] })),
    sections: [
      ['Relationship, dating, and the long term', `${a.code} and ${b.code} may be drawn together because they notice different things. ${a.relationshipStyle} ${b.relationshipStyle} In dating, partnership, or marriage, trust grows when affection, solitude, responsibilities, and expectations are discussed plainly rather than assumed.`, `Strength together: ${insight.attraction} Watch for: ${insight.conflict}`],
      ['Friendship dynamic', `Friendship can take shape around ${aHobby.toLowerCase()} for ${a.code} and ${bHobby.toLowerCase()} for ${b.code}. A quiet spell may be misread as disinterest, or enthusiasm as pressure. Small direct plans and shared experiences keep the connection light and real.`, 'After a misunderstanding, skip the guesswork and send one small repair message: “I want to understand what mattered to you there.”'],
      ['Workplace, leadership, and partnership', `As coworkers, managers, or founders, ${a.code} may lean toward ${aWork.toLowerCase()} while ${b.code} may gravitate toward ${bWork.toLowerCase()}. Clarify roles, decision owners, and deadlines before the meeting ends. That turns different leadership instincts into useful coverage rather than friction.`, 'Planning rule: write the options, name the owner, then set a review date.'],
      ['Communication guide', `${insight.communicationA} ${insight.communicationB} In listening, ask not only for the conclusion but also for the experience or evidence behind it. When a difficult text thread expands, move it to a voice or in-person conversation.`, 'Feedback formula: impact first, example second, next request third.'],
      ['Decision-making', `${insight.decisionA} ${insight.decisionB} Treat that difference as information, not as slowness or carelessness. When risk, evidence, speed, or adaptability pull in different directions, separate reversible choices from harder-to-reverse commitments.`, insight.decisions],
      ['Conflict, pressure, and repair', `${insight.pressure} Under pressure, ${a.code} may show ${aEdge.toLowerCase()}, while ${b.code} may show ${bEdge.toLowerCase()}. Discuss triggers when calm; during an argument, aim to understand and repair rather than to win.`, 'Repair practice: pause, name your part, and propose one practical change.'],
      ['What they can learn from each other', insight.growth, 'This comparison does not set a limit on either person. Life stage, values, lived experience, and behaviour matter more than type.'],
    ],
    misconceptions: [
      [`Myth: ${pair} are too different to work.`, 'Reality: differences can be complementary when communication and shared goals are clear.'],
      ['Myth: a label predicts the outcome of a relationship.', 'Reality: trust, respect, boundaries, and willingness to learn shape the outcome.'],
      ['Myth: apologising first means losing.', 'Reality: beginning repair is an investment in relational safety.'],
    ],
    percentage: 'Why KalQLater does not use compatibility percentages',
    percentageText: 'Human relationships cannot be reduced to one number. Compatibility depends on communication, values, maturity, life stage, behaviour, and shared goals. Instead of a made-up score, KalQLater offers practical guidance for the conversations and habits that can help this pair work better together.',
    faq: [
      [`Are ${pair} compatible?`, `${pair} cannot be defined by a percentage. ${insight.attraction} Their experience together will depend on how they handle communication, values, and everyday expectations.`],
      [`Do ${pair} get along?`, `They can, especially when they treat different pace as information and ${insight.advice}`],
      [`Can ${pair} marry?`, 'They can. As in any marriage, trust, shared responsibilities, boundaries, and repair after difficult conversations matter far more than a type label.'],
      [`Can ${pair} be good friends?`, 'Friendship tends to work best when both make shared experiences and respect different social or emotional rhythms.'],
      [`Are they good coworkers?`, `They can be. Turning ${aStrength.toLowerCase()} and ${bStrength.toLowerCase()} into clear roles can give a team wider coverage.`],
      ['Who apologises first?', 'Personality type does not decide that. Healthy repair begins with the person willing to recognise their part.'],
      ['How do they make decisions?', `${insight.decisionA} ${insight.decisionB}`],
      ['How can they stop an argument?', 'Pause, choose one issue at a time, and write down the next practical step.'],
      ['Can they start a business together?', 'Yes, when decision rights, risk limits, communication rhythm, and accountability are explicit from the start.'],
      ['Can different types change each other?', 'People can learn from one another, but changing someone should not be the goal. Better understanding and more choices are the goal.'],
      ['Why does KalQLater not use compatibility percentages?', 'Relationships depend on communication, values, maturity, life stage, behaviour, and shared goals—not a fictional score.'],
    ],
  };
  const experiment = locale === 'en' ? testComparison(a.code, b.code) : null;
  const authored = locale === 'en' ? priorityComparison(a.code, b.code) : null;
  const foundation = experiment ? { ...base, ...experiment } : authored ? { ...base, ...authored } : base;
  return locale === 'en' ? comparisonV3({ firstProfile:a, secondProfile:b, insight, foundation, authoredFoundation:experiment || authored }) : foundation;
}
