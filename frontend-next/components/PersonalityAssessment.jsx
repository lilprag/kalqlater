'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { assessmentQuestions, ASSESSMENT_STORAGE_KEY, computePersonalityResult } from '../lib/personality-assessment';

const COPY = {
  en: { eyebrow: 'Personality reflection', title: 'Notice the preferences that shape your everyday choices.', intro: 'There are no right answers. Choose the response that feels most like you today.', question: 'Question', of: 'of', back: 'Back', next: 'Next', finish: 'See my reflection', scale: ['Strongly disagree', 'Disagree', 'Neither', 'Agree', 'Strongly agree'], result: 'Your reflection points to', resultBody: 'This is a starting point for reflection, not a diagnosis or a measure of ability.', explore: 'Explore your guide', restart: 'Start again', saved: 'Continue where you left off?', resume: 'Your earlier responses are stored only in this browser.', continue: 'Continue', startOver: 'Start over' },
  hi: { eyebrow: 'व्यक्तित्व पर विचार', title: 'अपनी रोज़मर्रा की पसंदों को आकार देने वाले पैटर्न को पहचानें।', intro: 'यहाँ सही या गलत उत्तर नहीं हैं। आज जो आपके सबसे करीब लगे, वही चुनें।', question: 'प्रश्न', of: 'में से', back: 'पीछे', next: 'आगे', finish: 'अपना परिणाम देखें', scale: ['पूरी तरह असहमत', 'असहमत', 'न तो सहमत न असहमत', 'सहमत', 'पूरी तरह सहमत'], result: 'आपके उत्तर इस प्रकार की ओर संकेत करते हैं', resultBody: 'यह आत्मचिंतन की शुरुआत है, न निदान और न क्षमता का माप।', explore: 'अपनी गाइड देखें', restart: 'फिर से शुरू करें', saved: 'जहाँ छोड़ा था, वहीं से जारी रखें?', resume: 'आपके पहले के उत्तर केवल इसी ब्राउज़र में सुरक्षित हैं।', continue: 'जारी रखें', startOver: 'फिर से शुरू करें' },
  fr: { eyebrow: 'Réflexion sur la personnalité', title: 'Repérez les préférences qui influencent vos choix au quotidien.', intro: 'Il n’y a pas de bonne ou de mauvaise réponse. Choisissez celle qui vous ressemble le plus aujourd’hui.', question: 'Question', of: 'sur', back: 'Retour', next: 'Suivant', finish: 'Voir ma réflexion', scale: ['Pas du tout d’accord', 'Pas d’accord', 'Ni d’accord ni en désaccord', 'D’accord', 'Tout à fait d’accord'], result: 'Vos réponses évoquent le profil', resultBody: 'C’est un point de départ pour réfléchir, et non un diagnostic ni une mesure de vos capacités.', explore: 'Explorer ce guide', restart: 'Recommencer', saved: 'Reprendre là où vous vous étiez arrêté ?', resume: 'Vos réponses précédentes sont enregistrées uniquement dans ce navigateur.', continue: 'Continuer', startOver: 'Recommencer' },
  ja: { eyebrow: 'パーソナリティを振り返る', title: '日々の選択に表れる、自分らしい傾向を見つめてみましょう。', intro: '正解・不正解はありません。今の自分にもっとも近い答えを選んでください。', question: '質問', of: '問中', back: '戻る', next: '次へ', finish: '結果を見る', scale: ['まったく当てはまらない', 'あまり当てはまらない', 'どちらともいえない', 'やや当てはまる', 'とても当てはまる'], result: '回答から見えてくる傾向', resultBody: 'これは自己理解のための出発点であり、診断や能力の測定ではありません。', explore: 'タイプガイドを見る', restart: 'もう一度はじめる', saved: '前回の続きから始めますか？', resume: 'これまでの回答は、このブラウザー内にのみ保存されています。', continue: '続ける', startOver: '最初から始める' },
};

