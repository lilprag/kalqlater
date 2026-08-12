import { notFound } from 'next/navigation';
import { ConflictResult } from '../../../../../../components/insights/ConflictResult';
import { pageMetadata } from '../../../../../../lib/metadata';
import { isLocale } from '../../../../../../lib/site';
export async function generateMetadata({ params }) { const { locale } = await params; return pageMetadata({ locale: isLocale(locale) ? locale : 'en', path: 'insights/conflict/result', title: 'Conflict Insights', description: 'Private conflict reflection.', noIndex: true }); }
export default async function ConflictResultPage({ params }) { const { locale, resultId } = await params; if (!isLocale(locale) || !/^[a-z0-9-]{20,}$/i.test(resultId)) notFound(); return <ConflictResult locale={locale} resultId={resultId} />; }
