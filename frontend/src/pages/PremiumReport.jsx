import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Printer } from 'lucide-react';
import { TYPES } from '../data/types';
import { DASHBOARD_INSIGHTS } from '../data/insights/dashboard';
import { PERSONALITY_DNA } from '../data/insights/dna';
import { LEADERSHIP_INSIGHTS } from '../data/insights/leadership';
import { COMMUNICATION_INSIGHTS } from '../data/insights/communication';
import { COGNITIVE_INSIGHTS } from '../data/insights/cognitive';
import { GROWTH_BLUEPRINTS } from '../data/insights/growth';
import './PremiumReport.css';

import { API_URL } from '../services/apiConfig';
const API = API_URL;
const cognitiveLabels = { en: ['Thinking Style', 'Pattern Recognition', 'Problem Solving', 'Decision Speed', 'Creativity', 'Analytical Ability', 'Biggest Cognitive Bias', 'Cognitive Superpower'], hi: ['सोचने की शैली', 'पैटर्न पहचान', 'समस्या समाधान', 'निर्णय की गति', 'रचनात्मकता', 'विश्लेषण क्षमता', 'सबसे बड़ा संज्ञानात्मक पक्षपात', 'संज्ञानात्मक महाशक्ति'] };
const dnaLabels = { en: { leadership: 'Leadership', communication: 'Communication', cognition: 'Cognition', growth: 'Growth', career: 'Career', relationships: 'Relationships', stress: 'Stress', creativity: 'Creativity' }, hi: { leadership: 'नेतृत्व', communication: 'संवाद', cognition: 'संज्ञान', growth: 'विकास', career: 'करियर', relationships: 'रिश्ते', stress: 'तनाव', creativity: 'रचनात्मकता' } };

export default function PremiumReport() {
    const { id } = useParams();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [data, setData] = useState(location.state?.local ? location.state.local : null);
    const [loading, setLoading] = useState(!data && id !== 'preview');
    const previewCode = searchParams.get('type')?.toUpperCase();

    useEffect(() => {
        if (data || id === 'preview') return;
        axios.get(`${API}/submissions/${id}`).then((response) => {
            setData({ code: response.data.type_code, percentages: response.data.percentages });
        }).finally(() => setLoading(false));
    }, [id, data]);

    const typeCode = data?.code || previewCode;
    const type = TYPES[typeCode];
    if (loading) return <div className="max-w-2xl mx-auto px-4 py-32 text-center text-brand-subtle">Loading report…</div>;
    if (!type) return <div className="max-w-2xl mx-auto px-4 py-32 text-center"><p className="text-2xl text-brand-ink">Report not found</p><Link to="/types" className="mt-6 inline-block rounded-full bg-brand-teal px-6 py-3 text-white">Browse personality types</Link></div>;

    return <Report type={type} lang={location.state?.lang || 'en'} onPrint={() => window.print()} />;
}

