'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function LocaleSwitcher({ locale }) {
  const pathname = usePathname();
  const target = pathname.replace(/^\/(en|hi)(?=\/|$)/, `/${locale === 'en' ? 'hi' : 'en'}`);
  return <Link href={target || `/${locale === 'en' ? 'hi' : 'en'}`} className="rounded-full border border-brand-line px-3 py-2 text-sm font-semibold text-brand-ink hover:border-brand-teal" aria-label={locale === 'en' ? 'Switch to Hindi' : 'Switch to English'}>{locale === 'en' ? 'हिंदी' : 'EN'}</Link>;
}
