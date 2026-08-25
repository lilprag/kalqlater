"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TYPE_ORDER } from '../lib/personality';
import { localePath } from '../lib/site';

const copy = {
  en: {
    eyebrow: 'Relationship intelligence', title: 'Explore a personality dynamic',
    body: 'Choose two personality types to explore how their different patterns may show up in communication, decisions, collaboration, and growth.',
    first: 'First personality type', second: 'Second personality type', language: 'Language', submit: 'Explore this comparison',
    prompt: 'Looking for your own result?', test: 'Take the personality test',
  },
  hi: {
    eyebrow: 'रिश्ते की समझ', title: 'दो व्यक्तित्वों के डायनामिक को देखें',
    body: 'दो व्यक्तित्व प्रकार चुनें और देखें कि उनके अलग पैटर्न संवाद, निर्णय, सहयोग और विकास में कैसे दिखाई दे सकते हैं।',
    first: 'पहला व्यक्तित्व प्रकार', second: 'दूसरा व्यक्तित्व प्रकार', language: 'भाषा', submit: 'यह तुलना देखें',
    prompt: 'अपना परिणाम देखना चाहते हैं?', test: 'पर्सनैलिटी टेस्ट दें',
  },
  fr: {
    eyebrow: 'Comprendre les relations', title: 'Explorer la dynamique entre deux personnalités',
    body: 'Choisissez deux types pour observer comment leurs préférences peuvent se rencontrer dans la communication, les décisions, la collaboration et l’évolution.',
    first: 'Premier type de personnalité', second: 'Second type de personnalité', submit: 'Explorer cette comparaison',
    prompt: 'Vous cherchez votre propre résultat ?', test: 'Faire le test de personnalité', breadcrumb: 'Comparaisons',
  },
  ja: {
    eyebrow: '関係性を見つめる', title: '二つのパーソナリティの関わり方を知る',
    body: '二つのタイプを選び、コミュニケーション、意思決定、協働、成長の場面で、どのような違いと共通点が現れうるかを見つめます。',
    first: '一つ目のパーソナリティタイプ', second: '二つ目のパーソナリティタイプ', submit: 'この比較を見る',
    prompt: 'ご自身の結果を知りたいですか？', test: 'パーソナリティテストを受ける', breadcrumb: '比較',
  },
};

export function CompareSelector({ locale = 'en', mainId, secondary = false }) {
  const c = copy[locale];
  const router = useRouter();
  const [first, setFirst] = useState('INTJ');
  const [second, setSecond] = useState('ENFP');
  const submit = (event) => {
    event.preventDefault();
    if (first === second) return;
    const [a, b] = [first, second].sort((left, right) => TYPE_ORDER.indexOf(left) - TYPE_ORDER.indexOf(right));
    router.push(localePath(locale, `compare/${a.toLowerCase()}-vs-${b.toLowerCase()}`));
  };
  const Wrapper = secondary ? 'section' : 'main';
  const Heading = secondary ? 'h2' : 'h1';
  return <Wrapper id={mainId} className={`mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 ${secondary ? '' : 'min-h-[60vh]'}`}>
    {!secondary ? <nav aria-label="Breadcrumb" className="text-sm text-brand-subtle"><Link href={localePath(locale)}>KalQLater</Link><span aria-hidden="true"> / </span>{c.breadcrumb || (locale === 'hi' ? 'तुलना' : 'Compare')}</nav> : null}
    <section className={`content-hero relative overflow-hidden rounded-[2rem] border border-brand-line p-7 sm:p-10 ${secondary ? '' : 'mt-5'}`}><span className="absolute -right-14 -top-16 h-64 w-64 rounded-full bg-brand-plum/20 blur-3xl" aria-hidden="true" /><div className="relative"><p className="section-kicker">{secondary ? 'Compare any two types' : c.eyebrow}</p><Heading className="display-font mt-3 text-4xl sm:text-5xl">{secondary ? 'Choose two personality types' : c.title}</Heading><p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-subtle">{c.body}</p></div></section>
    <form onSubmit={submit} className="content-card mt-8 rounded-[1.75rem] border border-brand-line bg-white p-6 sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><TypeField label={c.first} value={first} onChange={setFirst} /><TypeField label={c.second} value={second} onChange={setSecond} /></div>{first === second && <p className="mt-4 text-sm text-brand-plum">{locale === 'ja' ? '異なる二つのタイプを選んでください。' : locale === 'fr' ? 'Choisissez deux types différents.' : locale === 'hi' ? 'दो अलग व्यक्तित्व प्रकार चुनें।' : 'Choose two different personality types.'}</p>}<button className="button-primary mt-7" type="submit">{c.submit} <span aria-hidden="true">→</span></button></form>
    <p className="mt-6 text-center text-sm text-brand-subtle">{c.prompt} <Link href={localePath(locale, 'test')} className="font-semibold text-brand-teal underline underline-offset-4">{c.test}</Link></p>
  </Wrapper>;
}

function TypeField({ label, value, onChange }) {
  return <label className="block"><span className="text-sm font-semibold text-brand-ink">{label}</span><select className="mt-2 w-full rounded-2xl border border-brand-line bg-brand-bg px-4 py-3 text-brand-ink outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20" value={value} onChange={(event) => onChange(event.target.value)}>{TYPE_ORDER.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>;
}
