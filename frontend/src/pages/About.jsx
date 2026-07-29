import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';

export default function About() {
    const { lang, t } = useLang();
    const hi = lang === 'hi';
    const cls = hi ? 'font-body-hi' : '';
    const clsH = hi ? 'font-display-hi' : 'font-display';

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className={`text-4xl sm:text-5xl text-brand-ink ${clsH}`} data-testid="about-title">{t.about.title}</h1>
            <div className={`mt-8 space-y-5 text-lg leading-relaxed text-brand-ink ${cls}`}>
                <p>{t.about.p1}</p>
                <p>{t.about.p2}</p>
                <p className="text-brand-subtle italic">{t.about.p3}</p>
            </div>
            <div className="mt-10">
                <Link to="/test" data-testid="about-cta" className={`inline-flex items-center rounded-full bg-brand-teal text-white px-6 py-3 hover:bg-[#164E59] ${cls}`}>
                    {t.hero.cta}
                </Link>
            </div>
        </div>
    );
}
