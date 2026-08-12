import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '../../../../components/JsonLd';
import { leadershipCopyFor } from '../../../../data/leadership-insights';
import { breadcrumbJsonLd, pageMetadata } from '../../../../lib/metadata';
import { isLocale, localePath } from '../../../../lib/site';

export const dynamicParams = false;
export function generateStaticParams() { return ['en', 'hi'].map((locale) => ({ locale })); }

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const hi = locale === 'hi';
  return pageMetadata({
    locale,
    path: 'insights/leadership',
    title: hi ? 'लीडरशिप इनसाइट्स: नेतृत्व के तरीके पर विचार करें' : 'Leadership Insights: Reflect on Leadership in Practice',
    description: hi ? 'दिशा, साझा जिम्मेदारी, फीडबैक और जवाबदेही के अपने व्यवहारिक पैटर्न पर विचार करें।' : 'Reflect on how you create direction, share ownership, give feedback, and repair impact.',
  });
}

export default async function LeadershipLandingPage({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = leadershipCopyFor(locale);
  const hi = locale === 'hi';
  const startHref = localePath(locale, 'insights/leadership/start');
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faq.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })),
  };
  return <><JsonLd data={{ '@context': 'https://schema.org', '@graph': [breadcrumbJsonLd(locale, [{ name: 'KalQLater' }, { name: 'Insights', path: 'insights' }, { name: c.title, path: 'insights/leadership' }]), faq] }} /><main className="overflow-hidden">
    <section className="hero-shell relative"><div aria-hidden="true" className="hero-blob hero-blob-teal" /><div aria-hidden="true" className="hero-blob hero-blob-saffron" /><div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24"><div><nav aria-label="Breadcrumb" className="text-sm text-brand-subtle"><Link href={localePath(locale)}>KalQLater</Link><span aria-hidden="true"> / </span><Link href={localePath(locale, 'insights')}>Insights</Link><span aria-hidden="true"> / </span>{c.title}</nav><p className="eyebrow-pill mt-7">✦ {c.eyebrow}</p><h1 className="display-font mt-6 max-w-2xl text-5xl leading-[.98] text-brand-ink sm:text-6xl">{hi ? 'नेतृत्व को व्यवहार में देखें।' : 'See leadership in practice.'}</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-subtle">{c.promise}</p><Link className="button-primary mt-8" href={startHref}>{c.start}<span aria-hidden="true">→</span></Link><p className="mt-6 text-sm leading-relaxed text-brand-subtle">{hi ? 'कोई स्कोर, रैंकिंग या नेतृत्व-क्षमता का फैसला नहीं।' : 'No score, ranking, or verdict on leadership ability.'}</p></div><aside className="rounded-[2rem] border border-brand-line bg-white p-7 shadow-[0_16px_40px_rgba(45,40,37,.06)]"><p className="section-kicker">{hi ? 'एक नज़र में' : 'At a glance'}</p><div className="mt-6 space-y-3">{c.dimensions.slice(0, 4).map(([id, name], index) => <div key={id} className="rounded-2xl bg-brand-cream p-4"><b className="text-brand-teal">0{index + 1}</b><p className="mt-1 text-brand-ink">{name}</p></div>)}</div></aside></div></section>
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]"><div><p className="section-kicker">{hi ? 'यह चिंतन क्या देखता है' : 'What this reflection explores'}</p><h2 className="display-font mt-3 text-4xl text-brand-ink">{hi ? 'रोज़मर्रा की साझा जिम्मेदारी में आपके चुनाव' : 'Your choices in shared responsibility'}</h2><p className="mt-5 max-w-xl leading-relaxed text-brand-subtle">{hi ? 'यह आत्मचिंतन दिशा तय करने, जिम्मेदारी बांटने, फीडबैक देने और असर सुधारने वाली वास्तविक कार्य-स्थितियों में आपके चुने तरीकों पर ध्यान देता है।' : 'This reflection focuses on the choices you make in real work situations involving direction, shared ownership, feedback, and repairing impact.'}</p></div><div className="grid gap-4 sm:grid-cols-2">{c.dimensions.map(([id, name]) => <article key={id} className="rounded-2xl border border-brand-line bg-white p-5"><h3 className="display-font text-2xl text-brand-ink">{name}</h3><p className="mt-3 text-sm leading-relaxed text-brand-subtle">{hi ? 'एक व्यवहारिक संकेत—बेहतर या खराब शैली का लेबल नहीं।' : 'A behavioural signal, not a label for a better or worse style.'}</p></article>)}</div></div></section>
    <section className="dimension-section"><div className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8"><article className="rounded-[2rem] bg-brand-ink p-7 text-white"><p className="section-kicker text-brand-sand">01</p><h2 className="display-font mt-3 text-3xl">{hi ? 'वास्तविक स्थितियाँ' : 'Real situations'}</h2><p className="mt-4 leading-relaxed text-white/80">{hi ? 'बारह कार्य-स्थितियों में वही उत्तर चुनें जो आप सामान्यतः देते हैं।' : 'Choose what you would usually do across twelve work situations.'}</p></article><article className="rounded-[2rem] border border-brand-line bg-white p-7"><p className="section-kicker">02</p><h2 className="display-font mt-3 text-3xl text-brand-ink">{hi ? 'आपके चुने क्षण' : 'Your chosen moments'}</h2><p className="mt-4 leading-relaxed text-brand-subtle">{hi ? 'परिणाम आपके चुने उत्तरों के उदाहरण दिखाता है, आंतरिक स्कोर या वेट नहीं।' : 'Your result shows examples from your selected responses, not internal scores or weights.'}</p></article><article className="rounded-[2rem] border border-brand-line bg-white p-7"><p className="section-kicker">03</p><h2 className="display-font mt-3 text-3xl text-brand-ink">{hi ? 'एक छोटा प्रयोग' : 'One small experiment'}</h2><p className="mt-4 leading-relaxed text-brand-subtle">{hi ? 'आपको तीन व्यावहारिक आदतें और इस सप्ताह आज़माने के लिए एक केंद्रित प्रयोग मिलता है।' : 'You receive three practical habits and one focused experiment to try this week.'}</p></article></div></section>
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><div className="rounded-[2rem] border border-brand-line bg-white p-7 sm:p-10"><p className="section-kicker">{hi ? 'सवाल' : 'Questions'}</p><h2 className="display-font mt-3 text-4xl text-brand-ink">{hi ? 'शुरू करने से पहले' : 'Before you begin'}</h2><div className="mt-7 grid gap-3 lg:grid-cols-2">{c.faq.map(([question, answer]) => <details key={question} className="rounded-2xl bg-brand-cream p-5"><summary className="cursor-pointer font-semibold text-brand-ink">{question}</summary><p className="mt-3 leading-relaxed text-brand-subtle">{answer}</p></details>)}</div><Link className="button-primary mt-8" href={startHref}>{c.start}<span aria-hidden="true">→</span></Link></div></section>
  </main></>;
}
