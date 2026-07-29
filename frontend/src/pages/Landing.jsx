import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Zap, Heart, Layers, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { useLang } from '../context/LangContext';
import Blobs from '../components/Blobs';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Landing() {
    const { lang, t } = useLang();
    const hi = lang === 'hi';
    const cls = hi ? 'font-body-hi' : '';
    const clsH = hi ? 'font-display-hi' : 'font-display';
    const [count, setCount] = useState(null);

    useEffect(() => {
        axios.get(`${API}/submissions/count/total`).then((r) => setCount(r.data.total)).catch(() => setCount(128473));
    }, []);

    const dims = [
        { icon: Zap, key: 'EI', hi: ['बहिर्मुखी बनाम अंतर्मुखी', 'आप अपनी ऊर्जा कहाँ से पाते हैं?'], en: ['Extraversion vs Introversion', 'Where you draw energy from'], color: 'from-brand-teal to-brand-plum' },
        { icon: Layers, key: 'SN', hi: ['इंद्रियबोध बनाम अंतर्ज्ञान', 'आप जानकारी कैसे लेते हैं?'], en: ['Sensing vs Intuition', 'How you take in information'], color: 'from-brand-saffron to-brand-sand' },
        { icon: Heart, key: 'TF', hi: ['विचार बनाम भावना', 'आप निर्णय कैसे लेते हैं?'], en: ['Thinking vs Feeling', 'How you make decisions'], color: 'from-brand-plum to-brand-saffron' },
        { icon: Compass, key: 'JP', hi: ['निर्णायक बनाम खुला-अंत', 'आप बाहरी दुनिया से कैसे मिलते हैं?'], en: ['Judging vs Perceiving', 'How you engage the outer world'], color: 'from-brand-teal to-brand-sand' },
    ];

    const features = [
        { icon: Sparkles, t: t.landing.f1t, d: t.landing.f1d },
        { icon: Users, t: t.landing.f2t, d: t.landing.f2d },
        { icon: Layers, t: t.landing.f3t, d: t.landing.f3d },
        { icon: ShieldCheck, t: t.landing.f4t, d: t.landing.f4d },
    ];

    return (
        <div>
            {/* Hero */}
            <section className="relative overflow-hidden grain">
                <Blobs />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20 lg:pt-24 lg:pb-32">
                    <div className="grid lg:grid-cols-12 gap-8 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="lg:col-span-7"
                        >
                            <div className={`inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur border border-brand-line px-4 py-1.5 text-xs tracking-wide text-brand-subtle ${cls}`} data-testid="hero-eyebrow">
                                <Sparkles size={14} className="text-brand-saffron" />
                                {t.hero.eyebrow}
                            </div>
                            <h1 className={`mt-6 text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-brand-ink ${clsH}`} data-testid="hero-title">
                                {t.hero.title}
                            </h1>
                            <p className={`mt-6 max-w-xl text-base sm:text-lg text-brand-subtle ${cls}`} data-testid="hero-subtitle">
                                {t.hero.subtitle}
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    to="/test"
                                    data-testid="hero-cta-start"
                                    className="group inline-flex items-center gap-2 rounded-full bg-brand-teal text-white px-6 py-3.5 text-base font-medium shadow-[0_8px_30px_rgb(31,108,125,0.25)] hover:bg-[#164E59] transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <span className={cls}>{t.hero.cta}</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/types"
                                    data-testid="hero-cta-secondary"
                                    className={`inline-flex items-center gap-2 rounded-full bg-white border border-brand-line px-6 py-3.5 text-base text-brand-ink hover:bg-brand-cream transition-colors ${cls}`}
                                >
                                    {t.hero.secondaryCta}
                                </Link>
                            </div>
                            <div className={`mt-8 flex items-center gap-3 text-sm text-brand-subtle ${cls}`}>
                                <div className="flex -space-x-2">
                                    {['#E87A5D', '#1F6C7D', '#6E4555', '#DAB49D'].map((c) => (
                                        <span key={c} className="w-8 h-8 rounded-full ring-2 ring-white" style={{ background: c }} />
                                    ))}
                                </div>
                                <span data-testid="trust-count">
                                    <span className="font-semibold text-brand-ink">{count ? count.toLocaleString(hi ? 'hi-IN' : 'en-IN') : '—'}</span> {t.hero.trust}
                                </span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="lg:col-span-5 relative"
                        >
                            <div className="relative aspect-square max-w-md mx-auto">
                                <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-brand-saffron/20 via-brand-sand/40 to-brand-teal/30 blur-2xl" />
                                <div className="absolute inset-6 rounded-[2.5rem] bg-white border border-brand-line shadow-[0_20px_60px_rgb(46,40,37,0.08)] p-8 flex flex-col justify-between">
                                    <div>
                                        <div className={`text-xs tracking-[0.25em] uppercase text-brand-subtle ${cls}`}>INTJ</div>
                                        <div className={`mt-2 text-3xl text-brand-ink ${clsH}`}>{hi ? 'वास्तुकार' : 'The Architect'}</div>
                                        <p className={`mt-2 text-sm text-brand-subtle ${cls}`}>{hi ? 'शांत रणनीतिकार जो व्यवस्थाओं को गहराई से देखता है।' : 'A quiet strategist who sees systems in depth.'}</p>
                                    </div>
                                    <div className="space-y-2.5">
                                        {[['I', 78], ['N', 65], ['T', 71], ['J', 60]].map(([l, v]) => (
                                            <div key={l}>
                                                <div className="flex justify-between text-[11px] text-brand-subtle mb-1">
                                                    <span>{l}</span><span>{v}%</span>
                                                </div>
                                                <div className="h-1.5 rounded-full bg-brand-cream overflow-hidden">
                                                    <div className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-plum" style={{ width: `${v}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className={`text-3xl sm:text-4xl text-brand-ink mb-12 ${clsH}`} data-testid="features-heading">{t.landing.featuresTitle}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="rounded-3xl bg-white border border-brand-line p-6 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgb(46,40,37,0.06)] transition-all"
                            data-testid={`feature-${i}`}
                        >
                            <div className="w-11 h-11 rounded-2xl bg-brand-cream flex items-center justify-center text-brand-teal mb-4">
                                <f.icon size={20} />
                            </div>
                            <div className={`font-semibold text-brand-ink text-lg ${hi ? 'font-body-hi' : ''}`}>{f.t}</div>
                            <p className={`mt-2 text-sm text-brand-subtle ${cls}`}>{f.d}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Dimensions */}
            <section className="relative bg-brand-cream/50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <h2 className={`text-3xl sm:text-4xl text-brand-ink ${clsH}`} data-testid="dimensions-heading">{t.landing.dimTitle}</h2>
                        <p className={`mt-3 text-brand-subtle ${cls}`}>{t.landing.dimSub}</p>
                    </div>
                    <div className="mt-10 grid md:grid-cols-2 gap-6">
                        {dims.map((d, i) => (
                            <motion.div
                                key={d.key}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="relative rounded-3xl bg-white border border-brand-line p-8 overflow-hidden"
                                data-testid={`dim-card-${d.key}`}
                            >
                                <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${d.color} opacity-20 blur-2xl`} />
                                <d.icon size={24} className="text-brand-teal" />
                                <div className={`mt-4 text-2xl text-brand-ink ${clsH}`}>{(hi ? d.hi : d.en)[0]}</div>
                                <p className={`mt-2 text-brand-subtle ${cls}`}>{(hi ? d.hi : d.en)[1]}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h2 className={`text-3xl sm:text-4xl text-brand-ink ${clsH}`}>{t.landing.ctaBottom}</h2>
                <div className="mt-6">
                    <Link
                        to="/test"
                        data-testid="bottom-cta-start"
                        className="inline-flex items-center gap-2 rounded-full bg-brand-teal text-white px-7 py-4 shadow-[0_8px_30px_rgb(31,108,125,0.25)] hover:bg-[#164E59] transition-all hover:scale-[1.02]"
                    >
                        <span className={cls}>{t.hero.cta}</span>
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
