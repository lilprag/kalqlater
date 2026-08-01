import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { createJob, getJob, updateJob } from '../../services/jobService';
import { APPLICATION_METHODS, EMPLOYMENT_TYPES, JOB_CATEGORIES, JOB_COPY, REMOTE_MODES } from '../../data/jobs';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { normalizeHttpUrl } from '../../utils/formErrors';
import { trackEvent } from '../../services/analytics';

const base = { title: '', company_name: '', company_website: '', company_logo_url: '', description: '', responsibilities: '', requirements: '', location: '', country: '', city: '', remote_mode: 'Remote', employment_type: 'Full-time', experience_min: '', experience_max: '', salary_min: '', salary_max: '', salary_currency: 'INR', salary_period: 'year', skills: '', industries: '', career_categories: ['Product Management'], recommended_personality_types: [], application_method: 'external_url', application_url: '', application_email: '', allow_connection_application: false, status: 'active', visibility: 'public', expires_at: '' };
const list = (value) => value.split(',').map((item) => item.trim()).filter(Boolean);
const urlFields = new Set(['company_website', 'company_logo_url', 'application_url']);

export default function JobForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const { user, ready } = useAuth();
  const { lang } = useLang();
  const copy = JOB_COPY[lang] || JOB_COPY.en;
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(base);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!editing) {
      trackEvent('job_post_started', { logged_in: Boolean(user), language: lang });
      return;
    }
    getJob(id).then((job) => {
      if (!job.is_owner) throw new Error('Job unavailable');
      setForm({ ...base, ...job, skills: (job.skills || []).join(', '), industries: (job.industries || []).join(', '), expires_at: job.expires_at?.slice(0, 10) || '' });
    }).catch(() => setError('Job unavailable.'));
  }, [editing, id, lang, user]);

  if (!ready) return null;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (!user.profile) return <main className="mx-auto max-w-xl px-4 py-16"><p>{copy.profileRequired}</p></main>;

  const set = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => { const next = { ...current }; delete next[key]; return next; });
  };
  const normalizeField = (key) => set(key, normalizeHttpUrl(form[key]));
  const focusFirst = (errors) => {
    const first = Object.keys(errors)[0];
    if (first) document.getElementById(`job-${first}`)?.focus();
  };
  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    setError('');
    const localErrors = {};
    if (!form.title.trim()) localErrors.title = 'Job title is required.';
    if (!form.company_name.trim()) localErrors.company_name = 'Company name is required.';
    if (!form.description.trim()) localErrors.description = 'Description is required.';
    if (!list(form.skills).length) localErrors.skills = 'Add at least one skill.';
    if (Object.keys(localErrors).length) { setFieldErrors(localErrors); focusFirst(localErrors); return; }
    setBusy(true);
    try {
      const payload = { ...form, skills: list(form.skills), industries: list(form.industries), experience_min: form.experience_min === '' ? null : Number(form.experience_min), experience_max: form.experience_max === '' ? null : Number(form.experience_max), salary_min: form.salary_min === '' ? null : Number(form.salary_min), salary_max: form.salary_max === '' ? null : Number(form.salary_max), expires_at: form.expires_at ? new Date(`${form.expires_at}T23:59:59Z`).toISOString() : null };
      urlFields.forEach((key) => { payload[key] = normalizeHttpUrl(payload[key]); });
      const job = editing ? await updateJob(id, payload) : await createJob(payload);
      trackEvent('job_posted', { career_category: job.career_categories?.[0], logged_in: true, language: lang });
      navigate(`/community/jobs/${job.id}`, { state: { success: editing ? 'Job updated successfully.' : 'Job published successfully.' } });
    } catch (requestError) {
      const nextFieldErrors = requestError.fieldErrors || {};
      setFieldErrors(nextFieldErrors);
      setError(requestError.message || 'We could not save your job. Please try again.');
      focusFirst(nextFieldErrors);
    } finally { setBusy(false); }
  };

  return <main className="mx-auto max-w-3xl px-4 py-12"><form onSubmit={submit} noValidate className="rounded-[2rem] border border-brand-line bg-white p-6 sm:p-8">
    <h1 className="font-display text-4xl">{editing ? copy.edit : copy.create}</h1><p className="mt-3 text-sm text-brand-subtle">{copy.disclaimer}</p>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}
    <div className="mt-7 grid gap-4 sm:grid-cols-2">
      <Field field="title" label="Job title *" value={form.title} onChange={(value) => set('title', value)} error={fieldErrors.title} />
      <Field field="company_name" label="Company name *" value={form.company_name} onChange={(value) => set('company_name', value)} error={fieldErrors.company_name} />
      <Field field="company_website" label="Company website" value={form.company_website} onChange={(value) => set('company_website', value)} onBlur={() => normalizeField('company_website')} error={fieldErrors.company_website} hint="Optional. You can enter example.com — https:// will be added automatically." />
      <Field field="company_logo_url" label="Company logo URL" value={form.company_logo_url} onChange={(value) => set('company_logo_url', value)} onBlur={() => normalizeField('company_logo_url')} error={fieldErrors.company_logo_url} hint="Optional. You can enter example.com — https:// will be added automatically." />
      <Select field="remote_mode" label="Remote mode *" value={form.remote_mode} onChange={(value) => set('remote_mode', value)} options={REMOTE_MODES} />
      <Select field="employment_type" label="Employment type *" value={form.employment_type} onChange={(value) => set('employment_type', value)} options={EMPLOYMENT_TYPES} />
      <Field field="location" label="Location" value={form.location} onChange={(value) => set('location', value)} /><Field field="country" label="Country" value={form.country} onChange={(value) => set('country', value)} /><Field field="city" label="City" value={form.city} onChange={(value) => set('city', value)} />
      <Field field="skills" label="Skills * (comma separated)" value={form.skills} onChange={(value) => set('skills', value)} error={fieldErrors.skills} /><Field field="industries" label="Industries (comma separated)" value={form.industries} onChange={(value) => set('industries', value)} />
      <Field field="experience_min" label="Minimum experience" type="number" value={form.experience_min} onChange={(value) => set('experience_min', value)} /><Field field="experience_max" label="Maximum experience" type="number" value={form.experience_max} onChange={(value) => set('experience_max', value)} />
      <Field field="salary_min" label="Minimum salary" type="number" value={form.salary_min} onChange={(value) => set('salary_min', value)} /><Field field="salary_max" label="Maximum salary" type="number" value={form.salary_max} onChange={(value) => set('salary_max', value)} />
      <Select field="salary_currency" label="Salary currency" value={form.salary_currency} onChange={(value) => set('salary_currency', value)} options={['INR', 'USD', 'EUR', 'GBP']} /><Select field="salary_period" label="Salary period" value={form.salary_period} onChange={(value) => set('salary_period', value)} options={['year', 'month', 'hour']} />
      <Select field="career_categories" label="Career category *" value={form.career_categories[0]} onChange={(value) => set('career_categories', [value])} options={JOB_CATEGORIES} /><Select field="application_method" label={copy.application} value={form.application_method} onChange={(value) => set('application_method', value)} options={APPLICATION_METHODS} />
      <Select field="status" label="Listing status" value={form.status} onChange={(value) => set('status', value)} options={['draft', 'active']} /><Select field="visibility" label="Visibility" value={form.visibility} onChange={(value) => set('visibility', value)} options={['public', 'members_only']} /><Field field="expires_at" label="Expiry date" type="date" value={form.expires_at} onChange={(value) => set('expires_at', value)} />
    </div>
    <Text field="description" label="Description *" value={form.description} onChange={(value) => set('description', value)} error={fieldErrors.description} /><Text field="responsibilities" label="Responsibilities" value={form.responsibilities} onChange={(value) => set('responsibilities', value)} /><Text field="requirements" label="Requirements" value={form.requirements} onChange={(value) => set('requirements', value)} />
    {['external_url', 'multiple'].includes(form.application_method) && <Field field="application_url" label="External application URL" value={form.application_url} onChange={(value) => set('application_url', value)} onBlur={() => normalizeField('application_url')} error={fieldErrors.application_url} hint="You can enter example.com — https:// will be added automatically." />}
    {['public_email', 'multiple'].includes(form.application_method) && <Field field="application_email" label="Public application email" type="email" value={form.application_email} onChange={(value) => set('application_email', value)} error={fieldErrors.application_email} />}
    <label className="mt-4 flex gap-2 text-sm"><input type="checkbox" checked={form.allow_connection_application} onChange={(event) => set('allow_connection_application', event.target.checked)} />Allow connection/contact application</label>
    <label className="mt-4 block text-sm">Recommended personality types (discovery only)<select multiple value={form.recommended_personality_types} onChange={(event) => set('recommended_personality_types', Array.from(event.target.selectedOptions).map((option) => option.value))} className="mt-1 h-32 w-full rounded-xl border border-brand-line p-2">{['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'].map((type) => <option key={type}>{type}</option>)}</select></label>
    <button disabled={busy} className="mt-7 rounded-full bg-brand-teal px-6 py-3 font-semibold text-white disabled:opacity-60">{busy ? 'Publishing…' : copy.save}</button>
  </form></main>;
}

