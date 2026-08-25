import assert from 'node:assert/strict';
import { priorityComparison } from '../lib/priority-comparisons.js';

const pairs = [
  ['INFJ', 'ISFJ'], ['ENFJ', 'ISFJ'], ['ENTP', 'ESFP'], ['ENTP', 'INFJ'], ['INFP', 'ISFP'],
];
const titles = new Set();
const descriptions = new Set();
for (const [first, second] of pairs) {
  const page = priorityComparison(first, second);
  assert(page, `${first}/${second}: missing authored priority content`);
  assert(page.title.includes(`${first} vs ${second}`), `${first}/${second}: title does not name canonical pair`);
  assert(page.description.includes(first) && page.description.includes(second), `${first}/${second}: meta description does not name both types`);
  assert(page.sections.length >= 7, `${first}/${second}: insufficient intent coverage`);
  assert(page.faq.length >= 4, `${first}/${second}: insufficient visible FAQ content`);
  assert(!/\b\d{1,3}%\b/.test(JSON.stringify(page)), `${first}/${second}: fabricated compatibility percentage`);
  titles.add(page.title); descriptions.add(page.description);
}
assert.equal(titles.size, pairs.length, 'priority titles must be unique');
assert.equal(descriptions.size, pairs.length, 'priority descriptions must be unique');

const lead = priorityComparison('INFJ', 'ISFJ');
const leadText = JSON.stringify(lead).toLowerCase();
for (const intent of ['quick answer', 'differences', 'similarities', 'communication', 'emotional needs', 'conflict', 'friendship', 'romance', 'family', 'work', 'decisions', 'friction']) {
  assert(leadText.includes(intent), `INFJ/ISFJ: missing ${intent} intent`);
}
assert(leadText.includes('advocate') && leadText.includes('defender'), 'INFJ/ISFJ: missing Advocate/Defender search-language context');

const baseUrl = process.env.COMPARE_BASE_URL?.replace(/\/$/, '');
if (baseUrl) {
  const canonicalSlugs = ['infj-vs-isfj', 'enfj-vs-isfj', 'entp-vs-esfp', 'entp-vs-infj', 'infp-vs-isfp'];
  for (const slug of canonicalSlugs) {
    const response = await fetch(`${baseUrl}/en/compare/${slug}`);
    const html = await response.text();
    const [first, , second] = slug.toUpperCase().split('-');
    assert.equal(response.status, 200, `${slug}: canonical page must return 200`);
    assert(html.includes(`<link rel="canonical" href="https://kalqlater.com/en/compare/${slug}"`), `${slug}: missing English canonical`);
    assert(html.includes('hrefLang="en"') && html.includes('hrefLang="x-default"'), `${slug}: missing hreflang contract`);
    assert(html.includes('FAQPage') && html.includes('BreadcrumbList'), `${slug}: missing visible schema contract`);
    assert(html.includes(`/en/personality/${first.toLowerCase()}`) && html.includes(`/en/personality/${second.toLowerCase()}`), `${slug}: missing links to both personality pages`);
  }
  for (const [legacy, destination] of [['isfj-vs-infj', 'infj-vs-isfj'], ['isfj-vs-enfj', 'enfj-vs-isfj'], ['esfp-vs-entp', 'entp-vs-esfp'], ['infj-vs-entp', 'entp-vs-infj'], ['isfp-vs-infp', 'infp-vs-isfp']]) {
    const response = await fetch(`${baseUrl}/compare/${legacy}`, { redirect: 'manual' });
    assert.equal(response.status, 308, `${legacy}: legacy pair must redirect permanently`);
    assert.equal(response.headers.get('location'), `/en/compare/${destination}`, `${legacy}: legacy pair must redirect directly to canonical owner`);
  }
  const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
  assert(!sitemap.includes('<loc>https://kalqlater.com/compare/'), 'sitemap must not expose legacy Compare URLs');
  for (const slug of canonicalSlugs) assert(sitemap.includes(`<loc>https://kalqlater.com/en/compare/${slug}</loc>`), `${slug}: missing canonical sitemap URL`);
  for (const type of ['infj', 'isfj', 'enfj', 'entp', 'esfp', 'infp', 'isfp']) {
    const html = await (await fetch(`${baseUrl}/en/personality/${type}`)).text();
    assert(html.includes(`/en/compare/`), `${type}: personality page missing contextual Compare links`);
    assert(!html.includes('href="https://kalqlater.com/test"'), `${type}: legacy absolute test link remains`);
  }
}
console.log('Priority comparison SEO content: PASS');
