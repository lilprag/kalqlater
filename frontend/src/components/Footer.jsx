import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { Heart } from 'lucide-react';

export default function Footer() {
    const { lang, t } = useLang();
    const cls = lang === 'hi' ? 'font-body-hi' : '';
    return (
        <footer className="mt-24 border-t border-brand-line bg-brand-cream/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-6 md:grid-cols-3">
                <div>
                    <div className={`font-display text-xl text-brand-ink ${lang === 'hi' ? 'font-display-hi' : ''}`}>{t.siteName}</div>
                    <p className={`mt-2 text-sm text-brand-subtle ${cls}`}>{t.tagline}</p>
                </div>
                <div className={`text-sm text-brand-subtle ${cls}`}>
                    <div className="mb-2 font-medium text-brand-ink">{t.nav.about}</div>
                    <div className="flex flex-col gap-1">
                        <Link to="/about" data-testid="footer-about" className="hover:text-brand-teal">{t.nav.about}</Link>
                        <Link to="/types" data-testid="footer-types" className="hover:text-brand-teal">{t.nav.types}</Link>
                        <Link to="/privacy" data-testid="footer-privacy" className="hover:text-brand-teal">{t.footer.privacy}</Link>
                        <Link to="/terms" className="hover:text-brand-teal">{t.footer.terms}</Link>
                        <Link to="/contact" className="hover:text-brand-teal">{lang === 'hi' ? 'संपर्क' : 'Contact'}</Link>
                    </div>
                </div>
                <div className={`text-sm text-brand-subtle ${cls}`}>
                    <div className="flex items-center gap-1">
                        {t.footer.madeIn} <Heart size={14} className="text-brand-saffron fill-brand-saffron" />
                    </div>
                    <div className="mt-2">© {new Date().getFullYear()} {t.siteName}. {t.footer.rights}.</div>
                </div>
            </div>
        </footer>
    );
}
