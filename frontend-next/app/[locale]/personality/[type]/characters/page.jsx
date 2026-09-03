import { notFound } from 'next/navigation';

import { CharacterGuide } from '../../../../../components/guides/CharacterGuide';
import { CHARACTER_GUIDES } from '../../../../../data/traffic-sprint';
import { pageMetadata } from '../../../../../lib/metadata';

export const dynamicParams = true;

export function generateStaticParams() {
  return Object.keys(CHARACTER_GUIDES).map((type) => ({ locale: 'en', type: type.toLowerCase() }));
}

export async function generateMetadata({ params }) {
  const { locale, type } = await params;
  const guide = locale === 'en' ? CHARACTER_GUIDES[String(type).toUpperCase()] : null;
  if (!guide) return {};
  return pageMetadata({ locale: 'en', path: `personality/${type}/characters`, title: guide.title, description: guide.description, availableLocales: ['en'] });
}

export default async function CharacterGuidePage({ params }) {
  const { locale, type } = await params;
  const code = String(type).toUpperCase();
  const guide = locale === 'en' ? CHARACTER_GUIDES[code] : null;
  if (!guide) notFound();
  return <CharacterGuide code={code} guide={guide} />;
}
