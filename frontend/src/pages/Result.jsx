import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ArrowRight, Copy, RotateCcw, Share2 } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { TYPES } from '../data/types';
import Blobs from '../components/Blobs';
import LeadershipCard from '../components/result/LeadershipCard';
import CommunicationCard from '../components/result/CommunicationCard';
import CognitiveCard from '../components/result/CognitiveCard';
import GrowthBlueprintCard from '../components/result/GrowthBlueprintCard';
import DashboardOverview from '../components/result/DashboardOverview';
import PersonalityDNA from '../components/result/PersonalityDNA';
import AICoachCard from '../components/result/AICoachCard';
import ResultNetwork from '../components/result/ResultNetwork';
import { profileFor } from '../data/resultNetwork/profiles';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../services/analytics';

import { API_URL } from '../services/apiConfig';
const API = API_URL;

const AXIS = [
    { key: 'EI', letters: ['E', 'I'] },
    { key: 'SN', letters: ['S', 'N'] },
    { key: 'TF', letters: ['T', 'F'] },
    { key: 'JP', letters: ['J', 'P'] },
];

export default function Result() {
    const { id } = useParams();
    const location = useLocation();
    const { lang, t } = useLang();
    const { user } = useAuth();
    const hi = lang === 'hi';
    const cls = hi ? 'font-body-hi' : '';
    const clsH = hi ? 'font-display-hi' : 'font-display';

    const [data, setData] = useState(location.state?.local ? { code: location.state.local.code, percentages: location.state.local.percentages } : null);
    const [loading, setLoading] = useState(!data);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (data) return;
        if (id === 'local') { setLoading(false); return; }
        axios.get(`${API}/submissions/${id}`).then((r) => {
            setData({ code: r.data.type_code, percentages: r.data.percentages });
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [id, data]);

    useEffect(() => {
        if (!data?.code) return;
        trackEvent('result_viewed', { personality_type: data.code, logged_in: Boolean(user), language: lang }, `result-viewed:${window.location.pathname}`);
    }, [data?.code, lang, user]);

    if (loading) {
        return <div className="max-w-2xl mx-auto px-4 py-32 text-center text-brand-subtle">Loading…</div>;
    }
    if (!data) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-32 text-center">
                <div className={`text-brand-ink text-2xl ${clsH}`}>{hi ? 'परिणाम नहीं मिला' : 'Result not found'}</div>
                <Link to="/test" data-testid="retake-nf" className={`inline-block mt-6 rounded-full bg-brand-teal text-white px-6 py-3 ${cls}`}>{t.result.retake}</Link>
            </div>
        );
    }

    const type = TYPES[data.code];
    const p = data.percentages;
    const info = hi ? type.hi : type.en;
    const identity = profileFor(data.code, lang);

    const shareUrl = window.location.href;
    const shareMsg = `${t.result.summaryPrefix} ${data.code} — ${info.nickname} ${t.result.summarySuffix}`;
    const waLink = `https://wa.me/?text=${encodeURIComponent(shareMsg + ' ' + shareUrl)}`;

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) { /* ignore clipboard errors */ }
    };

    return (
        <div className="relative">
            {/* Hero */}
            <section className="relative overflow-hidden grain">
                <Blobs />
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <div className={`inline-block rounded-full bg-white/80 backdrop-blur border border-brand-line px-4 py-1.5 text-xs tracking-[0.25em] uppercase text-brand-subtle ${cls}`}>{t.result.yourType}</div>
                        <div className="mt-6 flex flex-wrap items-baseline gap-4">
                            <h1 className={`text-3xl sm:text-4xl lg:text-5xl text-brand-ink ${clsH}`} data-testid="type-nickname">{identity?.name || info.nickname}</h1>
                            <div className={`text-5xl sm:text-6xl lg:text-7xl tracking-tight text-brand-ink ${clsH}`} data-testid="type-code" style={{ color: type.color }}>{type.code}</div>
                        </div>
                        <p className={`mt-4 max-w-2xl text-lg text-brand-subtle ${cls}`} data-testid="type-headline">{info.headline}</p>
                        {identity && <div className="mt-6 flex flex-wrap gap-2"><span className={`rounded-full bg-brand-ink px-3 py-1.5 text-xs text-white ${cls}`}>{hi ? `केवल ${identity.rarity} लोग` : `Only ${identity.rarity} of people`}</span>{identity.badges.map((badge) => <span key={badge} className={`rounded-full border border-brand-line bg-white/75 px-3 py-1.5 text-xs text-brand-subtle ${cls}`}>{badge}</span>)}</div>}

                        <div className="mt-8 flex flex-wrap gap-3">
                            <a data-testid="share-whatsapp" href={waLink} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 rounded-full bg-brand-teal text-white px-6 py-3 hover:bg-[#164E59] ${cls}`}>
                                <Share2 size={16} /> {t.result.shareWa}
                            </a>
                            <button data-testid="copy-link" onClick={copyLink} className={`inline-flex items-center gap-2 rounded-full bg-white border border-brand-line px-6 py-3 hover:bg-brand-cream ${cls}`}>
                                <Copy size={16} /> {copied ? t.result.copied : t.result.copyLink}
                            </button>
                            <Link to="/test" data-testid="retake-btn" className={`inline-flex items-center gap-2 rounded-full bg-brand-cream border border-brand-line px-6 py-3 hover:bg-white ${cls}`}>
                                <RotateCcw size={16} /> {t.result.retake}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <DashboardOverview typeCode={data.code} lang={lang} />
            <ResultNetwork typeCode={data.code} lang={lang} signedIn={Boolean(user)} hasProfile={Boolean(user?.profile)} returnTo={`${location.pathname}${location.search}`} />
            <PersonalityDNA typeCode={data.code} lang={lang} />
            <AICoachCard typeCode={data.code} lang={lang} />

            {/* Traits bars */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-testid="result-traits">
                <h2 className={`text-2xl sm:text-3xl text-brand-ink mb-8 ${clsH}`}>{t.result.traits}</h2>
                <div className="grid md:grid-cols-2 gap-5">
                    {AXIS.map((a, i) => {
                        const [L1, L2] = a.letters;
                        const v1 = p[L1] ?? 50;
                        const v2 = p[L2] ?? 50;
                        const dom = v1 >= 50 ? L1 : L2;
                        const domV = Math.max(v1, v2);
                        return (
                            <motion.div
                                key={a.key}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="rounded-3xl bg-white border border-brand-line p-6"
                                data-testid={`trait-${a.key}`}
                            >
                                <div className="flex items-center justify-between mb-3 text-sm">
                                    <span className="font-semibold" style={{ color: type.color }}>{dom}</span>
                                    <span className="text-brand-subtle">{domV}%</span>
                                </div>
                                <div className="h-3 rounded-full bg-brand-cream overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{ background: `linear-gradient(90deg, #1F6C7D, ${type.color})` }}
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${domV}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: 0.2 + i * 0.05 }}
                                    />
                                </div>
                                <div className={`mt-2 flex items-center justify-between text-xs text-brand-subtle ${cls}`}>
                                    <span>{L1} · {v1}%</span>
                                    <span>{v2}% · {L2}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* Description */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="rounded-3xl bg-white border border-brand-line p-8">
                    <p className={`text-lg leading-relaxed text-brand-ink ${cls}`} data-testid="type-description">{info.description}</p>
                </div>
            </section>

            {/* Grid sections */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6 pb-16">
                <Card title={t.result.strengths} items={info.strengths} accent={type.color} cls={cls} tid="strengths" />
                <Card title={t.result.weaknesses} items={info.weaknesses} accent="#B35841" cls={cls} tid="weaknesses" />
                <Card title={t.result.careers} items={info.careers} accent="#1F6C7D" cls={cls} tid="careers" />
                <div className="rounded-3xl bg-white border border-brand-line p-6" data-testid="relationships">
                    <div className={`text-xs tracking-[0.25em] uppercase text-brand-subtle mb-3 ${cls}`}>{t.result.relationships}</div>
                    <p className={`text-brand-ink leading-relaxed ${cls}`}>{info.relationships}</p>
                </div>
            </section>

            <LeadershipCard typeCode={data.code} lang={lang} />
            <CommunicationCard typeCode={data.code} lang={lang} />
            <CognitiveCard typeCode={data.code} lang={lang} />
            <GrowthBlueprintCard typeCode={data.code} lang={lang} />

            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
                <Link to="/types" data-testid="explore-all" className={`inline-flex items-center gap-2 rounded-full bg-brand-teal text-white px-6 py-3 hover:bg-[#164E59] ${cls}`}>
                    {t.result.explore} <ArrowRight size={16} />
                </Link>
            </section>
        </div>
    );
}

function Card({ title, items, accent, cls, tid }) {
    return (
        <div className="rounded-3xl bg-white border border-brand-line p-6" data-testid={tid}>
            <div className={`text-xs tracking-[0.25em] uppercase text-brand-subtle mb-3 ${cls}`}>{title}</div>
            <ul className="space-y-2">
                {items.map((it, i) => (
                    <li key={i} className={`flex items-start gap-3 text-brand-ink ${cls}`}>
                        <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent }} />
                        <span>{it}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
