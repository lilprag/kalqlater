import { notFound } from 'next/navigation';
import { OptimisticCommunicationFlow } from '../../../../../../components/insights/OptimisticAnalyzerFlows';
import { communicationRouteMetadata } from '../../../../../../data/communication-route-metadata';
import { pageMetadata } from '../../../../../../lib/metadata';
import { isLocale } from '../../../../../../lib/site';

export async function generateMetadata({ params }) { const { locale } = await params; const activeLocale = isLocale(locale) ? locale : 'en'; const copy = communicationRouteMetadata(activeLocale); return pageMetadata({ locale: activeLocale, path: 'insights/communication/session', title: copy.title, description: copy.sessionDescription, noIndex: true }); }
export default async function CommunicationSessionPage({ params }) { const { locale, sessionId } = await params; if (!isLocale(locale) || !/^[a-z0-9-]{20,}$/i.test(sessionId)) notFound(); return <OptimisticCommunicationFlow locale={locale} sessionId={sessionId} />; }
