import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Brain, Compass, Heart, Lightbulb, MessagesSquare, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { DASHBOARD_INSIGHTS } from '../../data/insights/dashboard';

const labels = {
    en: { title: 'Overview Dashboard', subtitle: 'Your personality at a glance — select a card to explore the full insight.', explore: 'Explore your dimensions', leadership: 'Leadership', communication: 'Communication', cognitive: 'Cognitive', growth: 'Growth', career: 'Career', relationship: 'Relationship', stress: 'Stress', overall: 'Overall Personality' },
    hi: { title: 'ओवरव्यू डैशबोर्ड', subtitle: 'एक नज़र में आपका व्यक्तित्व — विस्तृत अंतर्दृष्टि के लिए कार्ड चुनें।', explore: 'अपने आयाम देखें', leadership: 'नेतृत्व', communication: 'संवाद', cognitive: 'संज्ञानात्मक', growth: 'विकास', career: 'करियर', relationship: 'रिश्ते', stress: 'तनाव', overall: 'समग्र व्यक्तित्व' },
};

const scores = [
    ['leadership', Compass, 'leadership-insights', 'text-brand-teal', '#1F6C7D'],
    ['communication', MessagesSquare, 'communication-style', 'text-brand-plum', '#6E4555'],
    ['cognitive', Brain, 'cognitive-profile', 'text-brand-saffron', '#E87A5D'],
    ['growth', Sparkles, 'personal-growth-blueprint', 'text-brand-teal', '#1F6C7D'],
    ['career', Target, 'careers', 'text-brand-plum', '#6E4555'],
    ['relationship', Heart, 'relationships', 'text-brand-saffron', '#E87A5D'],
    ['stress', ShieldCheck, 'personal-growth-blueprint', 'text-brand-teal', '#1F6C7D'],
];

export default function DashboardOverview({ typeCode, lang }) {
    const profile = DASHBOARD_INSIGHTS[typeCode];
    if (!profile) return null;

    const copy = profile[lang] || profile.en;
    const t = labels[lang] || labels.en;
    const cls = lang === 'hi' ? 'font-body-hi' : '';
    const clsH = lang === 'hi' ? 'font-display-hi' : 'font-display';
    const scrollTo = (target) => document.querySelector(`[data-testid="${target}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16" data-testid="dashboard-overview">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.55, ease: 'easeOut' }}>
                <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-ink text-white shadow-[0_8px_20px_rgba(45,40,37,0.18)]"><BarChart3 size={20} /></span>
                    <div><p className={`text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-teal ${cls}`}>Premium report</p><h2 className={`mt-0.5 text-3xl leading-tight text-brand-ink sm:text-4xl ${clsH}`}>{t.title}</h2><p className={`mt-2 max-w-2xl text-sm leading-relaxed text-brand-subtle ${cls}`}>{t.subtitle}</p></div>
                </div>
                <button type="button" onClick={() => scrollTo('result-traits')} className="group mt-6 w-full rounded-[2rem] border border-brand-line bg-brand-ink p-6 text-left text-white shadow-[0_20px_50px_rgba(45,40,37,0.16)] transition-transform hover:-translate-y-1 sm:p-8">
                    <div className="grid items-center gap-5 sm:grid-cols-[auto_1fr]">
                        <ProgressRing score={copy.overall[0]} color="#DAB49D" large />
                        <div><p className={`text-xs font-semibold uppercase tracking-[0.22em] text-brand-sand ${cls}`}>{t.overall}</p><p className={`mt-2 text-xl leading-snug sm:text-2xl ${clsH}`}>{copy.overall[1]}</p><span className={`mt-3 inline-flex items-center gap-2 text-xs text-white/70 ${cls}`}>{t.explore} <span className="transition-transform group-hover:translate-x-1">→</span></span></div>
                    </div>
                </button>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
                    {scores.map(([key, Icon, target, accent, color], index) => <ScoreCard key={key} icon={Icon} title={t[key]} data={copy[key]} target={target} accent={accent} color={color} cls={cls} index={index} onClick={scrollTo} />)}
                </div>
            </motion.div>
        </section>
    );
}

function ScoreCard({ icon: Icon, title, data, target, accent, color, cls, index, onClick }) {
    return <motion.button type="button" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.36, delay: Math.min(index * 0.045, 0.24), ease: 'easeOut' }} onClick={() => onClick(target)} className="h-full rounded-3xl border border-brand-line bg-white p-5 text-left shadow-[0_10px_30px_rgba(45,40,37,0.03)] transition-shadow hover:shadow-[0_16px_36px_rgba(45,40,37,0.08)] focus:outline-none">
        <div className="flex items-center justify-between gap-3"><span className={`flex h-8 w-8 items-center justify-center rounded-xl bg-brand-cream ${accent}`}><Icon size={16} /></span><ProgressRing score={data[0]} color={color} /></div><p className={`mt-4 text-sm font-semibold ${accent} ${cls}`}>{title}</p><p className={`mt-2 text-sm leading-relaxed text-brand-subtle ${cls}`}>{data[1]}</p>
    </motion.button>;
}

function ProgressRing({ score, color, large = false }) {
    const size = large ? 108 : 58;
    const stroke = large ? 8 : 5;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    return <div className="relative shrink-0" style={{ width: size, height: size }}><svg width={size} height={size} className="-rotate-90"><circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className={large ? 'text-white/15' : 'text-brand-cream'} /><motion.circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} whileInView={{ strokeDashoffset: circumference - (score / 100) * circumference }} viewport={{ once: true }} transition={{ duration: 1.1, ease: 'easeOut' }} /></svg><span className={`absolute inset-0 flex items-center justify-center font-semibold ${large ? 'text-2xl text-white' : 'text-sm text-brand-ink'}`}>{score}<small className={large ? 'text-[10px] font-medium text-white/70' : 'text-[7px] font-medium text-brand-subtle'}>/100</small></span></div>;
}
