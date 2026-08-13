import { EditorialWorkbench } from '../../../../components/localization/EditorialWorkbench';
import { isLocale } from '../../../../lib/site';
import { pageMetadata } from '../../../../lib/metadata';

export async function generateMetadata({ params }) { const { locale } = await params; return pageMetadata({ locale: isLocale(locale) ? locale : 'en', path: 'editorial/localization', title: 'Localization editorial workbench', description: 'Private editorial review workspace.', noIndex: true }); }
export default async function LocalizationWorkbenchPage({ params }) { const { locale } = await params; return <EditorialWorkbench locale={isLocale(locale) ? locale : 'en'} />; }
