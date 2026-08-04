'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { communicationInsightsApi } from '../../lib/communication-insights-api';
import { insightsCopy } from '../../data/communication-insights';

const storageKey = 'kalqlater.communication-insights.session';
const idempotencyKey = () => `${Date.now()}-${crypto.randomUUID()}`;
const messageFor = (error, locale) => {
  const hi = locale === 'hi';
  if (error?.code === 'expired') return hi ? 'यह सत्र समाप्त हो गया है। आप नया आत्मचिंतन शुरू कर सकते/सकती हैं।' : 'This session has expired. You can begin a new reflection.';
  if (error?.code === 'timeout') return hi ? 'सेवा को जवाब देने में समय लगा। अपना कनेक्शन जाँचें और फिर कोशिश करें।' : 'The service took too long to respond. Check your connection and try again.';
  if (error?.code === 'unavailable') return hi ? 'यह अनुभव अभी प्रकाशित नहीं है। समीक्षा पूरी होने पर यह उपलब्ध होगा।' : 'This experience is not published yet. It will be available after content review is complete.';
  return hi ? 'यह कदम पूरा नहीं हो सका। कृपया फिर कोशिश करें।' : 'That step could not be completed. Please try again.';
};

function readSaved() { try { return JSON.parse(window.sessionStorage.getItem(storageKey) || 'null'); } catch { return null; } }
function saveSession(value) { window.sessionStorage.setItem(storageKey, JSON.stringify(value)); }

export function StartAssessment({ locale }) {
  const router = useRouter(); const copy = insightsCopy(locale); const [state, setState] = useState('idle'); const [error, setError] = useState(''); const abortRef = useRef();
  useEffect(() => () => abortRef.current?.abort(), []);
  const begin = async () => {
    abortRef.current?.abort(); const controller = new AbortController(); abortRef.current = controller; setState('loading'); setError('');
    try {
      const created = await communicationInsightsApi.createSession(locale, undefined, controller.signal);
      saveSession({ sessionId: created.session_id, accessToken: created.access_token, locale, analyzerVersion: 'pending', currentStep: 0 });
      router.push(`/${locale}/insights/communication/session/${created.session_id}`);
    } catch (issue) { setError(messageFor(issue, locale)); setState('idle'); }
  };
  return <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-16"><div className="content-hero rounded-[2rem] border border-brand-line px-6 py-9 sm:px-10 sm:py-12"><p className="section-kicker">KalQLater · {copy.title}</p><h1 className="display-font mt-3 text-4xl text-brand-ink sm:text-5xl">{copy.startTitle}</h1><p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-subtle">{copy.startBody}</p><ul className="mt-8 grid gap-3 sm:grid-cols-3">{[[copy.time, '◷'], [copy.privacy, '◌'], [copy.safety, '◇']].map(([text, icon]) => <li key={text} className="rounded-2xl bg-white p-4 text-sm leading-relaxed text-brand-subtle"><span aria-hidden="true" className="mr-2 font-bold text-brand-teal">{icon}</span>{text}</li>)}</ul><p className="mt-7 rounded-xl border-l-2 border-brand-saffron bg-brand-sand/20 px-4 py-3 text-sm text-brand-ink">{locale === 'hi' ? 'अपनी प्रतिक्रिया उसी आधार पर चुनें जो आप सामान्यतः करते/करती हैं, न कि जो आदर्श लगता है।' : 'Choose what you would usually do, not what seems ideal.'}</p>{error ? <p role="alert" className="mt-5 rounded-xl bg-brand-plum/10 p-4 text-sm text-brand-ink">{error}</p> : null}<button type="button" className="button-primary mt-8" onClick={begin} disabled={state === 'loading'}>{state === 'loading' ? (locale === 'hi' ? 'शुरू हो रहा है…' : 'Starting…') : copy.start}<span aria-hidden="true">→</span></button><p className="mt-4 text-xs text-brand-subtle">{locale === 'hi' ? 'प्रकाशित होने से पहले यह अनुभव समीक्षा में है।' : 'This experience is under review before publication.'}</p></div></section>;
}

