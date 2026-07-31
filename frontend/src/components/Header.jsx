import React, { useCallback, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CONNECTIONS_CHANGED, getPendingConnectionCount } from '../services/connectionService';

export default function Header() {
    const { lang, toggle, t } = useLang();
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);

    const baseLinks = [
        { to: '/', label: t.nav.home, id: 'nav-home' },
        { to: '/test', label: t.nav.test, id: 'nav-test' },
        { to: '/types', label: t.nav.types, id: 'nav-types' },
        { to: '/about', label: t.nav.about, id: 'nav-about' },
        { to: '/compare', label: lang === 'hi' ? 'तुलना' : 'Compare', id: 'nav-compare' },
        { to: '/community', label: lang === 'hi' ? 'कम्युनिटी' : 'Community', id: 'nav-community' },
        { to: '/contact', label: lang === 'hi' ? 'संपर्क' : 'Contact', id: 'nav-contact' },
    ];
    const links = user ? [...baseLinks, { to: '/community/connections', label: lang === 'hi' ? 'कनेक्शन' : 'Connections', id: 'nav-connections', badge: pendingCount }] : baseLinks;

    const refreshPendingCount = useCallback(async () => {
        if (!user) { setPendingCount(0); return; }
        try { setPendingCount((await getPendingConnectionCount()).count || 0); } catch { setPendingCount(0); }
    }, [user]);

    useEffect(() => {
        refreshPendingCount();
        window.addEventListener(CONNECTIONS_CHANGED, refreshPendingCount);
        return () => window.removeEventListener(CONNECTIONS_CHANGED, refreshPendingCount);
    }, [refreshPendingCount]);

    return (
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-brand-line">
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand-teal focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
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
                            {l.label}{l.badge > 0 && <span className="ml-1 inline-grid min-w-5 place-items-center rounded-full bg-brand-saffron px-1.5 py-0.5 text-xs font-bold text-brand-ink" aria-label={`${l.badge} pending connection requests`}>{l.badge}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-2">
                            {user ? <><Link to="/community/profile" className="px-3 py-2 text-sm text-brand-ink hover:text-brand-teal">My Profile</Link><button onClick={logout} className="rounded-full border border-brand-line px-3 py-2 text-sm text-brand-ink">Logout</button></> : <><Link to="/login" className="px-3 py-2 text-sm text-brand-ink hover:text-brand-teal">Login</Link><Link to="/signup" className="rounded-full bg-brand-teal px-4 py-2 text-sm font-semibold text-white">Sign Up</Link></>}
                    </div>
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
                        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={open}
                        aria-controls="mobile-navigation"
                        className="md:hidden w-9 h-9 rounded-full border border-brand-line flex items-center justify-center"
                    >
                        {open ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            {open && (
                <div id="mobile-navigation" className="md:hidden border-t border-brand-line bg-white">
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
                                {l.label}{l.badge > 0 ? ` (${l.badge})` : ''}
                            </NavLink>
                        ))}
                        <div className="border-t border-brand-line pt-2">{user ? <><Link to="/community/profile" onClick={() => setOpen(false)} className="block px-4 py-3 text-brand-ink">My Profile</Link><button onClick={() => { logout(); setOpen(false); }} className="w-full px-4 py-3 text-left text-brand-ink">Logout</button></> : <><Link to="/login" onClick={() => setOpen(false)} className="block px-4 py-3 text-brand-ink">Login</Link><Link to="/signup" onClick={() => setOpen(false)} className="block rounded-2xl bg-brand-teal px-4 py-3 font-semibold text-white">Sign Up</Link></>}</div>
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
