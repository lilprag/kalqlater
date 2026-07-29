import React from 'react';
import { useLang } from '../context/LangContext';

export default function Privacy() {
    const { lang, t } = useLang();
    const hi = lang === 'hi';
    const cls = hi ? 'font-body-hi' : '';
    const clsH = hi ? 'font-display-hi' : 'font-display';

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className={`text-4xl sm:text-5xl text-brand-ink ${clsH}`} data-testid="privacy-title">{t.privacy.title}</h1>
            <p className={`mt-6 text-lg leading-relaxed text-brand-ink ${cls}`}>{t.privacy.body}</p>
        </div>
    );
}
