import React, { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowRight, Copy, HeartHandshake, Lightbulb, MessageCircle, Repeat2, Share2, ShieldAlert, Sparkles, Users } from 'lucide-react';
import { TYPES } from '../data/types';
import { getRelationshipIntelligence } from '../data/insights/comparison';
import { useLang } from '../context/LangContext';
import TypeSelector from '../components/compare/TypeSelector';
import ComparisonHero from '../components/compare/ComparisonHero';
import ComparisonSection from '../components/compare/ComparisonSection';
import ComparisonSeo from '../components/ComparisonSeo';

const copy = {
  en: { title: 'Relationship Intelligence', sub: 'A practical read on the patterns two personalities create together—where energy flows, where misunderstandings begin, and what helps the connection thrive.', first: 'First type', second: 'Second type', swap: 'Swap types', copied: 'Link copied', copy: 'Copy comparison link', whatsapp: 'Share on WhatsApp', back: 'Back to My Result', invalid: 'An invalid or identical selection was reset to the default comparison.', flow: 'The relationship flow', strength: 'Biggest Strength Together', conflict: 'Biggest Source of Conflict', communication: 'Communication Guide', decisions: 'Decision Making', pressure: 'Under Pressure', business: 'Business Partnership', romance: 'Romantic Dynamic', friendship: 'Friendship', growth: 'Growth Opportunities', related: 'Related Comparisons', attraction: 'Natural pull', friction: 'Likely friction', practice: 'Shared practice', practical: 'Practical advice', chemistry: 'Chemistry', trust: 'Trust', longTerm: 'Long-term', labels: 'Interpretive relationship labels—not scientific scores.' },
  hi: { title: 'रिलेशनशिप इंटेलिजेंस', sub: 'दो व्यक्तित्वों के साथ आने पर बनने वाले पैटर्न का व्यावहारिक पाठ—ऊर्जा कहाँ बहती है, गलतफ़हमी कहाँ शुरू होती है और रिश्ते को क्या मज़बूत बनाता है।', first: 'पहला प्रकार', second: 'दूसरा प्रकार', swap: 'बदलें', copied: 'लिंक कॉपी हुआ', copy: 'तुलना लिंक कॉपी करें', whatsapp: 'WhatsApp पर शेयर करें', back: 'मेरे परिणाम पर वापस', invalid: 'अमान्य या समान चयन को डिफ़ॉल्ट तुलना से बदल दिया गया है।', flow: 'रिश्ते की धारा', strength: 'साथ की सबसे बड़ी ताक़त', conflict: 'टकराव का सबसे बड़ा स्रोत', communication: 'संवाद मार्गदर्शिका', decisions: 'निर्णय लेना', pressure: 'दबाव में', business: 'बिज़नेस पार्टनरशिप', romance: 'रोमांटिक डायनामिक', friendship: 'दोस्ती', growth: 'विकास के अवसर', related: 'मिलती-जुलती तुलनाएँ', attraction: 'स्वाभाविक खिंचाव', friction: 'संभावित तनाव', practice: 'साझा अभ्यास', practical: 'व्यावहारिक सलाह', chemistry: 'रसायन', trust: 'भरोसा', longTerm: 'लंबे समय में', labels: 'ये व्याख्यात्मक संबंध लेबल हैं—वैज्ञानिक स्कोर नहीं।' },
};

function FlowNode({ icon: Icon, title, text, tone }) {
  return <div className={`rounded-2xl border p-5 ${tone}`}><Icon size={19} aria-hidden="true" /><p className="mt-4 text-sm font-semibold text-brand-ink">{title}</p><p className="mt-2 text-sm leading-relaxed text-brand-subtle">{text}</p></div>;
}

