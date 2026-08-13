/** Authored SEO defaults. New published locales must add their own copy here. */
export const seoContent = Object.freeze({
  en: Object.freeze({
    home: Object.freeze({ title: 'Personality insights for reflection and growth', description: 'KalQLater is an original personality insight platform for reflection, growth, and community.' }),
  }),
  hi: Object.freeze({
    home: Object.freeze({ title: 'आत्मचिंतन और विकास के लिए व्यक्तित्व अंतर्दृष्टि', description: 'KalQLater आत्मचिंतन, विकास और समुदाय के लिए एक मौलिक व्यक्तित्व अंतर्दृष्टि मंच है।' }),
  }),
});

export function seoCopy(locale, key) {
  const copy = seoContent[locale]?.[key];
  if (!copy?.title || !copy?.description) throw new Error(`Missing authored SEO copy for ${locale}/${key}`);
  return copy;
}
