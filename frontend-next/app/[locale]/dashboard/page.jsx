import { notFound } from 'next/navigation';
import { DashboardAccess } from '../../../components/dashboard/GrowthDashboard';
import { pageMetadata } from '../../../lib/metadata';
import { isLocale } from '../../../lib/site';

export const dynamicParams = false;
export function generateStaticParams() { return ['en', 'hi'].map((locale) => ({ locale })); }

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const safeLocale = isLocale(locale) ? locale : 'en';
  return pageMetadata({
    locale: safeLocale,
    path: 'dashboard',
    title: safeLocale === 'hi' ? 'बिहेवियर इंटेलिजेंस डैशबोर्ड' : 'Behaviour Intelligence Dashboard',
    description: safeLocale === 'hi' ? 'आपके पूरे किए गए KalQLater आत्मचिंतन का निजी डैशबोर्ड।' : 'Your private dashboard for completed KalQLater reflections.',
    noIndex: true,
  });
}

export default async function DashboardPage({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <DashboardAccess locale={locale} />;
}
