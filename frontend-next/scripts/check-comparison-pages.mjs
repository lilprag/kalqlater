import { isSupportedCompareLocale } from '../lib/comparison-locales.js';

const baseUrl = String(process.env.COMPARISON_CHECK_BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const locale = String(process.env.COMPARISON_CHECK_LOCALE || 'en').trim().toLowerCase();
if (!isSupportedCompareLocale(locale)) {
  console.error(`Unsupported comparison locale: ${locale}`);
  process.exit(1);
}
// Keep this standalone so it can run after deployment with plain Node, without
// relying on Next.js's extensionless server-module resolution.
const types = ['intj', 'intp', 'entj', 'entp', 'infj', 'infp', 'enfj', 'enfp', 'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp'];
const urls = types.flatMap((first, index) => types.slice(index + 1).map((second) => `/${locale}/compare/${first}-vs-${second}`));
const failures = [];

for (const pathname of urls) {
  let response;
  try {
    response = await fetch(`${baseUrl}${pathname}`, { redirect: 'manual' });
  } catch (error) {
    failures.push({ pathname, status: 'NETWORK', detail: error.message });
    console.log(`FAIL NETWORK ${pathname}: ${error.message}`);
    continue;
  }
  if (response.status === 200) {
    console.log(`PASS 200 ${pathname}`);
  } else {
    failures.push({ pathname, status: response.status });
    console.log(`FAIL ${response.status} ${pathname}`);
  }
}

console.log(`\nSummary: ${urls.length - failures.length} passed, ${failures.length} failed`);
if (failures.length) process.exitCode = 1;
