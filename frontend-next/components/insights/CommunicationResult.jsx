'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { communicationInsightsApi } from '../../lib/communication-insights-api';
import { insightsCopy } from '../../data/communication-insights';

const storageKey = 'kalqlater.communication-insights.session';
function saved() { try { return JSON.parse(window.sessionStorage.getItem(storageKey) || 'null'); } catch { return null; } }

const resultCopy = {
  en: {
    privateResultMissing: 'This private result is not available in this browser session.',
    resultUnavailable: 'The result is not available right now. Please begin a new reflection.',
    unavailableTitle: 'Private result unavailable',
    retry: 'Retry',
    newReflection: 'Start a new reflection',
    loadingTitle: 'Looking for patterns across your responses…',
    loadingBody: 'Your reflection will appear as soon as it is ready.',
    resultTitle: 'Your communication patterns',
    evidenceTitle: 'Understand the evidence',
    evidenceBody: 'These signals come from your choices in a limited set of situations. Treat them as an invitation to reflect, not a fixed identity.',
    patternMap: 'Pattern map',
    band: { higher: 'More present', lower: 'Less present', balanced: 'Context-dependent', limited: 'Still emerging' },
    confidence: { 'clear-pattern': 'Clear pattern', 'emerging-pattern': 'Emerging pattern', 'mixed-evidence': 'Mixed evidence', 'limited-evidence': 'Limited evidence' },
    strengths: 'Useful strengths',
    blindSpots: 'Places to notice',
    misunderstandings: 'Misunderstandings that can happen',
    suggestions: 'Practical suggestions',
    weeklyExperiment: 'Weekly Experiment',
    weeklyPrompt: 'Time: one small real conversation. Reflection: what changed?',
    personalityProfile: 'Alongside your personality profile',
    saveTitle: 'Save this for later',
    saveBody: 'With an account, revisit this later, compare future retakes, and receive future tools. Your result remains available now; signing up is optional.',
    saveOptions: 'Explore save options',
  },
  hi: {
    privateResultMissing: 'यह निजी परिणाम इस ब्राउज़र सत्र में उपलब्ध नहीं है।',
    resultUnavailable: 'परिणाम अभी उपलब्ध नहीं है। नया आत्मचिंतन शुरू करें।',
    unavailableTitle: 'निजी परिणाम उपलब्ध नहीं है',
    retry: 'फिर कोशिश करें',
    newReflection: 'नया आत्मचिंतन',
    loadingTitle: 'आपके उत्तरों में पैटर्न देख रहे हैं…',
    loadingBody: 'परिणाम मिलते ही दिखाई देगा।',
    resultTitle: 'आपके संवाद पैटर्न',
    evidenceTitle: 'साक्ष्य को समझें',
    evidenceBody: 'ये संकेत सीमित स्थितियों में आपके उत्तरों से आते हैं। इन्हें स्थायी पहचान नहीं, विचार के निमंत्रण की तरह लें।',
    patternMap: 'पैटर्न मैप',
    band: { higher: 'अधिक स्पष्ट', lower: 'कम स्पष्ट', balanced: 'संदर्भ के अनुसार', limited: 'अभी उभरता हुआ' },
    confidence: { 'clear-pattern': 'स्पष्ट पैटर्न', 'emerging-pattern': 'उभरता पैटर्न', 'mixed-evidence': 'मिश्रित संकेत', 'limited-evidence': 'सीमित संकेत' },
    strengths: 'उपयोगी ताकतें',
    blindSpots: 'ध्यान देने योग्य जगहें',
    misunderstandings: 'गलतफहमी बन सकती है',
    suggestions: 'आजमाने योग्य कदम',
    weeklyExperiment: 'साप्ताहिक प्रयोग',
    weeklyPrompt: 'समय: एक छोटी वास्तविक बातचीत। विचार प्रश्न: क्या बदला?',
    personalityProfile: 'आपकी पर्सनैलिटी प्रोफाइल के साथ',
    saveTitle: 'इसे बाद के लिए सहेजें',
    saveBody: 'अकाउंट के साथ बाद में लौटें, भविष्य के रिटेक की तुलना करें और नए टूल पाएं। अभी आपका परिणाम यहीं उपलब्ध है; साइन अप वैकल्पिक है।',
    saveOptions: 'सहेजने के विकल्प देखें',
  },
  fr: {
    privateResultMissing: 'Ce résultat privé n’est pas disponible dans cette session de navigation.',
    resultUnavailable: 'Le résultat n’est pas disponible pour le moment. Veuillez commencer une nouvelle réflexion.',
    unavailableTitle: 'Résultat privé indisponible',
    retry: 'Réessayer',
    newReflection: 'Commencer une nouvelle réflexion',
    loadingTitle: 'Recherche de tendances dans vos réponses…',
    loadingBody: 'Votre bilan s’affichera dès qu’il sera prêt.',
    resultTitle: 'Vos habitudes de communication',
    evidenceTitle: 'Comprendre les éléments observés',
    evidenceBody: 'Ces indications proviennent de vos choix dans un nombre limité de situations. Considérez-les comme une invitation à réfléchir, et non comme une identité figée.',
    patternMap: 'Carte de vos habitudes',
    band: { higher: 'Plus présent', lower: 'Moins présent', balanced: 'Selon le contexte', limited: 'Encore en émergence' },
    confidence: { 'clear-pattern': 'Tendance nette', 'emerging-pattern': 'Tendance émergente', 'mixed-evidence': 'Indications contrastées', 'limited-evidence': 'Indications limitées' },
    strengths: 'Points forts utiles',
    blindSpots: 'Points à observer',
    misunderstandings: 'Malentendus possibles',
    suggestions: 'Suggestions pratiques',
    weeklyExperiment: 'Expérience de la semaine',
    weeklyPrompt: 'Durée : une courte conversation réelle. Réflexion : qu’est-ce qui a changé ?',
    personalityProfile: 'En complément de votre profil de personnalité',
    saveTitle: 'Conserver ce résultat pour plus tard',
    saveBody: 'Avec un compte, vous pourrez revenir sur ce résultat, le comparer à de futures évaluations et accéder à de nouveaux outils. Votre résultat reste disponible dès maintenant ; l’inscription est facultative.',
    saveOptions: 'Découvrir les options de sauvegarde',
  },
  ja: {
    privateResultMissing: 'この非公開の結果は、このブラウザーのセッションでは利用できません。',
    resultUnavailable: '現在、結果を表示できません。新しい振り返りを始めてください。',
    unavailableTitle: '非公開の結果を表示できません',
    retry: '再試行',
    newReflection: '新しい振り返りを始める',
    loadingTitle: '回答から傾向を確認しています…',
    loadingBody: '準備ができ次第、振り返りの結果を表示します。',
    resultTitle: 'あなたのコミュニケーションの傾向',
    evidenceTitle: '結果の手がかりを理解する',
    evidenceBody: 'これらの手がかりは、限られた場面での選択から得られたものです。固定した自分像ではなく、振り返りのきっかけとして受け取ってください。',
    patternMap: '傾向マップ',
    band: { higher: '強く表れている', lower: '控えめに表れている', balanced: '状況によって異なる', limited: 'まだ見え始めた段階' },
    confidence: { 'clear-pattern': '明確な傾向', 'emerging-pattern': '見え始めた傾向', 'mixed-evidence': '手がかりにばらつきあり', 'limited-evidence': '手がかりが限定的' },
    strengths: '活かせる強み',
    blindSpots: '意識したいポイント',
    misunderstandings: '起こりうる行き違い',
    suggestions: '実践のヒント',
    weeklyExperiment: '今週の実践',
    weeklyPrompt: '時間：短い実際の会話を一度。振り返り：何が変わりましたか？',
    personalityProfile: 'パーソナリティプロフィールとあわせて',
    saveTitle: 'あとで見返せるように保存',
    saveBody: 'アカウントがあれば、あとで結果を見返し、今後の振り返り結果と比較して、新しいツールも利用できます。現在の結果はこのまま確認でき、登録は任意です。',
    saveOptions: '保存方法を見る',
  },
};

