export const CONFLICT_INSIGHTS = {
  en: {
    title: 'Conflict Insights', eyebrow: 'Behavioural reflection',
    promise: 'Notice how you approach tension, boundaries, repair, and shared problem-solving across everyday situations.',
    startTitle: 'A calm space to reflect on conflict', startBody: 'You will see one everyday situation at a time. Choose the response closest to what you usually do; there are no right answers.',
    start: 'Begin reflection', time: 'About 5–7 minutes', privacy: 'Your individual answers stay on the assessment service and are not saved in this browser.', safety: 'This tool is not therapy, crisis support, or relationship-safety advice.',
    learn: ['How you respond when tension first appears', 'How you make a boundary or repair visible', 'How context can change a difficult conversation'],
    dimensions: [['repair-orientation', 'Repair orientation'], ['boundary-clarity', 'Boundary clarity'], ['perspective-taking', 'Perspective-taking'], ['emotional-regulation', 'Emotional regulation'], ['direct-engagement', 'Direct engagement'], ['collaborative-problem-solving', 'Collaborative problem-solving']],
    faq: [['Is this a relationship-safety assessment?', 'No. It cannot assess safety, abuse, or whether a relationship should continue. If you feel unsafe, prioritise immediate support and local resources.'], ['Is there a right answer?', 'No. Context, power, culture, and safety can make different responses workable.'], ['Does this diagnose conflict problems?', 'No. It offers language for reflection on limited scenarios, not a diagnosis or prediction.']],
  },
  hi: {
    title: 'कन्फ्लिक्ट इनसाइट्स', eyebrow: 'व्यवहार पर चिंतन',
    promise: 'रोज़मर्रा की स्थितियों में तनाव, सीमाओं, संबंध सुधार और मिलकर समाधान तक आपके तरीके पर विचार करें।',
    startTitle: 'मतभेद पर चिंतन के लिए शांत जगह', startBody: 'आपको एक समय में एक रोज़मर्रा की स्थिति दिखेगी। जो आप सामान्यतः करते/करती हैं उसके सबसे करीब प्रतिक्रिया चुनें; यहाँ कोई सही जवाब नहीं है।',
    start: 'आत्मचिंतन शुरू करें', time: 'लगभग 5–7 मिनट', privacy: 'आपके व्यक्तिगत जवाब आकलन सेवा पर रहते हैं और इस ब्राउज़र में सहेजे नहीं जाते।', safety: 'यह साधन थेरेपी, संकट सहायता या संबंध-सुरक्षा सलाह नहीं है।',
    learn: ['तनाव पहली बार दिखने पर आपकी प्रतिक्रिया', 'आप सीमा या सुधार को कैसे स्पष्ट करते/करती हैं', 'कठिन बातचीत में संदर्भ कैसे बदलाव ला सकता है'],
    dimensions: [['repair-orientation', 'संबंध सुधारने की दिशा'], ['boundary-clarity', 'सीमा की स्पष्टता'], ['perspective-taking', 'दूसरे का दृष्टिकोण समझना'], ['emotional-regulation', 'भावनात्मक संतुलन'], ['direct-engagement', 'सीधी भागीदारी'], ['collaborative-problem-solving', 'मिलकर समाधान']],
    faq: [['क्या यह संबंध-सुरक्षा आकलन है?', 'नहीं। यह सुरक्षा, दुर्व्यवहार या संबंध जारी रखने का निर्णय नहीं कर सकता। असुरक्षित महसूस होने पर तुरंत सहायता और स्थानीय संसाधनों को प्राथमिकता दें।'], ['क्या कोई सही जवाब है?', 'नहीं। संदर्भ, शक्ति, संस्कृति और सुरक्षा अलग प्रतिक्रियाओं को उपयुक्त बना सकते हैं।'], ['क्या यह मतभेद की समस्या का निदान करता है?', 'नहीं। यह सीमित स्थितियों पर चिंतन की भाषा देता है, निदान या भविष्यवाणी नहीं।']],
  },
};

export function conflictCopy(locale) {
  const copy = CONFLICT_INSIGHTS[locale];
  if (!copy) throw new Error(`Missing authored Conflict Insights locale: ${locale}`);
  return copy;
}
