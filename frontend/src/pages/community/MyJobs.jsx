import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { deleteJob, getMyJobs, updateJobStatus } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';

export default function MyJobs() {
  const { user, ready } = useAuth();
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');

  const load = () => getMyJobs().then((data) => setJobs(data.items || [])).catch(() => setError('We could not load your jobs.'));
  useEffect(() => { if (user) load(); }, [user]);

  if (!ready) return null;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  const remove = async (job) => {
    if (!window.confirm(`Delete “${job.title}”? This permanently removes the job and its application activity. This cannot be undone.`)) return;
    setError('');
    setDeletingId(job.id);
    try {
      await deleteJob(job.id);
      setJobs((current) => current.filter((item) => item.id !== job.id));
    } catch (requestError) {
      setError(requestError.message || 'We could not delete this job.');
    } finally {
      setDeletingId('');
    }
  };

  return <main className="mx-auto max-w-5xl px-4 py-12">
    <div className="flex items-center justify-between gap-4">
      <h1 className="font-display text-4xl">My jobs</h1>
      <Link to="/community/jobs/new" className="rounded-full bg-brand-teal px-5 py-3 font-semibold text-white">Post a job</Link>
    </div>
    {error && <p role="alert" className="mt-6 text-red-700">{error}</p>}
    {jobs.length === 0 ? <p className="mt-6 rounded-2xl border border-brand-line bg-white p-6 text-brand-subtle">You have not posted any jobs yet.</p> : <div className="mt-6 space-y-4">
      {jobs.map((job) => <article key={job.id} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-brand-line bg-white p-5">
        <div><p className="text-xs text-brand-teal">{job.status}</p><h2 className="font-display text-2xl">{job.title}</h2><p className="text-sm text-brand-subtle">{job.company_name}</p></div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/community/jobs/${job.id}/edit`} className="rounded-full border px-4 py-2">Edit</Link>
          <button type="button" onClick={async () => { await updateJobStatus(job.id, job.status === 'active' ? 'closed' : 'active'); load(); }} className="rounded-full border px-4 py-2">{job.status === 'active' ? 'Close' : 'Reopen'}</button>
          <button type="button" disabled={deletingId === job.id} onClick={() => remove(job)} className="rounded-full border border-red-200 px-4 py-2 text-red-700 disabled:opacity-60">{deletingId === job.id ? 'Deleting…' : 'Delete job'}</button>
        </div>
      </article>)}
    </div>}
  </main>;
}
