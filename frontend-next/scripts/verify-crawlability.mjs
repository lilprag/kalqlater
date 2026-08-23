const baseUrl = (process.env.CRAWL_BASE_URL || 'http://127.0.0.1:3100').replace(/\/$/, '');
import { localeConfig, publishedLocales } from '../lib/locales.js';
const careerTypes = ['intj', 'intp', 'entj', 'entp', 'infj', 'infp', 'enfj', 'enfp', 'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp'];
const pages = [
  ['/en', 'en', 'Meet the person you already are'], ['/hi', 'hi', 'अपने भीतर के व्यक्तित्व से मिलें'],
  ['/en/privacy', 'en', 'Privacy'], ['/en/terms', 'en', 'Terms of Use'], ['/en/contact', 'en', 'Contact us'],
  ['/en/personality/intj', 'en', 'INTJ'], ['/hi/personality/intj', 'hi', 'INTJ'], ['/en/personality/enfp', 'en', 'ENFP'], ['/hi/personality/enfp', 'hi', 'ENFP'],
  ['/en/personality/intj/careers', 'en', 'Best Careers for INTJ'], ['/hi/personality/intj/careers', 'hi', 'INTJ के लिए करियर दिशाएँ'],
  ['/en/compare/intj-vs-enfp', 'en', 'INTJ'], ['/hi/compare/intj-vs-enfp', 'hi', 'INTJ'],
  ['/en/compare', 'en', 'Explore a personality dynamic'], ['/hi/compare', 'hi', 'दो व्यक्तित्वों के डायनामिक को देखें'],
  ['/en/insights', 'en', 'Go beyond personality'], ['/hi/insights', 'hi', 'पर्सनैलिटी से आगे'],
  ['/en/insights/communication', 'en', 'Understand How You Communicate'], ['/hi/insights/communication', 'hi', 'जानें कि आप कैसे संवाद करते हैं'],
  ['/en/insights/conflict', 'en', 'Notice how you meet tension'], ['/hi/insights/conflict', 'hi', 'मतभेद में अपने तरीके पर विचार करें'],
  ['/en/insights/learning', 'en', 'Reflect on how you learn'], ['/hi/insights/learning', 'hi', 'सीखने के अपने तरीके पर विचार करें।'],
  ['/en/insights/leadership', 'en', 'See leadership in practice'], ['/hi/insights/leadership', 'hi', 'नेतृत्व को व्यवहार में देखें।'],
  ['/en/community', 'en', 'KalQLater Community'], ['/hi/community', 'hi', 'KalQLater कम्युनिटी'],
];

function assert(condition, message) { if (!condition) throw new Error(message); }

for (const [path, locale, visibleText] of pages) {
  const response = await fetch(`${baseUrl}${path}`);
  const html = await response.text();
  assert(response.ok, `${path}: expected HTTP 200, received ${response.status}`);
  assert(new RegExp(`<html[^>]+lang="${locale}"`).test(html), `${path}: missing locale html lang`);
  assert(new RegExp(`<html[^>]+dir="${localeConfig(locale).dir}"`).test(html), `${path}: missing locale html direction`);
  assert(/<title>[^<]+<\/title>/.test(html), `${path}: missing title`);
  assert(/<meta[^>]+name="description"[^>]+content="[^"]+"/.test(html), `${path}: missing description`);
  assert(/<link[^>]+rel="canonical"[^>]+href="[^"]+"/.test(html), `${path}: missing canonical`);
  const expectedCanonical = `https://kalqlater.com${path}`;
  assert(html.includes(`rel="canonical" href="${expectedCanonical}"`), `${path}: expected self-referencing localized canonical`);
  for (const hreflang of [...publishedLocales.map((availableLocale) => localeConfig(availableLocale).hreflang), 'x-default']) {
    const matches = html.match(new RegExp(`hreflang="${hreflang}"`, 'gi')) || [];
    assert(matches.length === 1, `${path}: expected one ${hreflang} hreflang, found ${matches.length}`);
  }
  assert(html.includes(`property="og:url" content="${expectedCanonical}"`), `${path}: localized og:url must match canonical`);
  assert(/<meta[^>]+property="og:title"[^>]+content="[^"]+"/.test(html), `${path}: missing localized og:title`);
  assert(/<meta[^>]+name="twitter:title"[^>]+content="[^"]+"/.test(html), `${path}: missing localized twitter:title`);
  assert(/<h1[^>]*>/.test(html), `${path}: missing h1`);
  assert(html.includes(visibleText), `${path}: missing visible server-rendered content`);
  assert(/<a [^>]+href=/.test(html), `${path}: missing links`);
  assert(!html.includes('You need to enable JavaScript to run this app'), `${path}: CRA shell text found`);
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((match) => match[1]);
  for (const json of jsonLd) JSON.parse(json);
}

