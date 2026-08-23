import assert from 'node:assert/strict';
import { jobMatchPresentation } from '../lib/job-match.js';

assert.deepEqual(jobMatchPresentation(null), null, 'anonymous visitors have no match badge');
assert.deepEqual(jobMatchPresentation({ status: 'insufficient_profile', overall_score: null }), { kind: 'incomplete', label: 'Complete profile for match' }, 'incomplete profiles never receive a fabricated percentage');
assert.deepEqual(jobMatchPresentation({ status: 'scored', overall_score: 0 }), { kind: 'score', score: 0, label: 'profile match', evidence: '' }, 'a genuine zero score remains visible');
assert.deepEqual(jobMatchPresentation({ status: 'scored', overall_score: 88.6, matched: ['Target role', '4 matched skills', 'Work mode', 'Industry'] }), { kind: 'score', score: 89, label: 'profile match', evidence: 'Target role · 4 matched skills · Work mode' }, 'valid scores and concise real evidence are presented');
console.log('Jobs match presentation: PASS');
