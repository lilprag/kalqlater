import { COPY } from '../../../data/copy';
import { breadcrumbJsonLd, pageMetadata } from '../../../lib/metadata';
import { isLocale } from '../../../lib/site';
import { JsonLd } from '../../../components/JsonLd';
import { LocalePackagePreview } from '../../../components/LocalePackagePreview';
import { loadLocalePage, localePreviewMetadata } from '../../../localization/runtime';

export async function generateMetadata({ params }) { const { locale } = await params; const packagePage = await loadLocalePage(locale, 'static:terms'); if (packagePage) return localePreviewMetadata(locale, packagePage, 'terms'); const activeLocale = isLocale(locale) ? locale : 'en'; return pageMetadata({ locale: activeLocale, path: 'terms', title: (COPY[locale] || COPY.en).terms.title, description: activeLocale === 'hi' ? 'KalQLater के आत्मचिंतन, कम्युनिटी और सार्वजनिक प्रोफाइल के जिम्मेदार उपयोग की शर्तें पढ़ें।' : 'Read the terms for responsible use of KalQLater reflection tools, Community, and public profiles.' }); }

export default async function TermsPage({ params }) { const { locale } = await params; const packagePage = await loadLocalePage(locale, 'static:terms'); if (packagePage) return <LocalePackagePreview locale={locale} page={packagePage} path="terms" />; const activeLocale = isLocale(locale) ? locale : 'en'; const copy = COPY[activeLocale].terms; return <><JsonLd data={breadcrumbJsonLd(activeLocale, [{ name: 'KalQLater' }, { name: copy.title, path: 'terms' }])} /><article className="mx-auto max-w-3xl px-4 py-16 sm:px-6"><p className="text-xs font-semibold uppercase tracking-[.24em] text-brand-teal">KalQLater</p><h1 className="display-font mt-3 text-4xl sm:text-5xl">{copy.title}</h1><p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-brand-subtle">{copy.body}</p></article></>; }