for (const path of ['/google41232c0c0c01eadd.html', '/robots.txt', '/sitemap.xml']) {
  const response = await fetch(`${baseUrl}${path}`);
  assert(response.ok, `${path}: expected HTTP 200, received ${response.status}`);
}
const careerTitles = new Set();
const careerDescriptions = new Set();
for (const locale of ['en', 'hi']) for (const type of careerTypes) {
  const response = await fetch(`${baseUrl}/${locale}/personality/${type}/careers`);
  const html = await response.text();
  assert(response.ok, `${locale}/${type} career guide: expected HTTP 200, received ${response.status}`);
  assert(html.includes(type.toUpperCase()), `${locale}/${type} career guide: missing type content`);
  assert(html.includes('<table'), `${locale}/${type} career guide: missing comparison table`);
  assert(html.includes('FAQPage'), `${locale}/${type} career guide: missing FAQ JSON-LD`);
  assert((html.match(/<details/g) || []).length >= 8, `${locale}/${type} career guide: fewer than eight visible FAQs`);
  assert(!/\b\d{1,3}%\b/.test(html), `${locale}/${type} career guide: unexpected numerical score claim`);
  assert(html.includes(`https://kalqlater.com/${locale}/personality/${type}/careers`), `${locale}/${type} career guide: missing self canonical`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/)?.[1];
  assert(title && description, `${locale}/${type} career guide: missing unique metadata`);
  careerTitles.add(title);
  careerDescriptions.add(description);
}
assert(careerTitles.size === 32, 'career guides: titles must be unique across all locales');
assert(careerDescriptions.size === 32, 'career guides: descriptions must be unique across all locales');
const sitemap = await fetch(`${baseUrl}/sitemap.xml`);
const sitemapXml = await sitemap.text();
for (const [locale, authoredText] of [['fr', 'Mieux vous comprendre, pour avancer avec plus de clarté'], ['ja', '自分らしさを知り、これからの選択を少し軽やかに']]) {
  const response = await fetch(`${baseUrl}/${locale}`);
  const html = await response.text();
  assert(response.ok, `/${locale}: expected HTTP 200, received ${response.status}`);
  assert(new RegExp(`<html[^>]+lang="${locale}"`).test(html), `/${locale}: missing locale html lang`);
  assert(/<html[^>]+dir="ltr"/.test(html), `/${locale}: missing ltr direction`);
  assert(html.includes(authoredText), `/${locale}: missing authored SSR content`);
  assert(!html.includes('noindex'), `/${locale}: public locale must be indexable`);
  assert(new RegExp(`hreflang="${locale}"`, 'i').test(html), `/${locale}: must join the public hreflang cluster`);
  assert(html.includes('application/ld+json'), `/${locale}: missing localized JSON-LD`);
}
assert(!sitemapXml.includes('<loc>https://kalqlater.com</loc>'), 'sitemap: root homepage must not be indexed separately');
for (const locale of publishedLocales) assert(sitemapXml.includes(`https://kalqlater.com/${locale}</loc>`), `sitemap: missing /${locale} homepage`);
for (const locale of publishedLocales) assert(sitemapXml.includes(`https://kalqlater.com/${locale}/types</loc>`), `sitemap: missing /${locale}/types hub`);
assert(!sitemapXml.includes('<lastmod>'), 'sitemap: must omit untrustworthy generated lastmod values');
for (const locale of ['es', 'ar', 'pt-br', 'zh-hans']) assert(!sitemapXml.includes(`https://kalqlater.com/${locale}`), `sitemap: unpublished locale ${locale} must not be included`);
for (const locale of publishedLocales) for (const type of careerTypes) assert(sitemapXml.includes(`/${locale}/personality/${type}/careers`), `sitemap: missing ${locale}/${type} career guide`);
for (const locale of publishedLocales) {
  assert(sitemapXml.includes(`/${locale}/insights`), `sitemap: missing ${locale} Insights hub`);
  assert(sitemapXml.includes(`/${locale}/compare</loc>`), `sitemap: missing ${locale} Compare selector`);
  assert(sitemapXml.includes(`/${locale}/insights/communication`), `sitemap: missing ${locale} Communication Insights landing`);
  assert(sitemapXml.includes(`/${locale}/insights/conflict`), `sitemap: missing ${locale} Conflict Insights landing`);
  assert(sitemapXml.includes(`/${locale}/insights/leadership`), `sitemap: missing ${locale} Leadership Insights landing`);
  assert(sitemapXml.includes(`/${locale}/insights/learning`), `sitemap: missing ${locale} Learning Insights landing`);
  assert(sitemapXml.includes(`/${locale}/community`), `sitemap: missing ${locale} Community landing`);
}
assert(sitemapXml.includes('/en/jobs</loc>'), 'sitemap: missing English Jobs landing');
for (const locale of ['hi', 'fr', 'ja']) assert(!sitemapXml.includes(`/${locale}/jobs</loc>`), `sitemap: incomplete ${locale} Jobs landing must be excluded`);
for (const locale of ['en', 'hi']) {
  const jobs = await fetch(`${baseUrl}/${locale}/jobs`);
  const jobsHtml = await jobs.text();
  if (jobs.ok) {
    assert(jobsHtml.includes('KalQLater Jobs') || jobsHtml.includes('KalQLater जॉब्स'), `${locale} Jobs: missing visible directory`);
    if (locale === 'en') assert(!jobsHtml.includes('noindex'), 'English Jobs directory must remain indexable');
    else assert(jobsHtml.includes('noindex'), 'Incomplete Hindi Jobs directory must be noindex');
  } else {
    assert(jobs.status >= 500, `${locale} Jobs: upstream failure must produce a temporary 5xx`);
    assert(!jobsHtml.includes('No fresh roles match these filters yet.'), `${locale} Jobs: upstream failure must not masquerade as empty inventory`);
  }
}
for (const locale of ['en', 'hi']) {
  const hub = await fetch(`${baseUrl}/${locale}/insights`);
  const hubHtml = await hub.text();
  assert(hub.ok && hubHtml.includes(`/${locale}/insights/communication`), `${locale} Insights hub: missing Communication Insights link`);
  assert(hubHtml.includes(`/${locale}/insights/conflict`), `${locale} Insights hub: missing Conflict Insights link`);
  assert(hubHtml.includes(`/${locale}/insights/leadership`), `${locale} Insights hub: missing Leadership Insights link`);
  assert(hubHtml.includes(`/${locale}/insights/learning`), `${locale} Insights hub: missing Learning Insights link`);
  assert(hubHtml.includes('BreadcrumbList'), `${locale} Insights hub: missing breadcrumb JSON-LD`);
}
for (const legacyPath of ['/community', '/community/jobs']) {
  assert(!sitemapXml.includes(`<loc>https://kalqlater.com${legacyPath}</loc>`), `sitemap: legacy application route must not be indexed: ${legacyPath}`);
}
for (const locale of ['en', 'hi']) {
  const workbench = await fetch(`${baseUrl}/${locale}/editorial/localization`);
  const workbenchHtml = await workbench.text();
  assert(workbench.ok, `${locale} editorial workbench: expected private route to resolve`);
  assert(workbenchHtml.includes('noindex'), `${locale} editorial workbench: expected noindex`);
  assert(!sitemapXml.includes(`/${locale}/editorial/localization`), `${locale} editorial workbench: private route must be excluded from sitemap`);
}
for (const locale of ['en', 'hi']) {
  const landing = await fetch(`${baseUrl}/${locale}/insights/communication`);
  const html = await landing.text();
  assert(html.includes('FAQPage') && html.includes('BreadcrumbList'), `${locale} Communication Insights: missing visible JSON-LD`);
  assert((html.match(/dimension-card/g) || []).length === 0 || html.includes('Ten dimensions') || html.includes('दस आयाम'), `${locale} Communication Insights: missing dimensions section`);
  const start = await fetch(`${baseUrl}/${locale}/insights/communication/start`);
  assert(start.headers.get('x-robots-tag')?.includes('noindex') || (await start.text()).includes('noindex'), `${locale} Communication Insights start: expected noindex`);
  const conflict = await fetch(`${baseUrl}/${locale}/insights/conflict`);
  const conflictHtml = await conflict.text();
  assert(conflict.ok && conflictHtml.includes('FAQPage') && conflictHtml.includes('BreadcrumbList'), `${locale} Conflict Insights: missing SSR JSON-LD`);
  const conflictStart = await fetch(`${baseUrl}/${locale}/insights/conflict/start`);
  assert(conflictStart.headers.get('x-robots-tag')?.includes('noindex') || (await conflictStart.text()).includes('noindex'), `${locale} Conflict Insights start: expected noindex`);
  const leadership = await fetch(`${baseUrl}/${locale}/insights/leadership`);
  const leadershipHtml = await leadership.text();
  assert(leadership.ok && leadershipHtml.includes('FAQPage') && leadershipHtml.includes('BreadcrumbList'), `${locale} Leadership Insights: missing SSR JSON-LD`);
  const leadershipStart = await fetch(`${baseUrl}/${locale}/insights/leadership/start`);
  assert(leadershipStart.headers.get('x-robots-tag')?.includes('noindex') || (await leadershipStart.text()).includes('noindex'), `${locale} Leadership Insights start: expected noindex`);
  const learning = await fetch(`${baseUrl}/${locale}/insights/learning`); const learningHtml = await learning.text();
  assert(learning.ok && learningHtml.includes('FAQPage') && learningHtml.includes('BreadcrumbList'), `${locale} Learning Insights: missing SSR JSON-LD`);
  const learningStart = await fetch(`${baseUrl}/${locale}/insights/learning/start`);
  assert(learningStart.headers.get('x-robots-tag')?.includes('noindex') || (await learningStart.text()).includes('noindex'), `${locale} Learning Insights start: expected noindex`);
}
for (const locale of ['en', 'hi']) for (const type of careerTypes) {
  const profile = await fetch(`${baseUrl}/${locale}/personality/${type}`);
  const profileHtml = await profile.text();
  assert(profileHtml.includes(`/${locale}/personality/${type}/careers`), `${locale}/${type} profile: missing career guide link`);
  assert(profileHtml.includes(`/${locale}/insights/communication`), `${locale}/${type} profile: missing Communication Insights CTA`);
  const career = await fetch(`${baseUrl}/${locale}/personality/${type}/careers`);
  assert((await career.text()).includes(`/${locale}/insights/communication`), `${locale}/${type} career guide: missing Communication Insights CTA`);
}
const selector = await fetch(`${baseUrl}/compare`, { redirect: 'manual' });
assert(selector.status === 308 && selector.headers.get('location') === '/en/compare', '/compare: expected permanent redirect to the English localized selector');

