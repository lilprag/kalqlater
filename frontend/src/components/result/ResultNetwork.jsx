import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Building2, HeartHandshake, MessageSquareText } from 'lucide-react';
import { trackEvent } from '../../services/analytics';
import { NETWORK_COPY } from '../../data/resultNetwork/copy';
import { profileFor } from '../../data/resultNetwork/profiles';
import { getCompanies } from '../../data/resultNetwork/companies';
import { getCareerMatches } from '../../data/resultNetwork/careerMatches';
import { getCompatibility } from '../../data/resultNetwork/compatibility';
import { getLocations } from '../../data/resultNetwork/locations';
import { getJobs } from '../../data/resultNetwork/jobs';
import { getDiscussions } from '../../data/resultNetwork/discussions';
import { getBooks } from '../../data/resultNetwork/books';
import { getJobs as getLiveJobs } from '../../services/jobService';
import SectionHeader from './SectionHeader';
import CommunityPreview from './CommunityPreview';
import CompanyCard from './CompanyCard';
import CareerCard from './CareerCard';
import CompatibilityCard from './CompatibilityCard';
import LocationCard from './LocationCard';
import DiscussionCard from './DiscussionCard';
import BookCard from './BookCard';
import UnlockBanner from './UnlockBanner';

function ScrollRow({ children, label }) {
    return <div role="region" aria-label={label} tabIndex="0" className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 outline-none focus:ring-2 focus:ring-brand-teal/30 sm:mx-0 sm:px-0">{children}</div>;
}

function PreviewNotice({ copy, cls }) {
    return <p className={`mt-4 inline-flex rounded-full border border-brand-line bg-white px-3 py-1 text-[11px] text-brand-subtle ${cls}`}>{copy.preview}</p>;
}

const careerJobsCache = new Map();
function useCareerJobs(typeCode, categoryKey) {
    const cacheKey = `${typeCode}:${categoryKey}`;
    const [state, setState] = useState(() => careerJobsCache.get(cacheKey) || { status: 'loading', jobs: [] });
    useEffect(() => {
        let current = true;
        if (!typeCode || !categoryKey) {
            setState({ status: 'ready', jobs: [] });
            return () => { current = false; };
        }
        const cached = careerJobsCache.get(cacheKey);
        if (cached) { setState(cached); return () => { current = false; }; }
        setState({ status: 'loading', jobs: [] });
        getLiveJobs({ type: typeCode, career: categoryKey }, 1, 12).then((result) => {
            const next = { status: 'ready', jobs: result.items || [] };
            careerJobsCache.set(cacheKey, next);
            if (current) setState(next);
        }).catch(() => { if (current) setState({ status: 'failed', jobs: [] }); });
        return () => { current = false; };
    }, [cacheKey, categoryKey, typeCode]);
    return state;
}

function SectionTracker({ name, typeCode, lang, loggedIn, children }) {
    const node = useRef(null);
    useEffect(() => {
        const element = node.current;
        if (!element || !('IntersectionObserver' in window)) return undefined;
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            trackEvent('result_network_section_viewed', { personality_type: typeCode, section_name: name, logged_in: loggedIn, language: lang }, `result-network:${window.location.pathname}:${name}`);
            observer.disconnect();
        }, { threshold: 0.22 });
        observer.observe(element);
        return () => observer.disconnect();
    }, [lang, loggedIn, name, typeCode]);
    return <div ref={node}>{children}</div>;
}

