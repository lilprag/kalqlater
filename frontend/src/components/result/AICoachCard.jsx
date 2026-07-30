import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BriefcaseBusiness, ChevronDown, Heart, Lightbulb, MessagesSquare, Sparkles, Target, Users } from 'lucide-react';
import { TYPES } from '../../data/types';

const labels = {
    en: { eyebrow: 'Guided reflection', title: 'AI Coach', subtitle: 'A private, personality-aware space to turn your report into your next useful move.', note: 'Mock guidance based on your profile — no AI conversation is running yet.', prompts: 'Suggested prompts', career: 'Ask about Career', relationships: 'Ask about Relationships', productivity: 'Ask about Productivity', leadership: 'Ask about Leadership', communication: 'Ask about Communication', ask: 'Open coach note' },
    hi: { eyebrow: 'निर्देशित चिंतन', title: 'AI कोच', subtitle: 'आपकी रिपोर्ट को अगले उपयोगी कदम में बदलने के लिए निजी, व्यक्तित्व-सजग जगह।', note: 'आपकी प्रोफ़ाइल पर आधारित नमूना मार्गदर्शन — अभी कोई AI बातचीत नहीं चल रही है।', prompts: 'सुझाए गए प्रॉम्प्ट', career: 'करियर के बारे में पूछें', relationships: 'रिश्तों के बारे में पूछें', productivity: 'उत्पादकता के बारे में पूछें', leadership: 'नेतृत्व के बारे में पूछें', communication: 'संवाद के बारे में पूछें', ask: 'कोच नोट खोलें' },
};

const topics = [
    ['career', BriefcaseBusiness, 'text-brand-teal'], ['relationships', Heart, 'text-brand-saffron'], ['productivity', Target, 'text-brand-plum'], ['leadership', Users, 'text-brand-teal'], ['communication', MessagesSquare, 'text-brand-saffron'],
];

export default function AICoachCard({ typeCode, lang }) {
    const type = TYPES[typeCode];
    const [open, setOpen] = useState(null);
    const t = labels[lang] || labels.en;
    const info = type ? (lang === 'hi' ? type.hi : type.en) : null;
    const cls = lang === 'hi' ? 'font-body-hi' : '';
    const clsH = lang === 'hi' ? 'font-display-hi' : 'font-display';
    const answers = useMemo(() => (info ? makeAnswers(info, lang) : {}), [info, lang]);

    if (!type) return null;

    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16" data-testid="ai-coach">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.55, ease: 'easeOut' }} className="rounded-[2rem] border border-brand-line bg-[#F8F6F1] p-4 shadow-[0_20px_60px_rgba(45,40,37,0.06)] dark:border-white/10 dark:bg-slate-900 sm:p-7 lg:p-8">
                <div className="rounded-3xl border border-brand-line bg-white p-5 shadow-[0_10px_30px_rgba(45,40,37,0.03)] dark:border-white/10 dark:bg-slate-950 sm:p-6">
                    <div className="flex items-start gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-ink text-brand-sand shadow-[0_8px_20px_rgba(45,40,37,0.18)]"><Sparkles size={20} /></span>
                        <div><p className={`text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-teal ${cls}`}>{t.eyebrow}</p><h2 className={`mt-0.5 text-3xl leading-tight text-brand-ink dark:text-white sm:text-4xl ${clsH}`}>{t.title}</h2><p className={`mt-2 max-w-2xl text-sm leading-relaxed text-brand-subtle dark:text-slate-300 ${cls}`}>{t.subtitle}</p></div>
                    </div>
                    <div className={`mt-5 flex items-center gap-2 rounded-2xl border border-brand-line bg-brand-cream/65 px-4 py-3 text-xs text-brand-subtle dark:border-white/10 dark:bg-white/5 dark:text-slate-300 ${cls}`}><Lightbulb size={15} className="shrink-0 text-brand-saffron" />{t.note}</div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5 sm:mt-5 sm:gap-4">
                    {topics.map(([key, Icon, accent], index) => <CoachTopic key={key} icon={Icon} title={t[key]} answer={answers[key]} accent={accent} cls={cls} open={open === key} index={index} onToggle={() => setOpen(open === key ? null : key)} />)}
                </div>

                <div className="mt-4 rounded-3xl border border-brand-line bg-white p-5 dark:border-white/10 dark:bg-slate-950 sm:mt-5 sm:p-6">
                    <p className={`text-xs font-semibold uppercase tracking-[0.22em] text-brand-subtle dark:text-slate-300 ${cls}`}>{t.prompts}</p>
                    <div className="mt-4 flex flex-wrap gap-2">{topics.map(([key]) => <button type="button" key={key} onClick={() => setOpen(key)} className={`rounded-full border border-brand-line bg-brand-cream/50 px-3.5 py-2 text-xs text-brand-ink transition-colors hover:border-brand-teal hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 ${cls}`}>{t[key]}</button>)}</div>
                </div>
            </motion.div>
        </section>
    );
}

