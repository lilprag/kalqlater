import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { JsonLd } from '../../../../components/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '../../../../lib/metadata';
import { isLocale, localePath, productionAppUrl } from '../../../../lib/site';
import { allPairs, comparisonProfile, parsePair } from '../../../../lib/comparisons';
import { personalityProfile } from '../../../../lib/personality';

export function generateStaticParams() { return ['en', 'hi'].flatMap((locale) => allPairs().map((pair) => ({ locale, pair: pair.slug }))); }
export const dynamicParams = false;

export async function generateMetadata({ params }) { const { locale, pair } = await params; const parsed = parsePair(pair); if (!isLocale(locale) || !parsed) return {}; const first = personalityProfile(parsed.canonical[0], locale); const second = personalityProfile(parsed.canonical[1], locale); return pageMetadata({ locale, path: `compare/${parsed.slug}`, title: `${first.code} vs ${second.code}: ${locale === 'hi' ? 'रिलेशनशिप इंटेलिजेंस' : 'Relationship Intelligence'}`, description: locale === 'hi' ? `${first.displayName} और ${second.displayName} संवाद, निर्णय और सहयोग में कैसे अलग या पूरक हो सकते हैं।` : `Explore how ${first.displayName} and ${second.displayName} may differ or complement one another in communication, decisions, and collaboration.` }); }

export default async function ComparisonPage({ params }) {
  const { locale, pair } = await params;
  if (!isLocale(locale)) notFound();
  const parsed = parsePair(pair);
  if (!parsed) notFound();
  if (!parsed.isCanonical) permanentRedirect(localePath(locale, `compare/${parsed.slug}`));
  const [firstCode, secondCode] = parsed.canonical;
  const first = personalityProfile(firstCode, locale);
  const second = personalityProfile(secondCode, locale);
  const insight = comparisonProfile(firstCode, secondCode, locale);
  const hi = locale === 'hi';
  const labels = hi ? { strength: 'साथ में ताकत', differences: 'मुख्य अंतर', communication: 'संवाद', decisions: 'निर्णय लेना', conflict: 'मतभेद की संभावना', work: 'काम और सहयोग', friendship: 'दोस्ती', romance: 'रिश्ते के विचार', growth: 'विकास के अवसर', tips: 'व्यावहारिक सुझाव', related: 'संबंधित तुलनाएँ', test: 'व्यक्तित्व टेस्ट दें', note: 'ये अंतर्दृष्टियाँ आत्मचिंतन के लिए हैं, निश्चित संगतता का दावा नहीं।' } : { strength: 'Strength together', differences: 'Key differences', communication: 'Communication', decisions: 'Decision-making', conflict: 'Possible friction', work: 'Work and collaboration', friendship: 'Friendship', romance: 'Romantic relationship considerations', growth: 'Growth opportunities', tips: 'Practical tips', related: 'Related comparisons', test: 'Take the personality test', note: 'These insights support reflection; they do not claim certain compatibility.' };
  const sections = [[labels.strength, insight.attraction], [labels.differences, `${first.code}: ${first.shortSummary} ${second.code}: ${second.shortSummary}`], [labels.communication, insight.communication], [labels.decisions, `${insight.decisionA} ${insight.decisionB} ${insight.decisions}`], [labels.conflict, insight.conflict], [labels.work, insight.advice], [labels.friendship, insight.friendship], [labels.romance, insight.romantic.longTerm], [labels.growth, insight.growth], [labels.tips, insight.advice]];
  const related = allPairs().filter((item) => item.slug !== parsed.slug && (item.first === firstCode || item.second === firstCode || item.first === secondCode || item.second === secondCode)).slice(0, 3);
  const jsonLd = breadcrumbJsonLd(locale, [{ name: 'KalQLater' }, { name: hi ? 'तुलना' : 'Compare', path: 'compare' }, { name: `${firstCode} vs ${secondCode}`, path: `compare/${parsed.slug}` }]);
  return <><JsonLd data={jsonLd} /><article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
    <header className="relative overflow-hidden rounded-[2rem] bg-brand-ink p-7 text-white shadow-[0_24px_70px_rgba(45,40,37,.2)] sm:p-10"><span className="absolute -right-12 -top-16 h-64 w-64 rounded-full bg-brand-teal/35 blur-3xl" aria-hidden="true" /><span className="absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-brand-plum/35 blur-3xl" aria-hidden="true" /><div className="relative"><p className="section-kicker text-brand-sand">{hi ? 'रिलेशनशिप इंटेलिजेंस' : 'Relationship Intelligence'}</p><h1 className="display-font mt-4 text-4xl sm:text-5xl">{first.code} <span className="text-brand-sand">vs</span> {second.code}</h1><div className="mt-6 grid items-center gap-5 md:grid-cols-[1fr_auto_1fr]"><div><p className="text-xs font-semibold tracking-[.2em] text-brand-sand">{first.code}</p><p className="display-font mt-2 text-3xl sm:text-4xl">{first.displayName}</p></div><div className="mx-auto flex items-center gap-3" aria-hidden="true"><i className="h-3 w-3 rounded-full bg-brand-saffron shadow-[0_0_18px_#E87A5D]" /><span className="h-px w-14 bg-white/35" /><i className="h-3 w-3 rounded-full bg-brand-teal shadow-[0_0_18px_#1F6C7D]" /></div><div className="md:text-right"><p className="text-xs font-semibold tracking-[.2em] text-brand-sand">{second.code}</p><p className="display-font mt-2 text-3xl sm:text-4xl">{second.displayName}</p></div></div><p className="mt-8 inline-flex rounded-full border border-brand-sand/30 bg-brand-sand/10 px-4 py-2 text-sm text-brand-sand">{insight.label}</p><p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/75">{insight.attraction}</p><p className="mt-6 max-w-3xl rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-relaxed text-white/80">{labels.note}</p></div></header>
    <div className="mt-8 grid gap-5 md:grid-cols-2">{sections.map(([title, body], index) => <section key={title} className={`content-card rounded-[1.75rem] border p-6 sm:p-7 ${index === 0 ? 'border-brand-teal/30 bg-brand-teal/5' : index === 4 ? 'border-brand-saffron/30 bg-brand-saffron/5' : 'border-brand-line bg-white'}`}><p className="section-kicker">{hi ? 'जोड़ी की समझ' : 'Pair insight'}</p><h2 className="display-font mt-2 text-2xl text-brand-ink">{title}</h2><p className="mt-4 leading-relaxed text-brand-subtle">{body}</p></section>)}</div>
    <section className="mt-10"><p className="section-kicker">{labels.related}</p><h2 className="display-font mt-2 text-3xl">{hi ? 'आगे क्या देखें' : 'Explore another dynamic'}</h2><div className="mt-5 flex flex-wrap gap-3">{related.map((item) => <Link key={item.slug} href={localePath(locale, `compare/${item.slug}`)} className="button-secondary min-h-0 px-4 py-2">{item.first} vs {item.second}</Link>)}</div></section>
    <div className="mt-10 flex flex-wrap gap-3"><Link href={localePath(locale, `personality/${first.slug}`)} className="button-secondary">{first.code}</Link><Link href={localePath(locale, `personality/${second.slug}`)} className="button-secondary">{second.code}</Link><a href={productionAppUrl('/test')} className="button-primary">{labels.test}<span aria-hidden="true">→</span></a></div>
  </article></>;
}
