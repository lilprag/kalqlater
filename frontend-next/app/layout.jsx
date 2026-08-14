import { headers } from 'next/headers';
import './globals.css';
import { Analytics } from '../components/Analytics';
import { localeDirection } from '../lib/site';
import { isRuntimePreviewLocale } from '../localization/runtime-policy';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kalqlater.com'),
  title: { default: 'KalQLater', template: '%s | KalQLater' },
  description: 'An original personality insight platform for reflection, growth, and community.',
};

export default async function RootLayout({ children }) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get('x-kalqlater-locale') || 'en';
  const skipLink = locale === 'es' ? 'Ir al contenido' : isRuntimePreviewLocale(locale) ? null : 'Skip to content';
  return <html lang={locale} dir={localeDirection(locale)}><body>{skipLink && <a className="skip-link" href="#main-content">{skipLink}</a>}{children}<Analytics /></body></html>;
}
