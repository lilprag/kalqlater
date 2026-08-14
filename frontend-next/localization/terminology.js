import { localeRegistry } from '../lib/locales.js';

export const terminologyConcepts = Object.freeze(['personality', 'insight', 'growth', 'reflection', 'leadership', 'communication', 'learning', 'career', 'community', 'relationship', 'strength', 'challenge']);

const approved = (values) => Object.freeze({ status: 'approved', values: Object.freeze(values) });
const pending = Object.freeze({ status: 'draft', values: Object.freeze({}) });

/** Translation memory only reuses editor-approved terms; never generated prose. */
export const terminologyByLocale = Object.freeze(Object.fromEntries(localeRegistry.map((locale) => [locale.code,
  locale.code === 'en' ? approved({ personality: 'personality', insight: 'insight', growth: 'growth', reflection: 'reflection', leadership: 'leadership', communication: 'communication', learning: 'learning', career: 'career', community: 'community', relationship: 'relationship', strength: 'strength', challenge: 'weekly experiment' })
    : locale.code === 'hi' ? approved({ personality: 'व्यक्तित्व', insight: 'इनसाइट्स', growth: 'विकास', reflection: 'आत्मचिंतन', leadership: 'नेतृत्व', communication: 'संवाद', learning: 'सीखना', career: 'करियर', community: 'कम्युनिटी', relationship: 'रिश्ता', strength: 'ताकत', challenge: 'साप्ताहिक प्रयोग' })
      : locale.code === 'es' ? approved({ personality: 'personalidad', insight: 'perspectiva', growth: 'desarrollo', reflection: 'autorreflexión', leadership: 'liderazgo', communication: 'comunicación', learning: 'aprendizaje', career: 'trayectoria profesional', community: 'comunidad', relationship: 'relación', strength: 'fortaleza', challenge: 'experimento semanal' })
      : locale.code === 'fr' ? approved({ personality: 'personnalité', insight: 'perspective', growth: 'développement', reflection: 'réflexion personnelle', leadership: 'leadership', communication: 'communication', learning: 'apprentissage', career: 'parcours professionnel', community: 'communauté', relationship: 'relation', strength: 'point fort', challenge: 'expérience de la semaine' })
      : locale.code === 'ja' ? approved({ personality: 'パーソナリティ', insight: '気づき', growth: '成長', reflection: '振り返り', leadership: 'リーダーシップ', communication: 'コミュニケーション', learning: '学び', career: 'キャリア', community: 'コミュニティ', relationship: '関係性', strength: '強み', challenge: '今週の実験' })
      : pending,
])));
