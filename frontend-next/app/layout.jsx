import { headers } from 'next/headers';
import './globals.css';
import { Analytics } from '../components/Analytics';
import { localeDirection } from '../lib/site';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kalqlater.com'),
  title: { default: 'KalQLater', template: '%s | KalQLater' },
  description: 'An original personality insight platform for reflection, growth, and community.',
};

export default async function RootLayout({ children }) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get('x-kalqlater-locale') || 'en';
  return <html lang={locale} dir={localeDirection(locale)}><body><a className="skip-link" href="#main-content">Skip to content</a>{children}<Analytics /></body></html>;
}
