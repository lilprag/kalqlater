"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { jobsApiUrl } from '../lib/jobs-api';
import { productionAppUrl } from '../lib/site';
import { dispatchBrowserAnalytics } from '../lib/analytics';

const auth = () => ({ Authorization: `Bearer ${localStorage.getItem('kalqlater_auth_token') || ''}`, 'Content-Type': 'application/json' });

export function JobActions({ jobId, applyUrl, locale = 'en', slug }) {
  const [msg, setMsg] = useState('');
  const resumed = useRef(false);
  const returnPath = `/${locale}/jobs/${slug}`;
  const login = useCallback((action) => {
    const intended = `${returnPath}?${action}=1`;
    window.location.assign(productionAppUrl(`/login?locale=${encodeURIComponent(locale)}&returnTo=${encodeURIComponent(intended)}`));
  }, [locale, returnPath]);
  const apply = useCallback(async () => {
    dispatchBrowserAnalytics('apply_click', { locale });
    const response = await fetch(jobsApiUrl(`/${jobId}/apply`), { method: 'POST', headers: auth() });
    if (response.status === 401) { login('apply'); return; }
    if (!response.ok) {
      setMsg('Complete your career profile before applying.');
      window.location.assign(`/${locale}/jobs/profile?returnTo=${encodeURIComponent(`${returnPath}?apply=1`)}`);
      return;
    }
    const result = await response.json();
    window.location.assign(result.redirect_url || applyUrl);
  }, [applyUrl, jobId, locale, login, returnPath]);
  const save = useCallback(async () => {
    dispatchBrowserAnalytics('save_job', { locale });
    const response = await fetch(jobsApiUrl(`/${jobId}/save`), { method: 'POST', headers: auth() });
    if (response.status === 401) { login('save'); return; }
    setMsg(response.ok ? 'Saved' : 'This job could not be saved.');
  }, [jobId, locale, login]);
  useEffect(() => {
    if (resumed.current) return;
    const params = new URLSearchParams(window.location.search);
    const action = params.get('apply') === '1' ? apply : params.get('save') === '1' ? save : null;
    if (!action) return;
    resumed.current = true;
    action();
  }, [apply, save]);
  return <div className="flex flex-wrap gap-3"><button onClick={apply} className="button-primary">Apply externally</button><button onClick={save} className="button-secondary">Save job</button>{msg && <p className="w-full text-sm">{msg}</p>}</div>;
}
