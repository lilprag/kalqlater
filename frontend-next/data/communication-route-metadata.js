const metadata = {
  en: {
    title: 'Communication Insights',
    sessionDescription: 'Private reflection session.',
    resultDescription: 'Private communication reflection.',
  },
  hi: {
    title: 'Communication Insights',
    sessionDescription: 'Private reflection session.',
    resultDescription: 'Private communication reflection.',
  },
  fr: {
    title: 'Perspectives de communication',
    sessionDescription: 'Session de réflexion privée.',
    resultDescription: 'Bilan privé sur votre manière de communiquer.',
  },
  ja: {
    title: 'コミュニケーション・インサイト',
    sessionDescription: '非公開の振り返りセッションです。',
    resultDescription: 'コミュニケーションについての非公開の振り返り結果です。',
  },
};

export function communicationRouteMetadata(locale) {
  return metadata[locale] || metadata.en;
}
