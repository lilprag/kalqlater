'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { communicationInsightsApi } from '../../lib/communication-insights-api';
import { insightsCopy } from '../../data/communication-insights';

const storageKey = 'kalqlater.communication-insights.session';
const idempotencyKey = () => `${Date.now()}-${crypto.randomUUID()}`;

const sessionCopy = {
  en: {
    expired: 'This session has expired. You can begin a new reflection.',
    timeout: 'The service took too long to respond. Check your connection and try again.',
    unavailable: 'This experience is not published yet. It will be available after content review is complete.',
    error: 'That step could not be completed. Please try again.',
    responseGuidance: 'Choose what you would usually do, not what seems ideal.',
    starting: 'Starting…',
    disclaimer: 'This is reflective guidance, not a diagnosis or grade.',
    sessionUnavailable: 'This session is not available',
    beginNewReflection: 'Begin a new reflection to continue.',
    loadingTitle: 'Understanding your communication patterns…',
    loadingBody: 'Holding your place while the next situation loads.',
    tryAgain: 'Try again',
    progressPrefix: 'Progress ',
    progressLabel: 'Reflection progress',
    usualAction: 'What would you usually do?',
    chooseResponse: 'Choose your response',
    leaveConfirmLabel: 'Confirm leaving reflection',
    leaveConfirmTitle: 'Leave this reflection for now?',
    leaveConfirmBody: 'Your session remains available in this browser and can be resumed from this session link.',
    stay: 'Stay',
    goToStart: 'Go to start',
    back: 'Back',
    saving: 'Saving…',
    continue: 'Continue',
    placeHeld: 'Your place is held in this browser session.',
    retry: 'Retry',
    startAgain: 'Start again',
  },
  hi: {
    expired: 'यह सत्र समाप्त हो गया है। आप नया आत्मचिंतन शुरू कर सकते/सकती हैं।',
    timeout: 'सेवा को जवाब देने में समय लगा। अपना कनेक्शन जाँचें और फिर कोशिश करें।',
    unavailable: 'यह अनुभव अभी प्रकाशित नहीं है। समीक्षा पूरी होने पर यह उपलब्ध होगा।',
    error: 'यह कदम पूरा नहीं हो सका। कृपया फिर कोशिश करें।',
    responseGuidance: 'अपनी प्रतिक्रिया उसी आधार पर चुनें जो आप सामान्यतः करते/करती हैं, न कि जो आदर्श लगता है।',
    starting: 'शुरू हो रहा है…',
    disclaimer: 'यह आत्मचिंतन मार्गदर्शन है, निदान या ग्रेड नहीं।',
    sessionUnavailable: 'सत्र उपलब्ध नहीं है',
    beginNewReflection: 'नया आत्मचिंतन शुरू करें।',
    loadingTitle: 'आपके पैटर्न समझ रहे हैं…',
    loadingBody: 'आपकी जगह सुरक्षित रखी जा रही है।',
    tryAgain: 'फिर कोशिश करें',
    progressPrefix: 'प्रगति ',
    progressLabel: 'आत्मचिंतन की प्रगति',
    usualAction: 'आप सामान्यतः क्या करते/करती हैं?',
    chooseResponse: 'अपनी प्रतिक्रिया चुनें',
    leaveConfirmLabel: 'सत्र छोड़ने की पुष्टि',
    leaveConfirmTitle: 'क्या आप आत्मचिंतन से बाहर जाना चाहते हैं?',
    leaveConfirmBody: 'आपका सत्र इस ब्राउज़र में बना रहेगा और आप इसी लिंक से लौट सकते/सकती हैं।',
    stay: 'रहें',
    goToStart: 'शुरुआत पर जाएँ',
    back: 'वापस',
    saving: 'सहेज रहे हैं…',
    continue: 'जारी रखें',
    placeHeld: 'आपकी जगह इस ब्राउज़र सत्र में सुरक्षित रहती है।',
    retry: 'फिर कोशिश करें',
    startAgain: 'शुरू करें',
  },
  fr: {
    expired: 'Cette session a expiré. Vous pouvez commencer une nouvelle réflexion.',
    timeout: 'Le service a mis trop de temps à répondre. Vérifiez votre connexion et réessayez.',
    unavailable: 'Cette expérience n’est pas encore publiée. Elle sera disponible une fois la révision du contenu terminée.',
    error: 'Cette étape n’a pas pu être terminée. Veuillez réessayer.',
    responseGuidance: 'Choisissez ce que vous feriez habituellement, et non ce qui vous semble idéal.',
    starting: 'Démarrage…',
    disclaimer: 'Il s’agit de pistes de réflexion, et non d’un diagnostic ou d’une note.',
    sessionUnavailable: 'Cette session n’est pas disponible',
    beginNewReflection: 'Commencez une nouvelle réflexion pour continuer.',
    loadingTitle: 'Analyse de vos habitudes de communication…',
    loadingBody: 'Votre progression est conservée pendant le chargement de la situation suivante.',
    tryAgain: 'Réessayer',
    progressPrefix: 'Progression ',
    progressLabel: 'Progression de la réflexion',
    usualAction: 'Que feriez-vous habituellement ?',
    chooseResponse: 'Choisissez votre réponse',
    leaveConfirmLabel: 'Confirmer la sortie de la réflexion',
    leaveConfirmTitle: 'Quitter cette réflexion pour le moment ?',
    leaveConfirmBody: 'Votre session restera disponible dans ce navigateur et vous pourrez la reprendre depuis ce lien.',
    stay: 'Rester',
    goToStart: 'Revenir au début',
    back: 'Retour',
    saving: 'Enregistrement…',
    continue: 'Continuer',
    placeHeld: 'Votre progression est conservée dans cette session de navigation.',
    retry: 'Réessayer',
    startAgain: 'Recommencer',
  },
};

