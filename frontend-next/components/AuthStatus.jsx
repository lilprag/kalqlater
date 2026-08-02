'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { productionAppUrl } from '../lib/site';

const AUTH_TOKEN_KEY = 'kalqlater_auth_token';
const AUTH_EXPIRED_EVENT = 'kalqlater:auth-expired';
const AUTH_CHANGED_EVENT = 'kalqlater:auth-changed';
const AuthStatusContext = createContext({ status: 'loading', logout: () => {} });

function backendUrl() {
  return (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '');
}

export function AuthStatusProvider({ locale, children }) {
  const [status, setStatus] = useState('loading');
  const validationVersion = useRef(0);
  const validate = useCallback(async () => {
    const version = ++validationVersion.current;
    if (typeof window === 'undefined') return;
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token || !backendUrl()) { if (version === validationVersion.current) setStatus('guest'); return; }
    try {
      const response = await fetch(`${backendUrl()}/api/community/me`, { headers: { Authorization: `Bearer ${token}` }, credentials: 'omit' });
      if (!response.ok) throw new Error('Session validation failed');
      if (version === validationVersion.current) setStatus('authenticated');
    } catch {
      // Match the established CRA AuthContext behaviour: an invalid or unusable
      // session is cleared, while no profile/email/token data is ever rendered.
      if (version === validationVersion.current) {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
        setStatus('guest');
      }
    }
  }, []);
  useEffect(() => {
    const initialValidation = window.setTimeout(validate, 0);
    const onStorage = (event) => { if (event.key === AUTH_TOKEN_KEY) validate(); };
    const onAuthChange = () => validate();
    window.addEventListener('storage', onStorage);
    window.addEventListener(AUTH_EXPIRED_EVENT, onAuthChange);
    window.addEventListener(AUTH_CHANGED_EVENT, onAuthChange);
    window.addEventListener('focus', onAuthChange);
    return () => {
      window.clearTimeout(initialValidation);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(AUTH_EXPIRED_EVENT, onAuthChange);
      window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChange);
      window.removeEventListener('focus', onAuthChange);
    };
  }, [validate]);
  const logout = useCallback(() => {
    validationVersion.current += 1;
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    setStatus('guest');
    window.location.assign(`/${locale}`);
  }, [locale]);
  const value = useMemo(() => ({ status, logout }), [status, logout]);
  return <AuthStatusContext.Provider value={value}>{children}</AuthStatusContext.Provider>;
}

export function useAuthStatus() { return useContext(AuthStatusContext); }

export function AuthConnectionsLink({ copy }) {
  const { status } = useAuthStatus();
  if (status !== 'authenticated') return status === 'loading' ? <span className="hidden h-8 w-20 rounded-full bg-brand-cream xl:block" aria-hidden="true" /> : null;
  return <a href={productionAppUrl('/community/connections')} className="rounded-full px-3 py-2 text-sm font-medium text-brand-subtle transition-colors hover:bg-brand-cream hover:text-brand-ink">{copy.connections}</a>;
}

export function AuthDesktopActions({ copy }) {
  const { status, logout } = useAuthStatus();
  if (status === 'loading') return <div className="hidden h-10 min-w-[11.5rem] animate-pulse rounded-full bg-brand-cream xl:block" aria-label={copy.checking} role="status" />;
  if (status === 'authenticated') return <div className="hidden min-w-[11.5rem] items-center justify-end gap-1 xl:flex"><a href={productionAppUrl('/community/me')} className="rounded-full px-3 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-cream">{copy.profile}</a><button type="button" onClick={logout} className="rounded-full border border-brand-line px-3 py-2 text-sm font-semibold text-brand-ink transition-colors hover:border-brand-teal hover:text-brand-teal">{copy.logout}</button></div>;
  return <div className="hidden min-w-[11.5rem] items-center justify-end gap-1 xl:flex"><a href={productionAppUrl('/login')} className="rounded-full px-3 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-cream">{copy.login}</a><a href={productionAppUrl('/signup')} className="rounded-full bg-brand-teal px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(31,108,125,.18)] transition-all hover:-translate-y-0.5 hover:bg-[#164E59]">{copy.signup}</a></div>;
}

export function AuthMobileActions({ copy, closeMenu }) {
  const { status, logout } = useAuthStatus();
  if (status === 'loading') return <p className="px-4 py-3 text-sm text-brand-subtle" role="status">{copy.checking}</p>;
  if (status === 'authenticated') return <><a href={productionAppUrl('/community/me')} onClick={closeMenu} className="block rounded-2xl px-4 py-3 font-semibold text-brand-ink hover:bg-brand-cream">{copy.profile}</a><button type="button" onClick={() => { closeMenu(); logout(); }} className="block w-full rounded-2xl px-4 py-3 text-left font-semibold text-brand-ink hover:bg-brand-cream">{copy.logout}</button></>;
  return <><a href={productionAppUrl('/login')} onClick={closeMenu} className="block rounded-2xl px-4 py-3 font-semibold text-brand-ink hover:bg-brand-cream">{copy.login}</a><a href={productionAppUrl('/signup')} onClick={closeMenu} className="button-primary mx-4 mt-1">{copy.signup}</a></>;
}
