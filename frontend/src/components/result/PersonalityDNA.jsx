import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Compass, Heart, MessagesSquare, ShieldCheck, Sparkles, Target, Zap } from 'lucide-react';
import { PERSONALITY_DNA } from '../../data/insights/dna';

const labels = {
    en: { eyebrow: 'Signature visual', title: 'Personality DNA', subtitle: 'Eight living strands reveal how your traits connect. Select a strand to explore its full report.', leadership: 'Leadership', communication: 'Communication', cognition: 'Cognition', growth: 'Growth', career: 'Career', relationships: 'Relationships', stress: 'Stress', creativity: 'Creativity' },
    hi: { eyebrow: 'सिग्नेचर विज़ुअल', title: 'पर्सनैलिटी डीएनए', subtitle: 'आठ जीवंत स्ट्रैंड बताते हैं कि आपके गुण कैसे जुड़े हैं। विस्तृत रिपोर्ट के लिए किसी स्ट्रैंड को चुनें।', leadership: 'नेतृत्व', communication: 'संवाद', cognition: 'संज्ञान', growth: 'विकास', career: 'करियर', relationships: 'रिश्ते', stress: 'तनाव', creativity: 'रचनात्मकता' },
};

const strands = [
    ['leadership', Compass, 'leadership-insights', '#1F6C7D'], ['communication', MessagesSquare, 'communication-style', '#6E4555'], ['cognition', Brain, 'cognitive-profile', '#E87A5D'], ['growth', Sparkles, 'personal-growth-blueprint', '#DAB49D'], ['career', Target, 'careers', '#1F6C7D'], ['relationships', Heart, 'relationships', '#6E4555'], ['stress', ShieldCheck, 'personal-growth-blueprint', '#E87A5D'], ['creativity', Zap, 'cognitive-profile', '#DAB49D'],
];

export default function PersonalityDNA({ typeCode, lang }) {
    const profile = PERSONALITY_DNA[typeCode];
    if (!profile) return null;

    const copy = profile[lang] || profile.en;
    const t = labels[lang] || labels.en;
    const cls = lang === 'hi' ? 'font-body-hi' : '';
    const clsH = lang === 'hi' ? 'font-display-hi' : 'font-display';
    const scrollTo = (target) => document.querySelector(`[data-testid="${target}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16" data-testid="personality-dna">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.14 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="relative overflow-hidden rounded-[2rem] border border-brand-ink/15 bg-[#24343A] p-5 shadow-[0_24px_70px_rgba(45,40,37,0.16)] dark:border-white/15 dark:bg-slate-950 sm:p-8 lg:p-10">
                <Glow className="-left-24 -top-32 bg-brand-teal" delay={0} />
                <Glow className="-right-16 bottom-0 bg-brand-plum" delay={1.4} />
                <div className="relative">
                    <div className="flex items-start gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-brand-sand"><Sparkles size={20} /></span>
                        <div><p className={`text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-sand ${cls}`}>{t.eyebrow}</p><h2 className={`mt-0.5 text-3xl leading-tight text-white sm:text-4xl ${clsH}`}>{t.title}</h2><p className={`mt-2 max-w-2xl text-sm leading-relaxed text-white/70 ${cls}`}>{t.subtitle}</p></div>
                    </div>
                    <div className="mt-7 space-y-3 sm:mt-8 sm:space-y-4">
                        {strands.map(([key, Icon, target, color], index) => <DnaStrand key={key} icon={Icon} title={t[key]} value={copy[key]} color={color} index={index} cls={cls} onClick={() => scrollTo(target)} />)}
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

function DnaStrand({ icon: Icon, title, value, color, index, cls, onClick }) {
    const nodes = [12, 36, 62, 88];
    return <motion.button type="button" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} whileHover={{ x: 4, scale: 1.008 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.42, delay: index * 0.055, ease: 'easeOut' }} onClick={onClick} className="group w-full rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-left backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-white/[0.1] sm:px-5 sm:py-4">
        <div className="grid items-center gap-3 sm:grid-cols-[auto_minmax(10rem,1fr)_minmax(12rem,1.5fr)_auto] sm:gap-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/10" style={{ color }}><Icon size={16} /></span>
            <div><p className={`text-sm font-semibold text-white ${cls}`}>{title}</p><p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-white/45">DNA {String(index + 1).padStart(2, '0')}</p></div>
            <div className="relative hidden h-8 sm:block"><div className="absolute left-0 right-0 top-1/2 h-px bg-white/15" /><motion.div className="absolute left-0 top-1/2 h-px origin-left" style={{ background: color }} initial={{ scaleX: 0 }} whileInView={{ scaleX: value[0] / 100 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.15 + index * 0.05, ease: 'easeOut' }} />{nodes.map((node, nodeIndex) => <motion.span key={node} className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#24343A] shadow-[0_0_14px_currentColor]" style={{ left: `${node}%`, background: node / 100 <= value[0] / 100 ? color : '#7d8586', color }} animate={{ scale: node / 100 <= value[0] / 100 ? [1, 1.18, 1] : 1, opacity: node / 100 <= value[0] / 100 ? [0.78, 1, 0.78] : 0.45 }} transition={{ duration: 2.4, delay: nodeIndex * 0.24, repeat: Infinity, ease: 'easeInOut' }} />)}</div>
            <div className="sm:text-right"><span className="text-lg font-semibold text-white">{value[0]}<span className="ml-0.5 text-[10px] font-medium text-white/50">/100</span></span><p className={`mt-1 text-xs leading-relaxed text-white/65 sm:max-w-[15rem] ${cls}`}>{value[1]}</p></div>
        </div>
    </motion.button>;
}

function Glow({ className, delay }) {
    return <motion.div aria-hidden className={`absolute h-64 w-64 rounded-full blur-3xl opacity-25 ${className}`} animate={{ scale: [1, 1.18, 1], opacity: [0.16, 0.3, 0.16] }} transition={{ duration: 7, delay, repeat: Infinity, ease: 'easeInOut' }} />;
}
