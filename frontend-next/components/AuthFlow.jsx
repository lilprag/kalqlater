'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authRequest, persistCompatibilityToken, safeReturnTarget } from '../lib/auth';
import { dispatchBrowserAnalytics } from '../lib/analytics';

const COPY = {
  en: { login: 'Welcome back', signup: 'Create your account', forgot: 'Reset your password', reset: 'Choose a new password', email: 'Email', password: 'Password', confirm: 'Confirm password', loginButton: 'Log in', signupButton: 'Create account', forgotButton: 'Send reset link', resetButton: 'Save password', waiting: 'Please wait…', forgotLink: 'Forgot password?', signupLink: 'Create an account', loginLink: 'Back to login', mismatch: 'Passwords do not match.', failed: 'We could not complete that request. Check your details and try again.', sent: 'If an account exists, reset instructions will be sent.', resetDone: 'Password updated. You can now log in.', minimal: 'Start with your credentials. Community and career profiles are optional and can be completed later.' },
  hi: { login: 'फिर से स्वागत है', signup: 'अपना अकाउंट बनाएँ', forgot: 'अपना पासवर्ड रीसेट करें', reset: 'नया पासवर्ड चुनें', email: 'ईमेल', password: 'पासवर्ड', confirm: 'पासवर्ड की पुष्टि करें', loginButton: 'लॉग इन करें', signupButton: 'अकाउंट बनाएँ', forgotButton: 'रीसेट लिंक भेजें', resetButton: 'पासवर्ड सेव करें', waiting: 'कृपया प्रतीक्षा करें…', forgotLink: 'पासवर्ड भूल गए?', signupLink: 'अकाउंट बनाएँ', loginLink: 'लॉग इन पर वापस जाएँ', mismatch: 'पासवर्ड मेल नहीं खाते।', failed: 'अनुरोध पूरा नहीं हो सका। अपनी जानकारी जाँचकर फिर कोशिश करें।', sent: 'यदि अकाउंट मौजूद है, तो रीसेट निर्देश भेजे जाएँगे।', resetDone: 'पासवर्ड अपडेट हो गया। अब आप लॉग इन कर सकते हैं।', minimal: 'शुरुआत केवल लॉगिन जानकारी से करें। कम्युनिटी और करियर प्रोफ़ाइल बाद में वैकल्पिक रूप से पूरी की जा सकती हैं।' },
  fr: { login: 'Ravi de vous revoir', signup: 'Créez votre compte', forgot: 'Réinitialisez votre mot de passe', reset: 'Choisissez un nouveau mot de passe', email: 'Adresse e-mail', password: 'Mot de passe', confirm: 'Confirmer le mot de passe', loginButton: 'Se connecter', signupButton: 'Créer mon compte', forgotButton: 'Envoyer le lien', resetButton: 'Enregistrer le mot de passe', waiting: 'Veuillez patienter…', forgotLink: 'Mot de passe oublié ?', signupLink: 'Créer un compte', loginLink: 'Retour à la connexion', mismatch: 'Les mots de passe ne correspondent pas.', failed: 'Impossible de terminer cette demande. Vérifiez vos informations et réessayez.', sent: 'Si un compte existe, les instructions de réinitialisation seront envoyées.', resetDone: 'Mot de passe mis à jour. Vous pouvez maintenant vous connecter.', minimal: 'Commencez avec vos identifiants. Les profils Communauté et carrière restent facultatifs et peuvent être complétés plus tard.' },
  ja: { login: 'おかえりなさい', signup: 'アカウントを作成', forgot: 'パスワードを再設定', reset: '新しいパスワードを設定', email: 'メールアドレス', password: 'パスワード', confirm: 'パスワード（確認）', loginButton: 'ログイン', signupButton: 'アカウントを作成', forgotButton: '再設定リンクを送信', resetButton: 'パスワードを保存', waiting: 'しばらくお待ちください…', forgotLink: 'パスワードをお忘れですか？', signupLink: 'アカウントを作成', loginLink: 'ログインに戻る', mismatch: 'パスワードが一致しません。', failed: '手続きを完了できませんでした。入力内容を確認して、もう一度お試しください。', sent: 'アカウントが存在する場合、再設定の案内を送信します。', resetDone: 'パスワードを更新しました。ログインできます。', minimal: 'まずはログイン情報だけで始められます。コミュニティやキャリアのプロフィールは、必要なときに任意で追加できます。' },
};

