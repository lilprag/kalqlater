'use client';

import { useCallback, useEffect, useRef } from 'react';
import { dispatchBrowserAnalytics } from './analytics';
import { createOrderedSaveQueue } from './insights-save-queue';

function storageKey(analyzer, sessionId) { return `kalqlater.insights.pending.${analyzer}.${sessionId}`; }
function read(key) { try { return JSON.parse(window.sessionStorage.getItem(key) || '[]'); } catch { return []; } }

export function useInsightsSaveQueue({ analyzer, locale, sessionId, saveAnswer, onBlocked }) {
  const queueRef = useRef(null);
  const saveRef = useRef(saveAnswer);
  const blockedRef = useRef(onBlocked);
  useEffect(() => { saveRef.current = saveAnswer; blockedRef.current = onBlocked; }, [onBlocked, saveAnswer]);

  useEffect(() => {
    const key = storageKey(analyzer, sessionId);
    queueRef.current = createOrderedSaveQueue({
      initialItems: read(key),
      persist: (items) => window.sessionStorage.setItem(key, JSON.stringify(items)),
      save: (item) => saveRef.current(item),
      onEvent: (event, item, detail) => {
        if (event === 'started') dispatchBrowserAnalytics('answer_save_started', { analyzer, locale, step: item.step, attempt: detail.attempt });
        if (event === 'completed') dispatchBrowserAnalytics('answer_save_completed', { analyzer, locale, step: item.step, latency_ms: detail.latencyMs });
        if (event === 'failed') dispatchBrowserAnalytics('answer_save_failed', { analyzer, locale, step: item.step, attempt: detail.attempt });
        if (event === 'failed' && detail.attempt === 3) blockedRef.current?.(detail.error);
      },
    });
    if (queueRef.current.pending()) void queueRef.current.flush();
    return () => { queueRef.current = null; };
  }, [analyzer, locale, sessionId]);

  const enqueue = useCallback((item) => queueRef.current?.enqueue(item), []);
  const flush = useCallback(() => queueRef.current?.flush() || Promise.resolve(true), []);
  const retry = useCallback(() => queueRef.current?.retry() || Promise.resolve(true), []);
  return { enqueue, flush, retry };
}
