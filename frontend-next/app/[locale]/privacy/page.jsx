import { COPY } from '../../../data/copy';
import { breadcrumbJsonLd, pageMetadata } from '../../../lib/metadata';
import { isLocale } from '../../../lib/site';
import { JsonLd } from '../../../components/JsonLd';

export async function generateMetadata({ params }) { const { locale } = await params; const activeLocale = isLocale(locale) ? locale : 'en'; return pageMetadata({ locale: activeLocale, path: 'privacy', title: (COPY[locale] || COPY.en).privacy.title, description: activeLocale === 'hi' ? 'जानें कि KalQLater आपके चुने हुए आकलन, अकाउंट और कम्युनिटी फीचर्स में निजी जानकारी को कैसे संभालता है।' : 'Learn how KalQLater handles information for the assessment, account, and community features you choose to use.' }); }

export default async function PrivacyPage({ params }) { const { locale } = await params; const activeLocale = isLocale(locale) ? locale : 'en'; const copy = COPY[activeLocale].privacy; return <><JsonLd data={breadcrumbJsonLd(activeLocale, [{ name: 'KalQLater' }, { name: copy.title, path: 'privacy' }])} /><article className="mx-auto max-w-3xl px-4 py-16 sm:px-6"><p className="text-xs font-semibold uppercase tracking-[.24em] text-brand-teal">KalQLater</p><h1 className="display-font mt-3 text-4xl sm:text-5xl">{copy.title}</h1><p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-brand-subtle">{copy.body}</p></article></>; }