export function AuthFlow({ locale, mode }) {
  const copy = COPY[locale] || COPY.en;
  const router = useRouter(); const params = useSearchParams();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  const returnTarget = useMemo(() => safeReturnTarget(params.get('returnTo'), locale), [locale, params]);
  const token = params.get('token') || '';
  useEffect(() => { dispatchBrowserAnalytics(mode === 'login' ? 'login_view' : mode === 'signup' ? 'signup_view' : 'auth_recovery_view', { locale, mode }); }, [locale, mode]);
  async function submit(event) {
    event.preventDefault(); setMessage('');
    if ((mode === 'signup' || mode === 'reset') && password !== confirm) { setMessage(copy.mismatch); return; }
    setBusy(true);
    const startEvent = mode === 'signup' ? 'signup_start' : mode === 'forgot' ? 'forgot_password_start' : null;
    if (startEvent) dispatchBrowserAnalytics(startEvent, { locale });
    try {
      const path = mode === 'login' ? '/login' : mode === 'signup' ? '/signup' : mode === 'forgot' ? '/forgot-password' : '/reset-password';
      const payload = mode === 'forgot' ? { email } : mode === 'reset' ? { token, password } : { email, password };
      const response = await authRequest(path, { method: 'POST', body: JSON.stringify(payload) });
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (mode === 'forgot') { setMessage(copy.sent); return; }
      if (mode === 'reset') { dispatchBrowserAnalytics('reset_password_success', { locale }); setMessage(copy.resetDone); return; }
      persistCompatibilityToken(data.token, data.csrf_token);
      dispatchBrowserAnalytics(mode === 'signup' ? 'signup_success' : 'login_success', { locale });
      if (params.get('returnTo')) dispatchBrowserAnalytics('auth_continuation_completed', { locale, kind: returnTarget.includes('/jobs/') ? (returnTarget.includes('apply=1') ? 'job_apply' : returnTarget.includes('save=1') ? 'job_save' : 'internal') : 'internal' });
      window.dispatchEvent(new Event('kalqlater:auth-changed'));
      router.replace(returnTarget);
    } catch {
      dispatchBrowserAnalytics(mode === 'signup' ? 'signup_failure' : 'login_failure', { locale });
      setMessage(copy.failed);
    } finally { setBusy(false); }
  }
  const title = copy[mode];
  return <main className="mx-auto max-w-md px-4 py-14 sm:py-20"><form onSubmit={submit} className="rounded-[2rem] border border-brand-line bg-white p-7 shadow-sm sm:p-9"><p className="section-kicker">KalQLater</p><h1 className="display-font mt-3 text-4xl text-brand-ink">{title}</h1>{mode === 'signup' ? <p className="mt-4 text-sm leading-relaxed text-brand-subtle">{copy.minimal}</p> : null}{mode !== 'reset' ? <label className="mt-7 block text-sm font-semibold">{copy.email}<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-brand-line p-3 font-normal" /></label> : null}{mode !== 'forgot' ? <label className="mt-4 block text-sm font-semibold">{copy.password}<input required minLength="10" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-brand-line p-3 font-normal" /></label> : null}{mode === 'signup' || mode === 'reset' ? <label className="mt-4 block text-sm font-semibold">{copy.confirm}<input required type="password" autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} className="mt-2 w-full rounded-xl border border-brand-line p-3 font-normal" /></label> : null}{message ? <p role="status" className="mt-5 rounded-xl bg-brand-cream p-4 text-sm text-brand-ink">{message}</p> : null}<button disabled={busy} className="button-primary mt-6 w-full">{busy ? copy.waiting : copy[`${mode}Button`]}</button><p className="mt-5 text-sm text-brand-subtle">{mode === 'login' ? <><Link href={`/${locale}/signup?returnTo=${encodeURIComponent(returnTarget)}`}>{copy.signupLink}</Link> · <Link href={`/${locale}/forgot-password`}>{copy.forgotLink}</Link></> : <Link href={`/${locale}/login?returnTo=${encodeURIComponent(returnTarget)}`}>{copy.loginLink}</Link>}</p></form></main>;
}
