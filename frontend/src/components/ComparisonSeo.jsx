import { useEffect } from 'react';

const SITE_URL = 'https://kalqlater.com';

function setMeta(selector, attribute, key, value) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', value);
}

export default function ComparisonSeo({ first, second, firstName, secondName, insight, lang }) {
  useEffect(() => {
    const url = `${SITE_URL}/compare/${first.toLowerCase()}-vs-${second.toLowerCase()}`;
    const title = `${first} vs ${second}: Relationship Intelligence | KalQLater`;
    const description = lang === 'hi'
      ? `${firstName} और ${secondName} साथ कैसे काम करते हैं, संवाद करते हैं और बढ़ते हैं—KalQLater का व्यावहारिक रिलेशनशिप इंटेलिजेंस गाइड।`
      : `Explore how ${firstName} (${first}) and ${secondName} (${second}) communicate, make decisions, navigate pressure, and grow together with KalQLater.`;
    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:url"]', 'name', 'twitter:url', url);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Compare personalities', item: `${SITE_URL}/compare/${first.toLowerCase()}-vs-${second.toLowerCase()}` },
            { '@type': 'ListItem', position: 3, name: `${first} vs ${second}` },
          ],
        },
        {
          '@type': 'WebPage',
          name: title,
          description,
          url,
          isPartOf: { '@type': 'WebSite', name: 'KalQLater', url: SITE_URL },
          inLanguage: lang === 'hi' ? 'hi-IN' : 'en-IN',
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: `What attracts ${first} and ${second}?`, acceptedAnswer: { '@type': 'Answer', text: insight.attraction } },
            { '@type': 'Question', name: `What commonly creates friction between ${first} and ${second}?`, acceptedAnswer: { '@type': 'Answer', text: insight.conflict } },
            { '@type': 'Question', name: `How can ${first} and ${second} work better together?`, acceptedAnswer: { '@type': 'Answer', text: insight.advice } },
          ],
        },
      ],
    };
    let structuredData = document.getElementById('comparison-structured-data');
    if (!structuredData) {
      structuredData = document.createElement('script');
      structuredData.id = 'comparison-structured-data';
      structuredData.type = 'application/ld+json';
      document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify(schema);
  }, [first, second, firstName, secondName, insight, lang]);

  return null;
}
