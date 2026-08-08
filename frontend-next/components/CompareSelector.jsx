import Link from 'next/link';
import { TYPE_ORDER } from '../lib/personality';
import { localePath, productionAppUrl } from '../lib/site';

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
};

export function CompareSelector({ locale = 'en', mainId }) {
  const c = copy[locale] || copy.en;
  return <main id={mainId} className="mx-auto min-h-[60vh] max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    <nav aria-label="Breadcrumb" className="text-sm text-brand-subtle"><Link href={localePath(locale)}>KalQLater</Link><span aria-hidden="true"> / </span>{locale === 'hi' ? 'तुलना' : 'Compare'}</nav>
    <section className="content-hero relative mt-5 overflow-hidden rounded-[2rem] border border-brand-line p-7 sm:p-10"><span className="absolute -right-14 -top-16 h-64 w-64 rounded-full bg-brand-plum/20 blur-3xl" aria-hidden="true" /><div className="relative"><p className="section-kicker">{c.eyebrow}</p><h1 className="display-font mt-3 text-4xl sm:text-5xl">{c.title}</h1><p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-subtle">{c.body}</p></div></section>
    <form action="/compare" method="get" className="content-card mt-8 rounded-[1.75rem] border border-brand-line bg-white p-6 sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><TypeField name="type1" label={c.first} defaultValue="INTJ" /><TypeField name="type2" label={c.second} defaultValue="ENFP" /></div><fieldset className="mt-6"><legend className="text-sm font-semibold text-brand-ink">{c.language}</legend><div className="mt-3 flex flex-wrap gap-3"><label className="inline-flex items-center gap-2 rounded-full border border-brand-line px-4 py-2 text-sm"><input defaultChecked={locale === 'en'} name="lang" type="radio" value="en" /> English</label><label className="inline-flex items-center gap-2 rounded-full border border-brand-line px-4 py-2 text-sm"><input defaultChecked={locale === 'hi'} name="lang" type="radio" value="hi" /> हिंदी</label></div></fieldset><button className="button-primary mt-7" type="submit">{c.submit} <span aria-hidden="true">→</span></button></form>
    <p className="mt-6 text-center text-sm text-brand-subtle">{c.prompt} <a href={productionAppUrl('/test')} className="font-semibold text-brand-teal underline underline-offset-4">{c.test}</a></p>
  </main>;
}

function TypeField({ name, label, defaultValue }) {
  return <label className="block"><span className="text-sm font-semibold text-brand-ink">{label}</span><select className="mt-2 w-full rounded-2xl border border-brand-line bg-brand-bg px-4 py-3 text-brand-ink outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20" defaultValue={defaultValue} name={name}>{TYPE_ORDER.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>;
}
