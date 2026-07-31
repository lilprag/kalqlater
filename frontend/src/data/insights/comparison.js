const GROUPS = {
  INTJ:'strategist', INTP:'strategist', ENTJ:'strategist', ENTP:'strategist', INFJ:'connector', INFP:'connector', ENFJ:'connector', ENFP:'connector',
  ISTJ:'steward', ISFJ:'steward', ESTJ:'steward', ESFJ:'steward', ISTP:'catalyst', ISFP:'catalyst', ESTP:'catalyst', ESFP:'catalyst',
};
const pairs = {
  'connector-catalyst': ['Exceptional Match', 'Heart meets momentum: one creates meaning while the other makes life feel immediate.', 'Emotional depth can be mistaken for hesitation; spontaneity can be mistaken for carelessness.', 'Keep plans light but explicit, and name feelings before reacting.'],
  'connector-strategist': ['Complementary Match', 'Vision and empathy combine: one sees the system, the other sees the humans inside it.', 'Logic may feel cold while emotion can feel indirect.', 'Translate intent: explain the why, then agree on the next action.'],
  'connector-steward': ['Growth Match', 'Care and reliability create a deeply supportive rhythm.', 'Both may preserve harmony instead of naming a difficult truth.', 'Schedule honest check-ins before small disappointments grow.'],
  'catalyst-strategist': ['Intense Match', 'One generates immediate movement while the other gives it a strategic destination.', 'Speed can collide with deliberation.', 'Separate exploration time from commitment time.'],
  'catalyst-steward': ['Growth Match', 'Adaptability and dependability can make each person more capable.', 'Freedom and routine may compete for the same space.', 'Agree on non-negotiables, then leave room for improvisation.'],
  'strategist-steward': ['Strong Match', 'Shared standards and complementary time horizons make this a steady alliance.', 'Both can become overly fixed on the right way to proceed.', 'Invite one experimental option before locking the plan.'],
  same: ['Strong Match', 'Shared instincts make trust and momentum easier to establish.', 'Similar blind spots can remain unchallenged.', 'Use differences in experience—not only preference—to keep perspective broad.'],
};
const hindiPairs = {
  'connector-catalyst': ['असाधारण मेल', 'दिल और गति मिलते हैं: एक अर्थ बनाता है, दूसरा जीवन को तत्काल महसूस कराता है।', 'भावनात्मक गहराई को हिचक और सहजता को लापरवाही समझा जा सकता है।', 'योजनाएँ हल्की लेकिन स्पष्ट रखें और प्रतिक्रिया से पहले भावना का नाम लें।'],
  'connector-strategist': ['पूरक मेल', 'दृष्टि और सहानुभूति मिलती हैं: एक व्यवस्था देखता है, दूसरा उसके भीतर के लोगों को।', 'तर्क ठंडा लग सकता है और भावना अप्रत्यक्ष।', 'इरादा अनुवाद करें: क्यों बताएं, फिर अगली कार्रवाई तय करें।'],
  'connector-steward': ['विकास मेल', 'देखभाल और भरोसेमंदी गहरा सहयोगी ताल बनाती हैं।', 'दोनों कठिन सच कहने के बजाय सामंजस्य बचा सकते हैं।', 'छोटी निराशा बढ़ने से पहले ईमानदार बातचीत तय करें।'],
  'catalyst-strategist': ['गहन मेल', 'एक तत्काल गति बनाता है, दूसरा उसे रणनीतिक दिशा देता है।', 'तेज़ी और सोच-विचार टकरा सकते हैं।', 'खोजने और प्रतिबद्ध होने का समय अलग रखें।'],
  'catalyst-steward': ['विकास मेल', 'लचीलापन और भरोसेमंदी दोनों को अधिक सक्षम बनाते हैं।', 'स्वतंत्रता और दिनचर्या एक ही जगह के लिए प्रतिस्पर्धा कर सकती हैं।', 'गैर-परक्राम्य बातें तय करें, फिर सहजता की जगह छोड़ें।'],
  'strategist-steward': ['मज़बूत मेल', 'साझा मानक और अलग समय-दृष्टि इस गठजोड़ को स्थिर बनाते हैं।', 'दोनों सही तरीके पर अधिक अड़ सकते हैं।', 'योजना तय करने से पहले एक प्रयोगात्मक विकल्प आमंत्रित करें।'],
  same: ['मज़बूत मेल', 'साझा प्रवृत्तियाँ भरोसा और गति को आसान बनाती हैं।', 'समान अंधे स्थान अनदेखे रह सकते हैं।', 'दृष्टि व्यापक रखने के लिए अनुभवों के अंतर का उपयोग करें।'],
};
const order = ['connector','catalyst','strategist','steward'];
const pairKey = (a,b) => a === b ? 'same' : [a,b].sort((x,y) => order.indexOf(x)-order.indexOf(y)).join('-');
const decisionLenses = {
  strategist: ['tests leverage, logic, and long-term consequences', 'लाभ, तर्क और दूरगामी परिणामों को परखता है'],
  connector: ['weighs values, people, and the future potential of everyone involved', 'मूल्यों, लोगों और सभी की भविष्य क्षमता को तौलता है'],
  steward: ['uses evidence, responsibility, and what has proved dependable', 'तथ्य, ज़िम्मेदारी और सिद्ध भरोसेमंदी पर भरोसा करता है'],
  catalyst: ['tests what works in the moment and adapts through action', 'क्षण में क्या काम करता है उसे परखता है और कार्रवाई से ढलता है'],
};
const businessLabels = {
  en: { innovation: 'Innovation', execution: 'Execution', leadership: 'Leadership', planning: 'Planning', risk: 'Risk', communication: 'Communication' },
  hi: { innovation: 'नवाचार', execution: 'क्रियान्वयन', leadership: 'नेतृत्व', planning: 'योजना', risk: 'जोखिम', communication: 'संवाद' },
};
const labelFor = (value, hindi) => {
  const translations = { 'Exceptional Match':'असाधारण मेल', 'Strong Match':'मज़बूत मेल', 'Complementary Match':'पूरक मेल', 'Growth Match':'विकास मेल', 'Challenging Match':'चुनौतीपूर्ण मेल', 'Intense Match':'गहन मेल' };
  return hindi ? translations[value] || value : value;
};
export function getRelationshipIntelligence(typeA, typeB, lang = 'en') {
  const a=GROUPS[typeA], b=GROUPS[typeB], key=pairKey(a,b); const text=(lang==='hi'?hindiPairs:pairs)[key] || (lang==='hi'?hindiPairs.same:pairs.same);
  const [label, attraction, conflict, advice] = text;
  const hindi=lang==='hi';
  const aLens = decisionLenses[a] || decisionLenses.strategist;
  const bLens = decisionLenses[b] || decisionLenses.connector;
  const business = {
    innovation: labelFor(a === 'catalyst' || b === 'catalyst' || a === 'strategist' || b === 'strategist' ? 'Complementary Match' : label, hindi),
    execution: labelFor(a === 'steward' || b === 'steward' ? 'Strong Match' : 'Growth Match', hindi),
    leadership: labelFor(a === b ? 'Strong Match' : label, hindi),
    planning: labelFor(a === 'strategist' || b === 'strategist' || a === 'steward' || b === 'steward' ? 'Strong Match' : 'Growth Match', hindi),
    risk: labelFor(a === 'catalyst' || b === 'catalyst' ? 'Intense Match' : 'Growth Match', hindi),
    communication: labelFor(a === b ? 'Strong Match' : label, hindi),
  };
  return { label, attraction, conflict, advice,
    communication: hindi ? `${typeA} पहले अपना इरादा और संदर्भ बताए; ${typeB} प्रतिक्रिया देने से पहले अपनी ज़रूरत स्पष्ट करे।` : `${typeA} should lead with intent and context; ${typeB} should name their need before reacting.`,
    communicationA: hindi ? `${typeA} से ${typeB}: पहले उद्देश्य और संदर्भ बताएं, फिर दूसरे व्यक्ति के विचार के लिए रुकें।` : `${typeA} to ${typeB}: lead with the purpose and context, then pause for their perspective.`,
    communicationB: hindi ? `${typeB} से ${typeA}: अपनी ज़रूरत साफ़ कहें और अनुमान लगाने के बजाय एक ठोस अनुरोध करें।` : `${typeB} to ${typeA}: name your need clearly and make one concrete request instead of asking them to infer it.`,
    decisions: hindi ? `अलग निर्णय-गति को सम्मान दें: विकल्प लिखें, निर्णय-स्वामी तय करें और समीक्षा का समय रखें।` : `Respect different decision speeds: write options down, name an owner, and set a review point.`,
    decisionA: hindi ? `${typeA} ${aLens[1]}।` : `${typeA} ${aLens[0]}.`,
    decisionB: hindi ? `${typeB} ${bLens[1]}।` : `${typeB} ${bLens[0]}.`,
    pressure: hindi ? `दबाव में दूरी को अस्वीकृति न मानें। विराम दें, फिर एक छोटे अगले कदम पर लौटें।` : `Under pressure, do not mistake distance for rejection. Offer a pause, then return to one small next step.`,
    business,
    businessLabels: businessLabels[hindi ? 'hi' : 'en'],
    romantic: {
      chemistry: attraction,
      trust: hindi ? 'भरोसा तब बनता है जब अपेक्षाएँ स्पष्ट हों और छोटे वादे लगातार निभाए जाएँ।' : 'Trust builds when expectations are explicit and small promises are kept consistently.',
      conflict: conflict,
      longTerm: hindi ? 'लंबे समय की ताक़त कठिन बातचीत के बाद फिर जुड़ने और दिनचर्या को साथ बनाने में है।' : 'Long-term strength comes from reconnecting after hard conversations and building rituals together.',
      communication: advice,
    },
    friendship: hindi ? `दोस्ती तब फलती है जब दोनों एक-दूसरे की गति का सम्मान करें और साझा अनुभव बनाएं।` : `Friendship thrives when both respect each other’s pace and make room for shared experiences.`,
    growth: hindi ? `${typeA} ${typeB} से अलग गति को अपनाना सीख सकता है; ${typeB} ${typeA} से अपने इरादे को स्पष्ट करना सीख सकता है।` : `${typeA} can learn to welcome a different pace from ${typeB}; ${typeB} can learn to make their intent clearer to ${typeA}.`,
  };
}
