import React from 'react';
import { motion } from 'framer-motion';
import { Ear, Handshake, HeartHandshake, MessageCircle, MessagesSquare, Lightbulb } from 'lucide-react';
import { COMMUNICATION_INSIGHTS } from '../../data/insights/communication';

const labels = {
    en: { title: 'Communication Style', summary: 'Communication Summary', preferred: 'Preferred Communication', conflict: 'Conflict Style', listening: 'Listening Style', negotiation: 'Negotiation Style', tips: 'Communication Tips' },
    hi: { title: 'संवाद शैली', summary: 'संवाद सारांश', preferred: 'पसंदीदा संवाद', conflict: 'टकराव की शैली', listening: 'सुनने की शैली', negotiation: 'बातचीत की शैली', tips: 'संवाद सुझाव' },
};

export default function CommunicationCard({ typeCode, lang }) {
    const insight = COMMUNICATION_INSIGHTS[typeCode];
    if (!insight) return null;

    const copy = insight[lang] || insight.en;
    const t = labels[lang] || labels.en;
    const cls = lang === 'hi' ? 'font-body-hi' : '';
    const clsH = lang === 'hi' ? 'font-display-hi' : 'font-display';

    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20" data-testid="communication-style">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, ease: 'easeOut' }} className="rounded-[2rem] border border-brand-line bg-brand-cream/65 p-4 shadow-[0_20px_60px_rgba(45,40,37,0.06)] sm:p-7 lg:p-8">
                <div className="flex items-center gap-3 rounded-3xl border border-brand-line/70 bg-white/75 p-4 sm:p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-plum text-white shadow-[0_8px_20px_rgba(110,69,85,0.22)]"><MessagesSquare size={19} /></span>
                    <div>
                        <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-plum ${cls}`}>Premium insight</p>
                        <h2 className={`mt-0.5 text-2xl leading-tight text-brand-ink sm:text-3xl ${clsH}`}>{t.title}</h2>
                    </div>
                </div>

                <Detail icon={MessageCircle} title={t.summary} content={copy.summary} accent="text-brand-plum" cls={cls} wide />
                <div className="mt-4 grid gap-4 md:grid-cols-2 sm:mt-5 sm:gap-5">
                    <Detail icon={HeartHandshake} title={t.preferred} content={copy.preferred} accent="text-brand-teal" cls={cls} />
                    <Detail icon={MessagesSquare} title={t.conflict} content={copy.conflict} accent="text-brand-saffron" cls={cls} />
                    <Detail icon={Ear} title={t.listening} content={copy.listening} accent="text-brand-plum" cls={cls} />
                    <Detail icon={Handshake} title={t.negotiation} content={copy.negotiation} accent="text-brand-teal" cls={cls} />
                </div>
                <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="mt-4 rounded-3xl border border-brand-line bg-white p-5 shadow-[0_10px_30px_rgba(45,40,37,0.03)] transition-shadow hover:shadow-[0_16px_36px_rgba(45,40,37,0.07)] sm:mt-5 sm:p-6">
                    <div className={`flex items-center gap-2 text-sm font-semibold text-brand-saffron ${cls}`}><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-cream"><Lightbulb size={16} /></span>{t.tips}</div>
                    <ul className={`mt-4 grid gap-3 text-[15px] leading-relaxed text-brand-ink sm:grid-cols-3 ${cls}`}>{copy.tips.map((tip) => <li key={tip} className="flex gap-3"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-sand" />{tip}</li>)}</ul>
                </motion.div>
            </motion.div>
        </section>
    );
}

function Detail({ icon: Icon, title, content, accent, cls, wide }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.38, ease: 'easeOut' }} className={`${wide ? 'mt-4 sm:mt-5' : ''} h-full rounded-3xl border border-brand-line bg-white p-5 shadow-[0_10px_30px_rgba(45,40,37,0.03)] transition-shadow hover:shadow-[0_16px_36px_rgba(45,40,37,0.07)] sm:p-6`}>
            <div className={`flex items-center gap-2 text-sm font-semibold ${accent} ${cls}`}><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-cream"><Icon size={16} /></span>{title}</div>
            <p className={`mt-4 text-[15px] leading-relaxed text-brand-ink ${cls}`}>{content}</p>
        </motion.div>
    );
}
