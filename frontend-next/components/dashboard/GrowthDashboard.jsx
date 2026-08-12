'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AuthStatusProvider, useAuthStatus } from '../AuthStatus';
import { productionAppUrl } from '../../lib/site';
import { FUTURE_INSIGHTS, INSIGHT_AVAILABILITY, loadGrowthDashboard, nextDashboardRecommendation } from '../../lib/growth-dashboard';

const copy = {
  en: {
    welcome: 'Welcome back', title: 'Your Behaviour Intelligence Dashboard', body: 'A private home for the reflections you have completed. Each insight stays independent—there is no overall score or ranking.',
    completed: 'Completed Insights', view: 'View result', guide: 'View guide', retake: 'Retake', coming: 'Coming Soon', weekly: 'Weekly Growth', experiment: 'Current Weekly Experiment', none: 'No current experiment yet.',
    experiments: 'Completed experiments', streak: 'Current streak', notTracking: 'Not tracking yet', growth: 'View Growth', timeline: 'Journey Timeline', timelineEmpty: 'Complete an Insight to begin a dated journey timeline.',
    progress: 'Insights Progress', journal: 'Growth Journal', bookmarks: 'Bookmarks', community: 'Discuss your Insights', communityText: 'Bring a reflection into a thoughtful conversation when you are ready.',
    startPersonality: 'Take the personality test', startCommunication: 'Explore Communication Insights', startConflict: 'Explore Conflict Insights', startLeadership: 'Explore Leadership Insights', startLearning: 'Explore Learning Insights', startCommunity: 'Explore Community',
    login: 'Redirecting you to login…', loading: 'Loading your private dashboard…', browserNote: 'Phase 1 shows completed Insight results available in this browser. Account-wide history will arrive with result claiming.',
    personality: 'Personality', communication: 'Communication', conflict: 'Conflict', leadership: 'Leadership', learning: 'Learning',
    completedLabel: 'Completed', available: 'Available in this browser', notYet: 'Not completed yet', version: 'Version', dateUnknown: 'Completion date unavailable', next: 'Suggested next step',
  },
  hi: {
    welcome: 'वापस स्वागत है', title: 'आपका बिहेवियर इंटेलिजेंस डैशबोर्ड', body: 'आपके पूरे किए गए आत्मचिंतन का निजी स्थान। हर इनसाइट स्वतंत्र रहती है—कोई कुल स्कोर या रैंकिंग नहीं है।',
    completed: 'पूरे किए गए इनसाइट्स', view: 'परिणाम देखें', guide: 'गाइड देखें', retake: 'फिर से करें', coming: 'जल्द आ रहा है', weekly: 'साप्ताहिक विकास', experiment: 'वर्तमान साप्ताहिक प्रयोग', none: 'अभी कोई साप्ताहिक प्रयोग नहीं है।',
    experiments: 'पूरे किए गए प्रयोग', streak: 'वर्तमान स्ट्रीक', notTracking: 'अभी ट्रैकिंग नहीं', growth: 'विकास देखें', timeline: 'जर्नी टाइमलाइन', timelineEmpty: 'तारीख वाली जर्नी टाइमलाइन शुरू करने के लिए एक इनसाइट पूरा करें।',
    progress: 'इनसाइट्स प्रगति', journal: 'ग्रोथ जर्नल', bookmarks: 'बुकमार्क्स', community: 'अपने इनसाइट्स पर बात करें', communityText: 'जब तैयार हों, अपने आत्मचिंतन को एक विचारशील बातचीत में लाएं।',
    startPersonality: 'पर्सनैलिटी टेस्ट दें', startCommunication: 'कम्युनिकेशन इनसाइट्स देखें', startConflict: 'कन्फ्लिक्ट इनसाइट्स देखें', startLeadership: 'लीडरशिप इनसाइट्स देखें', startLearning: 'लर्निंग इनसाइट्स देखें', startCommunity: 'कम्युनिटी देखें',
    login: 'आपको लॉगिन पर ले जा रहे हैं…', loading: 'आपका निजी डैशबोर्ड लोड हो रहा है…', browserNote: 'Phase 1 इस ब्राउज़र में उपलब्ध पूरे हुए Insight परिणाम दिखाता है। अकाउंट-स्तरीय इतिहास result claiming के साथ आएगा।',
    personality: 'पर्सनैलिटी', communication: 'कम्युनिकेशन', conflict: 'कन्फ्लिक्ट', leadership: 'लीडरशिप', learning: 'लर्निंग',
    completedLabel: 'पूरा हुआ', available: 'इस ब्राउज़र में उपलब्ध', notYet: 'अभी पूरा नहीं हुआ', version: 'वर्ज़न', dateUnknown: 'पूरे होने की तारीख उपलब्ध नहीं', next: 'अगला सुझाव',
  },
};

