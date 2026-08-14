import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { localeBootstrapFiles } from '../localization/bootstrap.js';

const [locale, destination = 'localization/locales'] = process.argv.slice(2);
if (!locale) throw new Error('Usage: node scripts/bootstrap-locale.mjs <locale> [destination]');
const files = localeBootstrapFiles(locale);
const root = path.resolve(destination, locale.toLowerCase());
let created = 0;
let skipped = 0;
for (const [relativePath, content] of files) {
  const target = path.join(root, relativePath);
  try { await access(target); skipped += 1; continue; } catch { /* create only absent files */ }
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(content, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
  created += 1;
}
console.log(`Locale bootstrap ${locale.toLowerCase()}: ${created} created, ${skipped} preserved at ${root}`);
