import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Brain, Compass, Eye, Lightbulb, Search, Sparkles, Wrench, Zap } from 'lucide-react';
import { COGNITIVE_INSIGHTS } from '../../data/insights/cognitive';

const labels = {
    en: ['Thinking Style', 'Pattern Recognition', 'Problem Solving', 'Decision Speed', 'Creativity', 'Analytical Ability', 'Biggest Cognitive Bias', 'Cognitive Superpower'],
    hi: ['सोचने की शैली', 'पैटर्न पहचान', 'समस्या समाधान', 'निर्णय की गति', 'रचनात्मकता', 'विश्लेषण क्षमता', 'सबसे बड़ा संज्ञानात्मक पक्षपात', 'संज्ञानात्मक महाशक्ति'],
};
const icons = [Brain, Search, Wrench, Zap, Sparkles, BarChart3, Eye, Compass];
const accents = ['text-brand-plum', 'text-brand-teal', 'text-brand-saffron', 'text-brand-plum', 'text-brand-saffron', 'text-brand-teal', 'text-brand-saffron', 'text-brand-plum'];

export default function CognitiveCard({ typeCode, lang }) {
    const profile = COGNITIVE_INSIGHTS[typeCode];
    if (!profile) return null;

    const copy = profile[lang] || profile.en;
    const headings = labels[lang] || labels.en;
    const cls = lang === 'hi' ? 'font-body-hi' : '';
    const clsH = lang === 'hi' ? 'font-display-hi' : 'font-display';

    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20" data-testid="cognitive-profile">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, ease: 'easeOut' }} className="rounded-[2rem] border border-brand-line bg-brand-cream/65 p-4 shadow-[0_20px_60px_rgba(45,40,37,0.06)] sm:p-7 lg:p-8">
                <div className="flex items-center gap-3 rounded-3xl border border-brand-line/70 bg-white/75 p-4 sm:p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-saffron text-white shadow-[0_8px_20px_rgba(232,122,93,0.22)]"><Brain size={20} /></span>
                    <div><p className={`text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-saffron ${cls}`}>Premium insight</p><h2 className={`mt-0.5 text-2xl leading-tight text-brand-ink sm:text-3xl ${clsH}`}>{lang === 'hi' ? 'संज्ञानात्मक प्रोफ़ाइल' : 'Cognitive Profile'}</h2></div>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2 sm:mt-5 sm:gap-5">
                    {copy.map((value, index) => <CognitiveDetail key={headings[index]} icon={icons[index]} title={headings[index]} content={value} accent={accents[index]} cls={cls} index={index} />)}
                </div>
            </motion.div>
        </section>
    );
}

function CognitiveDetail({ icon: Icon, title, content, accent, cls, index }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.38, delay: Math.min(index * 0.035, 0.18), ease: 'easeOut' }} className="h-full rounded-3xl border border-brand-line bg-white p-5 shadow-[0_10px_30px_rgba(45,40,37,0.03)] transition-shadow hover:shadow-[0_16px_36px_rgba(45,40,37,0.07)] sm:p-6">
            <div className={`flex items-center gap-2 text-sm font-semibold ${accent} ${cls}`}><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-cream"><Icon size={16} /></span>{title}</div>
            <p className={`mt-4 text-[15px] leading-relaxed text-brand-ink ${cls}`}>{content}</p>
        </motion.div>
    );
}
