import { notFound } from 'next/navigation';
import { ScenarioFlow } from '../../../../../../components/insights/CommunicationFlow';
import { pageMetadata } from '../../../../../../lib/metadata';
import { isLocale } from '../../../../../../lib/site';

export async function generateMetadata({ params }) { const { locale } = await params; return pageMetadata({ locale: isLocale(locale) ? locale : 'en', path: 'insights/communication/session', title: 'Communication Insights', description: 'Private reflection session.', noIndex: true }); }
export default async function CommunicationSessionPage({ params }) { const { locale, sessionId } = await params; if (!isLocale(locale) || !/^[a-z0-9-]{20,}$/i.test(sessionId)) notFound(); return <ScenarioFlow locale={locale} sessionId={sessionId} />; }
