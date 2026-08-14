import { notFound } from 'next/navigation';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { GenericLocaleChrome } from '../../components/GenericLocaleChrome';
import { isHomepagePreviewLocale, isLocale } from '../../lib/site';
import { localeRuntime } from '../../localization/runtime-policy';

export function generateStaticParams() { return [{ locale: 'en' }, { locale: 'hi' }]; }

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!isLocale(locale) && !isHomepagePreviewLocale(locale)) notFound();
  if (localeRuntime(locale)?.packageSource === 'json-package') return <GenericLocaleChrome locale={locale}>{children}</GenericLocaleChrome>;
  return <><Header locale={locale} /><main id="main-content" className="min-h-[60vh]">{children}</main><Footer locale={locale} /></>;
}
