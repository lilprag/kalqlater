const baseUrl = (process.env.CRAWL_BASE_URL || 'http://127.0.0.1:3100').replace(/\/$/, '');
const types = ['intj', 'intp', 'entj', 'entp', 'infj', 'infp', 'enfj', 'enfp', 'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp'];
const normalize = (value) => String(value || '').toLowerCase().replace(/<[^>]*>/g, ' ').replace(/[\p{P}\p{S}\s]+/gu, ' ').trim();
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const unique = (items) => new Set(items.map(normalize)).size === items.length;
const rawText = (html) => html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const legacyRelationshipPhrases = [
  'Architects want deep, intellectual relationships. They warm up slowly, but once bonded remain loyal for life.',
  'वास्तुकार गहरे, बौद्धिक रिश्ते चाहते हैं। वे खुलकर प्यार दिखाना धीरे सीखते हैं, पर एक बार जुड़ जाएँ तो वफ़ादार रहते हैं।',
];
const legacyDecisionPhrases = [
  'tests leverage, logic, and long-term consequences',
  'लाभ, तर्क और दूरगामी परिणामों को परखता है',
];
const conflictDefinition = JSON.parse(await (await import('node:fs/promises')).readFile(new URL('../../conflict-insights.v1.json', import.meta.url), 'utf8'));
const leadershipDefinition = JSON.parse(await (await import('node:fs/promises')).readFile(new URL('../../leadership-insights.v1.json', import.meta.url), 'utf8'));
const learningDefinition = JSON.parse(await (await import('node:fs/promises')).readFile(new URL('../../learning-insights.v1.json', import.meta.url), 'utf8'));
let personalityContextsChecked = 0;
let comparePairsChecked = 0;

for (const locale of ['en', 'hi']) {
  for (const type of types) {
    const response = await fetch(`${baseUrl}/${locale}/personality/${type}`);
    const html = await response.text();
    assert(response.ok, `${locale}/${type}: personality page did not load`);
    const marker = locale === 'hi' ? 'टीमवर्क' : 'Teamwork';
    const section = html.slice(html.indexOf(locale === 'hi' ? 'रिश्ते और जुड़ाव' : 'Relationships and connection'), html.indexOf(locale === 'hi' ? 'नेतृत्व और योगदान' : 'Leadership and contribution'));
    assert(section.includes(marker), `${locale}/${type}: relationship section is absent`);
    const cards = [...section.matchAll(/<h3[^>]*>(Friendship|Romantic relationships|Family|Teamwork|दोस्ती|रोमांटिक रिश्ते|परिवार|टीमवर्क)<\/h3><p[^>]*>(.*?)<\/p>/g)].map((match) => rawText(match[2]));
    assert(cards.length === 4, `${locale}/${type}: expected four relationship context cards, found ${cards.length}`);
    assert(cards.every((text) => normalize(text).length >= 55), `${locale}/${type}: relationship card copy is too short`);
    assert(unique(cards), `${locale}/${type}: relationship context copy repeats`);
    assert(!legacyRelationshipPhrases.some((phrase) => html.includes(phrase)), `${locale}/${type}: legacy relationship fallback is present in SSR HTML`);
    personalityContextsChecked += cards.length;

    const careerResponse = await fetch(`${baseUrl}/${locale}/personality/${type}/careers`);
    const careerHtml = await careerResponse.text();
    assert(careerResponse.ok, `${locale}/${type}: career guide did not load`);
    const roleSection = careerHtml.slice(careerHtml.indexOf(locale === 'hi' ? 'करियर पथ खोजें' : 'Career Path Explorer'), careerHtml.indexOf(locale === 'hi' ? 'भूमिका तुलना' : 'Role comparison'));
    const roles = [...roleSection.matchAll(/<h3[^>]*>(.*?)<\/h3><p[^>]*>(.*?)<\/p><p[^>]*>(.*?)<\/p><p[^>]*>(.*?)<\/p>/g)].map((match) => match.slice(1).map(rawText));
    assert(roles.length >= 12, `${locale}/${type}: expected role-specific career entries`);
    assert(unique(roles.map(([, reason]) => reason)), `${locale}/${type}: career reasons repeat within one guide`);
    assert(unique(roles.map(([, , demand]) => demand)), `${locale}/${type}: career challenges repeat within one guide`);
    assert(unique(roles.map(([, , , skill]) => skill)), `${locale}/${type}: career skills repeat within one guide`);
    assert(!roleSection.includes(locale === 'hi' ? 'जुड़े काम में योगदान देने की दिशा' : 'A direction for contributing through'), `${locale}/${type}: old type-level role fallback remains`);
  }
}

