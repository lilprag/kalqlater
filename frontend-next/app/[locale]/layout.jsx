import { notFound } from 'next/navigation';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { isLocale } from '../../lib/site';

export function generateStaticParams() { return [{ locale: 'en' }, { locale: 'hi' }]; }

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <><Header locale={locale} /><main id="main-content" className="min-h-[60vh]">{children}</main><Footer locale={locale} /></>;
}