export function ScenarioFlow({ locale, sessionId }) {
  const router = useRouter(); const [scenario, setScenario] = useState(null); const [choice, setChoice] = useState(''); const [state, setState] = useState('loading'); const [error, setError] = useState(''); const abortRef = useRef();
  const load = useCallback(async () => {
    const saved = readSaved();
    if (!saved || saved.sessionId !== sessionId || saved.locale !== locale) { setState('invalid'); return; }
    abortRef.current?.abort(); const controller = new AbortController(); abortRef.current = controller; setState('loading'); setError('');
    try { const [, next] = await Promise.all([communicationInsightsApi.session(sessionId, saved.accessToken, controller.signal), communicationInsightsApi.next(sessionId, saved.accessToken, controller.signal)]); if (!next.scenario) { router.replace(`/${locale}/insights/communication/result/${saved.resultId || ''}`); return; } setScenario(next.scenario); setChoice(''); setState('ready'); }
    catch (issue) { setState('error'); setError(messageFor(issue, locale)); }
  }, [locale, router, sessionId]);
  useEffect(() => { const timer = window.setTimeout(() => { void load(); }, 0); return () => { window.clearTimeout(timer); abortRef.current?.abort(); }; }, [load]);
  const submit = async () => {
    if (!choice || !scenario || state === 'submitting') return; const saved = readSaved(); setState('submitting'); setError('');
    try { await communicationInsightsApi.submit(sessionId, saved.accessToken, { scenario_id: scenario.scenario_id, option_id: choice, idempotency_key: idempotencyKey() }); saveSession({ ...saved, currentStep: scenario.progress.answered + 1 }); const next = await communicationInsightsApi.next(sessionId, saved.accessToken); if (next.scenario) { setScenario(next.scenario); setChoice(''); setState('ready'); return; } const complete = await communicationInsightsApi.complete(sessionId, saved.accessToken); saveSession({ ...saved, resultId: complete.result_id, currentStep: scenario.progress.total }); router.replace(`/${locale}/insights/communication/result/${complete.result_id}`); } catch (issue) { setState('ready'); setError(messageFor(issue, locale)); }
  };
  if (state === 'invalid') return <FlowNotice locale={locale} title={locale === 'hi' ? 'सत्र उपलब्ध नहीं है' : 'This session is not available'} body={locale === 'hi' ? 'नया आत्मचिंतन शुरू करें।' : 'Begin a new reflection to continue.'} />;
  if (state === 'loading') return <FlowNotice locale={locale} title={locale === 'hi' ? 'आपके पैटर्न समझ रहे हैं…' : 'Understanding your communication patterns…'} body={locale === 'hi' ? 'आपकी जगह सुरक्षित रखी जा रही है।' : 'Holding your place while the next situation loads.'} />;
  if (state === 'error' || !scenario) return <FlowNotice locale={locale} title={locale === 'hi' ? 'फिर कोशिश करें' : 'Try again'} body={error} action={load} />;
  const answered = scenario.progress.answered; const total = scenario.progress.total; const progress = Math.round((answered / total) * 100);
  return <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12"><div className="rounded-[2rem] border border-brand-line bg-white p-5 shadow-[0_20px_50px_rgba(45,40,37,.06)] sm:p-9"><div className="flex items-center justify-between gap-4"><p className="section-kicker">{scenario.category}</p><p className="text-sm text-brand-subtle"><span className="sr-only">{locale === 'hi' ? 'प्रगति ' : 'Progress '}</span>{answered + 1} / {total}</p></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-cream" role="progressbar" aria-label={locale === 'hi' ? 'आत्मचिंतन की प्रगति' : 'Reflection progress'} aria-valuemin="0" aria-valuemax={total} aria-valuenow={answered}><span className="block h-full rounded-full bg-brand-teal transition-[width]" style={{ width: `${progress}%` }} /></div><p className="mt-8 text-sm font-medium text-brand-teal">{locale === 'hi' ? 'आप सामान्यतः क्या करते/करती हैं?' : 'What would you usually do?'}</p><h1 className="display-font mt-3 text-3xl leading-tight text-brand-ink sm:text-4xl">{scenario.prompt}</h1><fieldset className="mt-8"><legend className="sr-only">{locale === 'hi' ? 'अपनी प्रतिक्रिया चुनें' : 'Choose your response'}</legend><div className="grid gap-3">{scenario.options.map((option, index) => <label key={option.id} className={`group flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition sm:p-5 ${choice === option.id ? 'border-brand-teal bg-brand-teal/5 shadow-sm' : 'border-brand-line bg-brand-bg hover:border-brand-teal/60'}`}><input className="mt-1 h-5 w-5 accent-brand-teal" type="radio" name="response" value={option.id} checked={choice === option.id} onChange={() => setChoice(option.id)} /><span className="min-w-0"><span className="text-xs font-bold uppercase tracking-wide text-brand-teal">{String.fromCharCode(65 + index)}</span><span className="mt-1 block leading-relaxed text-brand-ink">{option.text}</span></span></label>)}</div></fieldset>{error ? <p role="alert" className="mt-5 rounded-xl bg-brand-plum/10 p-4 text-sm text-brand-ink">{error}</p> : null}<div className="mt-8 flex items-center justify-between gap-3"><button type="button" className="text-sm font-semibold text-brand-subtle underline underline-offset-4" onClick={() => router.back()}>{locale === 'hi' ? 'वापस' : 'Back'}</button><button type="button" className="button-primary" onClick={submit} disabled={!choice || state === 'submitting'}>{state === 'submitting' ? (locale === 'hi' ? 'सहेज रहे हैं…' : 'Saving…') : (locale === 'hi' ? 'जारी रखें' : 'Continue')} <span aria-hidden="true">→</span></button></div><p className="mt-5 text-center text-xs text-brand-subtle">{locale === 'hi' ? 'आपकी जगह इस ब्राउज़र सत्र में सुरक्षित रहती है।' : 'Your place is held in this browser session.'}</p></div></section>;
}

function FlowNotice({ locale, title, body, action }) { return <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6"><div className="rounded-[2rem] bg-brand-cream p-8 text-center sm:p-12"><div aria-hidden="true" className="mx-auto h-12 w-12 rounded-full border-4 border-brand-teal/20 border-t-brand-teal" /><h1 className="display-font mt-6 text-3xl text-brand-ink">{title}</h1><p className="mx-auto mt-3 max-w-lg leading-relaxed text-brand-subtle">{body}</p>{action ? <button type="button" onClick={action} className="button-primary mt-7">{locale === 'hi' ? 'फिर कोशिश करें' : 'Retry'}</button> : <a className="button-primary mt-7" href={`/${locale}/insights/communication/start`}>{locale === 'hi' ? 'शुरू करें' : 'Start again'}</a>}</div></section>; }
