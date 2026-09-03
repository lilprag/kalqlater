import assert from 'node:assert/strict';

import { CHARACTER_GUIDES, CONCEPT_GUIDES, TRAFFIC_SPRINT_PATHS, TRAFFIC_SPRINT_URLS } from '../data/traffic-sprint.js';

const typeOrder = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
const canonicalPairSlugs = typeOrder.flatMap((first, index) => typeOrder.slice(index + 1).map((second) => `${first.toLowerCase()}-vs-${second.toLowerCase()}`));

const expectedPaths = [
  '/en/compare', '/en/personality/intj', '/en/personality/enfj', '/en/personality/esfp', '/en/personality/istj',
  '/en/guides/sensing-vs-intuition', '/en/guides/thinking-vs-feeling', '/en/guides/mbti-letters-meaning',
  '/en/personality/intp/characters', '/en/personality/intj/characters', '/en/personality/enfj/characters', '/en/personality/istp/characters',
  '/en/personality/enfp/careers', '/en/personality/enfj/careers',
];
const newPaths = TRAFFIC_SPRINT_URLS.filter(({ kind }) => kind === 'new').map(({ path }) => `/en/${path}`);
const normalize = (value) => String(value).toLowerCase().replace(/\b(?:intj|intp|enfj|istp|enfp|esfp|istj)\b/g, 'type').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const shingles = (value, width = 8) => { const words = normalize(value).split(' '); return new Set(words.slice(0, Math.max(0, words.length - width + 1)).map((_, index) => words.slice(index, index + width).join(' '))); };
const similarity = (left, right) => { const a = shingles(left); const b = shingles(right); const intersection = [...a].filter((item) => b.has(item)).length; return intersection / Math.max(1, new Set([...a, ...b]).size); };

assert.deepEqual(TRAFFIC_SPRINT_PATHS, expectedPaths, 'Sprint must retain the approved 14 canonical URL scope and order');
assert.equal(new Set(TRAFFIC_SPRINT_PATHS).size, 14, 'Sprint URLs must be unique');
assert.equal(Object.keys(CONCEPT_GUIDES).length, 3, 'Expected three concept guides');
assert.equal(Object.keys(CHARACTER_GUIDES).length, 4, 'Expected four character guides');
assert.equal(canonicalPairSlugs.length, 120, 'Compare canonical pair inventory changed');

const sourceVolume = TRAFFIC_SPRINT_URLS.reduce((total, item) => total + item.volume, 0);
const sortedKd = TRAFFIC_SPRINT_URLS.map(({ kd }) => kd).sort((a, b) => a - b);
const medianKd = (sortedKd[6] + sortedKd[7]) / 2;
assert.equal(sourceVolume, 205610, 'Sprint source-volume total changed');
assert(Math.abs(medianKd - 23.55) < 0.001, 'Sprint median KD changed');

for (const [slug, guide] of Object.entries(CONCEPT_GUIDES)) {
  assert(guide.title && guide.description && guide.heading && guide.quick, `${slug}: core editorial fields missing`);
  assert.equal(guide.sections.length, 4, `${slug}: expected four intent sections`);
  assert.equal(guide.faqs.length, 4, `${slug}: expected four visible/schema FAQs`);
  assert(!/\b\d{1,3}\s*%/.test(JSON.stringify(guide)), `${slug}: fabricated percentage found`);
}
const faqAnswers = Object.values(CONCEPT_GUIDES).flatMap((guide) => guide.faqs.map(([, answer]) => normalize(answer)));
assert.equal(new Set(faqAnswers).size, faqAnswers.length, 'Concept FAQ answers must not repeat');

const conceptBodies = Object.entries(CONCEPT_GUIDES).map(([slug, guide]) => [slug, [guide.intro, guide.quick, guide.myth, ...guide.sections.map(([, body]) => body)].join(' ')]);
for (let index = 0; index < conceptBodies.length; index += 1) for (let next = index + 1; next < conceptBodies.length; next += 1) {
  assert(similarity(conceptBodies[index][1], conceptBodies[next][1]) < 0.12, `${conceptBodies[index][0]} and ${conceptBodies[next][0]} are suspiciously duplicative`);
}

