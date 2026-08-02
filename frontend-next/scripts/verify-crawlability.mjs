const baseUrl = (process.env.CRAWL_BASE_URL || 'http://127.0.0.1:3100').replace(/\/$/, '');
const pages = [
  ['/en', 'en', 'Meet the person you already are'], ['/hi', 'hi', 'अपने भीतर के व्यक्तित्व से मिलें'],
  ['/en/privacy', 'en', 'Privacy'], ['/en/terms', 'en', 'Terms of Use'], ['/en/contact', 'en', 'Contact us'],
  ['/en/personality/intj', 'en', 'INTJ'], ['/hi/personality/intj', 'hi', 'INTJ'], ['/en/personality/enfp', 'en', 'ENFP'], ['/hi/personality/enfp', 'hi', 'ENFP'],
  ['/en/personality/intj/careers', 'en', 'INTJ Career Guide'], ['/hi/personality/intj/careers', 'hi', 'INTJ करियर गाइड'],
  ['/en/compare/intj-vs-enfp', 'en', 'INTJ'], ['/hi/compare/intj-vs-enfp', 'hi', 'INTJ'],
];

function assert(condition, message) { if (!condition) throw new Error(message); }

for (const [path, locale, visibleText] of pages) {
  const response = await fetch(`${baseUrl}${path}`);
  const html = await response.text();
  assert(response.ok, `${path}: expected HTTP 200, received ${response.status}`);
  assert(new RegExp(`<html[^>]+lang="${locale}"`).test(html), `${path}: missing locale html lang`);
  assert(/<title>[^<]+<\/title>/.test(html), `${path}: missing title`);
  assert(/<meta[^>]+name="description"[^>]+content="[^"]+"/.test(html), `${path}: missing description`);
  assert(/<link[^>]+rel="canonical"[^>]+href="[^"]+"/.test(html), `${path}: missing canonical`);
  assert(/hreflang="(en|hi|x-default)"/i.test(html), `${path}: missing hreflang`);
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
for (const [locale, text] of [['en', 'Software engineer'], ['hi', 'सॉफ्टवेयर इंजीनियर']]) {
  const response = await fetch(`${baseUrl}/${locale}/personality/intj/careers`);
  const html = await response.text();
  assert(html.includes(text), `${locale} INTJ career guide: missing featured career content`);
  assert(html.includes('<table'), `${locale} INTJ career guide: missing comparison table`);
  assert(html.includes('FAQPage'), `${locale} INTJ career guide: missing FAQ JSON-LD`);
  assert(!/\b\d{1,3}%\b/.test(html), `${locale} INTJ career guide: unexpected numerical score claim`);
  assert(html.includes(`https://kalqlater.com/${locale}/personality/intj/careers`), `${locale} INTJ career guide: missing self canonical`);
}
const sitemap = await fetch(`${baseUrl}/sitemap.xml`);
const sitemapXml = await sitemap.text();
assert(sitemapXml.includes('/en/personality/intj/careers') && sitemapXml.includes('/hi/personality/intj/careers'), 'sitemap: missing INTJ career prototypes');
const intj = await fetch(`${baseUrl}/en/personality/intj`);
assert((await intj.text()).includes('/en/personality/intj/careers'), 'INTJ profile: missing career guide link');
const selector = await fetch(`${baseUrl}/compare`);
const selectorHtml = await selector.text();
assert(selector.ok && selectorHtml.includes('Explore a personality dynamic'), '/compare: expected the interactive selector');

const missing = await fetch(`${baseUrl}/en/this-route-does-not-exist`);
assert(missing.status === 404, `404 route: expected HTTP 404, received ${missing.status}`);
for (const path of ['/en/personality/not-a-type', '/en/personality/intp/careers', '/en/compare/intj-vs-intj']) { const response = await fetch(`${baseUrl}${path}`); assert(response.status === 404, `${path}: expected HTTP 404, received ${response.status}`); }
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
