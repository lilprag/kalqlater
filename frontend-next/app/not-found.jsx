import Link from 'next/link';

export default function NotFound() {
  return <main className="mx-auto max-w-2xl px-4 py-28 text-center"><p className="text-xs font-semibold uppercase tracking-[.2em] text-brand-teal">404</p><h1 className="display-font mt-3 text-4xl sm:text-5xl">Page not found</h1><p className="mx-auto mt-4 max-w-md text-brand-subtle">The page you requested is not available in this preview.</p><Link href="/en" className="mt-8 inline-flex rounded-full bg-brand-teal px-6 py-3 font-semibold text-white">Return home</Link></main>;
}