const characterBodies = [];
const normalizedCharacterTitles = [];
for (const [type, guide] of Object.entries(CHARACTER_GUIDES)) {
  assert.equal(guide.characters.length, 5, `${type}: expected five evidenced examples`);
  assert.equal(new Set(guide.characters.map(([name]) => name)).size, 5, `${type}: character names must be unique`);
  assert.equal(guide.faqs.length, 3, `${type}: expected three visible/schema FAQs`);
  assert(/interpret|reading/i.test(guide.intro) || /interpret|reading/i.test(guide.quick), `${type}: interpretive framing missing`);
  assert(!/officially typed|confirmed as/i.test(JSON.stringify(guide.characters)), `${type}: unsupported canon claim found`);
  characterBodies.push([type, [guide.intro, guide.quick, guide.misunderstanding, ...guide.characters.flatMap(([, , evidence, limit]) => [evidence, limit])].join(' ')]);
  normalizedCharacterTitles.push(normalize(guide.title));
}
assert.equal(new Set(normalizedCharacterTitles).size, normalizedCharacterTitles.length, 'Character titles must not be type-name substitution templates');
for (let index = 0; index < characterBodies.length; index += 1) for (let next = index + 1; next < characterBodies.length; next += 1) {
  assert(similarity(characterBodies[index][1], characterBodies[next][1]) < 0.12, `${characterBodies[index][0]} and ${characterBodies[next][0]} character guides are suspiciously duplicative`);
}

const baseUrl = process.env.TRAFFIC_SPRINT_BASE_URL?.replace(/\/$/, '');
if (baseUrl) {
  const pages = new Map();
  for (const path of expectedPaths) {
    const response = await fetch(`${baseUrl}${path}`);
    const html = await response.text();
    assert.equal(response.status, 200, `${path}: expected HTTP 200`);
    assert(html.includes(`<link rel="canonical" href="https://kalqlater.com${path}"`), `${path}: self canonical missing`);
    assert(/<h1\b[^>]*>/.test(html), `${path}: H1 missing`);
    assert(!html.includes('noindex'), `${path}: indexable page contains noindex`);
    for (const json of [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => match[1])) JSON.parse(json);
    pages.set(path, html);
  }
  for (const path of newPaths) {
    const html = pages.get(path);
    assert(html.includes('FAQPage') && html.includes('BreadcrumbList'), `${path}: FAQ or breadcrumb schema missing`);
    for (const locale of ['hi', 'fr', 'ja']) {
      const response = await fetch(`${baseUrl}${path.replace('/en/', `/${locale}/`)}`);
      assert.equal(response.status, 404, `${path}: must not fall back to English under ${locale}`);
    }
  }

  const hub = pages.get('/en/compare');
  const hrefs = [...hub.matchAll(/href="\/en\/compare\/([a-z]{4}-vs-[a-z]{4})"/g)].map((match) => match[1]);
  const uniqueHrefs = new Set(hrefs);
  const canonicalPairs = new Set(canonicalPairSlugs);
  assert.equal(uniqueHrefs.size, 120, 'Compare hub must expose 120 unique pairs');
  for (const slug of uniqueHrefs) assert(canonicalPairs.has(slug), `${slug}: reverse or invalid Compare URL in hub`);
  assert(!/AggregateRating|Review/.test(hub), 'Compare hub must not emit rating schema');
  assert(!/\b\d{1,3}\s*%/.test(stripMarkup(hub)), 'Compare hub must not show a compatibility percentage');
  const reverse = await fetch(`${baseUrl}/en/compare/enfp-vs-intj`, { redirect: 'manual' });
  assert([307, 308].includes(reverse.status) && reverse.headers.get('location') === '/en/compare/intj-vs-enfp', 'Reverse Compare redirect changed');

  for (const path of newPaths) assert(hub.includes(`href="${path}"`) || pages.get('/en/personality/intj')?.includes(`href="${path}"`) || pages.get('/en/personality/enfj')?.includes(`href="${path}"`), `${path}: orphaned from sprint navigation`);
  const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
  for (const path of newPaths) assert(sitemap.includes(`<loc>https://kalqlater.com${path}</loc>`), `${path}: missing from sitemap`);
  for (const path of newPaths) for (const locale of ['hi', 'fr', 'ja']) assert(!sitemap.includes(path.replace('/en/', `/${locale}/`)), `${path}: unsupported locale leaked into sitemap`);
  assert(!sitemap.includes('<lastmod>'), 'Sitemap must not fabricate lastmod');
}

console.log(JSON.stringify({ sprintUrls: 14, newPages: newPaths.length, existingUpgrades: 7, sourceVolume, medianKd, canonicalPairs: 120 }));
console.log(`Traffic Sprint 1 quality gate: PASS${baseUrl ? ' (static + runtime)' : ' (static)'}`);

function stripMarkup(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
}
