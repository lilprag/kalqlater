import Link from 'next/link';

import { CAREER_QUICK_WINS, PERSONALITY_QUICK_WINS } from '../data/traffic-sprint';

export function PersonalityQuickAnswer({ code }) {
  const content = PERSONALITY_QUICK_WINS[code];
  if (!content) return null;
  return <section className="mt-10 rounded-[2rem] border border-brand-line bg-white p-7 sm:p-9">
    <p className="section-kicker">Quick answer</p>
    <h2 className="display-font mt-2 text-3xl text-brand-ink">What does {code} mean?</h2>
    <p className="mt-4 max-w-4xl text-lg leading-relaxed text-brand-subtle">{content.answer}</p>
    <p className="mt-4 max-w-4xl leading-relaxed text-brand-subtle">{content.meaning}</p>
    <div className="mt-6 flex flex-wrap gap-3">
      {content.guides.map((slug) => <Link key={slug} href={`/en/guides/${slug}`} className="button-secondary">{guideLabel(slug)}</Link>)}
      {content.characters ? <Link href={`/en/personality/${code.toLowerCase()}/characters`} className="button-secondary">{code} characters</Link> : null}
    </div>
  </section>;
}

export function CareerQuickAnswer({ code }) {
  const content = CAREER_QUICK_WINS[code];
  if (!content) return null;
  return <section className="mt-10 grid gap-6 rounded-[2rem] border border-brand-line bg-white p-7 sm:p-9 lg:grid-cols-[1.15fr_.85fr]">
    <div><p className="section-kicker">Quick answer</p><h2 className="display-font mt-2 text-3xl text-brand-ink">What careers may suit an {code}?</h2><p className="mt-4 text-lg leading-relaxed text-brand-subtle">{content.answer}</p></div>
    <aside className="rounded-2xl bg-brand-cream p-5"><h3 className="font-semibold text-brand-ink">Questions to test before choosing</h3><ul className="mt-4 space-y-2 text-sm text-brand-subtle">{content.checks.map((check) => <li key={check} className="flex gap-2"><span aria-hidden="true" className="text-brand-teal">✓</span><span>{check}</span></li>)}</ul></aside>
  </section>;
}

function guideLabel(slug) {
  return ({ 'sensing-vs-intuition': 'Sensing vs Intuition', 'thinking-vs-feeling': 'Thinking vs Feeling', 'mbti-letters-meaning': 'What the MBTI letters mean' })[slug];
}
