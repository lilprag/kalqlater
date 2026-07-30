const dashboard = (en, hi) => ({ en, hi });

const ANALYSTS = dashboard(
    { leadership: [88, 'Strategic and dependable leader'], communication: [72, 'Clear thinker with room for warmer delivery'], cognitive: [91, 'Strong systems thinking and pattern analysis'], growth: [76, 'Grows fastest through deliberate action'], career: [87, 'Well suited to complex, high-impact work'], relationship: [70, 'Loyal in bonds built on trust and depth'], stress: [64, 'Needs space before pressure becomes overload'], overall: [82, 'A focused, independent builder of better systems'] },
    { leadership: [88, 'रणनीतिक और भरोसेमंद नेता'], communication: [72, 'स्पष्ट सोच, गरमजोशी से कहने की और जगह'], cognitive: [91, 'मज़बूत व्यवस्था सोच और पैटर्न विश्लेषण'], growth: [76, 'सोच-समझकर काम करने से सबसे तेज़ विकास'], career: [87, 'जटिल और प्रभावशाली काम के लिए उपयुक्त'], relationship: [70, 'भरोसे और गहराई वाले रिश्तों में वफ़ादार'], stress: [64, 'दबाव बढ़ने से पहले जगह की ज़रूरत'], overall: [82, 'बेहतर व्यवस्था बनाने वाला केंद्रित और स्वतंत्र व्यक्ति'] },
);
const DIPLOMATS = dashboard(
    { leadership: [82, 'Values-led leadership that brings people together'], communication: [89, 'Warm, thoughtful, and people-aware communicator'], cognitive: [84, 'Insightful at reading context and human patterns'], growth: [78, 'Grows through boundaries and directness'], career: [81, 'Thrives where purpose and people matter'], relationship: [91, 'Deeply invested in meaningful connection'], stress: [67, 'Needs recovery after carrying emotional weight'], overall: [84, 'A compassionate catalyst for meaningful progress'] },
    { leadership: [82, 'लोगों को साथ लाने वाला मूल्य-आधारित नेतृत्व'], communication: [89, 'गरमजोशी भरा, विचारशील और व्यक्ति-सजग संवाद'], cognitive: [84, 'संदर्भ और मानवीय पैटर्न समझने में अंतर्दृष्टिपूर्ण'], growth: [78, 'सीमाओं और स्पष्टता से विकास'], career: [81, 'जहाँ उद्देश्य और लोग महत्वपूर्ण हों वहाँ फलते-फूलते हैं'], relationship: [91, 'अर्थपूर्ण जुड़ाव में गहरा निवेश'], stress: [67, 'भावनात्मक भार के बाद पुनर्स्थापना चाहिए'], overall: [84, 'अर्थपूर्ण प्रगति का करुणामय उत्प्रेरक'] },
);
const SENTINELS = dashboard(
    { leadership: [80, 'Reliable leadership grounded in follow-through'], communication: [79, 'Considerate communicator who builds trust'], cognitive: [78, 'Practical judgment with strong detail awareness'], growth: [74, 'Grows by making room for useful change'], career: [85, 'Excellent at dependable, people-centered execution'], relationship: [86, 'Committed and attentive relationship builder'], stress: [71, 'Stays steady when routines and support are present'], overall: [81, 'A trusted stabilizer who turns care into action'] },
    { leadership: [80, 'काम पूरा करने पर आधारित भरोसेमंद नेतृत्व'], communication: [79, 'भरोसा बनाने वाला विचारशील संवादक'], cognitive: [78, 'बारीकी की मज़बूत समझ के साथ व्यावहारिक निर्णय'], growth: [74, 'उपयोगी बदलाव के लिए जगह बनाकर विकास'], career: [85, 'भरोसेमंद, व्यक्ति-केंद्रित क्रियान्वयन में उत्कृष्ट'], relationship: [86, 'प्रतिबद्ध और ध्यान देने वाला रिश्ते का साथी'], stress: [71, 'दिनचर्या और सहयोग होने पर स्थिर रहते हैं'], overall: [81, 'देखभाल को कार्रवाई में बदलने वाला भरोसेमंद स्थिरकर्ता'] },
);
const EXPLORERS = dashboard(
    { leadership: [77, 'Action-oriented leadership with real-time awareness'], communication: [83, 'Engaging communicator who reads the room'], cognitive: [80, 'Fast, practical, and adaptable problem solver'], growth: [73, 'Grows through focus and follow-through'], career: [82, 'Excels in dynamic, hands-on environments'], relationship: [78, 'Brings energy and authenticity to connection'], stress: [69, 'Recovers best through movement and flexibility'], overall: [79, 'An adaptable, present-moment creator of momentum'] },
    { leadership: [77, 'वास्तविक समय की समझ वाला कार्य-केंद्रित नेतृत्व'], communication: [83, 'कमरे को पढ़ने वाला आकर्षक संवादक'], cognitive: [80, 'तेज़, व्यावहारिक और अनुकूल समस्या समाधान'], growth: [73, 'फोकस और काम पूरा करने से विकास'], career: [82, 'गतिशील, हाथों-हाथ काम के माहौल में उत्कृष्ट'], relationship: [78, 'रिश्तों में ऊर्जा और सच्चाई लाते हैं'], stress: [69, 'गतिशीलता और लचीलेपन से बेहतर उबरते हैं'], overall: [79, 'वर्तमान क्षण में गति बनाने वाला अनुकूल व्यक्ति'] },
);

export const DASHBOARD_INSIGHTS = {
    INTJ: ANALYSTS, INTP: ANALYSTS, ENTJ: ANALYSTS, ENTP: ANALYSTS,
    INFJ: DIPLOMATS, INFP: DIPLOMATS, ENFJ: DIPLOMATS, ENFP: DIPLOMATS,
    ISTJ: SENTINELS, ISFJ: SENTINELS, ESTJ: SENTINELS, ESFJ: SENTINELS,
    ISTP: EXPLORERS, ISFP: EXPLORERS, ESTP: EXPLORERS, ESFP: EXPLORERS,
};