const copyFor = (locale) => sessionCopy[locale] || sessionCopy.en;
const messageFor = (error, locale) => {
  const copy = copyFor(locale);
  if (error?.code === 'expired') return copy.expired;
  if (error?.code === 'timeout') return copy.timeout;
  if (error?.code === 'unavailable') return copy.unavailable;
  return copy.error;
};

function readSaved() { try { return JSON.parse(window.sessionStorage.getItem(storageKey) || 'null'); } catch { return null; } }
function saveSession(value) { window.sessionStorage.setItem(storageKey, JSON.stringify(value)); }

export function StartAssessment({ locale }) {
  const router = useRouter(); const copy = insightsCopy(locale); const session = copyFor(locale); const [state, setState] = useState('idle'); const [error, setError] = useState(''); const abortRef = useRef();
  useEffect(() => () => abortRef.current?.abort(), []);
  const begin = async () => {
    abortRef.current?.abort(); const controller = new AbortController(); abortRef.current = controller; setState('loading'); setError('');
    try {
      const created = await communicationInsightsApi.createSession(locale, undefined, controller.signal);
      saveSession({ sessionId: created.session_id, accessToken: created.access_token, locale, analyzerVersion: 'pending', currentStep: 0 });
      router.push(`/${locale}/insights/communication/session/${created.session_id}`);
    } catch (issue) { setError(messageFor(issue, locale)); setState('idle'); }
  };
  return <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-16"><div className="content-hero rounded-[2rem] border border-brand-line px-6 py-9 sm:px-10 sm:py-12"><p className="section-kicker">KalQLater · {copy.title}</p><h1 className="display-font mt-3 text-4xl text-brand-ink sm:text-5xl">{copy.startTitle}</h1><p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-subtle">{copy.startBody}</p><ul className="mt-8 grid gap-3 sm:grid-cols-3">{[[copy.time, '◷'], [copy.privacy, '◌'], [copy.safety, '◇']].map(([text, icon]) => <li key={text} className="rounded-2xl bg-white p-4 text-sm leading-relaxed text-brand-subtle"><span aria-hidden="true" className="mr-2 font-bold text-brand-teal">{icon}</span>{text}</li>)}</ul><p className="mt-7 rounded-xl border-l-2 border-brand-saffron bg-brand-sand/20 px-4 py-3 text-sm text-brand-ink">{session.responseGuidance}</p>{error ? <p role="alert" className="mt-5 rounded-xl bg-brand-plum/10 p-4 text-sm text-brand-ink">{error}</p> : null}<button type="button" className="button-primary mt-8" onClick={begin} disabled={state === 'loading'}>{state === 'loading' ? session.starting : copy.start}<span aria-hidden="true">→</span></button><p className="mt-4 text-xs text-brand-subtle">{session.disclaimer}</p></div></section>;
}

