import Link from 'next/link';

import { JsonLd } from './JsonLd';
import { LocalizedCompareContent } from './LocalizedCompareContent';
import { PersonalityComparisonDirectory, RelatedComparisonLinks } from './ComparisonDiscovery';
import { isAssessmentLocaleSupported } from '../lib/assessment-capabilities';
import { localePath } from '../lib/site';

function displayTitle(fields) {
  return fields.h1 || fields.hero || fields.displayName || fields.ui || fields.title || fields.seo?.title || fields.overview || fields.body || fields.summary;
}

const SECTION_LABELS = Object.freeze({
  summary: 'En bref', overview: 'Perspective', coreTraits: 'Préférences', strengths: 'Points d’appui', growthAreas: 'Pistes d’évolution',
  communication: 'Communication', relationships: 'Relations', friendship: 'Amitiés', romance: 'Vie amoureuse', family: 'Famille', teamwork: 'Travail en équipe',
  workStyle: 'Au travail', leadership: 'Leadership', learning: 'Apprentissage', stress: 'Sous pression', recommendations: 'À essayer',
  lens: 'Angle de réflexion', skill: 'Forces professionnelles', roles: 'Pistes professionnelles', settings: 'Environnements', formats: 'Formats de travail', skills: 'Compétences', stages: 'Évolution de carrière', industries: 'Secteurs',
  helper: 'À garder en tête', intro: 'Leur dynamique', snapshot: 'En bref', sections: 'Communication et travail', misconceptions: 'Éviter les raccourcis', percentage: 'Compatibilité',
  promise: 'Ce que vous allez explorer', dimensions: 'Repères', examples: 'Situations', howItWorks: 'Comment cela fonctionne',
  faqs: 'Questions fréquentes',
});

const SECTION_LABELS_JA = Object.freeze({
  summary: '概要', overview: '見方', coreTraits: '傾向', strengths: '強み', growthAreas: '成長のヒント',
  communication: 'コミュニケーション', relationships: '関係性', friendship: '友情', romance: '恋愛', family: '家族', teamwork: 'チームワーク',
  workStyle: '仕事の進め方', leadership: 'リーダーシップ', learning: '学び', stress: 'ストレス下での傾向', recommendations: '試してみること',
  lens: '考える視点', skill: '仕事で生きる強み', roles: '検討したい役割', settings: '環境', formats: '働き方', skills: 'スキル', stages: 'キャリアの段階', industries: '分野',
  helper: '覚えておきたいこと', intro: '二人の関係性', snapshot: '要点', sections: 'コミュニケーションと仕事', misconceptions: '短絡的に決めつけないために', percentage: '相性',
  promise: 'ここで見つめること', dimensions: '視点', examples: '場面', howItWorks: '進め方',
  faqs: 'よくある質問',
});

function sectionEntries(fields, labels) {
  return Object.entries(fields).filter(([key, value]) => labels[key] && typeof value === 'string' && value.trim() && key !== 'summary' && key !== 'intro' && key !== 'promise' && key !== 'faqs');
}

function familyFor(pageId) {
  return pageId.split(':', 1)[0];
}

function leadCopy(fields) {
  return fields.summary || fields.intro || fields.promise || fields.overview || fields.body;
}

function highlightEntries(fields, family) {
  const keys = family === 'personality'
    ? ['coreTraits', 'strengths', 'growthAreas']
    : family === 'career'
      ? ['skill', 'roles', 'settings']
      : family === 'compare'
        ? ['snapshot', 'sections', 'percentage']
        : ['dimensions', 'examples', 'howItWorks'];
  return keys.map((key) => [key, fields[key]]).filter(([, value]) => typeof value === 'string' && value.trim());
}

