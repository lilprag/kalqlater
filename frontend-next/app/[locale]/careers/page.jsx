import { notFound } from 'next/navigation';
import { CareersHub } from '../../../components/careers/CareersHub';
import { CAREER_TYPES, careerGuide } from '../../../data/career-guides';
import { pageMetadata } from '../../../lib/metadata';

export const dynamicParams = true;
export function generateStaticParams() { return [{ locale: 'en' }]; }
export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (locale !== 'en') return {};
  return pageMetadata({ locale: 'en', path: 'careers', title: 'Career Exploration and Personality Guidance', description: 'Explore career direction through work preferences, strengths, skills, work environments, career stages, and real opportunities.', availableLocales: ['en'] });
}
export default async function CareersPage({ params }) {
  const { locale } = await params;
  if (locale !== 'en') notFound();
  return <CareersHub guides={CAREER_TYPES.map((type) => careerGuide(type, 'en'))} />;
}
