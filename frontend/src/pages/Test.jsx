import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import axios from 'axios';
import { useLang } from '../context/LangContext';
import { QUESTIONS } from '../data/questions';
import { computeResult, LS_KEY } from '../utils/scoring';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Test() {
    const { lang, t } = useLang();
    const hi = lang === 'hi';
    const cls = hi ? 'font-body-hi' : '';
    const clsH = hi ? 'font-display-hi' : 'font-display';
    const navigate = useNavigate();

    const [answers, setAnswers] = useState(() => Array(QUESTIONS.length).fill(null));
    const [index, setIndex] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [showResume, setShowResume] = useState(false);
    const [direction, setDirection] = useState(1);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (raw) {
                const saved = JSON.parse(raw);
                if (Array.isArray(saved.answers) && saved.answers.some((a) => a != null)) {
                    setShowResume({ answers: saved.answers, index: saved.index ?? 0 });
                }
            }
        } catch (e) { /* ignore */ }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(LS_KEY, JSON.stringify({ answers, index }));
        } catch (e) { /* ignore */ }
    }, [answers, index]);

    const q = QUESTIONS[index];
    const progress = useMemo(() => Math.round(((index) / QUESTIONS.length) * 100), [index]);
    const allAnswered = answers.every((a) => a != null);

    const selectAnswer = (val) => {
        const next = [...answers];
        next[index] = val;
        setAnswers(next);
        if (index < QUESTIONS.length - 1) {
            setTimeout(() => {
                setDirection(1);
                setIndex(index + 1);
            }, 220);
        }
    };

    const goBack = () => {
        if (index > 0) {
            setDirection(-1);
            setIndex(index - 1);
        }
    };

    const goNext = () => {
        if (index < QUESTIONS.length - 1 && answers[index] != null) {
            setDirection(1);
            setIndex(index + 1);
        }
    };

    const submit = async () => {
        setSubmitting(true);
        const result = computeResult(answers);
        try {
            const res = await axios.post(`${API}/submissions`, {
                type_code: result.code,
                percentages: result.percentages,
                answers,
                language: lang,
            });
            localStorage.removeItem(LS_KEY);
            navigate(`/result/${res.data.id}`, { state: { local: result } });
        } catch (e) {
            // Fallback: still show result without server persistence
            localStorage.removeItem(LS_KEY);
            navigate('/result/local', { state: { local: result } });
        }
    };

    if (showResume) {
        return (
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="rounded-3xl bg-white border border-brand-line p-8 text-center">
                    <div className={`text-2xl text-brand-ink ${clsH}`}>{t.test.saved}</div>
                    <p className={`mt-3 text-brand-subtle ${cls}`}>{t.test.resume}</p>
                    <div className="mt-6 flex gap-3 justify-center">
                        <button
                            data-testid="resume-yes"
                            onClick={() => {
                                setAnswers(showResume.answers);
                                setIndex(showResume.index);
                                setShowResume(false);
                            }}
                            className={`rounded-full bg-brand-teal text-white px-6 py-3 hover:bg-[#164E59] ${cls}`}
                        >
                            {t.test.resumeYes}
                        </button>
                        <button
                            data-testid="resume-no"
                            onClick={() => {
                                localStorage.removeItem(LS_KEY);
                                setAnswers(Array(QUESTIONS.length).fill(null));
                                setIndex(0);
                                setShowResume(false);
                            }}
                            className={`rounded-full bg-white border border-brand-line px-6 py-3 hover:bg-brand-cream ${cls}`}
                        >
                            {t.test.resumeNo}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (submitting) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-32 text-center">
                <div className="w-16 h-16 mx-auto rounded-full border-4 border-brand-cream border-t-brand-teal animate-spin" />
                <div className={`mt-6 text-brand-subtle ${cls}`} data-testid="calculating">{t.test.calculating}</div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            {/* Progress */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2 text-sm">
                    <div className={`text-brand-subtle ${cls}`} data-testid="progress-text">
                        {t.test.questionOf} <span className="text-brand-ink font-semibold">{index + 1}</span> {t.test.of} {QUESTIONS.length}
                    </div>
                    <div className={`text-brand-subtle ${cls}`}>{progress}%</div>
                </div>
                <div className="h-2 rounded-full bg-brand-cream overflow-hidden">
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-plum"
                        animate={{ width: `${((index + (answers[index] != null ? 1 : 0)) / QUESTIONS.length) * 100}%` }}
                        transition={{ duration: 0.4 }}
                        data-testid="progress-bar"
                    />
                </div>
            </div>

            {/* Question card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: direction === 1 ? 40 : -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction === 1 ? -40 : 40 }}
                    transition={{ duration: 0.28 }}
                    className="rounded-3xl bg-white border border-brand-line p-6 sm:p-10 shadow-[0_10px_40px_rgb(46,40,37,0.05)]"
                >
                    <div className={`text-xs tracking-[0.25em] uppercase text-brand-subtle ${cls}`}>
                        {t.test.questionOf} {index + 1}/{QUESTIONS.length}
                    </div>
                    <h2 className={`mt-4 text-2xl sm:text-3xl leading-snug text-brand-ink ${clsH}`} data-testid="question-text">
                        {hi ? q.hi : q.en}
                    </h2>

                    {/* Likert */}
                    <div className="mt-10 grid grid-cols-5 gap-2 sm:gap-4">
                        {[1, 2, 3, 4, 5].map((v) => {
                            const selected = answers[index] === v;
                            const size = v === 3 ? 'w-11 h-11 sm:w-12 sm:h-12' : v === 1 || v === 5 ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-12 h-12 sm:w-14 sm:h-14';
                            const color = v <= 2 ? '#1F6C7D' : v >= 4 ? '#E87A5D' : '#DAB49D';
                            return (
                                <button
                                    key={v}
                                    data-testid={`likert-${v}`}
                                    onClick={() => selectAnswer(v)}
                                    className="likert-btn flex flex-col items-center gap-2 focus:outline-none"
                                >
                                    <span
                                        className={`${size} rounded-full flex items-center justify-center border-2`}
                                        style={{
                                            borderColor: selected ? color : '#E8E2D9',
                                            background: selected ? color : 'white',
                                            boxShadow: selected ? `0 6px 20px ${color}55` : 'none',
                                        }}
                                    >
                                        {selected && <Check size={20} className="text-white" />}
                                    </span>
                                    <span className={`text-[10px] sm:text-xs text-center text-brand-subtle leading-tight max-w-[6rem] ${cls}`}>
                                        {t.test.likert[v - 1]}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Nav */}
            <div className="mt-8 flex items-center justify-between">
                <button
                    data-testid="btn-back"
                    onClick={goBack}
                    disabled={index === 0}
                    className={`inline-flex items-center gap-2 rounded-full border border-brand-line bg-white px-5 py-3 text-brand-ink hover:bg-brand-cream disabled:opacity-40 disabled:cursor-not-allowed ${cls}`}
                >
                    <ArrowLeft size={16} /> {t.test.back}
                </button>

                {index < QUESTIONS.length - 1 ? (
                    <button
                        data-testid="btn-next"
                        onClick={goNext}
                        disabled={answers[index] == null}
                        className={`inline-flex items-center gap-2 rounded-full bg-brand-teal text-white px-6 py-3 hover:bg-[#164E59] disabled:opacity-40 disabled:cursor-not-allowed ${cls}`}
                    >
                        {t.test.next} <ArrowRight size={16} />
                    </button>
                ) : (
                    <button
                        data-testid="btn-finish"
                        onClick={submit}
                        disabled={!allAnswered}
                        className={`inline-flex items-center gap-2 rounded-full bg-brand-saffron text-white px-6 py-3 hover:brightness-95 disabled:opacity-40 disabled:cursor-not-allowed ${cls}`}
                    >
                        {t.test.finish} <ArrowRight size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}