/** Generic SSR renderer for an approved preview package; it never supplies fallback copy. */
export function LocalePackagePreview({ locale, page, path = '' }) {
  const { fields } = page;
  const title = displayTitle(fields);
  const labels = locale === 'ja' ? SECTION_LABELS_JA : SECTION_LABELS;
  const family = familyFor(page.id);
  if (family === 'compare' && Array.isArray(fields.editorial?.sections) && Array.isArray(fields.editorial?.faqs) && Array.isArray(fields.editorial?.relatedLinks)) return <LocalizedCompareContent locale={locale} page={page} path={path} />;
  const sections = sectionEntries(fields, labels);
  const highlights = highlightEntries(fields, family);
  const schema = {
    '@context': 'https://schema.org', '@type': 'WebPage', name: title,
    url: `https://kalqlater.com${localePath(locale, path)}`,
    inLanguage: locale,
    isPartOf: { '@type': 'WebSite', name: 'KalQLater' },
  };
  const breadcrumb = page.id === 'homepage' ? null : (fields.jsonLd?.breadcrumb || 'KalQLater');
  const faq = fields.jsonLd?.faq || fields.faqs;
  const schemas = [schema,
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'KalQLater', item: `https://kalqlater.com/${locale}` }, { '@type': 'ListItem', position: 2, name: breadcrumb, item: `https://kalqlater.com${localePath(locale, path)}` }] },
    ...(faq ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: faq, acceptedAnswer: { '@type': 'Answer', text: page.fields.faqs || faq } }] }] : []),
  ];
  const insightAnalyzer = page.id.startsWith('insight:') ? page.id.slice('insight:'.length) : null;
  const isUnsupportedInsight = insightAnalyzer && !isAssessmentLocaleSupported(insightAnalyzer, locale);
  const ctaPath = page.id.startsWith('insight:') ? `insights/${page.id.slice('insight:'.length)}/start` : '';
  const unavailableCopy = locale === 'ja'
    ? 'インタラクティブ診断は日本語版を準備中です。公開までの間は、ガイドや比較ページで自分の傾向をじっくり探ってみてください。'
    : 'L’évaluation interactive sera bientôt disponible en français. En attendant, vous pouvez explorer les guides et les comparaisons à votre rythme.';
  const alternativeCta = locale === 'ja' ? 'パーソナリティガイドを見る' : 'Explorer les guides de personnalité';
  return <><JsonLd data={schemas} /><main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">{page.id !== 'homepage' && <nav aria-label="KalQLater" className="text-sm text-brand-subtle"><Link href={localePath(locale)}>KalQLater</Link>{path && <><span aria-hidden="true"> / </span>{breadcrumb}</>}</nav>}<header className="relative mt-6 overflow-hidden rounded-[2rem] bg-brand-ink px-7 py-10 text-white shadow-[0_24px_70px_rgba(45,40,37,.16)] sm:px-10 sm:py-14"><span aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-teal/35 blur-3xl" /><div className="relative grid gap-8 lg:grid-cols-[1.2fr_.8fr]"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-brand-sand">{fields.eyebrow || breadcrumb || 'KalQLater'}</p><h1 className="display-font mt-4 text-4xl leading-tight sm:text-6xl">{title}</h1>{leadCopy(fields) && <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/80">{leadCopy(fields)}</p>}</div>{highlights.length > 0 && <aside className="grid gap-3">{highlights.map(([key, value], index) => <div key={key} className={`rounded-2xl p-4 ${index === 0 ? 'bg-white/15' : 'bg-white/10'}`}><p className="text-xs font-bold tracking-[.14em] text-brand-sand">{labels[key]}</p><p className="mt-2 text-sm leading-relaxed text-white/85">{value}</p></div>)}</aside>}</div></header><div className="mt-12 grid gap-5 md:grid-cols-2">{sections.map(([key, value], index) => <section key={key} className={`rounded-[1.75rem] p-6 shadow-sm sm:p-7 ${index % 4 === 1 ? 'bg-brand-cream' : index % 4 === 2 ? 'bg-brand-sand/25' : index % 4 === 3 ? 'bg-brand-teal/5' : 'border border-brand-line bg-white'}`}><p className="section-kicker">{String(index + 1).padStart(2, '0')}</p><h2 className="display-font mt-3 text-2xl text-brand-ink">{labels[key]}</h2><p className="mt-4 leading-relaxed text-brand-subtle">{value}</p></section>)}</div>{fields.faqs && <section className="mt-12 rounded-[2rem] border border-brand-line bg-white p-7 sm:p-9"><p className="section-kicker">{labels.faqs}</p><h2 className="display-font mt-3 text-3xl text-brand-ink">{faq}</h2><details className="mt-6 rounded-2xl bg-brand-cream p-5" open><summary className="cursor-pointer font-semibold text-brand-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal">{faq}</summary><p className="mt-4 max-w-4xl leading-relaxed text-brand-subtle">{fields.faqs}</p></details></section>}{family === 'personality' && <PersonalityComparisonDirectory locale={locale} type={page.id.slice('personality:'.length)} />}{family === 'compare' && <RelatedComparisonLinks locale={locale} pair={page.id} />}{fields.ctas && <section className="mt-12 rounded-[2rem] bg-brand-teal p-8 text-white sm:p-10"><p className="section-kicker text-brand-sand">KalQLater</p><h2 className="display-font mt-3 text-3xl">{isUnsupportedInsight ? unavailableCopy : fields.ctas}</h2>{isUnsupportedInsight ? <Link href={localePath(locale, 'personality/intj')} className="button-light mt-6">{alternativeCta}<span aria-hidden="true">→</span></Link> : <Link href={localePath(locale, ctaPath)} className="button-light mt-6">{fields.ctas}<span aria-hidden="true">→</span></Link>}</section>}</main></>;
}
