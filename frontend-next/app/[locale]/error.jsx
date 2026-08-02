'use client';

export default function LocaleError({ reset }) {
  return <div className="mx-auto max-w-2xl px-4 py-28 text-center"><h1 className="display-font text-4xl">Unable to load this page</h1><p className="mt-4 text-brand-subtle">Please try again.</p><button type="button" onClick={() => reset()} className="mt-8 rounded-full bg-brand-teal px-6 py-3 font-semibold text-white">Try again</button></div>;
}
