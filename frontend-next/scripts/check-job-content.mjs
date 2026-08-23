import assert from 'node:assert/strict';
import { distinctJobSection } from '../lib/job-content.js';

const description = 'Build reliable APIs and distributed systems for creators. '.repeat(8).trim();
assert.equal(distinctJobSection(description, description), '', 'identical requirements must be hidden');
assert.equal(distinctJobSection(description, `${description} `), '', 'near-identical requirements must be hidden');
assert.equal(distinctJobSection(`Introduction. ${description} Closing.`, description), '', 'requirements already contained in description must be hidden');
assert.equal(distinctJobSection(description, 'Five years of production Java experience.'), 'Five years of production Java experience.', 'distinct source requirements must remain visible');
console.log('Job detail content presentation checks: PASS');
