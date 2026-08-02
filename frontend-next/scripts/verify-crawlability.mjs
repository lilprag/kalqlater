const baseUrl = (process.env.CRAWL_BASE_URL || 'http://127.0.0.1:3100').replace(/\/$/, '');
const pages = [
  ['/en', 'en', 'Meet the person you already are'], ['/hi', 'hi', 'अपने भीतर के व्यक्तित्व से मिलें'],
  ['/en/privacy', 'en', 'Privacy'], ['/en/terms', 'en', 'Terms of Use'], ['/en/contact', 'en', 'Contact us'],
  ['/en/personality/intj', 'en', 'INTJ'], ['/hi/personality/intj', 'hi', 'INTJ'], ['/en/personality/enfp', 'en', 'ENFP'], ['/hi/personality/enfp', 'hi', 'ENFP'],
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
const selector = await fetch(`${baseUrl}/compare`);
const selectorHtml = await selector.text();
assert(selector.ok && selectorHtml.includes('Explore a personality dynamic'), '/compare: expected the interactive selector');

const missing = await fetch(`${baseUrl}/en/this-route-does-not-exist`);
assert(missing.status === 404, `404 route: expected HTTP 404, received ${missing.status}`);
for (const path of ['/en/personality/not-a-type', '/en/compare/intj-vs-intj']) { const response = await fetch(`${baseUrl}${path}`); assert(response.status === 404, `${path}: expected HTTP 404, received ${response.status}`); }
const reversed = await fetch(`${baseUrl}/en/compare/enfp-vs-intj`, { redirect: 'manual' });
assert([307, 308].includes(reversed.status) && /intj-vs-enfp/.test(reversed.headers.get('location') || ''), 'reversed pair: expected canonical redirect');
const legacyPair = await fetch(`${baseUrl}/compare/enfp-vs-intj`, { redirect: 'manual' });
assert(legacyPair.status === 308 && legacyPair.headers.get('location') === '/en/compare/intj-vs-enfp', 'legacy pair: expected localized canonical redirect');
const legacyQuery = await fetch(`${baseUrl}/compare?type1=INTJ&type2=ENFP&lang=hi`, { redirect: 'manual' });
assert(legacyQuery.status === 308 && legacyQuery.headers.get('location') === '/hi/compare/intj-vs-enfp', 'legacy query: expected localized canonical redirect');
for (const path of ['/compare/intj-vs-intj', '/compare?type1=INTJ&type2=INTJ']) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: 'manual' });
  assert(response.status === 404, `${path}: expected legacy invalid pair to return 404`);
}
console.log(`Crawlability checks passed for ${pages.length} public pages and static metadata routes.`);