const copyFor = (locale) => resultCopy[locale] || resultCopy.en;
const localizedResultText = (value, locale) => value?.[locale] || (['fr', 'ja'].includes(locale) ? '' : value?.en);

export function CommunicationResult({ locale, resultId }) {
  const copy = insightsCopy(locale); const ui = copyFor(locale); const [result, setResult] = useState(null); const [error, setError] = useState('');
  const load = useCallback(async () => { const session = saved(); if (!session?.accessToken || session?.resultId !== resultId || session?.locale !== locale) { setError(copyFor(locale).privateResultMissing); return; } try { const payload = await communicationInsightsApi.result(resultId, session.accessToken); setResult(payload.result); } catch { setError(copyFor(locale).resultUnavailable); } }, [locale, resultId]);
  useEffect(() => { const timer = window.setTimeout(() => { void load(); }, 0); return () => window.clearTimeout(timer); }, [load]);
  if (error) return <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6"><div className="rounded-[2rem] bg-brand-cream p-8 text-center sm:p-12"><h1 className="display-font text-3xl text-brand-ink">{ui.unavailableTitle}</h1><p className="mt-3 text-brand-subtle">{error}</p><div className="mt-7 flex flex-wrap justify-center gap-3"><button type="button" className="button-primary" onClick={() => { setError(''); void load(); }}>{ui.retry}</button><a className="button-secondary" href={`/${locale}/insights/communication/start`}>{ui.newReflection}</a></div></div></section>;
  if (!result) return <ResultNotice locale={locale} title={ui.loadingTitle} body={ui.loadingBody} loading />;
  const dimensions = Object.fromEntries(copy.dimensions.map(([id, name]) => [id, name]));
  return <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12"><header className="overflow-hidden rounded-[2rem] bg-brand-ink px-6 py-10 text-white sm:px-10"><p className="section-kicker text-brand-sand">KalQLater · {copy.title}</p><h1 className="display-font mt-3 max-w-3xl text-4xl sm:text-5xl">{ui.resultTitle}</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/80">{result.summary}</p></header><section className="mt-10 grid gap-6 lg:grid-cols-[.8fr_1.2fr]"><aside className="rounded-[2rem] bg-brand-sand/30 p-7"><h2 className="display-font text-3xl text-brand-ink">{ui.evidenceTitle}</h2><p className="mt-4 text-sm leading-relaxed text-brand-subtle">{ui.evidenceBody}</p></aside><div className="rounded-[2rem] border border-brand-line bg-white p-7"><h2 className="display-font text-3xl text-brand-ink">{ui.patternMap}</h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{result.dimension_results.map((item) => <div key={item.dimension_id} className="rounded-2xl bg-brand-cream p-4"><div className="flex items-start justify-between gap-3"><h3 className="font-semibold text-brand-ink">{dimensions[item.dimension_id] || item.dimension_id}</h3><span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-brand-teal">{ui.band[item.direction]}</span></div><p className="mt-3 text-sm leading-relaxed text-brand-subtle">{item.explanation}</p><p className="mt-3 text-xs text-brand-plum">{ui.confidence[item.confidence]}</p></div>)}</div></div></section><section className="mt-10 grid gap-6 lg:grid-cols-3"><InsightList title={ui.strengths} items={result.strengths} tone="teal" /><InsightList title={ui.blindSpots} items={result.blind_spots} tone="plum" /><InsightList title={ui.misunderstandings} items={result.misunderstandings} tone="sand" /></section><section className="mt-10 grid gap-6 lg:grid-cols-2"><InsightList title={ui.suggestions} items={result.practical_suggestions} tone="cream" /><aside className="rounded-[2rem] bg-brand-teal p-7 text-white"><p className="section-kicker text-brand-sand">{ui.weeklyExperiment}</p><h2 className="display-font mt-2 text-3xl">{localizedResultText(result.weekly_challenge?.title, locale)}</h2><p className="mt-4 leading-relaxed text-white/80">{localizedResultText(result.weekly_challenge?.instruction, locale)}</p><p className="mt-5 text-sm text-brand-sand">{ui.weeklyPrompt}</p></aside></section>{result.personality_note ? <section className="mt-10 rounded-[2rem] bg-brand-cream p-7"><h2 className="display-font text-3xl text-brand-ink">{ui.personalityProfile}</h2><p className="mt-3 text-brand-subtle">{result.personality_note}</p></section> : null}<section className="mt-10 rounded-[2rem] border border-brand-line bg-white p-7"><h2 className="display-font text-3xl text-brand-ink">{ui.saveTitle}</h2><p className="mt-3 max-w-2xl text-brand-subtle">{ui.saveBody}</p><Link href="/signup" className="button-secondary mt-5">{ui.saveOptions}</Link></section><p className="mt-8 text-center text-xs leading-relaxed text-brand-subtle">{result.disclaimer}</p></article>;
}

function InsightList({ title, items, tone }) { const tones = { teal: 'bg-brand-teal/10', plum: 'bg-brand-plum/10', sand: 'bg-brand-sand/30', cream: 'bg-brand-cream' }; return <section className={`rounded-[2rem] p-6 ${tones[tone]}`}><h2 className="display-font text-2xl text-brand-ink">{title}</h2><ul className="mt-5 space-y-3">{items.map((item) => <li key={item.id || item} className="rounded-xl bg-white/80 p-3 text-sm leading-relaxed text-brand-subtle">{item.text || item}</li>)}</ul></section>; }
function ResultNotice({ locale, title, body, loading = false }) { const copy = copyFor(locale); return <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6"><div className="rounded-[2rem] bg-brand-cream p-8 text-center sm:p-12">{loading ? <div aria-hidden="true" className="mx-auto h-12 w-12 rounded-full border-4 border-brand-teal/20 border-t-brand-teal" /> : null}<h1 className="display-font mt-5 text-3xl text-brand-ink">{title}</h1><p className="mt-3 text-brand-subtle">{body}</p>{!loading ? <a className="button-primary mt-7" href={`/${locale}/insights/communication/start`}>{copy.newReflection}</a> : null}</div></section>; }
