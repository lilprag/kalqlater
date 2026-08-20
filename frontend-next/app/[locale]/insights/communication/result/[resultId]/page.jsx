import { notFound } from 'next/navigation';
import { CommunicationResult } from '../../../../../../components/insights/CommunicationResult';
import { communicationRouteMetadata } from '../../../../../../data/communication-route-metadata';
import { pageMetadata } from '../../../../../../lib/metadata';
import { isLocale } from '../../../../../../lib/site';

export async function generateMetadata({ params }) { const { locale } = await params; const activeLocale = isLocale(locale) ? locale : 'en'; const copy = communicationRouteMetadata(activeLocale); return pageMetadata({ locale: activeLocale, path: 'insights/communication/result', title: copy.title, description: copy.resultDescription, noIndex: true }); }
export default async function CommunicationResultPage({ params }) { const { locale, resultId } = await params; if (!isLocale(locale) || !/^[a-z0-9-]{20,}$/i.test(resultId)) notFound(); return <CommunicationResult locale={locale} resultId={resultId} />; }