function Field({ field, label, value, onChange, onBlur, type = 'text', error, hint }) { return <label className="block text-sm font-medium" htmlFor={`job-${field}`}>{label}<input id={`job-${field}`} aria-invalid={Boolean(error)} aria-describedby={error ? `job-${field}-error` : undefined} type={type} value={value ?? ''} onChange={(event) => onChange(event.target.value)} onBlur={onBlur} className="mt-1 w-full rounded-xl border border-brand-line p-3" />{hint && <span className="mt-1 block text-xs font-normal text-brand-subtle">{hint}</span>}{error && <span id={`job-${field}-error`} className="mt-1 block text-xs font-normal text-red-700">{error}</span>}</label>; }
function Text({ field, label, value, onChange, error }) { return <label className="mt-4 block text-sm font-medium" htmlFor={`job-${field}`}>{label}<textarea id={`job-${field}`} aria-invalid={Boolean(error)} aria-describedby={error ? `job-${field}-error` : undefined} value={value ?? ''} onChange={(event) => onChange(event.target.value)} className="mt-1 min-h-28 w-full rounded-xl border border-brand-line p-3" />{error && <span id={`job-${field}-error`} className="mt-1 block text-xs font-normal text-red-700">{error}</span>}</label>; }
function Select({ field, label, value, onChange, options }) { return <label className="block text-sm font-medium" htmlFor={`job-${field}`}><span>{label}</span><select id={`job-${field}`} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-xl border border-brand-line p-3">{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>; }
