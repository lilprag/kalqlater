const dna = (en, hi) => ({ en, hi });

const ANALYSTS = dna(
    { leadership: [88, 'Strategic direction encoded in every decision'], communication: [72, 'Precision first; warmth grows with trust'], cognition: [91, 'Complex patterns become clear systems'], growth: [76, 'Progress accelerates when insight becomes action'], career: [87, 'Built for high-leverage, complex challenges'], relationships: [70, 'Depth over breadth, loyalty over display'], stress: [64, 'Recovery begins with space and autonomy'], creativity: [86, 'Original ideas shaped by rigorous thinking'] },
    { leadership: [88, 'हर निर्णय में रणनीतिक दिशा का संकेत'], communication: [72, 'सटीकता पहले; भरोसे के साथ गरमजोशी बढ़ती है'], cognition: [91, 'जटिल पैटर्न स्पष्ट व्यवस्था बनते हैं'], growth: [76, 'अंतर्दृष्टि के काम बनने पर प्रगति तेज़ होती है'], career: [87, 'प्रभावशाली और जटिल चुनौतियों के लिए बने हैं'], relationships: [70, 'चौड़ाई से अधिक गहराई, प्रदर्शन से अधिक निष्ठा'], stress: [64, 'जगह और स्वायत्तता से पुनर्स्थापना शुरू होती है'], creativity: [86, 'कठोर सोच से गढ़े मौलिक विचार'] },
);
const DIPLOMATS = dna(
    { leadership: [82, 'Purpose and people guide your influence'], communication: [89, 'Connection is your native language'], cognition: [84, 'You read the human pattern behind the facts'], growth: [78, 'Boundaries transform empathy into strength'], career: [81, 'Meaningful work is your lasting fuel'], relationships: [91, 'Deep presence is your relationship signature'], stress: [67, 'Emotional recovery needs deliberate quiet'], creativity: [88, 'Imagination turns ideals into possibility'] },
    { leadership: [82, 'उद्देश्य और लोग आपके प्रभाव को दिशा देते हैं'], communication: [89, 'जुड़ाव आपकी सहज भाषा है'], cognition: [84, 'आप तथ्यों के पीछे मानवीय पैटर्न पढ़ते हैं'], growth: [78, 'सीमाएँ सहानुभूति को शक्ति में बदलती हैं'], career: [81, 'अर्थपूर्ण काम आपकी स्थायी ऊर्जा है'], relationships: [91, 'गहरी उपस्थिति आपके रिश्तों की पहचान है'], stress: [67, 'भावनात्मक पुनर्स्थापना को सोच-समझकर शांति चाहिए'], creativity: [88, 'कल्पना आदर्श को संभावना में बदलती है'] },
);
const SENTINELS = dna(
    { leadership: [80, 'Trust is built through visible follow-through'], communication: [79, 'Careful words create dependable connection'], cognition: [78, 'Detail and experience form your internal map'], growth: [74, 'Small experiments create lasting confidence'], career: [85, 'Consistency is your professional advantage'], relationships: [86, 'Care is made visible through everyday attention'], stress: [71, 'Routine and support restore your balance'], creativity: [72, 'Refinement is your understated creative edge'] },
    { leadership: [80, 'दिखने वाले काम पूरे करने से भरोसा बनता है'], communication: [79, 'सावधान शब्द भरोसेमंद जुड़ाव बनाते हैं'], cognition: [78, 'बारीकी और अनुभव आपका आंतरिक नक्शा बनाते हैं'], growth: [74, 'छोटे प्रयोग स्थायी आत्मविश्वास बनाते हैं'], career: [85, 'निरंतरता आपका पेशेवर लाभ है'], relationships: [86, 'रोज़ के ध्यान से देखभाल दिखती है'], stress: [71, 'दिनचर्या और सहयोग संतुलन लौटाते हैं'], creativity: [72, 'निखार आपकी शांत रचनात्मक बढ़त है'] },
);
const EXPLORERS = dna(
    { leadership: [77, 'Momentum grows when you act in the moment'], communication: [83, 'Presence and energy make people lean in'], cognition: [80, 'Real-time signals sharpen your decisions'], growth: [73, 'Focus turns freedom into progress'], career: [82, 'Dynamic environments bring out your best'], relationships: [78, 'Authenticity keeps connection alive'], stress: [69, 'Movement and flexibility reset your system'], creativity: [84, 'Spontaneity sparks unexpected solutions'] },
    { leadership: [77, 'पल में काम करने से गति बनती है'], communication: [83, 'उपस्थिति और ऊर्जा लोगों को जोड़ती है'], cognition: [80, 'वास्तविक समय के संकेत निर्णय तेज़ करते हैं'], growth: [73, 'फोकस स्वतंत्रता को प्रगति बनाता है'], career: [82, 'गतिशील माहौल आपका सर्वश्रेष्ठ लाता है'], relationships: [78, 'सच्चाई जुड़ाव को जीवित रखती है'], stress: [69, 'गतिशीलता और लचीलापन व्यवस्था को रीसेट करते हैं'], creativity: [84, 'सहजता अनपेक्षित समाधान जगाती है'] },
);

export const PERSONALITY_DNA = {
    INTJ: ANALYSTS, INTP: ANALYSTS, ENTJ: ANALYSTS, ENTP: ANALYSTS,
    INFJ: DIPLOMATS, INFP: DIPLOMATS, ENFJ: DIPLOMATS, ENFP: DIPLOMATS,
    ISTJ: SENTINELS, ISFJ: SENTINELS, ESTJ: SENTINELS, ESFJ: SENTINELS,
    ISTP: EXPLORERS, ISFP: EXPLORERS, ESTP: EXPLORERS, ESFP: EXPLORERS,
};
