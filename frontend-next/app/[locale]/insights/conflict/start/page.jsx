import { notFound } from 'next/navigation';
import { ConflictStart } from '../../../../../components/insights/ConflictAssessment';
import { pageMetadata } from '../../../../../lib/metadata';
import { conflictCopy } from '../../../../../data/conflict-insights';
import { isLocale } from '../../../../../lib/site';
import { isAssessmentLocaleSupported } from '../../../../../lib/assessment-capabilities';
export async function generateMetadata({ params }) { const { locale } = await params; const activeLocale = isLocale(locale) ? locale : 'en'; return pageMetadata({ locale: activeLocale, path: 'insights/conflict/start', title: 'Conflict Insights', description: conflictCopy(activeLocale).promise, noIndex: true }); }
export default async function ConflictStartPage({ params }) { const { locale } = await params; if (!isLocale(locale) || !isAssessmentLocaleSupported('conflict', locale)) notFound(); return <ConflictStart locale={locale} />; }
