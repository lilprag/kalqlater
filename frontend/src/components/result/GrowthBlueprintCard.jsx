import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Heart, Lightbulb, MessagesSquare, ShieldCheck, Sparkles, Target, Users, Zap } from 'lucide-react';
import { GROWTH_BLUEPRINTS } from '../../data/insights/growth';

const labels = {
    en: { title: 'Personal Growth Blueprint', priorities: 'Top 3 Growth Priorities', build: 'Habits to Build', avoid: 'Habits to Avoid', challenge: 'Weekly Challenge', communication: 'Communication Goal', career: 'Career Development Goal', relationship: 'Relationship Goal', motto: 'Your Growth Motto' },
    hi: { title: 'व्यक्तिगत विकास ब्लूप्रिंट', priorities: 'विकास की शीर्ष 3 प्राथमिकताएँ', build: 'बनाने की आदतें', avoid: 'बचने की आदतें', challenge: 'साप्ताहिक चुनौती', communication: 'संवाद लक्ष्य', career: 'करियर विकास लक्ष्य', relationship: 'रिश्ते का लक्ष्य', motto: 'आपका विकास मंत्र' },
};

export default function GrowthBlueprintCard({ typeCode, lang }) {
    const profile = GROWTH_BLUEPRINTS[typeCode];
    if (!profile) return null;

    const copy = profile[lang] || profile.en;
    const t = labels[lang] || labels.en;
    const cls = lang === 'hi' ? 'font-body-hi' : '';
    const clsH = lang === 'hi' ? 'font-display-hi' : 'font-display';

    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20" data-testid="personal-growth-blueprint">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.55, ease: 'easeOut' }} className="rounded-[2rem] border border-brand-line bg-brand-cream/65 p-4 shadow-[0_20px_60px_rgba(45,40,37,0.06)] sm:p-7 lg:p-8">
                <div className="flex items-center gap-3 rounded-3xl border border-brand-line/70 bg-white/75 p-4 sm:p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-teal text-white shadow-[0_8px_20px_rgba(31,108,125,0.22)]"><Compass size={20} /></span>
                    <div><p className={`text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-teal ${cls}`}>Premium roadmap</p><h2 className={`mt-0.5 text-2xl leading-tight text-brand-ink sm:text-3xl ${clsH}`}>{t.title}</h2></div>
                </div>
                <PriorityList title={t.priorities} items={copy.priorities} cls={cls} />
                <div className="mt-4 grid gap-4 md:grid-cols-2 sm:mt-5 sm:gap-5">
                    <ListCard icon={Sparkles} title={t.build} items={copy.build} accent="text-brand-teal" cls={cls} />
                    <ListCard icon={ShieldCheck} title={t.avoid} items={copy.avoid} accent="text-brand-saffron" cls={cls} />
                </div>
                <GoalCard icon={Zap} title={t.challenge} content={copy.challenge} accent="text-brand-saffron" cls={cls} />
                <div className="mt-4 grid gap-4 md:grid-cols-3 sm:mt-5 sm:gap-5">
                    <GoalCard icon={MessagesSquare} title={t.communication} content={copy.communication} accent="text-brand-plum" cls={cls} />
                    <GoalCard icon={Target} title={t.career} content={copy.career} accent="text-brand-teal" cls={cls} />
                    <GoalCard icon={Heart} title={t.relationship} content={copy.relationship} accent="text-brand-saffron" cls={cls} />
                </div>
                <motion.blockquote initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.18, duration: 0.5 }} className={`mt-4 rounded-3xl bg-brand-plum px-6 py-6 text-lg leading-relaxed text-white shadow-[0_12px_30px_rgba(110,69,85,0.18)] sm:mt-5 sm:px-8 ${cls}`}><span className="mr-2 text-brand-sand">“</span>{copy.motto}<span className="ml-1 text-brand-sand">”</span><footer className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-sand">{t.motto}</footer></motion.blockquote>
            </motion.div>
        </section>
    );
}

function PriorityList({ title, items, cls }) {
    return <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.38, ease: 'easeOut' }} className="mt-4 rounded-3xl border border-brand-line bg-white p-5 shadow-[0_10px_30px_rgba(45,40,37,0.03)] sm:mt-5 sm:p-6"><div className={`flex items-center gap-2 text-sm font-semibold text-brand-plum ${cls}`}><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-cream"><Lightbulb size={16} /></span>{title}</div><ol className={`mt-4 grid gap-3 text-[15px] leading-relaxed text-brand-ink md:grid-cols-3 ${cls}`}>{items.map((item, index) => <li key={item} className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-cream text-xs font-semibold text-brand-plum">{index + 1}</span>{item}</li>)}</ol></motion.div>;
}

function ListCard({ icon: Icon, title, items, accent, cls }) {
    return <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }} viewport={{ once: true }} transition={{ duration: 0.38, ease: 'easeOut' }} className="h-full rounded-3xl border border-brand-line bg-white p-5 shadow-[0_10px_30px_rgba(45,40,37,0.03)] transition-shadow hover:shadow-[0_16px_36px_rgba(45,40,37,0.07)] sm:p-6"><div className={`flex items-center gap-2 text-sm font-semibold ${accent} ${cls}`}><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-cream"><Icon size={16} /></span>{title}</div><ul className={`mt-4 space-y-2.5 text-[15px] leading-relaxed text-brand-ink ${cls}`}>{items.map((item) => <li key={item} className="flex gap-3"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-sand" />{item}</li>)}</ul></motion.div>;
}

function GoalCard({ icon: Icon, title, content, accent, cls }) {
    return <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }} viewport={{ once: true }} transition={{ duration: 0.38, ease: 'easeOut' }} className="mt-4 h-full rounded-3xl border border-brand-line bg-white p-5 shadow-[0_10px_30px_rgba(45,40,37,0.03)] transition-shadow hover:shadow-[0_16px_36px_rgba(45,40,37,0.07)] sm:mt-5 sm:p-6"><div className={`flex items-center gap-2 text-sm font-semibold ${accent} ${cls}`}><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-cream"><Icon size={16} /></span>{title}</div><p className={`mt-4 text-[15px] leading-relaxed text-brand-ink ${cls}`}>{content}</p></motion.div>;
}
