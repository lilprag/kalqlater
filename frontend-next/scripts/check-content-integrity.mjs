const baseUrl = (process.env.CRAWL_BASE_URL || 'http://127.0.0.1:3100').replace(/\/$/, '');
const types = ['intj', 'intp', 'entj', 'entp', 'infj', 'infp', 'enfj', 'enfp', 'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp'];
const normalize = (value) => String(value || '').toLowerCase().replace(/<[^>]*>/g, ' ').replace(/[\p{P}\p{S}\s]+/gu, ' ').trim();
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const unique = (items) => new Set(items.map(normalize)).size === items.length;
const rawText = (html) => html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

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

for (const locale of ['en', 'hi']) {
  for (let a = 0; a < types.length; a += 1) for (let b = a + 1; b < types.length; b += 1) {
    const response = await fetch(`${baseUrl}/${locale}/compare/${types[a]}-vs-${types[b]}`);
    const html = await response.text();
    assert(response.ok, `${locale}/${types[a]}-vs-${types[b]}: compare page did not load`);
    const decision = html.slice(html.indexOf(locale === 'hi' ? 'निर्णय लेना' : 'Decision-making'), html.indexOf(locale === 'hi' ? 'मतभेद, दबाव और सुधार' : 'Conflict, pressure, and repair'));
    const text = rawText(decision);
    assert(text.includes(types[a].toUpperCase()) && text.includes(types[b].toUpperCase()), `${locale}/${types[a]}-vs-${types[b]}: both decision sides must appear`);
    assert(!new RegExp(`${types[a].toUpperCase()} ([^.]+)\\. ${types[b].toUpperCase()} \\1\\.`, 'i').test(text), `${locale}/${types[a]}-vs-${types[b]}: A and B decision text repeats`);
  }
}

console.log(`Content integrity checks passed: 32 personality guides, 32 career guides, and ${types.length * 15} comparison pages.`);
