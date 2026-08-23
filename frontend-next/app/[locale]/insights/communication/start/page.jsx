import { notFound } from 'next/navigation';
import { StartAssessment } from '../../../../../components/insights/CommunicationFlow';
import { insightsCopy } from '../../../../../data/communication-insights';
import { communicationRouteMetadata } from '../../../../../data/communication-route-metadata';
import { pageMetadata } from '../../../../../lib/metadata';
import { isLocale } from '../../../../../lib/site';
import { isAssessmentLocaleSupported } from '../../../../../lib/assessment-capabilities';

export async function generateMetadata({ params }) { const { locale } = await params; const activeLocale = isLocale(locale) ? locale : 'en'; return pageMetadata({ locale: activeLocale, path: 'insights/communication/start', title: communicationRouteMetadata(activeLocale).title, description: insightsCopy(activeLocale).promise, noIndex: true }); }
export default async function CommunicationStartPage({ params }) { const { locale } = await params; if (!isLocale(locale) || !isAssessmentLocaleSupported('communication', locale)) notFound(); return <StartAssessment locale={locale} />; }
