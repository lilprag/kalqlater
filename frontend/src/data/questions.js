// 60 original personality questions across 4 MBTI dimensions.
// direction: which axis letter "Strongly Agree" pushes toward.
// Answer scale 1..5 (1 = Strongly Disagree, 5 = Strongly Agree).
// Score contribution per question: (answer - 3) if direction is first letter, else -(answer - 3).

// Dimensions:
// EI: E = Extraversion, I = Introversion (first letter E)
// SN: S = Sensing, N = Intuition (first letter S)
// TF: T = Thinking, F = Feeling (first letter T)
// JP: J = Judging, P = Perceiving (first letter J)

export const QUESTIONS = [
    // ---------- E/I (15) ----------
    { id: 1, dim: 'EI', dir: 'E', hi: 'भीड़भाड़ वाली सामाजिक जगहों पर मुझे ऊर्जा मिलती है।', en: 'I feel energized in crowded social settings.' },
    { id: 2, dim: 'EI', dir: 'I', hi: 'लंबे दिन के बाद अकेले समय बिताना मुझे तरोताज़ा करता है।', en: 'Spending time alone after a long day refreshes me.' },
    { id: 3, dim: 'EI', dir: 'E', hi: 'नए लोगों से बात शुरू करने में मुझे झिझक नहीं होती।', en: 'I have no hesitation starting a conversation with strangers.' },
    { id: 4, dim: 'EI', dir: 'I', hi: 'बड़े समूह की तुलना में मैं गहरी एक-पर-एक बातचीत पसंद करता/करती हूँ।', en: 'I prefer deep one-on-one conversations over big group chatter.' },
    { id: 5, dim: 'EI', dir: 'E', hi: 'मैं सोचने से पहले अक्सर बोलकर विचार व्यक्त करता/करती हूँ।', en: 'I often think out loud before making up my mind.' },
    { id: 6, dim: 'EI', dir: 'I', hi: 'बहुत ज़्यादा बातचीत के बाद मुझे थकान महसूस होती है।', en: 'Too much conversation leaves me feeling drained.' },
    { id: 7, dim: 'EI', dir: 'E', hi: 'मैं पार्टियों या समारोहों में जाने का उत्साह रखता/रखती हूँ।', en: 'I look forward to parties and gatherings.' },
    { id: 8, dim: 'EI', dir: 'I', hi: 'शांत माहौल में ही मेरी सोच सबसे अच्छी चलती है।', en: 'My thinking works best in a quiet environment.' },
    { id: 9, dim: 'EI', dir: 'E', hi: 'फ़ोन कॉल करना मुझे टेक्स्ट मैसेज से ज़्यादा सहज लगता है।', en: 'Making a phone call feels easier than texting.' },
    { id: 10, dim: 'EI', dir: 'I', hi: 'मैं बोलने से पहले अच्छे से सोच लेता/लेती हूँ।', en: 'I think carefully before I speak.' },
    { id: 11, dim: 'EI', dir: 'E', hi: 'मैं आमतौर पर बातचीत का केंद्र होता/होती हूँ।', en: 'I usually end up at the center of a conversation.' },
    { id: 12, dim: 'EI', dir: 'I', hi: 'भीड़ में जाने से पहले मुझे मानसिक तैयारी करनी होती है।', en: 'I need to mentally prepare before heading into a crowd.' },
    { id: 13, dim: 'EI', dir: 'E', hi: 'नए दोस्त बनाना मुझे आसान लगता है।', en: 'Making new friends comes easily to me.' },
    { id: 14, dim: 'EI', dir: 'I', hi: 'दिन के अंत में मैं अकेले चार्ज होता/होती हूँ।', en: 'I recharge alone at the end of the day.' },
    { id: 15, dim: 'EI', dir: 'E', hi: 'मुझे टीम में ज़ोर से आइडिया शेयर करना पसंद है।', en: 'I enjoy sharing ideas loudly in a team.' },

    // ---------- S/N (15) ----------
    { id: 16, dim: 'SN', dir: 'S', hi: 'मैं तथ्यों और ठोस विवरणों पर ज़्यादा भरोसा करता/करती हूँ।', en: 'I trust concrete facts and details more than theories.' },
    { id: 17, dim: 'SN', dir: 'N', hi: 'मुझे भविष्य की संभावनाओं की कल्पना करना अच्छा लगता है।', en: 'I love imagining future possibilities.' },
    { id: 18, dim: 'SN', dir: 'S', hi: 'सिद्ध तरीक़ों पर मैं नए प्रयोगों से पहले भरोसा करता/करती हूँ।', en: 'I rely on proven methods before trying experiments.' },
    { id: 19, dim: 'SN', dir: 'N', hi: 'मेरा दिमाग अक्सर "क्या हो सकता है" के बारे में सोचता है।', en: 'My mind often wanders to “what could be”.' },
    { id: 20, dim: 'SN', dir: 'S', hi: 'निर्देश पढ़कर काम करना मुझे स्वाभाविक लगता है।', en: 'I find it natural to work step-by-step from instructions.' },
    { id: 21, dim: 'SN', dir: 'N', hi: 'मैं पैटर्न और छिपे हुए संकेत देखने में तेज़ हूँ।', en: 'I am quick to notice patterns and hidden clues.' },
    { id: 22, dim: 'SN', dir: 'S', hi: 'मुझे उन चीज़ों में रुचि है जो अभी उपयोगी हैं।', en: 'I am interested in what is useful right now.' },
    { id: 23, dim: 'SN', dir: 'N', hi: 'अमूर्त विचार मुझे कहानियों की तरह लुभाते हैं।', en: 'Abstract ideas fascinate me like stories.' },
    { id: 24, dim: 'SN', dir: 'S', hi: 'मैं वर्तमान क्षण पर बेहतर ध्यान देता/देती हूँ।', en: 'I focus better on the present moment.' },
    { id: 25, dim: 'SN', dir: 'N', hi: 'मैं अक्सर पंक्तियों के बीच के अर्थ खोजता/खोजती हूँ।', en: 'I often read between the lines.' },
    { id: 26, dim: 'SN', dir: 'S', hi: 'मुझे साफ़ और व्यावहारिक निर्देश पसंद हैं।', en: 'I prefer clear, practical instructions.' },
    { id: 27, dim: 'SN', dir: 'N', hi: 'मुझे "बड़ी तस्वीर" पर काम करना सुखद लगता है।', en: 'Working on the “big picture” feels satisfying.' },
    { id: 28, dim: 'SN', dir: 'S', hi: 'अनुभव से सीखी बातें किताबों की बातों से बेहतर हैं।', en: 'Lessons from experience beat lessons from books.' },
    { id: 29, dim: 'SN', dir: 'N', hi: 'मैं आम विचारों में नई संभावनाएँ जोड़ना पसंद करता/करती हूँ।', en: 'I like adding new possibilities to ordinary ideas.' },
    { id: 30, dim: 'SN', dir: 'S', hi: 'मैं भरोसा करता/करती हूँ जो मैं आँखों से देखता/देखती हूँ।', en: 'I trust what I can see with my own eyes.' },

    // ---------- T/F (15) ----------
    { id: 31, dim: 'TF', dir: 'T', hi: 'फ़ैसले लेते समय मैं तर्क को भावना से ऊपर रखता/रखती हूँ।', en: 'When deciding, I put logic above feelings.' },
    { id: 32, dim: 'TF', dir: 'F', hi: 'दूसरों की भावनाओं का ख़्याल रखना मेरे लिए ज़रूरी है।', en: 'Considering others’ feelings matters a lot to me.' },
    { id: 33, dim: 'TF', dir: 'T', hi: 'सच्चाई अगर कठोर हो, तो भी मैं वही कहूँगा/कहूँगी।', en: 'I tell the truth even when it stings.' },
    { id: 34, dim: 'TF', dir: 'F', hi: 'लोगों के बीच सद्भाव बनाए रखना मेरी प्राथमिकता है।', en: 'Keeping harmony between people is a priority for me.' },
    { id: 35, dim: 'TF', dir: 'T', hi: 'बहस में मैं तथ्यों की ओर लौटता/लौटती हूँ।', en: 'In arguments, I return to the facts.' },
    { id: 36, dim: 'TF', dir: 'F', hi: 'किसी को दुखी देखकर मैं भीतर से हिल जाता/जाती हूँ।', en: 'Seeing someone hurt shakes me deeply.' },
    { id: 37, dim: 'TF', dir: 'T', hi: 'निष्पक्षता मेरे लिए दया से अधिक मायने रखती है।', en: 'Fairness weighs more than mercy for me.' },
    { id: 38, dim: 'TF', dir: 'F', hi: 'मैं आसानी से लोगों के व्यक्तिगत हालात समझ जाता/जाती हूँ।', en: 'I easily sense people’s personal situations.' },
    { id: 39, dim: 'TF', dir: 'T', hi: 'मुझे "अच्छा या बुरा" से ज़्यादा "सही या ग़लत" पर ध्यान है।', en: 'I care more about “right vs wrong” than “nice vs not nice”.' },
    { id: 40, dim: 'TF', dir: 'F', hi: 'तारीफ़ मेरे दिन को खुशहाल बना देती है।', en: 'A word of praise lights up my day.' },
    { id: 41, dim: 'TF', dir: 'T', hi: 'भावनाओं में बहकर लिए गए निर्णय मुझे बेचैन करते हैं।', en: 'Decisions driven by emotion make me uneasy.' },
    { id: 42, dim: 'TF', dir: 'F', hi: 'मैं दूसरों की तारीफ़ मन खोलकर करता/करती हूँ।', en: 'I compliment others openly and warmly.' },
    { id: 43, dim: 'TF', dir: 'T', hi: 'आलोचना अगर उचित हो तो मुझे बुरी नहीं लगती।', en: 'Fair criticism does not offend me.' },
    { id: 44, dim: 'TF', dir: 'F', hi: 'दोस्तों की समस्याएँ सुनकर मैं भावुक हो जाता/जाती हूँ।', en: 'Hearing a friend’s troubles moves me emotionally.' },
    { id: 45, dim: 'TF', dir: 'T', hi: 'मैं समस्या को व्यक्ति से अलग रखकर देखता/देखती हूँ।', en: 'I separate the problem from the person while solving.' },

    // ---------- J/P (15) ----------
    { id: 46, dim: 'JP', dir: 'J', hi: 'मुझे पहले से योजना बनाना अच्छा लगता है।', en: 'I love planning things in advance.' },
    { id: 47, dim: 'JP', dir: 'P', hi: 'अचानक बदलती योजनाएँ मुझे उत्साहित करती हैं।', en: 'Sudden changes in plans excite me.' },
    { id: 48, dim: 'JP', dir: 'J', hi: 'मेरी to-do लिस्ट मुझे शांत रखती है।', en: 'A neat to-do list keeps me calm.' },
    { id: 49, dim: 'JP', dir: 'P', hi: 'मैं मूड के हिसाब से काम बदलता/बदलती हूँ।', en: 'I switch tasks based on my mood.' },
    { id: 50, dim: 'JP', dir: 'J', hi: 'अधूरा काम मुझे परेशान करता है।', en: 'Unfinished work bothers me.' },
    { id: 51, dim: 'JP', dir: 'P', hi: 'मैं आख़िरी वक़्त में अपना सबसे अच्छा काम करता/करती हूँ।', en: 'I do my best work at the last minute.' },
    { id: 52, dim: 'JP', dir: 'J', hi: 'मैं समय पर पहुँचने को बहुत महत्व देता/देती हूँ।', en: 'I place high value on being on time.' },
    { id: 53, dim: 'JP', dir: 'P', hi: 'निर्णय जल्दी लेने में मुझे कठिनाई होती है।', en: 'I find it hard to decide quickly.' },
    { id: 54, dim: 'JP', dir: 'J', hi: 'नियम और ढाँचे मुझे सहज महसूस कराते हैं।', en: 'Rules and structures make me feel comfortable.' },
    { id: 55, dim: 'JP', dir: 'P', hi: 'खुले विकल्प रखना बंद विकल्प से बेहतर लगता है।', en: 'Keeping options open feels better than closing them.' },
    { id: 56, dim: 'JP', dir: 'J', hi: 'मैं छुट्टियों की भी योजना बना लेता/लेती हूँ।', en: 'I even plan out my vacations.' },
    { id: 57, dim: 'JP', dir: 'P', hi: 'मुझे स्वाभाविक तरीक़े से चीज़ों को होने देना अच्छा लगता है।', en: 'I love letting things unfold naturally.' },
    { id: 58, dim: 'JP', dir: 'J', hi: 'मैं अपने दिन को शेड्यूल में ढालता/ढालती हूँ।', en: 'I like fitting my day into a schedule.' },
    { id: 59, dim: 'JP', dir: 'P', hi: 'सख़्त डेडलाइन मुझे घुटन देती हैं।', en: 'Strict deadlines feel suffocating to me.' },
    { id: 60, dim: 'JP', dir: 'J', hi: 'लक्ष्य पूरा होते ही अगला तय कर लेता/लेती हूँ।', en: 'As soon as a goal is done, I set the next one.' },
];

export const DIMENSION_META = {
    EI: { first: 'E', second: 'I', hi: ['बहिर्मुखी', 'अंतर्मुखी'], en: ['Extraversion', 'Introversion'] },
    SN: { first: 'S', second: 'N', hi: ['इंद्रियबोध', 'अंतर्ज्ञान'], en: ['Sensing', 'Intuition'] },
    TF: { first: 'T', second: 'F', hi: ['विचारक', 'भावुक'], en: ['Thinking', 'Feeling'] },
    JP: { first: 'J', second: 'P', hi: ['निर्णायक', 'खुला-अंत'], en: ['Judging', 'Perceiving'] },
};
