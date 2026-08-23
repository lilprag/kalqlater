'use client';

export default function JobsError({ reset }) {
  return <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6"><section className="rounded-[2rem] border border-brand-sand bg-brand-sand/20 p-8 text-center"><p className="section-kicker">KalQLater Jobs</p><h1 className="display-font mt-3 text-4xl text-brand-ink">Jobs are temporarily unavailable</h1><p className="mx-auto mt-4 max-w-xl leading-relaxed text-brand-subtle">We could not safely load the current job inventory. This is a service issue, not an empty search result.</p><button type="button" className="button-primary mt-7" onClick={reset}>Try again</button></section></main>;
}
