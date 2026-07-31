import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ExternalLink, Share2 } from 'lucide-react';
import { getPublicProfile } from '../../services/communityService';
import { acceptConnection, cancelConnection, declineConnection, getConnectionStatus, sendConnectionRequest } from '../../services/connectionService';
import { useAuth } from '../../context/AuthContext';

const names = { linkedin: 'LinkedIn', instagram: 'Instagram', x: 'X', github: 'GitHub', portfolio: 'Portfolio', website: 'Website' };

const Chips = ({ title, items }) => items?.length ? (
  <section className="rounded-2xl border border-brand-line p-5">
    <h2 className="font-display text-xl">{title}</h2>
    <div className="mt-3 flex flex-wrap gap-2">{items.map((item) => <span key={item} className="rounded-full bg-brand-cream px-3 py-1 text-sm">{item}</span>)}</div>
  </section>
) : null;

function ConnectionActions({ username, status, setStatus }) {
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');

  const act = async (action) => {
    setWorking(true);
    setError('');
    try {
      if (action === 'send') await sendConnectionRequest(username);
      if (action === 'accept') await acceptConnection(status.connection_id);
      if (action === 'decline') await declineConnection(status.connection_id);
      if (action === 'cancel') await cancelConnection(status.connection_id);
      const next = await getConnectionStatus(username);
      setStatus(next);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setWorking(false);
    }
  };

  if (!status) return <span className="text-sm text-brand-subtle" role="status">Loading connection options…</span>;
  if (status.status === 'connected') return <span className="rounded-full bg-brand-teal/10 px-4 py-2 text-sm font-semibold text-brand-teal">Connected</span>;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status.status === 'none' && <button type="button" disabled={working} onClick={() => act('send')} className="rounded-full bg-brand-teal px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{working ? 'Sending…' : 'Connect'}</button>}
      {status.status === 'outgoing_pending' && <><span className="rounded-full bg-brand-cream px-4 py-2 text-sm font-semibold text-brand-ink">Request sent</span><button type="button" disabled={working} onClick={() => act('cancel')} className="rounded-full border border-brand-line px-4 py-2 text-sm font-semibold disabled:opacity-60">{working ? 'Cancelling…' : 'Cancel request'}</button></>}
      {status.status === 'incoming_pending' && <><button type="button" disabled={working} onClick={() => act('accept')} className="rounded-full bg-brand-teal px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{working ? 'Accepting…' : 'Accept'}</button><button type="button" disabled={working} onClick={() => act('decline')} className="rounded-full border border-brand-line px-4 py-2 text-sm font-semibold disabled:opacity-60">{working ? 'Declining…' : 'Decline'}</button></>}
      {error && <p className="basis-full text-sm text-red-700" role="alert">{error}</p>}
    </div>
  );
}

export default function MemberProfile() {
  const { username } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [profile, setProfile] = useState();
  const [state, setState] = useState('loading');
  const [shared, setShared] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const isOwnProfile = user?.profile?.username === username;

  const loadProfile = useCallback(async () => {
    try {
      const data = await getPublicProfile(username);
      setProfile(data);
      setState('ok');
      if (user && user.profile?.username !== data.username) {
        try { setConnectionStatus(await getConnectionStatus(data.username)); } catch { setConnectionStatus({ status: 'none' }); }
      }
    } catch {
      setState('missing');
    }
  }, [username, user]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  useEffect(() => {
    if (!profile) return undefined;
    const url = `https://kalqlater.com/community/member/${encodeURIComponent(profile.username)}`;
    const title = `${profile.display_name} (${profile.personality_type}) | KalQLater Community`;
    const description = `${profile.display_name} is a ${profile.personality_type} community member${profile.profession ? ` working in ${profile.profession}` : ''}.`;
    document.title = title;
    const setMeta = (selector, attribute, key, value) => {
      let element = document.head.querySelector(selector);
      if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, key); document.head.appendChild(element); }
      element.setAttribute('content', value);
    };
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:url"]', 'name', 'twitter:url', url);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical); }
    canonical.setAttribute('href', url);
    let schema = document.getElementById('member-profile-structured-data');
    if (!schema) { schema = document.createElement('script'); schema.id = 'member-profile-structured-data'; schema.type = 'application/ld+json'; document.head.appendChild(schema); }
    schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: profile.display_name, url, jobTitle: profile.profession || undefined, address: profile.country ? { '@type': 'PostalAddress', addressLocality: profile.city || undefined, addressCountry: profile.country } : undefined });
    return () => schema?.remove();
  }, [profile]);

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: profile.display_name, url: window.location.href });
      else await navigator.clipboard.writeText(window.location.href);
      setShared(true);
    } catch { /* A cancelled native share dialog is not an application error. */ }
  };

  if (state === 'loading') return <main className="p-24 text-center">Loading profile…</main>;
  if (state !== 'ok') return <main className="p-24 text-center">This profile is private, hidden, or unavailable.</main>;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <section className="rounded-[2rem] border border-brand-line bg-white p-6 sm:p-8">
        <p className="text-sm text-brand-teal">{profile.personality_type}</p>
        <h1 className="mt-2 font-display text-4xl">{profile.display_name}</h1>
        <p className="text-brand-subtle">@{profile.username} · {profile.profession} · {profile.city}, {profile.country}</p>
        <p className="mt-6 text-lg">{profile.bio}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {isOwnProfile && <Link to="/community/profile" className="font-semibold text-brand-teal">Edit Profile</Link>}
          {!isOwnProfile && user && <ConnectionActions username={profile.username} status={connectionStatus} setStatus={setConnectionStatus} />}
          {!isOwnProfile && !user && <Link to="/login" state={{ from: location.pathname }} className="rounded-full bg-brand-teal px-4 py-2 text-sm font-semibold text-white">Login to connect</Link>}
          <button type="button" onClick={share} className="inline-flex items-center gap-1 font-semibold text-brand-teal"><Share2 size={15} aria-hidden="true" />{shared ? 'Link copied' : 'Share Profile'}</button>
        </div>
      </section>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Chips title="Skills" items={profile.skills} />
        <Chips title="Industries" items={profile.industries} />
        <Chips title="Languages" items={profile.languages} />
        <Chips title="Connection intents" items={profile.connection_intents} />
        <section className="rounded-2xl border border-brand-line p-5"><h2 className="font-display text-xl">Experience & availability</h2><p className="mt-3">{profile.years_experience} years experience · {profile.availability}</p></section>
        {Object.keys(profile.social_links || {}).length > 0 && <section className="rounded-2xl border border-brand-line p-5"><h2 className="font-display text-xl">Selected links</h2><div className="mt-3 flex flex-wrap gap-2">{Object.entries(profile.social_links).map(([key, value]) => <a key={key} href={value} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border px-3 py-2 text-sm">{names[key]}<ExternalLink size={13} aria-hidden="true" /></a>)}</div></section>}
      </div>
    </main>
  );
}