const root = await fetch(`${baseUrl}/?utm_source=google&utm_campaign=seo-sprint`, { redirect: 'manual' });
assert(root.status === 308, `root: expected permanent 308, received ${root.status}`);
assert(root.headers.get('location') === '/en?utm_source=google&utm_campaign=seo-sprint', `root: expected query-preserving /en redirect, received ${root.headers.get('location')}`);

const missing = await fetch(`${baseUrl}/en/this-route-does-not-exist`);
assert(missing.status === 404, `404 route: expected HTTP 404, received ${missing.status}`);
for (const path of ['/en/personality/not-a-type', '/en/personality/not-a-type/careers', '/en/compare/intj-vs-intj']) { const response = await fetch(`${baseUrl}${path}`); assert(response.status === 404, `${path}: expected HTTP 404, received ${response.status}`); }
const reversed = await fetch(`${baseUrl}/en/compare/enfp-vs-intj`, { redirect: 'manual' });
assert([307, 308].includes(reversed.status) && /intj-vs-enfp/.test(reversed.headers.get('location') || ''), 'reversed pair: expected canonical redirect');
const legacyPair = await fetch(`${baseUrl}/compare/enfp-vs-intj`, { redirect: 'manual' });
assert(legacyPair.status === 308 && legacyPair.headers.get('location') === '/en/compare/intj-vs-enfp', 'legacy pair: expected localized canonical redirect');
const legacyQuery = await fetch(`${baseUrl}/compare?type1=INTJ&type2=ENFP&lang=hi`, { redirect: 'manual' });
assert(legacyQuery.status === 308 && legacyQuery.headers.get('location') === '/hi/compare/intj-vs-enfp', 'legacy query: expected localized canonical redirect');
const legacyTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
for (const type of legacyTypes) {
  const variants = [type, type.toLowerCase(), `${type.slice(0, 1)}${type.slice(1, 2).toLowerCase()}${type.slice(2, 3)}${type.slice(3).toLowerCase()}`];
  for (const variant of variants) {
    const response = await fetch(`${baseUrl}/types/${variant}`, { redirect: 'manual' });
    assert(response.status === 308 && response.headers.get('location') === `/en/personality/${type.toLowerCase()}`, `legacy type ${variant}: expected localized canonical redirect`);
  }
}
for (const parameter of ['lang', 'locale']) {
  const response = await fetch(`${baseUrl}/types/ENFP?${parameter}=hi`, { redirect: 'manual' });
  assert(response.status === 308 && response.headers.get('location') === '/hi/personality/enfp', `legacy Hindi ${parameter}: expected localized canonical redirect`);
}
for (const path of ['/types/UNKNOWN', '/types/ABC', '/types/INTJ123']) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: 'manual' });
  assert(response.status === 404 && response.headers.get('x-robots-tag') === 'noindex', `${path}: expected noindex 404`);
}
for (const path of ['/compare/intj-vs-intj', '/compare?type1=INTJ&type2=INTJ']) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: 'manual' });
  assert(response.status === 404, `${path}: expected legacy invalid pair to return 404`);
}
console.log(`Crawlability checks passed for ${pages.length} public pages and static metadata routes.`);
