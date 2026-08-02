import { TYPES, TYPE_CODES } from '../data/types';
import { LEADERSHIP_INSIGHTS } from '../data/leadership';
import { COMMUNICATION_INSIGHTS } from '../data/communication';
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
  const leadership = LEADERSHIP_INSIGHTS[code]?.[locale];
  const communication = COMMUNICATION_INSIGHTS[code]?.[locale];
  return {
    code, slug: typeSlug(code), group: type.group, color: type.color,
    displayName: base.nickname, shortSummary: base.headline, overview: base.description,
    coreTraits: base.strengths.slice(0, 3), strengths: base.strengths, growthAreas: base.weaknesses,
    workStyle: base.careers, careerThemes: base.careers, relationshipStyle: base.relationships,
    leadership, communication,
    learningStyle: leadership?.weeklyAction,
    stressPatterns: base.weaknesses,
    developmentTips: communication?.tips || [],
    relatedTypes: TYPE_CODES.filter((item) => item !== code && TYPES[item].group === type.group).slice(0, 3),
  };
}

export function typeFaq(profile, locale) {
  const hi = locale === 'hi';
  return [
    { q: hi ? `${profile.code} का यह पृष्ठ क्या बताता है?` : `What does this ${profile.code} page describe?`, a: hi ? `यह पृष्ठ ${profile.displayName} की पसंद, ताकत और विकास के व्यावहारिक विचारों को संक्षेप में प्रस्तुत करता है।` : `This page summarises the preferences, strengths, and practical development ideas associated with ${profile.displayName}.` },
    { q: hi ? `क्या ${profile.code} एक निदान है?` : `Is ${profile.code} a diagnosis?`, a: hi ? 'नहीं। KalQLater आत्मचिंतन के लिए है, नैदानिक निदान या भर्ती निर्णय के लिए नहीं।' : 'No. KalQLater is for reflection, not a clinical diagnosis or a hiring decision.' },
  ];
}
