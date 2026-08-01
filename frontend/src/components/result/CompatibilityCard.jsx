import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function CompatibilityCard({ item, index, cls, clsH }) {
    return <motion.article initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="min-w-[258px] snap-start rounded-3xl border border-brand-line bg-white p-6"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-plum/10 text-brand-plum"><Sparkles size={18} /></span><p className={`mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-subtle ${cls}`}>{item.dynamic}</p><h3 className={`mt-2 text-3xl text-brand-ink ${clsH}`}>{item.type}</h3><p className={`mt-3 text-sm leading-relaxed text-brand-subtle ${cls}`}>{item.reason}</p><p className={`mt-5 text-xs text-brand-subtle/70 blur-[2px] select-none ${cls}`}>{item.detail}</p></motion.article>;
}
