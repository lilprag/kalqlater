/**
 * Immutable English content IDs. Editorial text stays in locale packages;
 * this registry is the shared map used for scope, review, and change impact.
 */
export const MASTER_LOCALE = 'en';

export const PAGE_FAMILIES = Object.freeze([
  'home', 'navigation', 'personality', 'career', 'compare', 'insights',
  'community', 'jobs', 'contact', 'privacy', 'terms', 'shared-ui',
]);

const blocks = [
  ['HOME.HERO.TITLE', 'home'], ['HOME.HERO.BODY', 'home'], ['HOME.HERO.CTA', 'home'],
  ['NAV.HOME', 'navigation'], ['NAV.PERSONALITY', 'navigation'], ['NAV.COMPARE', 'navigation'], ['NAV.INSIGHTS', 'navigation'], ['NAV.COMMUNITY', 'navigation'], ['NAV.JOBS', 'navigation'],
  ['FOOTER.PRIVACY', 'navigation'], ['FOOTER.TERMS', 'navigation'], ['FOOTER.CONTACT', 'navigation'],
  ['BUTTON.START', 'shared-ui'], ['BUTTON.NEXT', 'shared-ui'], ['BUTTON.BACK', 'shared-ui'], ['BUTTON.RETRY', 'shared-ui'], ['ERROR.NETWORK', 'shared-ui'], ['ERROR.NOT_FOUND', 'shared-ui'],
  ['PERSONALITY.{TYPE}.META.TITLE', 'personality'], ['PERSONALITY.{TYPE}.META.DESCRIPTION', 'personality'], ['PERSONALITY.{TYPE}.HERO.TITLE', 'personality'], ['PERSONALITY.{TYPE}.HERO.SUMMARY', 'personality'], ['PERSONALITY.{TYPE}.RELATIONSHIPS.FRIENDSHIP', 'personality'], ['PERSONALITY.{TYPE}.RELATIONSHIPS.ROMANCE', 'personality'], ['PERSONALITY.{TYPE}.RELATIONSHIPS.FAMILY', 'personality'], ['PERSONALITY.{TYPE}.RELATIONSHIPS.TEAMWORK', 'personality'],
  ['CAREER.{TYPE}.META.TITLE', 'career'], ['CAREER.{TYPE}.META.DESCRIPTION', 'career'], ['CAREER.{TYPE}.HERO.TITLE', 'career'], ['CAREER.{TYPE}.ROLE.{ROLE}.RATIONALE', 'career'], ['CAREER.{TYPE}.ROLE.{ROLE}.CHALLENGE', 'career'], ['CAREER.{TYPE}.ROLE.{ROLE}.SKILL', 'career'],
  ['COMPARE.{PAIR}.META.TITLE', 'compare'], ['COMPARE.{PAIR}.META.DESCRIPTION', 'compare'], ['COMPARE.{PAIR}.OPENING', 'compare'], ['COMPARE.{PAIR}.DECISION.TYPE_A', 'compare'], ['COMPARE.{PAIR}.DECISION.TYPE_B', 'compare'], ['COMPARE.{PAIR}.FAQ.{FAQ}', 'compare'],
  ['INSIGHTS.HUB.META.TITLE', 'insights'], ['INSIGHTS.HUB.META.DESCRIPTION', 'insights'], ['INSIGHTS.{INSIGHT}.META.TITLE', 'insights'], ['INSIGHTS.{INSIGHT}.META.DESCRIPTION', 'insights'], ['INSIGHTS.{INSIGHT}.LANDING.H1', 'insights'], ['INSIGHTS.{INSIGHT}.FAQ.{FAQ}', 'insights'],
  ['COMMUNITY.META.TITLE', 'community'], ['COMMUNITY.META.DESCRIPTION', 'community'], ['COMMUNITY.HERO.TITLE', 'community'],
  ['JOBS.META.TITLE', 'jobs'], ['JOBS.META.DESCRIPTION', 'jobs'], ['JOBS.HERO.TITLE', 'jobs'],
  ['CONTACT.META.TITLE', 'contact'], ['CONTACT.META.DESCRIPTION', 'contact'], ['CONTACT.FORM.{FIELD}', 'contact'],
  ['PRIVACY.META.TITLE', 'privacy'], ['PRIVACY.META.DESCRIPTION', 'privacy'], ['PRIVACY.BODY.{SECTION}', 'privacy'],
  ['TERMS.META.TITLE', 'terms'], ['TERMS.META.DESCRIPTION', 'terms'], ['TERMS.BODY.{SECTION}', 'terms'],
];

export const masterContentRegistry = Object.freeze(blocks.map(([id, family]) => Object.freeze({ id, family, masterLocale: MASTER_LOCALE })));
export const contentIds = Object.freeze(masterContentRegistry.map((block) => block.id));

export function blocksForFamily(family) { return masterContentRegistry.filter((block) => block.family === family); }
