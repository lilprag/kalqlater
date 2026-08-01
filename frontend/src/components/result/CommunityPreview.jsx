import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, UsersRound } from 'lucide-react';
import { getPublicDirectory } from '../../services/communityService';
import { COMMUNITY_PREVIEW_LIMIT } from '../../data/resultNetwork/community';
import SectionHeader from './SectionHeader';

function ProfileCard({ member, cls, clsH }) {
    const location = [member.city, member.country].filter(Boolean).join(', ');
    return <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="min-w-[258px] snap-start rounded-3xl border border-brand-line bg-white p-5 shadow-[0_12px_30px_rgba(45,40,37,0.04)]">
        <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-teal/10 text-sm font-semibold text-brand-teal" aria-hidden="true">{member.display_name?.slice(0, 1)?.toUpperCase() || '?'}</span><div className="min-w-0"><h3 className={`truncate text-base text-brand-ink ${clsH}`}>{member.display_name}</h3><p className={`truncate text-xs text-brand-subtle ${cls}`}>{member.personality_type} · {member.profession}</p></div></div>
        {member.bio && <p className={`mt-4 line-clamp-2 text-sm leading-relaxed text-brand-subtle ${cls}`}>{member.bio}</p>}
        {location && <p className={`mt-4 flex items-center gap-1 text-xs text-brand-subtle ${cls}`}><MapPin size={12} aria-hidden="true" /> {location}</p>}
        <Link to={`/community/member/${encodeURIComponent(member.username)}`} className={`mt-5 inline-flex text-sm font-semibold text-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/30 ${cls}`}>View profile <span aria-hidden="true">→</span></Link>
    </motion.article>;
}

export default function CommunityPreview({ typeCode, identity, copy, cls, clsH, ctaTo, onCtaClick }) {
    const [state, setState] = useState({ status: 'loading', members: [] });
    const load = useCallback(async () => {
        setState((previous) => ({ ...previous, status: 'loading' }));
        try {
            const response = await getPublicDirectory({ type: typeCode }, 1, COMMUNITY_PREVIEW_LIMIT);
            setState({ status: 'ready', members: response.items || [] });
        } catch {
            setState({ status: 'error', members: [] });
        }
    }, [typeCode]);

    useEffect(() => { load(); }, [load]);

    const callToAction = <Link to={ctaTo} onClick={onCtaClick} className={`inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-sand px-5 py-3 text-sm font-semibold text-brand-ink transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white ${cls}`}>{copy.join}<ArrowRight size={16} aria-hidden="true" /></Link>;

    return <section className="max-w-6xl mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8" data-testid="community-preview">
        <SectionHeader eyebrow={copy.eyebrow} title={copy.tribe} description={copy.tribeText} cls={cls} clsH={clsH} />
        {state.status === 'loading' && <div className="grid gap-4 sm:grid-cols-3" aria-live="polite">{[0, 1, 2].map((item) => <div key={item} className="h-48 animate-pulse rounded-3xl bg-brand-cream" />)}</div>}
        {state.status === 'error' && <div className="rounded-3xl border border-brand-line bg-white p-6" role="alert"><p className={`text-brand-subtle ${cls}`}>{copy.communityError}</p><button type="button" onClick={load} className={`mt-4 rounded-full border border-brand-line px-4 py-2 text-sm font-semibold text-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal ${cls}`}>{copy.retry}</button></div>}
        {state.status === 'ready' && state.members.length === 0 && <div className="rounded-3xl border border-brand-line bg-white p-6 sm:p-8"><UsersRound size={21} className="text-brand-teal" aria-hidden="true" /><p className={`mt-4 max-w-xl text-lg text-brand-ink ${clsH}`}>{copy.emptyTribe.replace('{identity}', identity.name)}</p><p className={`mt-2 text-sm text-brand-subtle ${cls}`}>{copy.tribeText}</p><Link to={ctaTo} onClick={onCtaClick} className={`mt-5 inline-flex items-center gap-2 rounded-full bg-brand-teal px-5 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-brand-teal ${cls}`}>{copy.createProfile}<ArrowRight size={16} aria-hidden="true" /></Link></div>}
        {state.status === 'ready' && state.members.length > 0 && <><div role="region" aria-label={copy.tribe} tabIndex="0" className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 outline-none focus:ring-2 focus:ring-brand-teal/30 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">{state.members.map((member) => <ProfileCard key={member.username} member={member} cls={cls} clsH={clsH} />)}</div><div className="mt-7 flex flex-col items-start justify-between gap-4 rounded-3xl bg-brand-ink p-6 text-white sm:flex-row sm:items-center"><div><p className={`text-lg ${clsH}`}>{copy.join}</p><p className={`mt-1 text-sm text-white/70 ${cls}`}>{copy.tribeText}</p></div>{callToAction}</div></>}
    </section>;
}