export function ScenarioFlow({ locale, sessionId }) {
  const router = useRouter(); const copy = copyFor(locale); const [scenario, setScenario] = useState(null); const [session, setSession] = useState(null); const [choice, setChoice] = useState(''); const [state, setState] = useState('loading'); const [error, setError] = useState(''); const [leaveConfirm, setLeaveConfirm] = useState(false); const abortRef = useRef();
  const loadScenario = useCallback(async (sessionData, scenarioId, signal) => { const next = await communicationInsightsApi.scenario(sessionId, readSaved().accessToken, scenarioId, signal); setSession(sessionData); setScenario(next.scenario); setChoice(next.scenario.selected_option_id || ''); setState('ready'); }, [sessionId]);
  const load = useCallback(async () => {
    const saved = readSaved();
    if (!saved || saved.sessionId !== sessionId || saved.locale !== locale) { setState('invalid'); return; }
    abortRef.current?.abort(); const controller = new AbortController(); abortRef.current = controller; setState('loading'); setError('');
    try { const [current, next] = await Promise.all([communicationInsightsApi.session(sessionId, saved.accessToken, controller.signal), communicationInsightsApi.next(sessionId, saved.accessToken, controller.signal)]); if (!next.scenario) { if (saved.resultId) router.replace(`/${locale}/insights/communication/result/${saved.resultId}`); else { const complete = await communicationInsightsApi.complete(sessionId, saved.accessToken, controller.signal); saveSession({ ...saved, resultId: complete.result_id }); router.replace(`/${locale}/insights/communication/result/${complete.result_id}`); } return; } await loadScenario(current, next.scenario.scenario_id, controller.signal); }
    catch (issue) { setState('error'); setError(messageFor(issue, locale)); }
  }, [loadScenario, locale, router, sessionId]);
  useEffect(() => { const timer = window.setTimeout(() => { void load(); }, 0); return () => { window.clearTimeout(timer); abortRef.current?.abort(); }; }, [load]);
  const submit = async () => {
    if (!choice || !scenario || state === 'submitting') return; const saved = readSaved(); setState('submitting'); setError('');
    try { const payload = { scenario_id: scenario.scenario_id, option_id: choice, idempotency_key: idempotencyKey() }; if (scenario.selected_option_id) await communicationInsightsApi.update(sessionId, saved.accessToken, payload); else await communicationInsightsApi.submit(sessionId, saved.accessToken, payload); const refreshed = await communicationInsightsApi.session(sessionId, saved.accessToken); const nextId = refreshed.scenario_ids[scenario.progress.index + 1]; if (nextId) { await loadScenario(refreshed, nextId); return; } const complete = await communicationInsightsApi.complete(sessionId, saved.accessToken); saveSession({ ...saved, resultId: complete.result_id, currentStep: scenario.progress.total }); router.replace(`/${locale}/insights/communication/result/${complete.result_id}`); } catch (issue) { setState('ready'); setError(messageFor(issue, locale)); }
  };
  const goBack = async () => { if (!scenario || !session) return; if (scenario.progress.index === 0) { setLeaveConfirm(true); return; } setState('loading'); try { await loadScenario(session, session.scenario_ids[scenario.progress.index - 1]); } catch (issue) { setState('ready'); setError(messageFor(issue, locale)); } };
  if (state === 'invalid') return <FlowNotice locale={locale} title={copy.sessionUnavailable} body={copy.beginNewReflection} />;
  if (state === 'loading') return <FlowNotice locale={locale} title={copy.loadingTitle} body={copy.loadingBody} />;
  if (state === 'error' || !scenario) return <FlowNotice locale={locale} title={copy.tryAgain} body={error} action={load} />;
  const answered = scenario.progress.answered; const total = scenario.progress.total; const progress = Math.round((answered / total) * 100);
  return <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12"><div className="rounded-[2rem] border border-brand-line bg-white p-5 shadow-[0_20px_50px_rgba(45,40,37,.06)] sm:p-9"><div className="flex items-center justify-between gap-4"><p className="section-kicker">{scenario.category}</p><p className="text-sm text-brand-subtle"><span className="sr-only">{copy.progressPrefix}</span>{scenario.progress.index + 1} / {total}</p></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-cream" role="progressbar" aria-label={copy.progressLabel} aria-valuemin="0" aria-valuemax={total} aria-valuenow={answered}><span className="block h-full rounded-full bg-brand-teal transition-[width]" style={{ width: `${progress}%` }} /></div><p className="mt-8 text-sm font-medium text-brand-teal">{copy.usualAction}</p><h1 className="display-font mt-3 text-3xl leading-tight text-brand-ink sm:text-4xl">{scenario.prompt}</h1><fieldset className="mt-8" aria-describedby={error ? 'response-error' : undefined}><legend className="sr-only">{copy.chooseResponse}</legend><div className="grid gap-3">{scenario.options.map((option, index) => <label key={option.id} className={`group flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition sm:p-5 ${choice === option.id ? 'border-brand-teal bg-brand-teal/5 shadow-sm' : 'border-brand-line bg-brand-bg hover:border-brand-teal/60'}`}><input className="mt-1 h-5 w-5 accent-brand-teal" type="radio" name="response" value={option.id} checked={choice === option.id} onChange={() => setChoice(option.id)} /><span className="min-w-0"><span className="text-xs font-bold uppercase tracking-wide text-brand-teal">{String.fromCharCode(65 + index)}</span><span className="mt-1 block leading-relaxed text-brand-ink">{option.text}</span></span></label>)}</div></fieldset>{error ? <p id="response-error" role="alert" className="mt-5 rounded-xl bg-brand-plum/10 p-4 text-sm text-brand-ink">{error}</p> : null}{leaveConfirm ? <div role="alertdialog" aria-modal="true" aria-label={copy.leaveConfirmLabel} className="mt-6 rounded-2xl bg-brand-sand/30 p-5"><p className="font-semibold text-brand-ink">{copy.leaveConfirmTitle}</p><p className="mt-2 text-sm text-brand-subtle">{copy.leaveConfirmBody}</p><div className="mt-4 flex gap-3"><button type="button" className="button-secondary" onClick={() => setLeaveConfirm(false)}>{copy.stay}</button><button type="button" className="button-primary" onClick={() => router.push(`/${locale}/insights/communication/start`)}>{copy.goToStart}</button></div></div> : null}<div className="mt-8 flex items-center justify-between gap-3"><button type="button" className="text-sm font-semibold text-brand-subtle underline underline-offset-4" onClick={goBack}>{copy.back}</button><button type="button" className="button-primary" onClick={submit} disabled={!choice || state === 'submitting'}>{state === 'submitting' ? copy.saving : copy.continue} <span aria-hidden="true">→</span></button></div><p className="mt-5 text-center text-xs text-brand-subtle">{copy.placeHeld}</p></div></section>;
}

function FlowNotice({ locale, title, body, action }) { const copy = copyFor(locale); return <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6"><div className="rounded-[2rem] bg-brand-cream p-8 text-center sm:p-12"><div aria-hidden="true" className="mx-auto h-12 w-12 rounded-full border-4 border-brand-teal/20 border-t-brand-teal" /><h1 className="display-font mt-6 text-3xl text-brand-ink">{title}</h1><p className="mx-auto mt-3 max-w-lg leading-relaxed text-brand-subtle">{body}</p>{action ? <button type="button" onClick={action} className="button-primary mt-7">{copy.retry}</button> : <a className="button-primary mt-7" href={`/${locale}/insights/communication/start`}>{copy.startAgain}</a>}</div></section>; }