assert(conflictDefinition.analyzer.slug === 'conflict-insights' && conflictDefinition.analyzer.status === 'published', 'Conflict Insights must be an explicitly published analyzer');
assert(conflictDefinition.analyzer.noOverallScore === true, 'Conflict Insights must not define an overall score');
assert(conflictDefinition.dimensions.length === 8, 'Conflict Insights requires eight authored dimensions');
assert(conflictDefinition.scenarios.length === 12, 'Conflict Insights requires twelve authored scenarios');
assert(conflictDefinition.weeklyChallenges.length >= 15, 'Conflict Insights requires authored weekly experiments');
for (const scenario of conflictDefinition.scenarios) {
  assert(scenario.options.length === 4, `${scenario.id}: Conflict Insights requires four response options`);
  for (const locale of ['en', 'hi']) {
    assert(scenario.prompt[locale]?.trim(), `${scenario.id}: missing Conflict Insights ${locale} prompt`);
    const options = scenario.options.map((option) => option.text[locale]?.trim());
    assert(options.every(Boolean) && unique(options), `${scenario.id}: missing or duplicate Conflict Insights ${locale} options`);
  }
}
for (const challenge of conflictDefinition.weeklyChallenges) for (const locale of ['en', 'hi']) {
  assert(challenge.title[locale]?.trim() && challenge.instruction[locale]?.trim(), `${challenge.id}: missing authored Conflict Insights ${locale} experiment`);
}
assert(leadershipDefinition.analyzer.slug === 'leadership-insights' && leadershipDefinition.analyzer.status === 'published', 'Leadership Insights must be explicitly published');
assert(leadershipDefinition.analyzer.noOverallScore === true && leadershipDefinition.dimensions.length === 8 && leadershipDefinition.scenarios.length === 12 && leadershipDefinition.weeklyChallenges.length >= 15, 'Leadership Insights requires complete authored content');
for (const scenario of leadershipDefinition.scenarios) for (const locale of ['en', 'hi']) assert(scenario.prompt[locale]?.trim() && scenario.options.length === 4 && unique(scenario.options.map((option) => option.text[locale]?.trim())), `${scenario.id}: incomplete Leadership Insights ${locale} content`);
for (const challenge of leadershipDefinition.weeklyChallenges) for (const locale of ['en', 'hi']) assert(challenge.dimension && challenge.title[locale]?.trim() && challenge.instruction[locale]?.trim(), `${challenge.id}: missing authored Leadership Insights ${locale} experiment`);
assert(learningDefinition.analyzer.slug === 'learning-insights' && learningDefinition.analyzer.status === 'published' && learningDefinition.analyzer.noOverallScore === true, 'Learning Insights release contract is invalid');
assert(learningDefinition.dimensions.length === 8 && learningDefinition.scenarios.length === 12 && new Set(learningDefinition.scenarios.map((item) => item.id)).size === 12, 'Learning Insights requires eight dimensions and twelve unique scenarios');
const learningDimensions = new Set();
for (const scenario of learningDefinition.scenarios) { assert(scenario.options.length === 4 && new Set(scenario.options.map((item) => item.id)).size === 4, `${scenario.id}: Learning options require four unique IDs`); for (const locale of ['en', 'hi']) { const text = scenario.options.map((item) => item.text[locale]?.trim()); assert(scenario.prompt[locale]?.trim() && text.every(Boolean) && unique(text), `${scenario.id}: missing, fallback, or duplicate Learning ${locale} content`); } for (const option of scenario.options) for (const [dimension, value] of Object.entries(option.scores)) { assert(Number.isInteger(value) && value !== 0, `${scenario.id}: invalid Learning score`); learningDimensions.add(dimension); } }
assert(learningDimensions.size === 8, 'Learning Insights must represent all eight dimensions');
assert(learningDefinition.weeklyChallenges.length === 15 && new Set(learningDefinition.weeklyChallenges.map((item) => item.id)).size === 15, 'Learning Insights requires fifteen stable authored experiments');
for (const item of learningDefinition.weeklyChallenges) for (const locale of ['en', 'hi']) assert(item.dimension && item.title[locale]?.trim() && item.instruction[locale]?.trim(), `${item.id}: missing authored Learning ${locale} experiment`);
for (const scenario of learningDefinition.scenarios) assert(!JSON.stringify(scenario).match(/\b(IQ|intelligence|learning style|percentage|%|placeholder|generic)\b/i), `${scenario.id}: Learning scenario contains forbidden substantive claim or placeholder`);

for (const locale of ['en', 'hi']) {
  for (let a = 0; a < types.length; a += 1) for (let b = a + 1; b < types.length; b += 1) {
    const response = await fetch(`${baseUrl}/${locale}/compare/${types[a]}-vs-${types[b]}`);
    const html = await response.text();
    assert(response.ok, `${locale}/${types[a]}-vs-${types[b]}: compare page did not load`);
    const decision = html.slice(html.indexOf(locale === 'hi' ? 'निर्णय लेना' : 'Decision-making'), html.indexOf(locale === 'hi' ? 'मतभेद, दबाव और सुधार' : 'Conflict, pressure, and repair'));
    const text = rawText(decision);
    assert(text.includes(types[a].toUpperCase()) && text.includes(types[b].toUpperCase()), `${locale}/${types[a]}-vs-${types[b]}: both decision sides must appear`);
    assert(!new RegExp(`${types[a].toUpperCase()} ([^.]+)\\. ${types[b].toUpperCase()} \\1\\.`, 'i').test(text), `${locale}/${types[a]}-vs-${types[b]}: A and B decision text repeats`);
    assert(!legacyDecisionPhrases.some((phrase) => html.includes(phrase)), `${locale}/${types[a]}-vs-${types[b]}: legacy decision fallback is present in SSR HTML`);
    comparePairsChecked += 1;
  }
}

console.log(`Content integrity checks passed: ${personalityContextsChecked} personality contexts, 32 career guides, ${comparePairsChecked} comparison pages, and authored Conflict, Leadership, and Learning Insights scenarios; 0 legacy fallback occurrences.`);
