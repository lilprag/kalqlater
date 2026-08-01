import React from 'react';
import { motion } from 'framer-motion';

export default function SectionHeader({ eyebrow, title, description, cls = '', clsH = '', inverse = false }) {
    return <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45 }} className="mb-6">
        <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${inverse ? 'text-brand-sand' : 'text-brand-teal'} ${cls}`}>{eyebrow}</p>
        <h2 className={`mt-2 text-3xl leading-tight sm:text-4xl ${inverse ? 'text-white' : 'text-brand-ink'} ${clsH}`}>{title}</h2>
        {description && <p className={`mt-2 max-w-2xl text-sm leading-relaxed sm:text-base ${inverse ? 'text-white/70' : 'text-brand-subtle'} ${cls}`}>{description}</p>}
    </motion.div>;
}
