import { notFound } from 'next/navigation';
import { JsonLd } from '../../../components/JsonLd';
import { PersonalityAssessment } from '../../../components/PersonalityAssessment';
import { breadcrumbJsonLd, pageMetadata } from '../../../lib/metadata';
import { isLocale } from '../../../lib/site';

const SEO = {
  en: ['Personality Test | KalQLater', 'A 60-question personality reflection designed to help you notice everyday preferences.'],
  hi: ['पर्सनैलिटी टेस्ट | KalQLater', 'रोज़मर्रा की पसंदों को समझने के लिए 60 प्रश्नों वाला आत्मचिंतन पर्सनैलिटी टेस्ट।'],
  fr: ['Test de personnalité | KalQLater', 'Un test de personnalité en 60 questions pour mieux observer vos préférences au quotidien.'],
  ja: ['パーソナリティテスト | KalQLater', '日々の傾向を見つめるための、60問のパーソナリティ振り返りテスト。'],
};
export async function generateMetadata({ params }) { const { locale } = await params; if (!isLocale(locale)) return {}; const [title, description] = SEO[locale]; return pageMetadata({ locale, path: 'test', title, description, noIndex: true }); }
export default async function TestPage({ params }) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <><JsonLd data={breadcrumbJsonLd(locale, [{ name: 'KalQLater' }, { name: SEO[locale][0], path: 'test' }])} /><PersonalityAssessment locale={locale} /></>; }
