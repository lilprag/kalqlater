"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { jobsApiUrl } from '../lib/jobs-api';
import { dispatchBrowserAnalytics } from '../lib/analytics';
import { authHeaders } from '../lib/auth';

const auth = () => authHeaders({ mutation: true });

export function JobActions({ jobId, applyUrl, locale = 'en', slug }) {
  const [msg, setMsg] = useState('');
  const resumed = useRef(false);
  const returnPath = `/${locale}/jobs/${slug}`;
  const login = useCallback((action) => {
    const intended = `${returnPath}?${action}=1`;
    dispatchBrowserAnalytics('auth_continuation_started', { locale, kind: action === 'apply' ? 'job_apply' : 'job_save' });
    window.location.assign(`/${locale}/login?returnTo=${encodeURIComponent(intended)}`);
  }, [locale, returnPath]);
  const apply = useCallback(async () => {
    const resumedAfterAuth = new URLSearchParams(window.location.search).get('apply') === '1';
    if (!resumedAfterAuth) dispatchBrowserAnalytics('apply_click', { locale });
    const response = await fetch(jobsApiUrl(`/${jobId}/apply`), { method: 'POST', headers: auth(), credentials: 'include' });
    if (response.status === 401) { login('apply'); return; }
    if (!response.ok) {
      setMsg('This application could not be started. Please try again.');
      return;
    }
    const result = await response.json();
    if (resumedAfterAuth) { dispatchBrowserAnalytics('job_apply_after_auth', { locale }); window.history.replaceState(null, '', returnPath); }
    window.location.assign(result.redirect_url || applyUrl);
  }, [applyUrl, jobId, locale, login, returnPath]);
  const save = useCallback(async () => {
    const resumedAfterAuth = new URLSearchParams(window.location.search).get('save') === '1';
    if (!resumedAfterAuth) dispatchBrowserAnalytics('save_job', { locale });
    const response = await fetch(jobsApiUrl(`/${jobId}/save`), { method: 'POST', headers: auth(), credentials: 'include' });
    if (response.status === 401) { login('save'); return; }
    if (response.ok && resumedAfterAuth) { dispatchBrowserAnalytics('job_save_after_auth', { locale }); window.history.replaceState(null, '', returnPath); }
    setMsg(response.ok ? 'Saved' : 'This job could not be saved.');
  }, [jobId, locale, login, returnPath]);
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
