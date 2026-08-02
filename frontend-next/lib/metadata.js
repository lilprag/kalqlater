import { localePath, siteUrl } from './site';

const defaults = {
  en: {
    siteName: 'KalQLater',
    title: 'Personality insights for reflection and growth',
    description: 'KalQLater is an original personality insight platform for reflection, growth, and community.',
  },
  hi: {
    siteName: 'KalQLater',
    title: 'आत्मचिंतन और विकास के लिए व्यक्तित्व अंतर्दृष्टि',
    description: 'KalQLater आत्मचिंतन, विकास और समुदाय के लिए एक मौलिक व्यक्तित्व अंतर्दृष्टि मंच है।',
  },
};

export function pageMetadata({ locale, path = '', title, description, noIndex = false }) {
  const copy = defaults[locale] || defaults.en;
  const canonicalPath = localePath(locale, path);
  const canonical = `${siteUrl()}${canonicalPath}`;
  const resolvedTitle = title || copy.title;
  const resolvedDescription = description || copy.description;
  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical,
      languages: {
        en: `${siteUrl()}${localePath('en', path)}`,
        hi: `${siteUrl()}${localePath('hi', path)}`,
        'x-default': `${siteUrl()}${localePath('en', path)}`,
      },
    },
    openGraph: {
      type: 'website', siteName: copy.siteName, title: resolvedTitle,
      description: resolvedDescription, url: canonical,
      locale: locale === 'hi' ? 'hi_IN' : 'en_IN',
      alternateLocale: locale === 'hi' ? ['en_IN'] : ['hi_IN'],
    },
    twitter: { card: 'summary', title: resolvedTitle, description: resolvedDescription },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function breadcrumbJsonLd(locale, items) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem', position: index + 1, name: item.name,
      item: `${siteUrl()}${localePath(locale, item.path || '')}`,
    })),
  };
}
