import Link from 'next/link';

import { JsonLd } from './JsonLd';
import { localePath } from '../lib/site';

function strings(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}

function displayTitle(fields) {
  return fields.h1 || fields.hero || fields.title || fields.seo?.title || fields.overview || fields.body || fields.summary;
}

/** Generic SSR renderer for an approved preview package; it never supplies fallback copy. */
export function LocalePackagePreview({ locale, page, path = '' }) {
  const title = displayTitle(page.fields);
  const body = strings(page.fields).filter((value) => value !== title && !Object.values(page.fields.seo || {}).includes(value));
  const schema = {
    '@context': 'https://schema.org', '@type': 'WebPage', name: title,
    url: `https://kalqlater.com${localePath(locale, path)}`,
    inLanguage: locale,
    isPartOf: { '@type': 'WebSite', name: 'KalQLater' },
  };
  return <><JsonLd data={schema} /><main className="mx-auto max-w-4xl px-4 py-16 sm:px-6"><nav aria-label="KalQLater" className="text-sm text-brand-subtle"><Link href={localePath(locale)}>KalQLater</Link>{path && <><span aria-hidden="true"> / </span>{path}</>}</nav><h1 className="display-font mt-8 text-4xl text-brand-ink sm:text-5xl">{title}</h1><div className="mt-8 space-y-4"><p className="text-lg leading-relaxed text-brand-subtle">{page.fields.body || page.fields.summary || page.fields.intro || page.fields.promise || page.fields.overview}</p>{body.slice(0, 48).map((value, index) => <p key={`${index}-${value.slice(0, 24)}`} className="leading-relaxed text-brand-subtle">{value}</p>)}</div></main></>;
}
