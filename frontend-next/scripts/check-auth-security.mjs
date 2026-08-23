import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { insightClaimContinuation, personalityClaimContinuation, safeReturnTarget } from '../lib/auth.js';

assert.equal(safeReturnTarget('/en/jobs/product-role?save=1', 'en'), '/en/jobs/product-role?save=1');
assert.equal(safeReturnTarget('/fr/jobs/profile', 'fr'), '/fr/jobs/profile');
assert.equal(safeReturnTarget('/ja/insights/communication/result/result-id?claim=1', 'ja'), '/ja/insights/communication/result/result-id?claim=1');
assert.equal(safeReturnTarget('/community/member/asha', 'en'), '/community/member/asha');
assert.equal(safeReturnTarget('https://evil.example/steal', 'en'), '/en/dashboard');
assert.equal(safeReturnTarget('//evil.example/steal', 'en'), '/en/dashboard');
assert.equal(safeReturnTarget('/\\evil.example/steal', 'en'), '/en/dashboard');
assert.equal(safeReturnTarget('/hi/jobs/role?save=1', 'en'), '/en/dashboard');
assert.equal(safeReturnTarget('/en/jobs/role?next=https://evil.example&apply=1', 'en'), '/en/jobs/role?apply=1');
assert.equal(safeReturnTarget('/en/contact', 'en'), '/en/dashboard');
assert.equal(insightClaimContinuation('fr', 'communication', 'result-12345'), '/fr/insights/communication/result/result-12345?claim=1');
assert.equal(insightClaimContinuation('en', 'unknown', 'result-12345'), null);
assert.equal(personalityClaimContinuation(), null, 'browser-only personality results must not fabricate ownership');

for (const locale of ['en', 'hi', 'fr', 'ja']) {
  for (const route of ['login', 'signup', 'forgot-password', 'reset-password']) {
    const page = await readFile(new URL(`../app/[locale]/${route}/page.jsx`, import.meta.url), 'utf8');
    assert(page.includes('index:false') && page.includes('follow:false'), `${locale}/${route} must be noindex`);
  }
}

const form = await readFile(new URL('../components/AuthFlow.jsx', import.meta.url), 'utf8');
assert(!/password.*dispatchBrowserAnalytics|email.*dispatchBrowserAnalytics/.test(form), 'credentials must never enter analytics');
assert(form.includes("['en'") === false, 'locale handling must not be hard-coded in the form renderer');
for (const locale of ['en', 'hi', 'fr', 'ja']) assert(form.includes(`${locale}: {`), `missing ${locale} auth copy`);

console.log('Auth continuation, noindex, locale, and open-redirect security checks passed.');
