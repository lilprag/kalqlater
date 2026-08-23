import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../services/analytics';

const safeReturn = (value, fallback) => value && value.startsWith('/') && !value.startsWith('//') ? value : fallback;
const localeFrom = (value) => value?.match(/^\/(en|hi|fr|ja)(?:\/|$)/)?.[1];

export default function Auth({ mode }) {
  const auth = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  const params = new URLSearchParams(location.search);
  const requested = safeReturn(params.get('returnTo') || location.state?.from, '');
  const locale = params.get('locale') || localeFrom(requested) || 'en';
  const normalDestination = `/${locale}/dashboard`;
  const reset = mode === 'reset';
  const submit = async (event) => {
    event.preventDefault();
    if ((mode === 'signup' || reset) && password !== confirm) { setMessage('Passwords do not match.'); return; }
    setBusy(true);
    if (mode === 'signup') trackEvent('signup_start', { language: locale });
    try {
      if (mode === 'login') await auth.login(email, password);
      else if (mode === 'signup') await auth.signup(email, password);
      else if (mode === 'forgot') { await auth.forgotPassword(email); setMessage('If an account exists, a reset link will be sent.'); return; }
      else { await auth.resetPassword(params.get('token'), password); navigate(`/login?locale=${encodeURIComponent(locale)}`); return; }
      trackEvent(mode === 'signup' ? 'signup_success' : 'login_success', { language: locale });
      window.location.assign(safeReturn(requested, normalDestination));
    } catch {
      trackEvent(mode === 'signup' ? 'signup_failure' : 'login_failure', { language: locale });
      setMessage('We could not complete that request. Please check your details and try again.');
    } finally { setBusy(false); }
  };
  const title = mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : reset ? 'Choose a new password' : 'Reset your password';
  const query = `?locale=${encodeURIComponent(locale)}${requested ? `&returnTo=${encodeURIComponent(requested)}` : ''}`;
  return <main className="mx-auto max-w-md px-4 py-16"><form onSubmit={submit} className="rounded-3xl border border-brand-line bg-white p-8"><h1 className="text-3xl font-display">{title}</h1>{mode === 'signup' ? <p className="mt-3 text-sm text-brand-subtle">Community and career profiles are optional. Add them later when they are useful.</p> : null}{mode !== 'reset' && <label className="mt-6 block text-sm">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-xl border border-brand-line p-3" /></label>}{mode !== 'forgot' && <label className="mt-4 block text-sm">Password<input required minLength="10" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-xl border border-brand-line p-3" /></label>}{(mode === 'signup' || reset) && <label className="mt-4 block text-sm">Confirm password<input required type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} className="mt-1 w-full rounded-xl border border-brand-line p-3" /></label>}{message && <p role="alert" className="mt-4 text-sm text-brand-saffron">{message}</p>}<button disabled={busy} className="mt-6 w-full rounded-full bg-brand-teal p-3 text-white">{busy ? 'Please wait…' : mode === 'login' ? 'Login' : mode === 'signup' ? 'Sign up' : mode === 'forgot' ? 'Send reset link' : 'Save password'}</button><p className="mt-5 text-sm text-brand-subtle">{mode === 'login' ? <><Link to={`/signup${query}`}>Create account</Link> · <Link to="/forgot-password">Forgot password?</Link></> : <Link to={`/login${query}`}>Back to login</Link>}</p></form></main>;
}
