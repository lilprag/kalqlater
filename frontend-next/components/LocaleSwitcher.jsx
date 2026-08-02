'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function LocaleSwitcher({ locale }) {
  const pathname = usePathname();
  const target = pathname.replace(/^\/(en|hi)(?=\/|$)/, `/${locale === 'en' ? 'hi' : 'en'}`);
  return <Link href={target || `/${locale === 'en' ? 'hi' : 'en'}`} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-brand-line bg-white px-3 text-sm font-semibold text-brand-ink transition-colors hover:border-brand-teal hover:bg-brand-cream" aria-label={locale === 'en' ? 'Switch to Hindi' : 'Switch to English'}><span className={locale === 'hi' ? 'font-bold text-brand-teal' : 'text-brand-subtle'}>हिं</span><span className="text-brand-line">|</span><span className={locale === 'en' ? 'font-bold text-brand-teal' : 'text-brand-subtle'}>EN</span></Link>;
}
