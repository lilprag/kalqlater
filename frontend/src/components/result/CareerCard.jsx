import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, LockKeyhole } from 'lucide-react';

export default function CareerCard({ item, index, copy, cls, clsH }) {
    return <motion.article initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="min-w-[265px] snap-start rounded-3xl border border-brand-line bg-white p-6 shadow-[0_10px_26px_rgba(45,40,37,0.03)]"><div className="flex items-start justify-between gap-3"><div><span className={`rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-semibold text-brand-teal ${cls}`}>{item.fit}</span><h3 className={`mt-4 text-xl text-brand-ink ${clsH}`}>{item.role}</h3></div><ArrowUpRight className="text-brand-saffron" size={20} /></div><p className={`mt-4 text-sm leading-relaxed text-brand-subtle ${cls}`}>{copy.careerReason}: {item.why}</p><div className="mt-5 rounded-2xl bg-brand-cream/80 p-3"><p className={`flex items-center gap-2 text-xs text-brand-subtle blur-[2px] select-none ${cls}`}><LockKeyhole size={13} /> {item.detail}</p></div></motion.article>;
}
