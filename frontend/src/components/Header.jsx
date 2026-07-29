import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { Menu, X, Sparkles } from 'lucide-react';

export default function Header() {
    const { lang, toggle, t } = useLang();
    const [open, setOpen] = useState(false);

    const links = [
        { to: '/', label: t.nav.home, id: 'nav-home' },
        { to: '/test', label: t.nav.test, id: 'nav-test' },
        { to: '/types', label: t.nav.types, id: 'nav-types' },
        { to: '/about', label: t.nav.about, id: 'nav-about' },
    ];

    return (
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-brand-line">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link to="/" data-testid="logo-link" className="flex items-center gap-2 group">
                    <span className="w-9 h-9 rounded-2xl bg-gradient-to-br from-brand-saffron to-brand-plum flex items-center justify-center text-white shadow-sm">
                        <Sparkles size={18} />
                    </span>
                    <span className={`font-display text-xl text-brand-ink group-hover:text-brand-teal transition-colors ${lang === 'hi' ? 'font-display-hi' : ''}`}>
                        {t.siteName}
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    {links.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            end={l.to === '/'}
                            data-testid={l.id}
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-full text-sm transition-colors ${
                                    isActive
                                        ? 'bg-brand-cream text-brand-ink font-medium'
                                        : 'text-brand-subtle hover:text-brand-ink hover:bg-brand-cream/60'
                                } ${lang === 'hi' ? 'font-body-hi' : ''}`
                            }
                        >
                            {l.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <button
                        data-testid="lang-toggle"
                        onClick={toggle}
                        className="hidden sm:inline-flex items-center gap-2 px-3 h-9 rounded-full border border-brand-line bg-white hover:bg-brand-cream text-sm text-brand-ink transition-colors"
                    >
                        <span className={lang === 'hi' ? 'font-semibold text-brand-teal' : 'text-brand-subtle'}>हिं</span>
                        <span className="text-brand-line">|</span>
                        <span className={lang === 'en' ? 'font-semibold text-brand-teal' : 'text-brand-subtle'}>EN</span>
                    </button>
                    <button
                        data-testid="mobile-menu-toggle"
                        onClick={() => setOpen(!open)}
                        className="md:hidden w-9 h-9 rounded-full border border-brand-line flex items-center justify-center"
                    >
                        {open ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            {open && (
                <div className="md:hidden border-t border-brand-line bg-white">
                    <div className="px-4 py-4 space-y-2">
                        {links.map((l) => (
                            <NavLink
                                key={l.to}
                                to={l.to}
                                end={l.to === '/'}
                                onClick={() => setOpen(false)}
                                data-testid={`mobile-${l.id}`}
                                className={({ isActive }) =>
                                    `block px-4 py-3 rounded-2xl transition-colors ${
                                        isActive ? 'bg-brand-cream text-brand-ink' : 'text-brand-subtle hover:bg-brand-cream'
                                    } ${lang === 'hi' ? 'font-body-hi' : ''}`
                                }
                            >
                                {l.label}
                            </NavLink>
                        ))}
                        <button
                            data-testid="mobile-lang-toggle"
                            onClick={toggle}
                            className="w-full mt-2 px-4 py-3 rounded-2xl border border-brand-line flex items-center justify-center gap-3"
                        >
                            <span className={lang === 'hi' ? 'font-semibold text-brand-teal' : ''}>हिंदी</span>
                            <span className="text-brand-line">|</span>
                            <span className={lang === 'en' ? 'font-semibold text-brand-teal' : ''}>English</span>
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
