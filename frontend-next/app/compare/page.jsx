import Link from 'next/link';
import { TYPE_ORDER } from '../../lib/personality';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export const metadata = {
  title: 'Compare personalities',
  description: 'Choose two personality types to explore their relationship intelligence on KalQLater.',
  robots: { index: false, follow: true },
};

export default function CompareSelectorPage() {
  return <><Header locale="en" /><main id="main-content" className="mx-auto min-h-[60vh] max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"><section className="content-hero relative overflow-hidden rounded-[2rem] border border-brand-line p-7 sm:p-10"><span className="absolute -right-14 -top-16 h-64 w-64 rounded-full bg-brand-plum/20 blur-3xl" aria-hidden="true" /><div className="relative"><p className="section-kicker">Relationship intelligence</p><h1 className="display-font mt-3 text-4xl sm:text-5xl">Explore a personality dynamic</h1><p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-subtle">Choose two personality types to explore how their different patterns may show up in communication, decisions, collaboration, and growth.</p></div></section><form action="/compare" method="get" className="content-card mt-8 rounded-[1.75rem] border border-brand-line bg-white p-6 sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><TypeField name="type1" label="First personality type" defaultValue="INTJ" /><TypeField name="type2" label="Second personality type" defaultValue="ENFP" /></div><fieldset className="mt-6"><legend className="text-sm font-semibold text-brand-ink">Language</legend><div className="mt-3 flex flex-wrap gap-3"><label className="inline-flex items-center gap-2 rounded-full border border-brand-line px-4 py-2 text-sm"><input defaultChecked name="lang" type="radio" value="en" /> English</label><label className="inline-flex items-center gap-2 rounded-full border border-brand-line px-4 py-2 text-sm"><input name="lang" type="radio" value="hi" /> हिंदी</label></div></fieldset><button className="button-primary mt-7" type="submit">Explore this comparison <span aria-hidden="true">→</span></button></form><p className="mt-6 text-center text-sm text-brand-subtle">Looking for your own result? <Link href="/test" className="font-semibold text-brand-teal underline underline-offset-4">Take the personality test</Link></p></main><Footer locale="en" /></>;
}

function TypeField({ name, label, defaultValue }) { return <label className="block"><span className="text-sm font-semibold text-brand-ink">{label}</span><select className="mt-2 w-full rounded-2xl border border-brand-line bg-brand-bg px-4 py-3 text-brand-ink outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20" defaultValue={defaultValue} name={name}>{TYPE_ORDER.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>; }
