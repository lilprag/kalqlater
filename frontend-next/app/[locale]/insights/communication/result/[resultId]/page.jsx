import { notFound } from 'next/navigation';
import { CommunicationResult } from '../../../../../../components/insights/CommunicationResult';
import { pageMetadata } from '../../../../../../lib/metadata';
import { isLocale } from '../../../../../../lib/site';

export async function generateMetadata({ params }) { const { locale } = await params; return pageMetadata({ locale: isLocale(locale) ? locale : 'en', path: 'insights/communication/result', title: 'Communication Insights', description: 'Private communication reflection.', noIndex: true }); }
export default async function CommunicationResultPage({ params }) { const { locale, resultId } = await params; if (!isLocale(locale) || !/^[a-z0-9-]{20,}$/i.test(resultId)) notFound(); return <CommunicationResult locale={locale} resultId={resultId} />; }
