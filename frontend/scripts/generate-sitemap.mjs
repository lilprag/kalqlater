import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const site = 'https://kalqlater.com';
const types = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
const basePages = ['', '/test', '/types', '/about', '/privacy', '/terms', '/contact'];
const typePages = types.map((type) => `/types/${type}`);
const comparisonPages = types.flatMap((first, index) => types.slice(index + 1).map((second) => `/compare/${first.toLowerCase()}-vs-${second.toLowerCase()}`));
const urls = [...basePages, ...typePages, ...comparisonPages];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((path) => `  <url><loc>${site}${path}</loc></url>`).join('\n')}\n</urlset>\n`;

writeFileSync(resolve('public/sitemap.xml'), xml);
