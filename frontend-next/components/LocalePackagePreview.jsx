import Link from 'next/link';

import { JsonLd } from './JsonLd';
import { localePath } from '../lib/site';

function displayTitle(fields) {
  return fields.h1 || fields.hero || fields.title || fields.seo?.title || fields.overview || fields.body || fields.summary;
}

const SECTION_LABELS = Object.freeze({
  summary: 'En bref', overview: 'Perspective', coreTraits: 'Préférences', strengths: 'Points d’appui', growthAreas: 'Pistes d’évolution',
  communication: 'Communication', relationships: 'Relations', friendship: 'Amitiés', romance: 'Vie amoureuse', family: 'Famille', teamwork: 'Travail en équipe',
  workStyle: 'Au travail', leadership: 'Leadership', learning: 'Apprentissage', stress: 'Sous pression', recommendations: 'À essayer',
  lens: 'Angle de réflexion', skill: 'Forces professionnelles', roles: 'Pistes professionnelles', settings: 'Environnements', formats: 'Formats de travail', skills: 'Compétences', stages: 'Évolution de carrière', industries: 'Secteurs',
  helper: 'À garder en tête', intro: 'Leur dynamique', snapshot: 'En bref', sections: 'Communication et travail', misconceptions: 'Éviter les raccourcis', percentage: 'Compatibilité',
  promise: 'Ce que vous allez explorer', dimensions: 'Repères', examples: 'Situations', howItWorks: 'Comment cela fonctionne',
});

const SECTION_LABELS_JA = Object.freeze({
  summary: '概要', overview: '見方', coreTraits: '傾向', strengths: '強み', growthAreas: '成長のヒント',
  communication: 'コミュニケーション', relationships: '関係性', friendship: '友情', romance: '恋愛', family: '家族', teamwork: 'チームワーク',
  workStyle: '仕事の進め方', leadership: 'リーダーシップ', learning: '学び', stress: 'ストレス下での傾向', recommendations: '試してみること',
  lens: '考える視点', skill: '仕事で生きる強み', roles: '検討したい役割', settings: '環境', formats: '働き方', skills: 'スキル', stages: 'キャリアの段階', industries: '分野',
  helper: '覚えておきたいこと', intro: '二人の関係性', snapshot: '要点', sections: 'コミュニケーションと仕事', misconceptions: '短絡的に決めつけないために', percentage: '相性',
  promise: 'ここで見つめること', dimensions: '視点', examples: '場面', howItWorks: '進め方',
});

function sectionEntries(fields, labels) {
  return Object.entries(fields).filter(([key, value]) => labels[key] && typeof value === 'string' && value.trim());
}

/** Generic SSR renderer for an approved preview package; it never supplies fallback copy. */
export function LocalePackagePreview({ locale, page, path = '' }) {
  const title = displayTitle(page.fields);
  const labels = locale === 'ja' ? SECTION_LABELS_JA : SECTION_LABELS;
  const sections = sectionEntries(page.fields, labels);
  const schema = {
    '@context': 'https://schema.org', '@type': 'WebPage', name: title,
    url: `https://kalqlater.com${localePath(locale, path)}`,
    inLanguage: locale,
    isPartOf: { '@type': 'WebSite', name: 'KalQLater' },
  };
  const breadcrumb = page.id === 'homepage' ? null : (page.fields.jsonLd?.breadcrumb || 'KalQLater');
  const faq = page.fields.jsonLd?.faq || page.fields.faqs;
  const schemas = [schema,
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'KalQLater', item: `https://kalqlater.com/${locale}` }, { '@type': 'ListItem', position: 2, name: breadcrumb, item: `https://kalqlater.com${localePath(locale, path)}` }] },
    ...(faq ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: faq, acceptedAnswer: { '@type': 'Answer', text: page.fields.faqs || faq } }] }] : []),
  ];
  return <><JsonLd data={schemas} /><main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">{page.id !== 'homepage' && <nav aria-label="KalQLater" className="text-sm text-brand-subtle"><Link href={localePath(locale)}>KalQLater</Link>{path && <><span aria-hidden="true"> / </span>{breadcrumb}</>}</nav>}<header className="mt-8 max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-brand-teal">{page.fields.eyebrow || breadcrumb || 'KalQLater'}</p><h1 className="display-font mt-3 text-4xl text-brand-ink sm:text-5xl">{title}</h1><p className="mt-5 text-lg leading-relaxed text-brand-subtle">{page.fields.body || page.fields.summary || page.fields.intro || page.fields.promise || page.fields.overview}</p></header><div className="mt-10 grid gap-5 md:grid-cols-2">{sections.map(([key, value]) => <section key={key} className="rounded-2xl border border-brand-line bg-white p-6 shadow-sm"><h2 className="display-font text-xl text-brand-ink">{labels[key]}</h2><p className="mt-3 leading-relaxed text-brand-subtle">{value}</p></section>)}</div>{page.fields.ctas && <Link href={localePath(locale)} className="mt-10 inline-flex rounded-full bg-brand-teal px-6 py-3 font-semibold text-white">{page.fields.ctas}</Link>}</main></>;
}
