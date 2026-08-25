import assert from 'node:assert/strict';

const baseUrl=(process.env.COMPARE_BASE_URL||'http://127.0.0.1:3213').replace(/\/$/,'');
const types=['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];
const pairs=types.flatMap((first,index)=>types.slice(index+1).map(second=>({first,second,slug:`${first.toLowerCase()}-vs-${second.toLowerCase()}`})));
const required=['Quick answer','At a glance','Key differences','What they have in common','How this pairing actually works','Communication','Decision-making','Conflict and repair','Under stress','Friendship','Romantic relationships','Work and coworker dynamics','Emotional and interpersonal needs','Common misunderstandings','Real-life interaction scenarios','What each can learn from the other','Myth and reality','Frequently asked questions'];
const strip=(html)=>html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&(?:amp|#x27|quot|lt|gt);/g,' ').replace(/\s+/g,' ').trim();
const normalize=(text)=>text.toLowerCase().replace(/\b(?:intj|intp|entj|entp|infj|infp|enfj|enfp|istj|isfj|estj|esfj|istp|isfp|estp|esfp)\b/g,'TYPE').replace(/\s+/g,' ').trim();
const paragraphPages=new Map();const sentencePages=new Map();const titles=new Set();const descriptions=new Set();
const sharedExclusions=['personality type alone cannot predict relationship success','use this guide as a prompt for observation and choice','turn a type difference into a better next conversation','kalqlater presents personality preferences as a starting point for self-understanding'];
for(const {first,second,slug} of pairs){
  const response=await fetch(`${baseUrl}/en/compare/${slug}`);const html=await response.text();
  assert.equal(response.status,200,`${slug}: expected 200`);
  for(const heading of required) assert(html.includes(heading),`${slug}: missing ${heading}`);
  assert(html.includes(`If you are ${first} dealing with ${second}`),`${slug}: missing Type A advice`);
  assert(html.includes(`If you are ${second} dealing with ${first}`),`${slug}: missing Type B advice`);
  assert((html.match(/Another possibility:/g)||[]).length>=2,`${slug}: misunderstanding coverage`);
  assert((html.match(/Possible friction:/g)||[]).length>=3,`${slug}: scenario coverage`);
  assert(!html.includes('Why KalQLater does not use compatibility percentages'),`${slug}: old large disclaimer remains`);
  assert(html.includes('No compatibility score.'),`${slug}: compact score note missing`);
  assert(html.includes('FAQPage')&&html.includes('BreadcrumbList'),`${slug}: schema missing`);
  assert(html.includes(`<link rel="canonical" href="https://kalqlater.com/en/compare/${slug}"`),`${slug}: canonical missing`);
  assert(html.includes(`/en/personality/${first.toLowerCase()}`)&&html.includes(`/en/personality/${second.toLowerCase()}`),`${slug}: personality links missing`);
  const title=strip(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]||'');
  const description=html.match(/<meta name="description" content="([^"]+)"/i)?.[1]||'';
  assert(title&&description,`${slug}: metadata missing`);titles.add(title);descriptions.add(description);
  for(const match of html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)){
    const text=strip(match[1]);if(text.length<140||sharedExclusions.some(item=>text.toLowerCase().includes(item)))continue;
    const key=normalize(text);if(!paragraphPages.has(key))paragraphPages.set(key,new Set());paragraphPages.get(key).add(slug);
    for(const raw of text.split(/(?<=[.!?])\s+/)){const value=normalize(raw);if(value.length<110)continue;if(!sentencePages.has(value))sentencePages.set(value,new Set());sentencePages.get(value).add(slug);}
  }
}
assert.equal(titles.size,120,'titles must be unique');assert.equal(descriptions.size,120,'descriptions must be unique');
const duplicateEntries=[...paragraphPages.entries()].filter(([,pages])=>pages.size>1);
const duplicateBodies=duplicateEntries.map(([,pages])=>pages);
const suspiciousEntries=[...sentencePages.entries()].filter(([,pages])=>pages.size>=8);
const suspiciousSentences=suspiciousEntries.map(([,pages])=>pages);
if(duplicateBodies.length) console.error(JSON.stringify(duplicateEntries.slice(0,8).map(([text,pages])=>({text,pages:[...pages]})),null,2));
if(suspiciousSentences.length) console.error(JSON.stringify(suspiciousEntries.slice(0,12).map(([text,pages])=>({text,pages:[...pages]})),null,2));
assert.equal(duplicateBodies.length,0,`normalized identical long bodies: ${duplicateBodies.length}`);
assert.equal(suspiciousSentences.length,0,`suspicious repeated long sentences: ${suspiciousSentences.length}`);
const localized=await(await fetch(`${baseUrl}/hi/compare/intj-vs-intp`)).text();
assert(!localized.includes('How this pairing actually works'),'English V3 leaked into Hindi');
console.log(JSON.stringify({canonicalPairs:pairs.length,v3Pages:pairs.length,interactionLoops:pairs.length,misunderstandings:pairs.length,scenarios:pairs.length,typeAAdvice:pairs.length,typeBAdvice:pairs.length,myths:pairs.length,faqs:pairs.length,atGlance:pairs.length,normalizedIdenticalLongBodies:duplicateBodies.length,suspiciousRepeatedSentences:suspiciousSentences.length}));
console.log('Compare V3 architecture and uniqueness: PASS');
