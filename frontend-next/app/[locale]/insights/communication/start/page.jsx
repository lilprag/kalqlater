import { notFound } from 'next/navigation';
import { StartAssessment } from '../../../../../components/insights/CommunicationFlow';
import { insightsCopy } from '../../../../../data/communication-insights';
import { pageMetadata } from '../../../../../lib/metadata';
import { isLocale } from '../../../../../lib/site';

export async function generateMetadata({ params }) { const { locale } = await params; return pageMetadata({ locale: isLocale(locale) ? locale : 'en', path: 'insights/communication/start', title: 'Communication Insights', description: insightsCopy(isLocale(locale) ? locale : 'en').promise, noIndex: true }); }
export default async function CommunicationStartPage({ params }) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <StartAssessment locale={locale} />; }
