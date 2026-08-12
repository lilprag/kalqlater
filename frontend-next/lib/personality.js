import { TYPES, TYPE_CODES } from '../data/types';
import { LEADERSHIP_INSIGHTS } from '../data/leadership';
import { COMMUNICATION_INSIGHTS } from '../data/communication';
import { RELATIONSHIP_CONTEXTS } from '../data/personality-contexts';
import { isLocale, localePath } from './site';

export const TYPE_ORDER = TYPE_CODES;

export function typeSlug(code) { return code.toLowerCase(); }
export function typeFromSlug(slug) { const code = String(slug || '').toUpperCase(); return TYPE_CODES.includes(code) ? code : null; }

export function getPersonalityUrl(type, locale = 'en') {
  const code = typeFromSlug(type);
  if (!code) return null;
  return localePath(isLocale(locale) ? locale : 'en', `personality/${typeSlug(code)}`);
}

export function personalityProfile(code, locale) {
  const type = TYPES[code];
  if (!type) return null;
  const base = type[locale];
  const relationshipContexts = RELATIONSHIP_CONTEXTS[code]?.[locale];
  if (!relationshipContexts || !['friendship', 'romance', 'family', 'teamwork'].every((context) => relationshipContexts[context])) {
    throw new Error(`Missing authored relationship contexts for ${code}/${locale}`);
  }
  const leadership = LEADERSHIP_INSIGHTS[code]?.[locale];
  const communication = COMMUNICATION_INSIGHTS[code]?.[locale];
  if (!leadership || !communication?.tips?.length || !base.careers?.length) {
    throw new Error(`Missing required authored personality content for ${code}/${locale}`);
  }
  return {
    code, slug: typeSlug(code), group: type.group, color: type.color,
    displayName: base.nickname, shortSummary: base.headline, overview: base.description,
    coreTraits: base.strengths.slice(0, 3), strengths: base.strengths, growthAreas: base.weaknesses,
    workStyle: base.careers, careerThemes: base.careers,
    // Never use the old one-paragraph type summary as a context fallback. The
    // authored friendship context is the only concise relationship summary used
    // outside the four explicit relationship cards.
    relationshipStyle: relationshipContexts.friendship,
    relationshipContexts,
    leadership, communication,
    learningStyle: leadership?.weeklyAction,
    stressPatterns: base.weaknesses,
    developmentTips: communication.tips,
    relatedTypes: TYPE_CODES.filter((item) => item !== code && TYPES[item].group === type.group).slice(0, 3),
  };
}

export function typeFaq(profile, locale) {
  const hi = locale === 'hi';
  return [
    { q: hi ? `${profile.code} का यह पृष्ठ क्या बताता है?` : `What does this ${profile.code} page describe?`, a: hi ? `यह पृष्ठ ${profile.displayName} की पसंद, ताकत और विकास के व्यावहारिक विचारों को संक्षेप में प्रस्तुत करता है।` : `This page summarises the preferences, strengths, and practical development ideas associated with ${profile.displayName}.` },
    { q: hi ? `क्या ${profile.code} एक निदान है?` : `Is ${profile.code} a diagnosis?`, a: hi ? 'नहीं। KalQLater आत्मचिंतन के लिए है, नैदानिक निदान या भर्ती निर्णय के लिए नहीं।' : 'No. KalQLater is for reflection, not a clinical diagnosis or a hiring decision.' },
    { q: hi ? `क्या ${profile.code} अच्छा नेता हो सकता है?` : `Can an ${profile.code} be a good leader?`, a: hi ? 'हाँ। नेतृत्व संवाद, जिम्मेदारी सौंपने और फीडबैक जैसे सीखे जाने वाले अभ्यासों पर भी निर्भर करता है।' : 'Yes. Leadership also relies on learnable practices such as communication, delegation, and feedback.' },
    { q: hi ? `${profile.code} काम में क्या खोज सकता है?` : `What may an ${profile.code} look for at work?`, a: profile.workStyle[0] },
    { q: hi ? `${profile.code} रिश्तों में कैसा हो सकता है?` : `How may an ${profile.code} show up in relationships?`, a: profile.relationshipStyle },
    { q: hi ? `${profile.code} तनाव में क्या मदद कर सकता है?` : `What can help an ${profile.code} under stress?`, a: hi ? 'आराम, स्पष्ट सीमाएँ, भरोसेमंद बातचीत और लगातार परेशानी होने पर वास्तविक पेशेवर सहयोग उपयोगी हो सकता है।' : 'Rest, clear boundaries, trusted conversation, and real professional support when distress persists may help.' },
    { q: hi ? `क्या व्यक्तित्व प्रकार बदल सकता है?` : `Can personality type change?`, a: hi ? 'लोग अनुभव, भूमिका और जीवन-चरण के साथ सीखते और बदलते हैं। इस रूपरेखा को कठोर पहचान नहीं, आत्मचिंतन के संकेत की तरह उपयोग करें।' : 'People learn and change through experience, roles, and life stages. Use this framework as a reflection prompt, not a fixed identity.' },
    { q: hi ? 'नियोक्ता इस जानकारी का उपयोग कैसे करें?' : 'How should employers use this information?', a: hi ? 'केवल वैकल्पिक आत्मचिंतन के लिए। नियोक्ताओं को व्यक्तित्व प्रकार से छंटनी, रैंकिंग या भर्ती नहीं करनी चाहिए।' : 'Only for optional self-reflection. Employers should never use personality type to screen, rank, or hire people.' },
  ];
}
