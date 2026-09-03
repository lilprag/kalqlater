import { notFound } from 'next/navigation';

import { GuidesHub } from '../../../components/GuideDiscovery';
import { JsonLd } from '../../../components/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '../../../lib/metadata';

export const dynamicParams = true;

export function generateStaticParams() {
  return [{ locale: 'en' }];
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (locale !== 'en') return {};
  return pageMetadata({ locale: 'en', path: 'guides', title: 'Personality Guides: MBTI Concepts and Preferences', description: 'Understand personality type letters and preference pairs through clear guides to MBTI concepts, communication, and comparison.', availableLocales: ['en'] });
}

export default async function PersonalityGuidesPage({ params }) {
  const { locale } = await params;
  if (locale !== 'en') notFound();
  return <><JsonLd data={{ '@context': 'https://schema.org', '@graph': [breadcrumbJsonLd('en', [{ name: 'KalQLater' }, { name: 'Personality Guides', path: 'guides' }]), { '@type': 'CollectionPage', name: 'Personality Guides', description: 'Understand the concepts behind personality types, preferences, communication and comparison.', url: 'https://kalqlater.com/en/guides', inLanguage: 'en' }] }} /><GuidesHub /></>;
}
