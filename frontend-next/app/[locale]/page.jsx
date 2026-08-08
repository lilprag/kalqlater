import { pageMetadata } from '../../lib/metadata';
import { isLocale, localePath, siteUrl } from '../../lib/site';
import { JsonLd } from '../../components/JsonLd';
import { HomeVisual } from '../../components/HomeVisual';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return pageMetadata({ locale: isLocale(locale) ? locale : 'en' });
}

export default async function HomePage({ params }) {
  const { locale } = await params;
  const activeLocale = isLocale(locale) ? locale : 'en';
  const canonicalHomeUrl = `${siteUrl()}${localePath('en')}`;
  const websiteSchema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebSite', name: 'KalQLater', url: canonicalHomeUrl, inLanguage: ['en-IN', 'hi-IN'] },
      { '@type': 'Organization', name: 'KalQLater', url: canonicalHomeUrl },
    ],
  };
  return <><JsonLd data={websiteSchema} /><HomeVisual locale={activeLocale} /></>;
}
