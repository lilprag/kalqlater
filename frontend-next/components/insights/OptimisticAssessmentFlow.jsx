'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dispatchBrowserAnalytics } from '../../lib/analytics';
import { useInsightsSaveQueue } from '../../lib/use-insights-save-queue';

const defaultCopy = {
  loading: 'Loading your reflection…', unavailable: 'This session is unavailable.', retry: 'Retry',
  persistence: 'Your response could not be saved safely. Check your connection and retry before continuing.',
  usual: 'What would you usually do?', choose: 'Choose your response', back: 'Back', next: 'Continue',
  completing: 'Preparing your result…', progress: 'Reflection progress', startAgain: 'Start again',
};

export function OptimisticAssessmentFlow({ analyzer, routeSegment, locale, sessionId, api, readSession, writeSession, copy: suppliedCopy = {}, onFirstBack }) {
  const copy = { ...defaultCopy, ...suppliedCopy };
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [choice, setChoice] = useState('');
  const [state, setState] = useState('loading');
  const [error, setError] = useState('');
  const cache = useRef(new Map());
  const prefetches = useRef(new Map());

  const saved = useCallback(() => readSession(), [readSession]);
  const saveAnswer = useCallback(async (item) => {
    const current = saved();
    if (!current?.accessToken) throw new Error('Session unavailable');
    if (item.mode === 'update') await api.update(sessionId, current.accessToken, item.payload);
    else await api.submit(sessionId, current.accessToken, item.payload);
  }, [api, saved, sessionId]);
  const blocked = useCallback(() => { setError(copy.persistence); }, [copy.persistence]);
  const { enqueue, flush, retry } = useInsightsSaveQueue({ analyzer, locale, sessionId, saveAnswer, onBlocked: blocked });

  const getScenario = useCallback(async (sessionData, index) => {
    const id = sessionData.scenario_ids[index];
    if (!id) return null;
    if (cache.current.has(id)) return cache.current.get(id);
    if (!prefetches.current.has(id)) {
      const current = saved();
      prefetches.current.set(id, api.scenario(sessionId, current.accessToken, id).then((response) => {
        cache.current.set(id, response.scenario);
        prefetches.current.delete(id);
        return response.scenario;
      }));
    }
    return prefetches.current.get(id);
  }, [api, saved, sessionId]);

  const showScenario = useCallback(async (sessionData, index, clickedAt) => {
    const next = await getScenario(sessionData, index);
    if (!next) return false;
    setSession(sessionData);
    setScenario(next);
    setChoice(next.selected_option_id || '');
    setState('ready');
    setError('');
    if (clickedAt) dispatchBrowserAnalytics('next_scenario_rendered', { analyzer, locale, step: index + 1, latency_ms: Math.max(0, Math.round(performance.now() - clickedAt)) });
    void getScenario(sessionData, index + 1);
    return true;
  }, [analyzer, getScenario, locale]);

  const load = useCallback(async () => {
    const current = saved();
    if (!current?.accessToken || current.sessionId !== sessionId || current.locale !== locale) { setState('invalid'); return; }
    setState('loading'); setError('');
    const recovered = await flush();
    if (!recovered) { setState('blocked'); setError(copy.persistence); return; }
    try {
      const sessionData = await api.session(sessionId, current.accessToken);
      const index = Math.min(sessionData.answered_scenario_ids.length, sessionData.scenario_ids.length - 1);
      if (sessionData.answered_scenario_ids.length === sessionData.scenario_ids.length) {
        const completed = current.resultId ? null : await api.complete(sessionId, current.accessToken);
        const resultId = current.resultId || completed.result_id;
        writeSession({ ...current, resultId });
        router.replace(`/${locale}/insights/${routeSegment}/result/${resultId}`);
        return;
      }
      await showScenario(sessionData, index);
    } catch { setState('error'); setError(copy.unavailable); }
  }, [api, copy.persistence, copy.unavailable, flush, locale, routeSegment, router, saved, sessionId, showScenario, writeSession]);

  useEffect(() => { const timer = window.setTimeout(() => { void load(); }, 0); return () => window.clearTimeout(timer); }, [load]);

  const choose = (optionId) => {
    setChoice(optionId);
    if (scenario) cache.current.set(scenario.scenario_id, { ...scenario, selected_option_id: optionId });
    dispatchBrowserAnalytics('answer_selected', { analyzer, locale, step: (scenario?.progress.index || 0) + 1 });
  };

  const submit = async () => {
    if (!choice || !scenario || !session || state !== 'ready') return;
    const index = scenario.progress.index;
    const clickedAt = performance.now();
    dispatchBrowserAnalytics('next_clicked', { analyzer, locale, step: index + 1 });
    const payload = { scenario_id: scenario.scenario_id, option_id: choice, idempotency_key: crypto.randomUUID() };
    enqueue({ id: payload.idempotency_key, step: index + 1, mode: scenario.selected_option_id ? 'update' : 'submit', payload });
    const nextIndex = index + 1;
    if (nextIndex < session.scenario_ids.length) {
      if (!cache.current.has(session.scenario_ids[nextIndex])) setState('loading');
      try { await showScenario(session, nextIndex, clickedAt); } catch { setState('blocked'); setError(copy.persistence); }
      return;
    }
    setState('completing'); setError('');
    const persisted = await flush();
    if (!persisted) { setState('blocked'); setError(copy.persistence); return; }
    try {
      const current = saved();
      const completed = await api.complete(sessionId, current.accessToken);
      writeSession({ ...current, resultId: completed.result_id });
      dispatchBrowserAnalytics('assessment_completed', { analyzer, locale });
      router.replace(`/${locale}/insights/${routeSegment}/result/${completed.result_id}`);
    } catch { setState('blocked'); setError(copy.unavailable); }
  };

  const goBack = async () => {
    if (!scenario || !session) return;
    if (scenario.progress.index === 0) { onFirstBack?.(); return; }
    try { await showScenario(session, scenario.progress.index - 1); } catch { setError(copy.unavailable); }
  };

  const retryPersistence = async () => {
    setState('loading'); setError('');
    if (await retry()) await load();
    else { setState('blocked'); setError(copy.persistence); }
  };

  if (state === 'invalid') return <Notice title={copy.unavailable} body={copy.unavailable} href={`/${locale}/insights/${routeSegment}/start`} label={copy.startAgain} />;
  if (state === 'blocked') return <Notice title={copy.retry} body={error} action={retryPersistence} label={copy.retry} />;
  if (state === 'error') return <Notice title={copy.unavailable} body={error} action={load} label={copy.retry} />;
  if (state === 'loading' || !scenario) return <Notice title={copy.loading} />;
  if (state === 'completing') return <Notice title={copy.completing} />;

  const total = scenario.progress.total;
  const index = scenario.progress.index;
  return <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12"><div className="rounded-[2rem] border border-brand-line bg-white p-5 shadow-[0_20px_50px_rgba(45,40,37,.06)] sm:p-9"><div className="flex items-center justify-between gap-4"><p className="section-kicker">{scenario.category}</p><p className="text-sm text-brand-subtle">{index + 1} / {total}</p></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-cream" role="progressbar" aria-label={copy.progress} aria-valuemin="0" aria-valuemax={total} aria-valuenow={index}><span className="block h-full rounded-full bg-brand-teal transition-[width]" style={{ width: `${Math.round((index / total) * 100)}%` }} /></div><p className="mt-8 text-sm font-medium text-brand-teal">{copy.usual}</p><h1 className="display-font mt-3 text-3xl leading-tight text-brand-ink sm:text-4xl">{scenario.prompt}</h1><fieldset className="mt-8"><legend className="sr-only">{copy.choose}</legend><div className="grid gap-3">{scenario.options.map((option, optionIndex) => <label key={option.id} className={`group flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition sm:p-5 ${choice === option.id ? 'border-brand-teal bg-brand-teal/5 shadow-sm' : 'border-brand-line bg-brand-bg hover:border-brand-teal/60'}`}><input className="mt-1 h-5 w-5 accent-brand-teal" type="radio" name="response" value={option.id} checked={choice === option.id} onChange={() => choose(option.id)} /><span className="min-w-0"><span className="text-xs font-bold uppercase tracking-wide text-brand-teal">{String.fromCharCode(65 + optionIndex)}</span><span className="mt-1 block leading-relaxed text-brand-ink">{option.text}</span></span></label>)}</div></fieldset><div className="mt-8 flex items-center justify-between gap-3"><button type="button" className="text-sm font-semibold text-brand-subtle underline underline-offset-4 disabled:opacity-40" onClick={goBack} disabled={index === 0 && !onFirstBack}>{copy.back}</button><button type="button" className="button-primary" onClick={submit} disabled={!choice}>{copy.next} <span aria-hidden="true">→</span></button></div></div></section>;
}

function Notice({ title, body, action, href, label }) {
  return <section className="mx-auto max-w-2xl px-4 py-14"><div className="rounded-[2rem] bg-brand-cream p-8 text-center"><div aria-hidden="true" className="mx-auto h-10 w-10 rounded-full border-4 border-brand-teal/20 border-t-brand-teal" /><h1 className="display-font mt-5 text-3xl text-brand-ink">{title}</h1>{body ? <p className="mt-3 text-brand-subtle">{body}</p> : null}{action ? <button type="button" onClick={action} className="button-primary mt-7">{label}</button> : href ? <a href={href} className="button-primary mt-7">{label}</a> : null}</div></section>;
}