function Report({ type, lang, onPrint }) {
    const info = type[lang] || type.en;
    const dashboard = (DASHBOARD_INSIGHTS[type.code]?.[lang] || DASHBOARD_INSIGHTS[type.code]?.en);
    const dna = (PERSONALITY_DNA[type.code]?.[lang] || PERSONALITY_DNA[type.code]?.en);
    const leadership = (LEADERSHIP_INSIGHTS[type.code]?.[lang] || LEADERSHIP_INSIGHTS[type.code]?.en);
    const communication = (COMMUNICATION_INSIGHTS[type.code]?.[lang] || COMMUNICATION_INSIGHTS[type.code]?.en);
    const cognitive = (COGNITIVE_INSIGHTS[type.code]?.[lang] || COGNITIVE_INSIGHTS[type.code]?.en);
    const growth = (GROWTH_BLUEPRINTS[type.code]?.[lang] || GROWTH_BLUEPRINTS[type.code]?.en);
    const date = new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', { dateStyle: 'long' }).format(new Date());

    return <div className="premium-report">
        <div className="premium-report__actions"><Link to={`/types/${type.code}`} className="premium-report__back"><ArrowLeft size={16} /> Back to profile</Link><button onClick={onPrint}><Printer size={16} /> Print / Save PDF</button></div>
        <main className="report-print">
            <section className="report-page report-cover">
                <div className="report-cover__orb report-cover__orb--one" /><div className="report-cover__orb report-cover__orb--two" />
                <div className="report-cover__content"><p className="report-kicker">KALQLATER · PREMIUM PERSONALITY REPORT</p><div className="report-mark">K</div><p className="report-cover__label">Your signature profile</p><h1>{type.code}</h1><h2>{info.nickname}</h2><p className="report-cover__headline">{info.headline}</p><div className="report-cover__meta"><span>Prepared {date}</span><span>Personal growth edition</span></div></div><PageNumber number="01" />
            </section>

            <section className="report-page"><ReportHeader eyebrow="Overview Dashboard" title="Your personality, at a glance" /><div className="report-score-grid">{dashboard && Object.entries(dashboard).map(([key, [score, note]]) => <div className={`report-score ${key === 'overall' ? 'report-score--overall' : ''}`} key={key}><span>{key}</span><strong>{score}<small>/100</small></strong><p>{note}</p></div>)}</div><PageNumber number="02" /></section>

            <section className="report-page report-dna"><ReportHeader eyebrow="Signature visual" title="Personality DNA" /><p className="report-intro">Eight strands form your visual fingerprint — a compact view of the traits that shape how you lead, connect, think, and grow.</p><div className="report-dna__list">{dna && Object.entries(dna).map(([key, [score, note]], index) => <div className="report-dna__strand" key={key}><div className="report-dna__name"><span>{String(index + 1).padStart(2, '0')}</span>{dnaLabels[lang]?.[key] || dnaLabels.en[key]}</div><div className="report-dna__line"><i style={{ width: `${score}%` }} />{[20, 45, 70, 95].map((position) => <b key={position} style={{ left: `${position}%`, opacity: position <= score ? 1 : 0.3 }} />)}</div><strong>{score}</strong><p>{note}</p></div>)}</div><PageNumber number="03" /></section>

            <section className="report-page"><ReportHeader eyebrow="Leadership" title={leadership?.style} /><p className="report-lead">{leadership?.summary}</p><ReportList title="Strengths to lead with" items={leadership?.strengths} /><ReportList title="Watch points" items={leadership?.blindSpots} /><ReportCallout label="Weekly action" content={leadership?.weeklyAction} /><ReportList title="Best-fit roles" items={leadership?.bestRoles} /><PageNumber number="04" /></section>

            <section className="report-page"><ReportHeader eyebrow="Communication" title="How you connect" /><ReportDetail title="Communication summary" content={communication?.summary} /><ReportDetail title="Preferred communication" content={communication?.preferred} /><ReportDetail title="Conflict style" content={communication?.conflict} /><ReportDetail title="Listening style" content={communication?.listening} /><ReportDetail title="Negotiation style" content={communication?.negotiation} /><ReportList title="Communication practices" items={communication?.tips} /><PageNumber number="05" /></section>

            <section className="report-page"><ReportHeader eyebrow="Cognitive Profile" title="Your thinking signature" /><div className="report-cognitive">{cognitive?.map((content, index) => <ReportDetail key={cognitiveLabels[lang]?.[index] || cognitiveLabels.en[index]} title={cognitiveLabels[lang]?.[index] || cognitiveLabels.en[index]} content={content} />)}</div><PageNumber number="06" /></section>

            <section className="report-page"><ReportHeader eyebrow="Personal Growth Blueprint" title="Your next useful move" /><ReportList title="Top 3 growth priorities" items={growth?.priorities} numbered /><div className="report-two-column"><ReportList title="Habits to build" items={growth?.build} /><ReportList title="Habits to avoid" items={growth?.avoid} /></div><ReportCallout label="Weekly challenge" content={growth?.challenge} /><div className="report-two-column"><ReportDetail title="Communication goal" content={growth?.communication} /><ReportDetail title="Career development goal" content={growth?.career} /></div><ReportDetail title="Relationship goal" content={growth?.relationship} /><blockquote>“{growth?.motto}”</blockquote><PageNumber number="07" /></section>
        </main>
    </div>;
}

function ReportHeader({ eyebrow, title }) { return <header className="report-header"><p>{eyebrow}</p><h2>{title}</h2></header>; }
function ReportList({ title, items, numbered = false }) { return <div className="report-list"><h3>{title}</h3><ul>{items?.map((item, index) => <li key={item}><span>{numbered ? index + 1 : '•'}</span>{item}</li>)}</ul></div>; }
function ReportDetail({ title, content }) { return <div className="report-detail"><h3>{title}</h3><p>{content}</p></div>; }
function ReportCallout({ label, content }) { return <div className="report-callout"><span>{label}</span><p>{content}</p></div>; }
function PageNumber({ number }) { return <footer className="report-page-number"><span>KalQLater · Premium Report</span><strong>{number}</strong></footer>; }
