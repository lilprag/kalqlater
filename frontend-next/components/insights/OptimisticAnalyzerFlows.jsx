'use client';

import { communicationInsightsApi } from '../../lib/communication-insights-api';
import { conflictInsightsApi } from '../../lib/conflict-insights-api';
import { leadershipInsightsApi } from '../../lib/leadership-insights-api';
import { learningInsightsApi } from '../../lib/learning-insights-api';
import { OptimisticAssessmentFlow } from './OptimisticAssessmentFlow';

const storage = { communication: 'kalqlater.communication-insights.session', conflict: 'kalqlater.conflict-insights.session', leadership: 'kalqlater.leadership-insights.session', learning: 'kalqlater.learning-insights.session' };
const read = (analyzer) => { try { return JSON.parse(window.sessionStorage.getItem(storage[analyzer]) || 'null'); } catch { return null; } };
const write = (analyzer, value) => window.sessionStorage.setItem(storage[analyzer], JSON.stringify(value));
const sessionReaders = Object.fromEntries(Object.keys(storage).map((analyzer) => [analyzer, () => read(analyzer)]));
const sessionWriters = Object.fromEntries(Object.keys(storage).map((analyzer) => [analyzer, (value) => write(analyzer, value)]));

const communicationCopy = {
  en: { loading: 'Understanding your communication patterns…', unavailable: 'This session is not available', retry: 'Retry', persistence: 'Your response could not be saved safely. Check your connection and retry before continuing.', usual: 'What would you usually do?', choose: 'Choose your response', back: 'Back', next: 'Continue', completing: 'Preparing your communication result…', progress: 'Reflection progress', startAgain: 'Start again' },
  hi: { loading: 'आपके पैटर्न समझ रहे हैं…', unavailable: 'सत्र उपलब्ध नहीं है', retry: 'फिर कोशिश करें', persistence: 'आपका उत्तर सुरक्षित रूप से सहेजा नहीं जा सका। कनेक्शन जाँचें और आगे बढ़ने से पहले फिर कोशिश करें।', usual: 'आप सामान्यतः क्या करते/करती हैं?', choose: 'अपनी प्रतिक्रिया चुनें', back: 'वापस', next: 'जारी रखें', completing: 'आपका परिणाम तैयार हो रहा है…', progress: 'आत्मचिंतन की प्रगति', startAgain: 'शुरू करें' },
  fr: { loading: 'Analyse de vos habitudes de communication…', unavailable: 'Cette session n’est pas disponible', retry: 'Réessayer', persistence: 'Votre réponse n’a pas pu être enregistrée de manière fiable. Vérifiez votre connexion et réessayez avant de continuer.', usual: 'Que feriez-vous habituellement ?', choose: 'Choisissez votre réponse', back: 'Retour', next: 'Continuer', completing: 'Préparation de votre résultat…', progress: 'Progression de la réflexion', startAgain: 'Recommencer' },
  ja: { loading: 'コミュニケーションの傾向を確認しています…', unavailable: 'このセッションは利用できません', retry: '再試行', persistence: '回答を安全に保存できませんでした。接続を確認し、続ける前にもう一度お試しください。', usual: '普段のあなたなら、どうしますか？', choose: '回答を選んでください', back: '戻る', next: '次へ', completing: '結果を準備しています…', progress: '振り返りの進捗', startAgain: 'もう一度始める' },
};
const bilingual = (locale, en, hi) => locale === 'hi' ? hi : en;
const standardCopy = (locale, subject) => ({ loading: bilingual(locale, `Loading your ${subject} reflection…`, 'आपका आत्मचिंतन लोड हो रहा है…'), unavailable: bilingual(locale, 'This session is unavailable.', 'यह सत्र उपलब्ध नहीं है।'), retry: bilingual(locale, 'Retry', 'फिर कोशिश करें'), persistence: bilingual(locale, 'Your response could not be saved safely. Check your connection and retry before continuing.', 'आपका उत्तर सुरक्षित रूप से सहेजा नहीं जा सका। कनेक्शन जाँचें और आगे बढ़ने से पहले फिर कोशिश करें।'), usual: bilingual(locale, 'What would you usually do?', 'आप सामान्यतः क्या करते/करती हैं?'), choose: bilingual(locale, 'Choose your response', 'अपनी प्रतिक्रिया चुनें'), back: bilingual(locale, 'Back', 'वापस'), next: bilingual(locale, 'Continue', 'जारी रखें'), completing: bilingual(locale, 'Preparing your result…', 'आपका परिणाम तैयार हो रहा है…'), progress: bilingual(locale, 'Reflection progress', 'आत्मचिंतन की प्रगति'), startAgain: bilingual(locale, 'Start again', 'फिर शुरू करें') });

const communicationApi = { session: communicationInsightsApi.session, scenario: communicationInsightsApi.scenario, submit: communicationInsightsApi.submit, update: communicationInsightsApi.update, complete: communicationInsightsApi.complete };
const conflictApi = { session: conflictInsightsApi.session, scenario: conflictInsightsApi.scenario, submit: conflictInsightsApi.submit, update: conflictInsightsApi.update, complete: conflictInsightsApi.complete };
const leadershipApi = { session: leadershipInsightsApi.session, scenario: (sessionId, token, scenarioId) => leadershipInsightsApi.scenario(sessionId, scenarioId, token), submit: leadershipInsightsApi.submit, update: leadershipInsightsApi.update, complete: leadershipInsightsApi.complete };
const learningApi = { session: learningInsightsApi.session, scenario: (sessionId, token, scenarioId) => learningInsightsApi.scenario(sessionId, scenarioId, token), submit: learningInsightsApi.submit, update: learningInsightsApi.update, complete: learningInsightsApi.complete };

function Flow(props) { const { analyzer } = props; return <OptimisticAssessmentFlow {...props} readSession={sessionReaders[analyzer]} writeSession={sessionWriters[analyzer]} />; }
export function OptimisticCommunicationFlow({ locale, sessionId }) { return <Flow analyzer="communication" routeSegment="communication" locale={locale} sessionId={sessionId} api={communicationApi} copy={communicationCopy[locale] || communicationCopy.en} />; }
export function OptimisticConflictFlow({ locale, sessionId }) { return <Flow analyzer="conflict" routeSegment="conflict" locale={locale} sessionId={sessionId} api={conflictApi} copy={standardCopy(locale, 'conflict')} />; }
export function OptimisticLeadershipFlow({ locale, sessionId }) { return <Flow analyzer="leadership" routeSegment="leadership" locale={locale} sessionId={sessionId} api={leadershipApi} copy={standardCopy(locale, 'leadership')} />; }
export function OptimisticLearningFlow({ locale, sessionId }) { return <Flow analyzer="learning" routeSegment="learning" locale={locale} sessionId={sessionId} api={learningApi} copy={standardCopy(locale, 'learning')} />; }
