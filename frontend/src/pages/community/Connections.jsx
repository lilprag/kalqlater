import React, { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { acceptConnection, cancelConnection, declineConnection, getAcceptedConnections, getIncomingConnections, getOutgoingConnections } from '../../services/connectionService';
import { useAuth } from '../../context/AuthContext';

const tabs = {
  incoming: { label: 'Incoming', get: getIncomingConnections },
  sent: { label: 'Sent', get: getOutgoingConnections },
  connections: { label: 'Connections', get: getAcceptedConnections },
};

function ConnectionRow({ item, tab, onAction }) {
  const [working, setWorking] = useState('');
  const [actionError, setActionError] = useState('');
  const run = async (action) => {
    setWorking(action);
    setActionError('');
    try { await onAction(item.connection_id, action); }
    catch (error) { setActionError(error.message); }
    finally { setWorking(''); }
  };
  const member = item.member;
  return (
    <article className="rounded-3xl border border-brand-line bg-white p-5 shadow-[0_10px_28px_rgba(45,40,37,.04)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-brand-teal">{member.personality_type}</p>
          <h2 className="mt-1 font-display text-2xl">{member.display_name}</h2>
          <p className="text-sm text-brand-subtle">@{member.username} · {member.profession}</p>
          {(member.city || member.country) && <p className="mt-1 text-sm text-brand-subtle">{[member.city, member.country].filter(Boolean).join(', ')}</p>}
          {member.skills?.length > 0 && <p className="mt-3 text-sm text-brand-subtle">{member.skills.join(' · ')}</p>}
          {item.message && tab === 'incoming' && <p className="mt-4 rounded-2xl bg-brand-cream p-3 text-sm text-brand-ink">“{item.message}”</p>}
          <p className="mt-3 text-xs text-brand-subtle">Sent {new Date(item.created_at).toLocaleDateString()}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {tab === 'incoming' && <><button type="button" disabled={Boolean(working)} onClick={() => run('accept')} className="rounded-full bg-brand-teal px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{working === 'accept' ? 'Accepting…' : 'Accept'}</button><button type="button" disabled={Boolean(working)} onClick={() => run('decline')} className="rounded-full border border-brand-line px-4 py-2 text-sm font-semibold disabled:opacity-60">{working === 'decline' ? 'Declining…' : 'Decline'}</button></>}
          {tab === 'sent' && <button type="button" disabled={Boolean(working)} onClick={() => run('cancel')} className="rounded-full border border-brand-line px-4 py-2 text-sm font-semibold disabled:opacity-60">{working === 'cancel' ? 'Cancelling…' : 'Cancel'}</button>}
          <Link to={member.profile_url} className="rounded-full border border-brand-line px-4 py-2 text-sm font-semibold">View profile</Link>
        </div>
      </div>
      {actionError && <p className="mt-3 text-sm text-red-700" role="alert">{actionError}</p>}
    </article>
  );
}

export default function Connections() {
  const { user, ready } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = tabs[searchParams.get('tab')] ? searchParams.get('tab') : 'incoming';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const [result, setResult] = useState({ items: [], has_more: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try { setResult(await tabs[tab].get(page)); }
    catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }, [page, tab]);

  useEffect(() => { if (user) load(); }, [load, user]);
  if (!ready) return null;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;

  const setTab = (nextTab) => setSearchParams(nextTab === 'incoming' ? {} : { tab: nextTab });
  const setPage = (nextPage) => setSearchParams({ ...(tab === 'incoming' ? {} : { tab }), ...(nextPage > 1 ? { page: String(nextPage) } : {}) });
  const act = async (connectionId, action) => {
    if (action === 'accept') await acceptConnection(connectionId);
    if (action === 'decline') await declineConnection(connectionId);
    if (action === 'cancel') await cancelConnection(connectionId);
    await load();
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <section className="rounded-[2rem] bg-[#182B31] p-7 text-white sm:p-10"><p className="text-sm font-semibold uppercase tracking-[.18em] text-brand-saffron">Community</p><h1 className="mt-2 font-display text-4xl">Connections</h1><p className="mt-3 max-w-2xl text-white/75">Keep track of the people who want to connect around personality and purpose.</p></section>
      <div className="mt-7 flex flex-wrap gap-2" role="tablist" aria-label="Connection lists">
        {Object.entries(tabs).map(([key, value]) => <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === key ? 'bg-brand-teal text-white' : 'bg-brand-cream text-brand-ink'}`}>{value.label}</button>)}
      </div>
      {loading && <p className="mt-6 text-brand-subtle" role="status">Loading connections…</p>}
      {!loading && error && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900" role="alert"><p>{error}</p><button type="button" onClick={load} className="mt-2 font-semibold underline">Try again</button></div>}
      {!loading && !error && result.items.length === 0 && <p className="mt-6 rounded-2xl border border-brand-line bg-white p-6 text-brand-subtle">{tab === 'incoming' ? 'No incoming connection requests yet.' : tab === 'sent' ? 'You have not sent any pending requests.' : 'No accepted connections yet.'}</p>}
      {!loading && !error && result.items.length > 0 && <div className="mt-6 space-y-4">{result.items.map((item) => <ConnectionRow key={item.connection_id} item={item} tab={tab} onAction={act} />)}</div>}
      {!loading && !error && (page > 1 || result.has_more) && <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Connection pages"><button type="button" disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-full border border-brand-line px-4 py-2 text-sm disabled:opacity-50">Previous</button><span className="text-sm text-brand-subtle">Page {page}</span><button type="button" disabled={!result.has_more} onClick={() => setPage(page + 1)} className="rounded-full border border-brand-line px-4 py-2 text-sm disabled:opacity-50">Next</button></nav>}
    </main>
  );
}
