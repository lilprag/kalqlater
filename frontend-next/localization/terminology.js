import { localeRegistry } from '../lib/locales.js';

export const terminologyConcepts = Object.freeze(['personality', 'insight', 'growth', 'reflection', 'leadership', 'communication', 'learning', 'career', 'community', 'relationship', 'strength', 'challenge']);

const approved = (values) => Object.freeze({ status: 'approved', values: Object.freeze(values) });
const pending = Object.freeze({ status: 'draft', values: Object.freeze({}) });

/** Translation memory only reuses editor-approved terms; never generated prose. */
export const terminologyByLocale = Object.freeze(Object.fromEntries(localeRegistry.map((locale) => [locale.code,
  locale.code === 'en' ? approved({ personality: 'personality', insight: 'insight', growth: 'growth', reflection: 'reflection', leadership: 'leadership', communication: 'communication', learning: 'learning', career: 'career', community: 'community', relationship: 'relationship', strength: 'strength', challenge: 'weekly experiment' })
    : locale.code === 'hi' ? approved({ personality: 'व्यक्तित्व', insight: 'इनसाइट्स', growth: 'विकास', reflection: 'आत्मचिंतन', leadership: 'नेतृत्व', communication: 'संवाद', learning: 'सीखना', career: 'करियर', community: 'कम्युनिटी', relationship: 'रिश्ता', strength: 'ताकत', challenge: 'साप्ताहिक प्रयोग' })
      : locale.code === 'es' ? approved({ personality: 'personalidad', insight: 'perspectiva', growth: 'desarrollo', reflection: 'autorreflexión', leadership: 'liderazgo', communication: 'comunicación', learning: 'aprendizaje', career: 'trayectoria profesional', community: 'comunidad', relationship: 'relación', strength: 'fortaleza', challenge: 'experimento semanal' })
      : pending,
])));
