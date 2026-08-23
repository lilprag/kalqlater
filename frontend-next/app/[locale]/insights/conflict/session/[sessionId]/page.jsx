import { notFound } from 'next/navigation';
import { OptimisticConflictFlow } from '../../../../../../components/insights/OptimisticAnalyzerFlows';
import { pageMetadata } from '../../../../../../lib/metadata';
import { isLocale } from '../../../../../../lib/site';
import { isAssessmentLocaleSupported } from '../../../../../../lib/assessment-capabilities';
export async function generateMetadata({ params }) { const { locale } = await params; return pageMetadata({ locale: isLocale(locale) ? locale : 'en', path: 'insights/conflict/session', title: 'Conflict Insights', description: 'Private conflict reflection session.', noIndex: true }); }
export default async function ConflictSessionPage({ params }) { const { locale, sessionId } = await params; if (!isLocale(locale) || !isAssessmentLocaleSupported('conflict', locale) || !/^[a-z0-9-]{20,}$/i.test(sessionId)) notFound(); return <OptimisticConflictFlow locale={locale} sessionId={sessionId} />; }
