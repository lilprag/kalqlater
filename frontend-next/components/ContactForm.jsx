'use client';

import { useState } from 'react';
import { contactEndpoint } from '../lib/api';

const initialForm = { name: '', email: '', subject: '', message: '', website: '' };

export function ContactForm({ copy }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [startedAt] = useState(() => Date.now());
  const update = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));
  async function submit(event) {
    event.preventDefault(); setMessage('');
    if (![form.name, form.email, form.subject, form.message].every((value) => value.trim())) { setStatus('error'); setMessage(copy.required); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setStatus('error'); setMessage(copy.invalid); return; }
    setStatus('loading');
    try {
      const response = await fetch(contactEndpoint(), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, started_at: startedAt }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.delivered) throw new Error(typeof payload.detail === 'string' ? payload.detail : copy.error);
      setForm(initialForm); setStatus('success'); setMessage(payload.message || copy.success);
    } catch (error) { setStatus('error'); setMessage(error.message || copy.error); }
  }
  const inputClass = 'mt-2 w-full rounded-2xl border border-brand-line bg-brand-bg px-4 py-3 text-brand-ink outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20';
  return <form className="surface-shadow mt-10 rounded-[2rem] border border-brand-line bg-white p-6 sm:p-8" noValidate onSubmit={submit}><div className="grid gap-5 sm:grid-cols-2"><Field copy={copy} name="name" value={form.name} onChange={update} className={inputClass} maxLength={100} /><Field copy={copy} name="email" type="email" value={form.email} onChange={update} className={inputClass} maxLength={254} /><Field copy={copy} name="subject" value={form.subject} onChange={update} className={inputClass} maxLength={150} /></div><Field copy={copy} name="message" value={form.message} onChange={update} className={inputClass} maxLength={5000} multiline /><div className="absolute -left-[10000px]" aria-hidden="true"><label>Website<input name="website" value={form.website} onChange={update} tabIndex={-1} autoComplete="off" /></label></div>{status === 'error' && <p className="mt-5 text-sm text-[#B35841]" role="alert">{message}</p>}{status === 'success' && <p className="mt-5 text-sm text-brand-teal" role="status" aria-live="polite">{message}</p>}<button type="submit" disabled={status === 'loading' || status === 'success'} className="mt-6 rounded-full bg-brand-teal px-6 py-3 font-semibold text-white disabled:opacity-60">{status === 'loading' ? copy.sending : copy.send}</button></form>;
}

function Field({ copy, name, type = 'text', value, onChange, className, maxLength, multiline = false }) {
  const label = copy[name];
  return <label className={`block ${name === 'message' ? 'mt-5' : ''}`}><span className="text-sm font-semibold">{label}</span>{multiline ? <textarea name={name} value={value} onChange={onChange} maxLength={maxLength} required rows="7" className={className} /> : <input name={name} type={type} value={value} onChange={onChange} maxLength={maxLength} required className={className} />}</label>;
}
