import React from 'react';
import { motion } from 'framer-motion';

export default function CompanyCard({ company, index, cls }) {
    return <motion.article initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} whileHover={{ y: -3 }} viewport={{ once: true }} transition={{ duration: 0.32, delay: index * 0.04 }} className="min-w-[205px] snap-start rounded-3xl border border-brand-line bg-white p-5 shadow-[0_10px_26px_rgba(45,40,37,0.03)]">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-cream text-sm font-bold text-brand-plum">{company.name.slice(0, 1)}</span><h3 className={`mt-5 text-lg text-brand-ink ${cls}`}>{company.name}</h3><p className={`mt-2 text-sm leading-relaxed text-brand-subtle ${cls}`}>{company.signal}</p><p className={`mt-4 text-xs text-brand-subtle/75 ${cls}`}>{company.detail}</p>
    </motion.article>;
}
