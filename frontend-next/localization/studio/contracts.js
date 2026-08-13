export const STUDIO_STAGES = Object.freeze([
  'meaning_extraction', 'psychology_guardian', 'native_editorial_writer',
  'seo_localization_expert', 'ux_writer', 'terminology_guardian',
  'cultural_adaptation', 'accessibility_reviewer', 'brand_guardian',
  'seo_validator', 'localization_validator', 'editorial_scoring',
]);

export const HUMAN_APPROVALS = Object.freeze(['psychology', 'editorial', 'seo', 'accessibility', 'localization', 'brand']);
export const SCORE_DIMENSIONS = Object.freeze(['localization', 'editorial', 'seo', 'ux', 'accessibility', 'brand', 'psychology']);

export function createJob({ locale, contentId, masterRevision, masterContent, pageFamily }) {
  if (!locale || !contentId || !masterRevision || !masterContent || !pageFamily) throw new Error('Localization job requires immutable master content, revision, locale, and page family');
  return Object.freeze({ locale, contentId, masterRevision, masterContent, pageFamily, sourceLocale: 'en' });
}

export function validateStageResult(stage, result) {
  if (!STUDIO_STAGES.includes(stage)) throw new Error(`Unknown studio stage: ${stage}`);
  if (!result || typeof result !== 'object' || result.stage !== stage || typeof result.approved !== 'boolean') throw new Error(`${stage}: invalid stage result`);
  if (result.approved && !result.output) throw new Error(`${stage}: approved output is required`);
  return result;
}
