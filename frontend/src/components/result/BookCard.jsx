import React from 'react';
import { BookOpen } from 'lucide-react';

export default function BookCard({ book, index, cls, clsH }) {
    return <article className="min-w-[225px] snap-start rounded-3xl border border-brand-line bg-brand-cream/60 p-5"><span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${index % 2 ? 'bg-brand-plum text-white' : 'bg-brand-saffron text-white'}`}><BookOpen size={18} /></span><h3 className={`mt-6 text-lg leading-snug text-brand-ink ${clsH}`}>{book.title}</h3><p className={`mt-1 text-xs text-brand-subtle ${cls}`}>{book.author}</p><p className={`mt-4 text-sm leading-relaxed text-brand-subtle ${cls}`}>{book.note}</p></article>;
}