const icon = { personality: '◌', communication: '↗', conflict: '≈', leadership: '✦', learning: '○' };

export function DashboardAccess({ locale }) {
  return <AuthStatusProvider locale={locale}><DashboardGate locale={locale} /></AuthStatusProvider>;
}

function DashboardGate({ locale }) {
  const { status } = useAuthStatus();
  const c = copy[locale];
  useEffect(() => {
    if (status === 'guest') window.location.assign(productionAppUrl('/login'));
  }, [status]);
  if (status !== 'authenticated') return <PrivateNotice title={c.title} text={status === 'guest' ? c.login : c.loading} />;
  return <GrowthDashboard locale={locale} />;
}

function GrowthDashboard({ locale }) {
  const c = copy[locale];
  const [state, setState] = useState({ status: 'loading', data: null });
  useEffect(() => {
    let active = true;
    loadGrowthDashboard(locale).then((data) => { if (active) setState({ status: 'ready', data }); }).catch(() => { if (active) setState({ status: 'ready', data: { completed: [], dated: [], currentExperiment: null } }); });
    return () => { active = false; };
  }, [locale]);
  if (state.status !== 'ready') return <PrivateNotice title={c.title} text={c.loading} />;

  const completed = state.data.completed;
  const byType = Object.fromEntries(completed.map((item) => [item.type, item]));
  const weeklyExperiment = localizedWeeklyExperiment(state.data.currentExperiment, locale);
  const recommendation = nextDashboardRecommendation(completed.map((item) => item.type));
  const recommendationHref = recommendation === 'personality' ? productionAppUrl('/test') : recommendation === 'communication' ? `/${locale}/insights/communication` : recommendation === 'conflict' ? `/${locale}/insights/conflict` : recommendation === 'leadership' ? `/${locale}/insights/leadership` : recommendation === 'learning' ? `/${locale}/insights/learning` : `/${locale}/community`;
  const recommendationText = recommendation === 'personality' ? c.startPersonality : recommendation === 'communication' ? c.startCommunication : recommendation === 'conflict' ? c.startConflict : recommendation === 'leadership' ? c.startLeadership : recommendation === 'learning' ? c.startLearning : c.startCommunity;

  return <main className="overflow-hidden"><section className="hero-shell relative"><div aria-hidden="true" className="hero-blob hero-blob-teal" /><div aria-hidden="true" className="hero-blob hero-blob-saffron" /><div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"><p className="eyebrow-pill"><span aria-hidden="true">✦</span>{c.welcome}</p><h1 className="display-font mt-6 max-w-4xl text-5xl leading-[.98] tracking-tight text-brand-ink sm:text-6xl">{c.title}</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-subtle">{c.body}</p><Link href={recommendationHref} className="button-primary mt-8">{recommendationText}<span aria-hidden="true">→</span></Link></div></section>
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><SectionTitle eyebrow="01" title={c.completed} /><div className="mt-7 grid gap-5 lg:grid-cols-2">{['personality', 'communication', 'conflict', 'leadership', 'learning'].map((type) => <InsightCard key={type} item={byType[type]} type={type} available={INSIGHT_AVAILABILITY[type].available} c={c} locale={locale} />)}</div><div className="mt-5 grid gap-4 sm:grid-cols-2">{FUTURE_INSIGHTS.map((type) => <article key={type} className="rounded-[1.75rem] border border-dashed border-brand-line bg-brand-cream/60 p-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-brand-teal">{c.coming}</p><h3 className="display-font mt-3 text-2xl text-brand-ink">{icon[type]} {c[type]}</h3></article>)}</div></section>
    <section className="dimension-section"><div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8"><article className="rounded-[2rem] bg-brand-ink p-7 text-white sm:p-9"><p className="section-kicker text-brand-sand">{c.weekly}</p><h2 className="display-font mt-3 text-3xl">{c.experiment}</h2>{weeklyExperiment ? <><h3 className="mt-6 text-xl font-semibold">{weeklyExperiment.title}</h3><p className="mt-3 leading-relaxed text-white/80">{weeklyExperiment.instruction}</p></> : <p className="mt-6 leading-relaxed text-white/75">{c.none}</p>}<dl className="mt-8 grid grid-cols-2 gap-3"><Stat label={c.experiments} value="—" /><Stat label={c.streak} value={c.notTracking} /></dl><button type="button" disabled className="button-light mt-7 cursor-not-allowed opacity-70">{c.growth}</button></article><article className="rounded-[2rem] border border-brand-line bg-white p-7 sm:p-9"><p className="section-kicker">{c.timeline}</p><h2 className="display-font mt-3 text-3xl text-brand-ink">{c.welcome}</h2>{state.data.dated.length ? <ol className="mt-7 space-y-5 border-l border-brand-line pl-6">{state.data.dated.map((item) => <li key={item.id} className="relative"><span aria-hidden="true" className="absolute -left-[1.93rem] top-1 h-3 w-3 rounded-full bg-brand-teal ring-4 ring-brand-bg" /><p className="text-sm font-semibold text-brand-ink">{item.title} · {c.completedLabel}</p><p className="mt-1 text-sm text-brand-subtle">{new Intl.DateTimeFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { dateStyle: 'medium' }).format(new Date(item.completedAt))}</p></li>)}</ol> : <p className="mt-7 rounded-2xl bg-brand-cream p-5 leading-relaxed text-brand-subtle">{c.timelineEmpty}</p>}</article></div></section>
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8"><article className="rounded-[2rem] border border-brand-line bg-white p-7 lg:col-span-2"><p className="section-kicker">{c.progress}</p><h2 className="display-font mt-3 text-3xl text-brand-ink">{c.next}</h2><div className="mt-7 grid gap-3 sm:grid-cols-2">{['personality', 'communication', 'conflict', 'leadership', 'learning', ...FUTURE_INSIGHTS].map((type) => <ProgressItem key={type} complete={INSIGHT_AVAILABILITY[type]?.available && Boolean(byType[type])} label={c[type]} c={c} />)}</div><p className="mt-6 text-sm leading-relaxed text-brand-subtle">{c.browserNote}</p></article><article className="rounded-[2rem] bg-brand-sand/30 p-7"><p className="section-kicker">{c.community}</p><h2 className="display-font mt-3 text-3xl text-brand-ink">{c.community}</h2><p className="mt-4 leading-relaxed text-brand-subtle">{c.communityText}</p><Link href={`/${locale}/community`} className="button-secondary mt-7">{c.startCommunity}</Link></article></section>
    <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:px-8"><Placeholder title={c.journal} body={c.coming} /><Placeholder title={c.bookmarks} body={c.coming} /></section>
  </main>;
}

