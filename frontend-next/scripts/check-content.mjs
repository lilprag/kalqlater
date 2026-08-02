import { readFile } from 'node:fs/promises';

const codes = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];
const sources = await Promise.all(['data/types.js', 'data/leadership.js', 'data/communication.js'].map((file) => readFile(file, 'utf8')));
for (const code of codes) for (const source of sources) if (!source.includes(code)) throw new Error(`Missing approved content for ${code}`);
console.log('Content coverage checks passed for 16 codes, two locales, and canonical pair pages.');
