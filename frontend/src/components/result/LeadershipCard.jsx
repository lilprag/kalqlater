import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Eye, Sparkles, Target, Users } from 'lucide-react';
import { LEADERSHIP_INSIGHTS } from '../../data/insights/leadership';

const labels = {
    en: {
        title: 'Leadership Insights',
        style: 'Leadership Style',
        summary: 'Summary',
        strengths: 'Strengths',
        blindSpots: 'Blind Spots',
        weeklyAction: 'Weekly Action',
        bestRoles: 'Best Roles',
    },
    hi: {
        title: 'नेतृत्व अंतर्दृष्टि',
        style: 'नेतृत्व शैली',
        summary: 'सारांश',
        strengths: 'ताक़तें',
        blindSpots: 'सावधानियाँ',
        weeklyAction: 'इस सप्ताह का कदम',
        bestRoles: 'उपयुक्त भूमिकाएँ',
    },
};

export default function LeadershipCard({ typeCode, lang }) {
    const profile = LEADERSHIP_INSIGHTS[typeCode];
    if (!profile) return null;

    const copy = profile[lang] || profile.en;
    const t = labels[lang] || labels.en;
    const cls = lang === 'hi' ? 'font-body-hi' : '';
    const clsH = lang === 'hi' ? 'font-display-hi' : 'font-display';

    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20" data-testid="leadership-insights">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="rounded-[2rem] border border-brand-line bg-brand-cream/65 p-4 shadow-[0_20px_60px_rgba(45,40,37,0.06)] sm:p-7 lg:p-8"
            >
                <div className="flex items-center gap-3 rounded-3xl border border-brand-line/70 bg-white/75 p-4 sm:p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-teal text-white shadow-[0_8px_20px_rgba(31,108,125,0.22)]">
                        <Compass size={19} />
                    </span>
                    <div>
                        <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-teal ${cls}`}>Premium insight</p>
                        <h2 className={`mt-0.5 text-2xl leading-tight text-brand-ink sm:text-3xl ${clsH}`}>{t.title}</h2>
                    </div>
                </div>

                <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.22 }} className="mt-4 rounded-3xl border border-brand-line bg-white p-6 shadow-[0_10px_30px_rgba(45,40,37,0.035)] sm:mt-5 sm:p-7">
                    <p className={`text-[11px] font-medium uppercase tracking-[0.22em] text-brand-subtle ${cls}`}>{t.style}</p>
                    <p className={`mt-2 text-2xl leading-tight text-brand-teal sm:text-3xl ${clsH}`}>{copy.style}</p>
                    <p className={`mt-3 max-w-3xl text-[15px] leading-relaxed text-brand-ink sm:text-base ${cls}`}>{copy.summary}</p>
                </motion.div>

                <div className="mt-4 grid gap-4 md:grid-cols-2 sm:mt-5 sm:gap-5">
                    <InsightList icon={Sparkles} title={t.strengths} items={copy.strengths} accent="text-brand-plum" cls={cls} />
                    <InsightList icon={Eye} title={t.blindSpots} items={copy.blindSpots} accent="text-brand-saffron" cls={cls} />
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2 sm:mt-5 sm:gap-5">
                    <InsightPanel icon={Target} title={t.weeklyAction} content={copy.weeklyAction} accent="text-brand-teal" cls={cls} />
                    <InsightList icon={Users} title={t.bestRoles} items={copy.bestRoles} accent="text-brand-plum" cls={cls} />
                </div>
            </motion.div>
        </section>
    );
}

function InsightList({ icon: Icon, title, items, accent, cls }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="h-full rounded-3xl border border-brand-line bg-white p-5 shadow-[0_10px_30px_rgba(45,40,37,0.03)] transition-shadow hover:shadow-[0_16px_36px_rgba(45,40,37,0.07)] sm:p-6">
            <div className={`flex items-center gap-2 text-sm font-semibold ${accent} ${cls}`}><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-cream"><Icon size={16} /></span>{title}</div>
            <ul className={`mt-4 space-y-2.5 text-[15px] leading-relaxed text-brand-ink ${cls}`}>
                {items.map((item) => <li key={item} className="flex gap-3"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-sand" />{item}</li>)}
            </ul>
        </motion.div>
    );
}

function InsightPanel({ icon: Icon, title, content, accent, cls }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="h-full rounded-3xl border border-brand-line bg-white p-5 shadow-[0_10px_30px_rgba(45,40,37,0.03)] transition-shadow hover:shadow-[0_16px_36px_rgba(45,40,37,0.07)] sm:p-6">
            <div className={`flex items-center gap-2 text-sm font-semibold ${accent} ${cls}`}><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-cream"><Icon size={16} /></span>{title}</div>
            <p className={`mt-4 text-[15px] leading-relaxed text-brand-ink ${cls}`}>{content}</p>
        </motion.div>
    );
}
