import React, { createContext, useContext, useEffect, useState } from 'react';
import { STRINGS } from '../data/i18n';
import { LS_LANG } from '../utils/scoring';

const LangContext = createContext(null);

export function LangProvider({ children }) {
    const [lang, setLang] = useState('hi');

    useEffect(() => {
        try {
            const saved = localStorage.getItem(LS_LANG);
            if (saved === 'hi' || saved === 'en') setLang(saved);
        } catch (e) { /* ignore */ }
    }, []);

    useEffect(() => {
        try { localStorage.setItem(LS_LANG, lang); } catch (e) { /* ignore */ }
        document.documentElement.lang = lang;
    }, [lang]);

    const t = STRINGS[lang];
    const toggle = () => setLang(lang === 'hi' ? 'en' : 'hi');

    return (
        <LangContext.Provider value={{ lang, setLang, toggle, t }}>
            {children}
        </LangContext.Provider>
    );
}

export const useLang = () => {
    const ctx = useContext(LangContext);
    if (!ctx) throw new Error('useLang must be used within LangProvider');
    return ctx;
};