export default function ResultNetwork({ typeCode, lang, signedIn = false, hasProfile = false, returnTo }) {
    const copy = NETWORK_COPY[lang] || NETWORK_COPY.en;
    const profile = profileFor(typeCode, lang);
    const careers = getCareerMatches(typeCode, lang) || [];
    const careerCategories = useMemo(() => (getCareerMatches(typeCode, lang) || []).map((career) => career.category).filter(Boolean), [lang, typeCode]);
    const careerCategoryKey = useMemo(() => careerCategories.join(','), [careerCategories]);
    const careerJobs = useCareerJobs(typeCode, careerCategoryKey);
    useEffect(() => {
        if (careerJobs.status !== 'ready' || !careerJobs.jobs.length) return;
        trackEvent('result_live_jobs_viewed', { personality_type: typeCode, logged_in: signedIn, language: lang }, `result-live-jobs:${typeCode}:${lang}`);
    }, [careerJobs.jobs.length, careerJobs.status, lang, signedIn, typeCode]);
    if (!profile) return null;
    const cls = lang === 'hi' ? 'font-body-hi' : '';
    const clsH = lang === 'hi' ? 'font-display-hi' : 'font-display';
    const ctaTo = signedIn ? (hasProfile ? '/community' : '/community/me') : { pathname: '/signup', state: { from: returnTo } };
    const eventData = { personality_type: typeCode, logged_in: signedIn, language: lang };
    const trackCta = () => trackEvent(signedIn ? 'result_community_cta_clicked' : 'result_signup_cta_clicked', { ...eventData, section_name: 'community' });
    const companies = getCompanies(typeCode, lang);
    const compatibility = getCompatibility(typeCode, lang);
    const locations = getLocations();
    const jobs = getJobs(typeCode, lang);
    const discussions = getDiscussions();
    const books = getBooks();

    return <MotionConfig reducedMotion="user">
        <SectionTracker name="identity" typeCode={typeCode} lang={lang} loggedIn={signedIn}><section className="max-w-6xl mx-auto px-4 pt-4 sm:px-6 lg:px-8" data-testid="personality-identity"><div className="rounded-[2rem] border border-brand-line bg-white p-6 shadow-[0_14px_34px_rgba(45,40,37,0.04)] sm:p-8"><p className={`text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-teal ${cls}`}>{copy.identity}</p><div className="mt-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><h2 className={`text-3xl text-brand-ink sm:text-4xl ${clsH}`}>{profile.name} <span className="text-brand-teal">· {profile.code}</span></h2><p className={`mt-3 max-w-2xl text-base leading-relaxed text-brand-subtle ${cls}`}>{profile.focus}</p></div><p className={`rounded-2xl bg-brand-cream px-4 py-3 text-sm text-brand-ink ${cls}`}><span className="font-semibold">{profile.rarity}</span> {copy.rare}</p></div><div className="mt-6 flex flex-wrap gap-2">{profile.badges.map((badge) => <span key={badge} className={`rounded-full border border-brand-line bg-brand-bg px-3 py-1.5 text-xs text-brand-subtle ${cls}`}>{badge}</span>)}</div></div></section></SectionTracker>
        <SectionTracker name="community" typeCode={typeCode} lang={lang} loggedIn={signedIn}><CommunityPreview typeCode={typeCode} identity={profile} copy={copy} cls={cls} clsH={clsH} ctaTo={ctaTo} onCtaClick={trackCta} /></SectionTracker>
        <SectionTracker name="companies" typeCode={typeCode} lang={lang} loggedIn={signedIn}><section className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8"><SectionHeader eyebrow={copy.eyebrow} title={copy.companies} description={copy.companiesText} cls={cls} clsH={clsH} /><ScrollRow label={copy.companies}>{companies.map((company, index) => <CompanyCard key={company.name} company={company} index={index} cls={cls} />)}</ScrollRow><PreviewNotice copy={copy} cls={cls} /></section></SectionTracker>
        <SectionTracker name="careers" typeCode={typeCode} lang={lang} loggedIn={signedIn}><section className="bg-brand-cream/65 py-12 sm:py-16"><div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"><SectionHeader eyebrow={copy.eyebrow} title={copy.careers} description={copy.careersText} cls={cls} clsH={clsH} /><ScrollRow label={copy.careers}>{careers.map((item, index) => <CareerCard key={item.role} item={item} index={index} copy={copy} cls={cls} clsH={clsH} typeCode={typeCode} signedIn={signedIn} ctaTo={ctaTo} jobsState={careerJobs.status} liveJobs={careerJobs.jobs.filter((job) => job.career_categories?.includes(item.category))} />)}</ScrollRow></div></section></SectionTracker>
        <SectionTracker name="matches" typeCode={typeCode} lang={lang} loggedIn={signedIn}><section className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8"><SectionHeader eyebrow={copy.eyebrow} title={copy.matches} description={copy.matchesText} cls={cls} clsH={clsH} /><ScrollRow label={copy.matches}>{compatibility.map((item, index) => <CompatibilityCard key={item.type} item={item} index={index} cls={cls} clsH={clsH} />)}</ScrollRow><div className="mt-6"><Link to="/compare" onClick={() => trackEvent('result_match_preview_clicked', eventData)} className={`inline-flex items-center gap-2 rounded-full border border-brand-line bg-white px-5 py-3 text-sm text-brand-ink transition-colors hover:bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-teal ${cls}`}><HeartHandshake size={16} aria-hidden="true" /> {copy.detail}</Link></div></section></SectionTracker>
        <SectionTracker name="locations" typeCode={typeCode} lang={lang} loggedIn={signedIn}><section className="bg-brand-ink py-12 text-white sm:py-16"><div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"><SectionHeader eyebrow={copy.eyebrow} title={copy.locations} description={copy.locationsText} cls={cls} clsH={clsH} inverse /><ScrollRow label={copy.locations}>{locations.map((location, index) => <LocationCard key={location.city} location={location} index={index} copy={copy} cls={cls} clsH={clsH} />)}</ScrollRow></div></section></SectionTracker>
        <SectionTracker name="jobs" typeCode={typeCode} lang={lang} loggedIn={signedIn}><section className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8"><SectionHeader eyebrow={copy.eyebrow} title={copy.jobs} description={copy.jobsText} cls={cls} clsH={clsH} /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{jobs.map((job) => <article key={job.company} className="rounded-3xl border border-brand-line bg-white p-5"><Building2 size={18} className="text-brand-saffron" aria-hidden="true" /><h3 className={`mt-5 text-lg text-brand-ink ${clsH}`}>{job.title}</h3><p className={`mt-1 text-sm text-brand-subtle ${cls}`}>{job.company}</p><p className={`mt-4 text-sm leading-relaxed text-brand-subtle ${cls}`}>{job.reason}</p><button type="button" onClick={() => trackEvent('result_job_preview_clicked', eventData)} className={`mt-5 rounded-full border border-brand-line px-3 py-2 text-xs font-semibold text-brand-subtle focus:outline-none focus:ring-2 focus:ring-brand-teal ${cls}`}>{copy.comingSoon}</button></article>)}</div><PreviewNotice copy={copy} cls={cls} /></section></SectionTracker>
        <SectionTracker name="discovery" typeCode={typeCode} lang={lang} loggedIn={signedIn}><section className="bg-brand-cream/65 py-12 sm:py-16"><div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"><div className="grid gap-10 lg:grid-cols-2"><div><SectionHeader eyebrow={copy.eyebrow} title={copy.discussions} cls={cls} clsH={clsH} /><ScrollRow label={copy.discussions}>{discussions.map((discussion) => <DiscussionCard key={discussion.title} discussion={discussion} copy={copy} cls={cls} clsH={clsH} />)}</ScrollRow></div><div><SectionHeader eyebrow={copy.eyebrow} title={copy.books} cls={cls} clsH={clsH} /><ScrollRow label={copy.books}>{books.map((book, index) => <BookCard key={book.title} book={book} index={index} cls={cls} clsH={clsH} />)}</ScrollRow></div></div><div className={`mt-5 flex items-center gap-2 text-xs text-brand-subtle ${cls}`}><MessageSquareText size={14} aria-hidden="true" /> {copy.preview}</div></div></section></SectionTracker>
        <UnlockBanner copy={copy} cls={cls} clsH={clsH} to={ctaTo} signedIn={signedIn} onClick={() => trackEvent(signedIn ? 'result_community_cta_clicked' : 'result_signup_cta_clicked', { ...eventData, section_name: 'unlock_banner' })} />
    </MotionConfig>;
}
