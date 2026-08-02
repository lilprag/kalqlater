import { COPY } from '../../../data/copy';
import { breadcrumbJsonLd, pageMetadata } from '../../../lib/metadata';
import { isLocale } from '../../../lib/site';
import { JsonLd } from '../../../components/JsonLd';

export async function generateMetadata({ params }) { const { locale } = await params; return pageMetadata({ locale: isLocale(locale) ? locale : 'en', path: 'privacy', title: (COPY[locale] || COPY.en).privacy.title }); }

export default async function PrivacyPage({ params }) { const { locale } = await params; const activeLocale = isLocale(locale) ? locale : 'en'; const copy = COPY[activeLocale].privacy; return <><JsonLd data={breadcrumbJsonLd(activeLocale, [{ name: 'KalQLater' }, { name: copy.title, path: 'privacy' }])} /><article className="mx-auto max-w-3xl px-4 py-16 sm:px-6"><p className="text-xs font-semibold uppercase tracking-[.24em] text-brand-teal">KalQLater</p><h1 className="display-font mt-3 text-4xl sm:text-5xl">{copy.title}</h1><p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-brand-subtle">{copy.body}</p></article></>; }
