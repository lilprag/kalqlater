import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { TYPES } from '../data/types';

export default function TypeDetail() {
    const { code } = useParams();
    const { lang, t } = useLang();
    const hi = lang === 'hi';
    const cls = hi ? 'font-body-hi' : '';
    const clsH = hi ? 'font-display-hi' : 'font-display';

    const tp = TYPES[code?.toUpperCase()];
    if (!tp) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-32 text-center">
                <div className={`text-2xl text-brand-ink ${clsH}`}>{hi ? 'यह प्रकार नहीं मिला' : 'Type not found'}</div>
                <Link to="/types" className={`inline-block mt-6 rounded-full bg-brand-teal text-white px-6 py-3 ${cls}`}>{hi ? 'सभी प्रकार' : 'All types'}</Link>
            </div>
        );
    }
    const info = hi ? tp.hi : tp.en;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <Link to="/types" data-testid="back-to-types" className={`inline-flex items-center gap-2 text-brand-subtle hover:text-brand-ink ${cls}`}>
                <ArrowLeft size={16} /> {t.result.explore}
            </Link>

            <div className="mt-8 rounded-3xl bg-white border border-brand-line p-8 sm:p-12 relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-30" style={{ background: tp.color }} />
                <div className={`text-xs tracking-[0.3em] uppercase text-brand-subtle`}>{tp.group}</div>
                <div className="mt-2 flex flex-wrap items-baseline gap-4">
                    <div className={`text-5xl sm:text-7xl text-brand-ink ${clsH}`} style={{ color: tp.color }}>{tp.code}</div>
                    <div className={`text-3xl sm:text-4xl text-brand-ink ${clsH}`}>{info.nickname}</div>
                </div>
                <p className={`mt-4 max-w-2xl text-lg text-brand-subtle ${cls}`}>{info.headline}</p>
            </div>

            <div className="mt-6 rounded-3xl bg-white border border-brand-line p-8">
                <p className={`text-lg leading-relaxed text-brand-ink ${cls}`}>{info.description}</p>
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-6">
                <ListCard title={t.result.strengths} items={info.strengths} accent={tp.color} cls={cls} />
                <ListCard title={t.result.weaknesses} items={info.weaknesses} accent="#B35841" cls={cls} />
                <ListCard title={t.result.careers} items={info.careers} accent="#1F6C7D" cls={cls} />
                <div className="rounded-3xl bg-white border border-brand-line p-6">
                    <div className={`text-xs tracking-[0.25em] uppercase text-brand-subtle mb-3 ${cls}`}>{t.result.relationships}</div>
                    <p className={`text-brand-ink leading-relaxed ${cls}`}>{info.relationships}</p>
                </div>
            </div>

            <div className="mt-10 text-center">
                <Link to="/test" data-testid="cta-take-test" className={`inline-flex items-center gap-2 rounded-full bg-brand-teal text-white px-6 py-3 hover:bg-[#164E59] ${cls}`}>
                    {t.hero.cta} <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
}

function ListCard({ title, items, accent, cls }) {
    return (
        <div className="rounded-3xl bg-white border border-brand-line p-6">
            <div className={`text-xs tracking-[0.25em] uppercase text-brand-subtle mb-3 ${cls}`}>{title}</div>
            <ul className="space-y-2">
                {items.map((it, i) => (
                    <li key={i} className={`flex items-start gap-3 text-brand-ink ${cls}`}>
                        <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent }} />
                        <span>{it}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
