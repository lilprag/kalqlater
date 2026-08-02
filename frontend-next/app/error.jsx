'use client';

export default function GlobalError({ reset }) {
  return <html lang="en"><body className="bg-brand-bg text-brand-ink"><main className="mx-auto max-w-2xl px-4 py-28 text-center"><h1 className="display-font text-4xl">Something went wrong</h1><p className="mt-4 text-brand-subtle">Please try loading this page again.</p><button type="button" onClick={() => reset()} className="mt-8 rounded-full bg-brand-teal px-6 py-3 font-semibold text-white">Try again</button></main></body></html>;
}
