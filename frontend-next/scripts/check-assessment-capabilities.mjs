import assert from 'node:assert/strict';
import { ASSESSMENT_LOCALES, isAssessmentLocaleSupported } from '../lib/assessment-capabilities.js';

assert.deepEqual(ASSESSMENT_LOCALES.communication, ['en', 'hi', 'fr']);
assert.deepEqual(ASSESSMENT_LOCALES.conflict, ['en', 'hi']);
assert.deepEqual(ASSESSMENT_LOCALES.leadership, ['en', 'hi']);
assert.deepEqual(ASSESSMENT_LOCALES.learning, ['en', 'hi']);

for (const locale of ['en', 'hi', 'fr']) assert.equal(isAssessmentLocaleSupported('communication', locale), true);
for (const analyzer of ['conflict', 'leadership', 'learning']) {
  assert.equal(isAssessmentLocaleSupported(analyzer, 'en'), true);
  assert.equal(isAssessmentLocaleSupported(analyzer, 'hi'), true);
  assert.equal(isAssessmentLocaleSupported(analyzer, 'fr'), false);
}
for (const analyzer of Object.keys(ASSESSMENT_LOCALES)) assert.equal(isAssessmentLocaleSupported(analyzer, 'ja'), false);
assert.equal(isAssessmentLocaleSupported('unknown', 'fr'), false);

console.log('Assessment locale capabilities are analyzer-specific and fail closed.');