export default function Compare() {
  const { lang } = useLang();
  const { pair } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const legacyOne = params.get('type1')?.toUpperCase();
  const legacyTwo = params.get('type2')?.toUpperCase();
  const match = pair?.match(/^([a-z]{4})-vs-([a-z]{4})$/i);
  const parsedOne = match?.[1]?.toUpperCase();
  const parsedTwo = match?.[2]?.toUpperCase();
  const one = pair ? parsedOne : (TYPES[legacyOne] ? legacyOne : 'INTJ');
  const two = pair ? parsedTwo : (TYPES[legacyTwo] && legacyTwo !== one ? legacyTwo : 'ENFP');
  const invalid = !TYPES[one] || !TYPES[two] || one === two;
  const labels = copy[lang] || copy.en;
  const canonicalPath = `/compare/${String(one).toLowerCase()}-vs-${String(two).toLowerCase()}`;
  const insight = useMemo(() => getRelationshipIntelligence(one, two, lang), [one, two, lang]);
  const setTypes = (first, second) => navigate(`/compare/${first.toLowerCase()}-vs-${second.toLowerCase()}`);
  const shareUrl = typeof window === 'undefined' ? '' : window.location.href;
  const copyLink = async () => { try { await navigator.clipboard?.writeText(shareUrl); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); } };
  const related = useMemo(() => {
    const candidates = Object.keys(TYPES).filter((type) => type !== one && type !== two).slice(0, 3);
    return [
      ...candidates.map((type) => [one, type]),
      ...candidates.slice(0, 2).map((type) => [type, two]),
    ];
  }, [one, two]);

  if (!pair || invalid || pair !== `${String(one).toLowerCase()}-vs-${String(two).toLowerCase()}`) return <Navigate to={invalid ? '/compare/intj-vs-enfp' : canonicalPath} replace />;
  const firstInfo = lang === 'hi' ? TYPES[one].hi : TYPES[one].en;
  const secondInfo = lang === 'hi' ? TYPES[two].hi : TYPES[two].en;

  return <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
    <ComparisonSeo first={one} second={two} firstName={firstInfo.nickname} secondName={secondInfo.nickname} insight={insight} lang={lang} />
    <header className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[.24em] text-brand-teal">KalQLater · Pair Lens</p>
      <h1 className="mt-3 text-4xl font-display text-brand-ink sm:text-5xl">{labels.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-brand-subtle">{labels.sub}</p>
    </header>

    <section aria-label="Choose personalities" className="mt-8 grid gap-4 rounded-3xl border border-brand-line bg-brand-cream/60 p-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
      <TypeSelector label={labels.first} value={one} onChange={(value) => setTypes(value, value === two ? one : two)} lang={lang} />
      <TypeSelector label={labels.second} value={two} onChange={(value) => setTypes(value === one ? two : one, value)} lang={lang} />
      <button type="button" onClick={() => setTypes(two, one)} className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-ink px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-2"><Repeat2 size={16} aria-hidden="true" />{labels.swap}</button>
    </section>

    <div className="mt-8"><ComparisonHero first={TYPES[one]} second={TYPES[two]} insight={insight} lang={lang} /></div>
    <p className="mt-3 text-center text-xs text-brand-subtle">{labels.labels}</p>

    <div className="mt-5 grid gap-5">
      <ComparisonSection title={labels.flow} index={0} tone="dark"><div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center"><FlowNode icon={Sparkles} title={labels.attraction} text={insight.attraction} tone="border-brand-sand/20 bg-white/95" /><ArrowRight className="mx-auto hidden text-brand-sand md:block" aria-hidden="true" /><FlowNode icon={ShieldAlert} title={labels.friction} text={insight.conflict} tone="border-brand-sand/20 bg-white/95" /><ArrowRight className="mx-auto hidden text-brand-sand md:block" aria-hidden="true" /><FlowNode icon={Lightbulb} title={labels.practice} text={insight.advice} tone="border-brand-sand/20 bg-white/95" /></div></ComparisonSection>

      <div className="grid gap-5 lg:grid-cols-2">
        <ComparisonSection title={labels.strength} index={1}><p>{insight.attraction}</p><div className="mt-5 rounded-2xl bg-brand-cream p-4 text-sm"><span className="font-semibold text-brand-ink">{one} + {two}</span><span className="text-brand-subtle"> · {insight.label}</span></div></ComparisonSection>
        <ComparisonSection title={labels.conflict} index={2}><p>{insight.conflict}</p><div className="mt-5 rounded-2xl border border-brand-line bg-brand-cream/60 p-4 text-sm"><span className="font-semibold text-brand-ink">{labels.practical}: </span>{insight.advice}</div></ComparisonSection>
      </div>

      <ComparisonSection title={labels.communication} index={3}><div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl bg-brand-cream p-5"><MessageCircle size={20} className="text-brand-teal" aria-hidden="true" /><p className="mt-4 font-semibold text-brand-ink">{one} → {two}</p><p className="mt-2 text-sm">{insight.communicationA}</p></div><div className="rounded-2xl border border-brand-line p-5"><MessageCircle size={20} className="text-brand-plum" aria-hidden="true" /><p className="mt-4 font-semibold text-brand-ink">{two} → {one}</p><p className="mt-2 text-sm">{insight.communicationB}</p></div></div></ComparisonSection>

      <ComparisonSection title={labels.decisions} index={4}><div className="grid gap-4 md:grid-cols-3 md:items-stretch"><div className="rounded-2xl bg-brand-cream p-5"><p className="font-semibold text-brand-ink">{one}</p><p className="mt-2 text-sm">{insight.decisionA}</p></div><div className="rounded-2xl border border-dashed border-brand-teal/40 p-5 text-sm"><p className="font-semibold text-brand-ink">{labels.practice}</p><p className="mt-2">{insight.decisions}</p></div><div className="rounded-2xl bg-brand-cream p-5"><p className="font-semibold text-brand-ink">{two}</p><p className="mt-2 text-sm">{insight.decisionB}</p></div></div></ComparisonSection>

      <ComparisonSection title={labels.pressure} index={5}><p>{insight.pressure}</p><div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-brand-cream px-4 py-2 text-sm text-brand-ink">{one}: {lang === 'hi' ? 'विराम और स्पष्टता' : 'space and clarity'}</span><span className="rounded-full bg-brand-cream px-4 py-2 text-sm text-brand-ink">{two}: {lang === 'hi' ? 'छोटा अगला कदम' : 'one small next step'}</span></div></ComparisonSection>

      <ComparisonSection title={labels.business} index={6}><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(insight.business).map(([key, value]) => <div key={key} className="flex items-center justify-between rounded-2xl border border-brand-line bg-brand-cream/50 px-4 py-4"><span className="text-sm font-medium text-brand-ink">{insight.businessLabels[key]}</span><span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-teal">{value}</span></div>)}</div></ComparisonSection>

      <ComparisonSection title={labels.romance} index={7}><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[[labels.chemistry, insight.romantic.chemistry], [labels.trust, insight.romantic.trust], [labels.conflict, insight.romantic.conflict], [labels.longTerm, insight.romantic.longTerm], [labels.communication, insight.romantic.communication]].map(([title, text]) => <div key={title} className="rounded-2xl bg-brand-cream p-5"><p className="font-semibold text-brand-ink">{title}</p><p className="mt-2 text-sm">{text}</p></div>)}</div></ComparisonSection>

      <div className="grid gap-5 lg:grid-cols-2"><ComparisonSection title={labels.friendship} index={8}><Users size={20} className="text-brand-teal" aria-hidden="true" /><p className="mt-4">{insight.friendship}</p></ComparisonSection><ComparisonSection title={labels.growth} index={9}><Lightbulb size={20} className="text-brand-plum" aria-hidden="true" /><p className="mt-4">{insight.growth}</p></ComparisonSection></div>
    </div>

    <section className="mt-8 rounded-[1.75rem] border border-brand-line bg-brand-cream/50 p-6 sm:p-8"><p className="text-xs font-semibold uppercase tracking-[.22em] text-brand-teal">KalQLater · Pair Lens</p><h2 className="mt-2 text-2xl font-display text-brand-ink">{labels.related}</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{related.map(([first, second]) => <Link key={`${first}-${second}`} to={`/compare/${first.toLowerCase()}-vs-${second.toLowerCase()}`} className="group rounded-2xl border border-brand-line bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand-teal hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-teal"><p className="font-semibold text-brand-ink">{first} <span className="text-brand-teal">vs</span> {second}</p><p className="mt-1 text-sm text-brand-subtle">{(lang === 'hi' ? TYPES[first].hi : TYPES[first].en).nickname} × {(lang === 'hi' ? TYPES[second].hi : TYPES[second].en).nickname}</p></Link>)}</div></section>
    <div className="mt-8 flex flex-wrap gap-3" aria-label="Share comparison"><button type="button" onClick={copyLink} className="inline-flex items-center gap-2 rounded-full border border-brand-line bg-white px-5 py-3 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-md"><Copy size={16} aria-hidden="true" />{copied ? labels.copied : labels.copy}</button><a href={`https://wa.me/?text=${encodeURIComponent(`${one} × ${two} — KalQLater ${shareUrl}`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-brand-teal px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-md"><Share2 size={16} aria-hidden="true" />{labels.whatsapp}</a><Link to="/result/local" className="inline-flex items-center gap-2 rounded-full bg-brand-cream px-5 py-3 text-sm font-medium text-brand-ink transition hover:-translate-y-0.5"><HeartHandshake size={16} aria-hidden="true" />{labels.back}</Link></div>
  </main>;
}