function InsightCard({ item, type, available, c, locale }) {
  if (!available) return <article className="rounded-[2rem] border border-dashed border-brand-line bg-brand-cream/60 p-6"><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-cream text-xl text-brand-teal" aria-hidden="true">{icon[type]}</span><span className="rounded-full bg-brand-cream px-3 py-1 text-xs font-semibold text-brand-subtle">{c.coming}</span></div><h3 className="display-font mt-6 text-3xl text-brand-ink">{c[type]}</h3><p className="mt-3 min-h-12 text-sm leading-relaxed text-brand-subtle">{c.coming}</p></article>;
  if (!item) return <article className="rounded-[2rem] border border-brand-line bg-white p-6"><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-cream text-xl text-brand-teal" aria-hidden="true">{icon[type]}</span><span className="rounded-full bg-brand-cream px-3 py-1 text-xs font-semibold text-brand-subtle">{c.notYet}</span></div><h3 className="display-font mt-6 text-3xl text-brand-ink">{c[type]}</h3><p className="mt-3 min-h-12 text-sm leading-relaxed text-brand-subtle">{c[`start${type[0].toUpperCase()}${type.slice(1)}`] || c.notYet}</p><Link href={type === 'personality' ? productionAppUrl('/test') : `/${locale}/insights/${type}`} className="button-secondary mt-6">{type === 'personality' ? c.startPersonality : type === 'communication' ? c.startCommunication : type === 'conflict' ? c.startConflict : type === 'leadership' ? c.startLeadership : c.startLearning}</Link></article>;
  const completion = item.completedAt ? new Intl.DateTimeFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { dateStyle: 'medium' }).format(new Date(item.completedAt)) : c.dateUnknown;
  return <article className="rounded-[2rem] border border-brand-line bg-white p-6 shadow-[0_16px_40px_rgba(45,40,37,.06)]"><div className="flex items-center justify-between gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-teal/10 text-xl text-brand-teal" aria-hidden="true">{icon[type]}</span><span className="rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-semibold text-brand-teal">{c.completedLabel}</span></div><h3 className="display-font mt-6 text-3xl text-brand-ink">{item.title}</h3><p className="mt-3 min-h-12 text-sm leading-relaxed text-brand-subtle">{item.summary}</p><p className="mt-5 text-xs font-medium text-brand-subtle">{item.version ? `${c.version} ${item.version}` : c.dateUnknown} · {completion}</p><div className="mt-6 flex flex-wrap gap-3">{item.resultUrl ? <Link href={item.resultUrl} className="button-primary">{c.view}</Link> : <Link href={item.guideUrl} className="button-primary">{c.guide}</Link>}<a href={item.retakeUrl} className="button-secondary">{c.retake}</a></div></article>;
}

