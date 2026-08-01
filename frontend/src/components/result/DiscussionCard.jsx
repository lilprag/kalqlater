import React from 'react';
import { MessageCircleMore } from 'lucide-react';

export default function DiscussionCard({ discussion, copy, cls, clsH }) {
    return <article className="min-w-[270px] snap-start rounded-3xl border border-brand-line bg-white p-5"><span className={`text-xs font-semibold uppercase tracking-[0.18em] text-brand-teal ${cls}`}>{discussion.tag}</span><h3 className={`mt-3 text-lg leading-snug text-brand-ink ${clsH}`}>{discussion.title}</h3><p className={`mt-5 flex items-center gap-2 text-xs text-brand-subtle ${cls}`}><MessageCircleMore size={14} aria-hidden="true" /> {copy.replies}</p></article>;
}
