import { ContactForm } from '../../../components/ContactForm';
import { COPY } from '../../../data/copy';
import { breadcrumbJsonLd, pageMetadata } from '../../../lib/metadata';
import { isLocale } from '../../../lib/site';
import { JsonLd } from '../../../components/JsonLd';
import { LocalePackagePreview } from '../../../components/LocalePackagePreview';
import { loadLocalePage, localePreviewMetadata } from '../../../localization/runtime';

export async function generateMetadata({ params }) { const { locale } = await params; const packagePage = await loadLocalePage(locale, 'static:contact'); if (packagePage) return localePreviewMetadata(locale, packagePage, 'contact'); const activeLocale = isLocale(locale) ? locale : 'en'; const copy = COPY[activeLocale].contact; return pageMetadata({ locale: activeLocale, path: 'contact', title: copy.title, description: copy.body }); }

export default async function ContactPage({ params }) { const { locale } = await params; const packagePage = await loadLocalePage(locale, 'static:contact'); if (packagePage) return <LocalePackagePreview locale={locale} page={packagePage} path="contact" />; const activeLocale = isLocale(locale) ? locale : 'en'; const copy = COPY[activeLocale].contact; return <><JsonLd data={breadcrumbJsonLd(activeLocale, [{ name: 'KalQLater' }, { name: copy.title, path: 'contact' }])} /><div className="mx-auto max-w-3xl px-4 py-16 sm:px-6"><header className="max-w-xl"><p className="text-xs font-semibold uppercase tracking-[.24em] text-brand-teal">{copy.eyebrow}</p><h1 className="display-font mt-3 text-4xl sm:text-5xl">{copy.title}</h1><p className="mt-4 text-lg leading-relaxed text-brand-subtle">{copy.body}</p></header><ContactForm copy={copy} /></div></>; }
