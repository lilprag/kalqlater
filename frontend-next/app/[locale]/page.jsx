import { pageMetadata } from '../../lib/metadata';
import { isHomepagePreviewLocale, isLocale, localePath, siteUrl } from '../../lib/site';
import { homepageContent } from '../../localization/homepage';
import { JsonLd } from '../../components/JsonLd';
import { HomeVisual } from '../../components/HomeVisual';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (isHomepagePreviewLocale(locale)) {
    const seo = homepageContent(locale).seo;
    const url = `${siteUrl()}/es`;
    return { title: { absolute: seo.title }, description: seo.description, alternates: { canonical: url }, openGraph: { type: 'website', siteName: 'KalQLater', title: seo.title, description: seo.description, url, locale: 'es_ES' }, twitter: { card: 'summary', title: seo.title, description: seo.description }, robots: { index: false, follow: false } };
  }
  const activeLocale = isLocale(locale) ? locale : 'en';
  const seo = ['fr', 'ja'].includes(activeLocale) ? homepageContent(activeLocale).seo : undefined;
  const title = seo?.title?.replace(/\s*\|\s*KalQLater\s*$/i, '').trim();
  return pageMetadata({ locale: activeLocale, title, description: seo?.description });
}

export default async function HomePage({ params }) {
  const { locale } = await params;
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
