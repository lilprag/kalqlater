import assert from 'node:assert/strict';
import { testComparison } from '../lib/test-comparisons.js';

const typeOrder = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
const canonicalPairs = typeOrder.flatMap((first, index) => typeOrder.slice(index + 1).map((second) => `${first.toLowerCase()}-vs-${second.toLowerCase()}`));

const tests = [
  ['INTP', 'ENTP', 'intp-vs-entp'],
  ['ENTJ', 'ENTP', 'entj-vs-entp'],
  ['INFJ', 'ENFJ', 'infj-vs-enfj'],
  ['ENTP', 'ISTP', 'entp-vs-istp'],
  ['ISTJ', 'ISFJ', 'istj-vs-isfj'],
];
const titles = new Set();
const descriptions = new Set();
for (const [first, second, slug] of tests) {
  assert(canonicalPairs.includes(slug), `${slug}: Test B path is not canonical`);
  const page = testComparison(first, second);
  assert(page, `${slug}: missing Test B content`);
  assert.equal(page.comparison.length, 8, `${slug}: at-a-glance comparison must cover eight dimensions`);
  assert.equal(page.sections.length, 11, `${slug}: missing rich intent sections`);
  assert(page.faq.length >= 4 && page.faq.length <= 7, `${slug}: FAQ count outside experiment contract`);
  assert(page.title.includes(first) && page.title.includes(second), `${slug}: title must name both types`);
  assert(page.description.includes(first) && page.description.includes(second), `${slug}: description must name both types`);
  assert(!/\b\d{1,3}%\b/.test(JSON.stringify(page)), `${slug}: fabricated percentage detected`);
  titles.add(page.title); descriptions.add(page.description);
}
assert.equal(titles.size, tests.length, 'Test B titles must be unique');
assert.equal(descriptions.size, tests.length, 'Test B descriptions must be unique');

const baseUrl = process.env.COMPARE_BASE_URL?.replace(/\/$/, '');
if (baseUrl) {
  const hub = await (await fetch(`${baseUrl}/en/compare`)).text();
  const hrefs = [...hub.matchAll(/href="\/en\/compare\/([a-z]{4}-vs-[a-z]{4})"/g)].map((match) => match[1]);
  const unique = new Set(hrefs);
  const canonical = new Set(canonicalPairs);
  assert.equal(unique.size, 120, 'hub must expose all 120 unique canonical pair links');
  for (const slug of unique) assert(canonical.has(slug), `${slug}: hub contains reverse or invalid pair URL`);
  for (const slug of canonical) assert(unique.has(slug), `${slug}: orphaned from Compare hub`);
  assert(hub.indexOf('Frequently searched personality comparisons') < hub.indexOf('Compare any two types'), 'selector must be secondary to crawlable navigation');
  for (const [first, second, slug] of tests) {
    const response = await fetch(`${baseUrl}/en/compare/${slug}`);
    const html = await response.text();
    assert.equal(response.status, 200, `${slug}: expected HTTP 200`);
    assert(html.includes('Quick answer') && html.includes('At a glance'), `${slug}: rich experiment structure not rendered`);
    assert(html.includes('FAQPage') && html.includes('BreadcrumbList'), `${slug}: schema contract missing`);
    assert(html.includes(`<link rel="canonical" href="https://kalqlater.com/en/compare/${slug}"`), `${slug}: self canonical missing`);
    assert(html.includes('hrefLang="en"') && html.includes('hrefLang="x-default"'), `${slug}: hreflang contract missing`);
    assert(html.includes(`/en/personality/${first.toLowerCase()}`) && html.includes(`/en/personality/${second.toLowerCase()}`), `${slug}: both personality links required`);
    assert(html.includes(`More ${first}`) && html.includes(`More ${second}`), `${slug}: both related comparison groups required`);
    assert(html.includes('/en/compare'), `${slug}: Compare hub link missing`);
  }
  for (const [reverse, canonicalSlug] of [['entp-vs-intp', 'intp-vs-entp'], ['entp-vs-entj', 'entj-vs-entp'], ['enfj-vs-infj', 'infj-vs-enfj'], ['istp-vs-entp', 'entp-vs-istp'], ['isfj-vs-istj', 'istj-vs-isfj']]) {
    const response = await fetch(`${baseUrl}/en/compare/${reverse}`, { redirect: 'manual' });
    assert([307, 308].includes(response.status), `${reverse}: reverse pair must redirect`);
    assert.equal(response.headers.get('location'), `/en/compare/${canonicalSlug}`, `${reverse}: reverse pair must redirect directly to canonical owner`);
  }
  const home = await (await fetch(`${baseUrl}/en`)).text();
  assert(home.includes('href="/en/compare"'), 'homepage must retain a direct Compare link');
}
console.log('Compare SEO experiment: PASS');
