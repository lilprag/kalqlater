import { pageMetadata } from '../../lib/metadata';
import { isHomepagePreviewLocale, isLocale, localePath, siteUrl } from '../../lib/site';
import { homepageContent } from '../../localization/homepage';
import { JsonLd } from '../../components/JsonLd';
import { HomeVisual } from '../../components/HomeVisual';
import { LocalePackagePreview } from '../../components/LocalePackagePreview';
import { loadLocalePage, localePreviewMetadata } from '../../localization/runtime';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const packagePage = await loadLocalePage(locale, 'homepage');
  if (packagePage) return localePreviewMetadata(locale, packagePage);
  if (isHomepagePreviewLocale(locale)) {
    const seo = homepageContent(locale).seo;
    const url = `${siteUrl()}/es`;
    return { title: { absolute: seo.title }, description: seo.description, alternates: { canonical: url }, openGraph: { type: 'website', siteName: 'KalQLater', title: seo.title, description: seo.description, url, locale: 'es_ES' }, twitter: { card: 'summary', title: seo.title, description: seo.description }, robots: { index: false, follow: false } };
  }
  return pageMetadata({ locale: isLocale(locale) ? locale : 'en' });
}

export default async function HomePage({ params }) {
  const { locale } = await params;
  const packagePage = await loadLocalePage(locale, 'homepage');
  if (packagePage) return <LocalePackagePreview locale={locale} page={packagePage} />;
  const activeLocale = isLocale(locale) || isHomepagePreviewLocale(locale) ? locale : 'en';
  const canonicalHomeUrl = `${siteUrl()}${localePath(activeLocale)}`;
  const websiteSchema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebSite', name: 'KalQLater', url: canonicalHomeUrl, inLanguage: activeLocale === 'es' ? 'es' : ['en-IN', 'hi-IN'] },
      { '@type': 'Organization', name: 'KalQLater', url: canonicalHomeUrl },
    ],
  };
  return <><JsonLd data={websiteSchema} /><HomeVisual locale={activeLocale} /></>;
}
