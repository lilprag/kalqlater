import React from 'react';
import { motion } from 'framer-motion';
import { MapPinned } from 'lucide-react';

export default function LocationCard({ location, index, copy, cls, clsH }) {
    return <motion.article initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="min-w-[200px] snap-start rounded-3xl border border-brand-line bg-white p-5"><MapPinned size={19} className="text-brand-saffron" /><h3 className={`mt-5 text-xl text-brand-ink ${clsH}`}>{location.city}</h3><p className={`mt-1 text-sm text-brand-subtle ${cls}`}>{location.country}</p><p className={`mt-5 text-xs text-brand-teal ${cls}`}>{copy.preview}</p></motion.article>;
}
