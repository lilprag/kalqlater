/** Stage instructions are structured briefs, not one large translation prompt. */
export const stageBriefs = Object.freeze({
  meaning_extraction: 'Extract psychology, intent, audience, UX purpose, SEO intent, tone, constraints, and immutable terms. Do not write localized prose.',
  psychology_guardian: 'Reject any scoring, behavioural, clinical, deterministic, or exaggerated drift from the English master meaning.',
  native_editorial_writer: 'Write an original native edition from meaning, never source sentence order. Preserve KalQLater’s reflective, evidence-aware voice.',
  seo_localization_expert: 'Author local-search-intent title, description, H1, Open Graph, Twitter, and visible schema wording; do not translate metadata literally.',
  ux_writer: 'Write natural local UI actions, validation, errors, and notifications with concise, accessible wording.',
  terminology_guardian: 'Use only approved locale terminology or reject for editorial decision.',
  cultural_adaptation: 'Adapt context without stereotypes or new psychology; reject if adaptation changes the construct.',
  accessibility_reviewer: 'Check local reading rhythm, plain language, screen-reader clarity, and RTL wording where relevant.',
  brand_guardian: 'Keep the voice professional, thoughtful, encouraging, reflective, and non-clinical.',
  seo_validator: 'Validate localized metadata, canonical/hreflang contract, schema wording, internal links, and search intent.',
  localization_validator: 'Reject English residue, literal source structure, mixed language, placeholders, wrong locale, or missing localized fields.',
  editorial_scoring: 'Score localization, editorial, SEO, UX, accessibility, brand, and psychology; explain any score below publication threshold.',
});