function CoachTopic({ icon: Icon, title, answer, accent, cls, open, index, onToggle }) {
    return <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.36, delay: index * 0.05, ease: 'easeOut' }} className={`rounded-3xl border bg-white shadow-[0_10px_30px_rgba(45,40,37,0.03)] transition-shadow hover:shadow-[0_16px_36px_rgba(45,40,37,0.07)] dark:border-white/10 dark:bg-slate-950 ${open ? 'border-brand-teal/50 ring-1 ring-brand-teal/15' : 'border-brand-line'}`}>
        <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-3 p-4 text-left sm:p-5"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-cream dark:bg-white/10 ${accent}`}><Icon size={16} /></span><span className={`min-w-0 flex-1 text-sm font-semibold text-brand-ink dark:text-white ${cls}`}>{title}</span><ChevronDown size={16} className={`shrink-0 text-brand-subtle transition-transform ${open ? 'rotate-180' : ''}`} /></button>
        <AnimatePresence initial={false}>{open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }} className="overflow-hidden"><div className={`border-t border-brand-line px-4 pb-5 pt-4 text-sm leading-relaxed text-brand-subtle dark:border-white/10 dark:text-slate-300 sm:px-5 ${cls}`}>{answer}</div></motion.div>}</AnimatePresence>
    </motion.div>;
}

function makeAnswers(info, lang) {
    if (lang === 'hi') return {
        career: `${info.nickname} के लिए ${info.careers.slice(0, 2).join(' और ')} जैसे रास्ते स्वाभाविक रूप से उपयुक्त हो सकते हैं। इस हफ्ते ऐसा एक काम चुनें जिसमें आपकी ${info.strengths[0]} की ताक़त स्पष्ट दिखाई दे।`,
        relationships: `${info.relationships} आज के लिए एक उपयोगी संकेत है। किसी करीबी व्यक्ति से एक खुला प्रश्न पूछें और समाधान देने से पहले पूरी बात सुनें।`,
        productivity: `अपनी ${info.strengths[0]} को मुख्य काम के लिए बचाएँ, और ${info.weaknesses[0]} के जोखिम को कम करने के लिए दिन की एक ही प्राथमिकता लिखें।`,
        leadership: `आपकी नेतृत्व क्षमता ${info.strengths.slice(0, 2).join(' और ')} में दिखती है। इस सप्ताह किसी को दिशा देने से पहले उनका दृष्टिकोण जानें।`,
        communication: `आपकी शैली ${info.headline} से शुरू होती है। एक बातचीत में स्पष्टता के साथ अपनी ज़रूरत कहें और सामने वाले के इरादे के बारे में जिज्ञासु रहें।`,
    };
    return {
        career: `Paths such as ${info.careers.slice(0, 2).join(' and ')} may naturally fit your profile. This week, choose one task where your strength in ${info.strengths[0].toLowerCase()} is visible.`,
        relationships: `${info.relationships} offers a useful cue for today. Ask someone close an open question, then listen fully before offering a solution.`,
        productivity: `Protect your ${info.strengths[0].toLowerCase()} for the most important work, and reduce the risk of ${info.weaknesses[0].toLowerCase()} by writing down one priority for the day.`,
        leadership: `Your leadership shows up through ${info.strengths.slice(0, 2).join(' and ').toLowerCase()}. This week, learn someone’s perspective before giving direction.`,
        communication: `Your style starts here: ${info.headline} In one conversation, state a need clearly while staying curious about the other person’s intent.`,
    };
}