export function PersonalityAssessment({ locale }) {
  const copy = COPY[locale];
  const [answers, setAnswers] = useState(() => Array(assessmentQuestions.length).fill(null));
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [resume, setResume] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(ASSESSMENT_STORAGE_KEY) || 'null');
      if (Array.isArray(saved?.answers) && saved.answers.some((answer) => answer != null)) {
        const timer = window.setTimeout(() => setResume(saved), 0);
        return () => window.clearTimeout(timer);
      }
    } catch { /* Browser storage is optional. */ }
  }, []);
  useEffect(() => {
    if (!result) window.localStorage.setItem(ASSESSMENT_STORAGE_KEY, JSON.stringify({ answers, index }));
  }, [answers, index, result]);

  const progress = useMemo(() => Math.round(((index + (answers[index] != null ? 1 : 0)) / assessmentQuestions.length) * 100), [answers, index]);
  const answer = (value) => { const next = [...answers]; next[index] = value; setAnswers(next); };
  const complete = () => { const nextResult = computePersonalityResult(answers); window.localStorage.removeItem(ASSESSMENT_STORAGE_KEY); setResult(nextResult); };
  const restart = () => { window.localStorage.removeItem(ASSESSMENT_STORAGE_KEY); setAnswers(Array(assessmentQuestions.length).fill(null)); setIndex(0); setResult(null); };

  if (resume) return <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6"><section className="rounded-[2rem] border border-brand-line bg-white p-8 text-center shadow-sm"><p className="section-kicker">KalQLater</p><h1 className="display-font mt-3 text-4xl text-brand-ink">{copy.saved}</h1><p className="mx-auto mt-4 max-w-lg text-brand-subtle">{copy.resume}</p><div className="mt-8 flex flex-wrap justify-center gap-3"><button className="button-primary" onClick={() => { setAnswers(resume.answers); setIndex(resume.index || 0); setResume(false); }}>{copy.continue}</button><button className="button-secondary" onClick={() => { window.localStorage.removeItem(ASSESSMENT_STORAGE_KEY); setResume(false); }}>{copy.startOver}</button></div></section></main>;
  if (result) return <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16"><section className="rounded-[2rem] bg-brand-ink p-8 text-white shadow-[0_24px_70px_rgba(45,40,37,.2)] sm:p-12"><p className="section-kicker text-brand-sand">KalQLater</p><p className="mt-7 text-white/75">{copy.result}</p><h1 className="display-font mt-2 text-6xl text-brand-sand sm:text-8xl">{result.code}</h1><p className="mt-6 max-w-2xl leading-relaxed text-white/80">{copy.resultBody}</p><div className="mt-8 flex flex-wrap gap-3"><Link className="button-light" href={`/${locale}/personality/${result.code.toLowerCase()}`}>{copy.explore}</Link><button className="button-dark-outline" onClick={restart}>{copy.restart}</button></div></section><section className="mt-8 grid gap-3 sm:grid-cols-4">{Object.entries(result.percentages).filter(([letter]) => ['E','S','T','J'].includes(letter)).map(([letter, value]) => <article key={letter} className="rounded-2xl border border-brand-line bg-white p-5"><p className="text-xs font-bold tracking-wide text-brand-teal">{letter}</p><p className="display-font mt-2 text-3xl text-brand-ink">{value}%</p></article>)}</section></main>;
  const current = assessmentQuestions[index];
  return <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14"><header className="mb-9"><p className="section-kicker">{copy.eyebrow}</p><h1 className="display-font mt-3 text-4xl text-brand-ink sm:text-5xl">{copy.title}</h1><p className="mt-4 max-w-2xl text-brand-subtle">{copy.intro}</p></header><div className="mb-8"><div className="mb-2 flex justify-between text-sm text-brand-subtle"><span>{copy.question} {index + 1} {copy.of} {assessmentQuestions.length}</span><span>{progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-brand-cream"><div className="h-full rounded-full bg-brand-teal transition-all" style={{ width: `${progress}%` }} /></div></div><section className="rounded-[2rem] border border-brand-line bg-white p-6 shadow-sm sm:p-10"><p className="text-xs font-bold tracking-[.18em] text-brand-teal">{String(index + 1).padStart(2, '0')}</p><h2 className="display-font mt-4 text-2xl leading-snug text-brand-ink sm:text-3xl">{current.text[locale]}</h2><div className="mt-9 grid gap-3 sm:grid-cols-5">{copy.scale.map((label, value) => <button key={label} onClick={() => answer(value + 1)} className={`min-h-20 rounded-2xl border p-3 text-sm transition-colors ${answers[index] === value + 1 ? 'border-brand-teal bg-brand-teal text-white' : 'border-brand-line bg-white text-brand-ink hover:bg-brand-cream'}`}><span className="block text-lg">{value + 1}</span><span className="mt-1 block leading-tight">{label}</span></button>)}</div></section><div className="mt-8 flex justify-between gap-3"><button className="button-secondary" disabled={index === 0} onClick={() => setIndex(index - 1)}>{copy.back}</button>{index < assessmentQuestions.length - 1 ? <button className="button-primary" disabled={answers[index] == null} onClick={() => setIndex(index + 1)}>{copy.next}</button> : <button className="button-primary" disabled={answers.some((value) => value == null)} onClick={complete}>{copy.finish}</button>}</div></main>;
}
