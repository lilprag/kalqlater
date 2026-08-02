import Link from 'next/link';
import { COPY } from '../../data/copy';

export default async function LocaleNotFound({ params }) {
  const locale = (await params)?.locale === 'hi' ? 'hi' : 'en';
  const copy = COPY[locale].notFound;
  return <div className="mx-auto max-w-2xl px-4 py-28 text-center"><p className="text-xs font-semibold uppercase tracking-[.2em] text-brand-teal">404</p><h1 className="display-font mt-3 text-4xl">{copy.title}</h1><p className="mt-4 text-brand-subtle">{copy.body}</p><Link href={`/${locale}`} className="mt-8 inline-flex rounded-full bg-brand-teal px-6 py-3 font-semibold text-white">{copy.cta}</Link></div>;
}