function localizedWeeklyExperiment(experiment, locale) {
  if (!experiment?.title?.[locale] || !experiment?.instruction?.[locale]) return null;
  return { title: experiment.title[locale], instruction: experiment.instruction[locale] };
}

function SectionTitle({ eyebrow, title }) { return <><p className="section-kicker">{eyebrow}</p><h2 className="display-font mt-3 text-4xl text-brand-ink">{title}</h2></>; }
function Stat({ label, value }) { return <div className="rounded-2xl bg-white/10 p-4"><dt className="text-xs text-white/65">{label}</dt><dd className="mt-2 text-sm font-semibold text-white">{value}</dd></div>; }
function ProgressItem({ complete, label, c }) { return <div className="rounded-2xl bg-brand-cream p-4"><p className="text-sm font-semibold text-brand-ink">{complete ? '✓' : '○'} {label}</p><p className="mt-2 text-xs text-brand-subtle">{complete ? c.completedLabel : c.coming}</p></div>; }
function Placeholder({ title, body }) { return <article className="rounded-[2rem] border border-dashed border-brand-line bg-brand-cream/50 p-7"><p className="section-kicker">{body}</p><h2 className="display-font mt-3 text-3xl text-brand-ink">{title}</h2></article>; }
function PrivateNotice({ title, text }) { return <main className="mx-auto max-w-2xl px-4 py-24 sm:px-6"><section className="rounded-[2rem] bg-brand-cream p-8 text-center sm:p-12" role="status"><h1 className="sr-only">{title}</h1><div aria-hidden="true" className="mx-auto h-10 w-10 rounded-full border-4 border-brand-teal/20 border-t-brand-teal" /><p className="mt-5 text-brand-subtle">{text}</p></section></main>; }
