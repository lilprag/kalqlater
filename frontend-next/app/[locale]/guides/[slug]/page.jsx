import { notFound } from 'next/navigation';

import { ConceptGuide } from '../../../../components/guides/ConceptGuide';
import { CONCEPT_GUIDES } from '../../../../data/traffic-sprint';
import { pageMetadata } from '../../../../lib/metadata';

export const dynamicParams = true;

export function generateStaticParams() {
  return Object.keys(CONCEPT_GUIDES).map((slug) => ({ locale: 'en', slug }));
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const guide = locale === 'en' ? CONCEPT_GUIDES[slug] : null;
  if (!guide) return {};
  return pageMetadata({ locale: 'en', path: `guides/${slug}`, title: guide.title, description: guide.description, availableLocales: ['en'] });
}

export default async function ConceptGuidePage({ params }) {
  const { locale, slug } = await params;
  const guide = locale === 'en' ? CONCEPT_GUIDES[slug] : null;
  if (!guide) notFound();
  return <ConceptGuide guide={guide} slug={slug} />;
}
