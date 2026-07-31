import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return <main className="mx-auto max-w-2xl px-4 py-24 text-center"><p className="text-sm font-semibold uppercase tracking-[.2em] text-brand-teal">404</p><h1 className="mt-3 font-display text-4xl">Page not found</h1><p className="mt-4 text-brand-subtle">The page you’re looking for is unavailable or may have moved.</p><Link to="/" className="mt-7 inline-flex rounded-full bg-brand-teal px-5 py-3 font-semibold text-white">Return home</Link></main>;
}
