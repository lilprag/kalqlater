import { createJob, HUMAN_APPROVALS, SCORE_DIMENSIONS, STUDIO_STAGES } from '../localization/studio/contracts.js';
import { createTranslationMemory, affectedLocaleBlocks } from '../localization/studio/memory.js';
import { publicationDecision, runNativeLocalizationPipeline, scoreCandidate } from '../localization/studio/pipeline.js';
import { studioLocaleReport } from '../localization/studio/reporting.js';
import { stageBriefs } from '../localization/studio/prompts.js';

const assert = (condition, message) => { if (!condition) throw new Error(message); };
assert(STUDIO_STAGES.length === 12 && STUDIO_STAGES.every((stage) => stageBriefs[stage]), 'every AI studio stage needs an explicit responsibility');

const job = createJob({ locale: 'es', contentId: 'HOME.HERO.TITLE', masterRevision: 'en-2026-08-13', masterContent: 'Original master intent', pageFamily: 'home' });
const approvedStage = async (stage) => ({ stage, approved: true, output: stage === 'native_editorial_writer' ? { text: 'Una mirada personal para crecer con calma.' } : { stage } });
const candidate = await runNativeLocalizationPipeline(job, approvedStage);
assert(candidate.status === 'needs_human_review' && candidate.trail.length === 12, 'approved pipeline must still require human review');
const rejected = await runNativeLocalizationPipeline(job, async (stage) => ({ stage, approved: stage !== 'psychology_guardian', output: stage === 'psychology_guardian' ? undefined : { stage } }));
assert(rejected.status === 'rejected' && rejected.rejectedAt === 'psychology_guardian', 'psychology rejection must stop the pipeline');

const perfectScores = Object.fromEntries(SCORE_DIMENSIONS.map((dimension) => [dimension, 95]));
assert(scoreCandidate(perfectScores).overall === 95, 'quality score must be deterministic');
const decision = publicationDecision({ pipelineStatus: candidate.status, scores: perfectScores, approvals: Object.fromEntries(HUMAN_APPROVALS.map((gate) => [gate, 'approved'])) });
assert(decision.publishable, 'fully approved high-quality candidate should be publishable in editorial state');
const aiOnly = publicationDecision({ pipelineStatus: candidate.status, scores: perfectScores, approvals: {} });
assert(!aiOnly.publishable && aiOnly.missingApprovals.length === HUMAN_APPROVALS.length, 'AI-only output must never publish');

const memory = createTranslationMemory([{ locale: 'es', contentId: 'BUTTON.START', value: 'Empezar', status: 'approved' }, { locale: 'es', contentId: 'BUTTON.NEXT', value: 'Next', status: 'draft' }]);
assert(memory.get('es', 'BUTTON.START')?.value === 'Empezar' && !memory.get('es', 'BUTTON.NEXT'), 'memory must retain only approved human edits');
const affected = affectedLocaleBlocks({ changedContentIds: ['HOME.HERO.TITLE'], localeRecords: [{ locale: 'es', contentId: 'HOME.HERO.TITLE', status: 'published' }, { locale: 'es', contentId: 'BUTTON.START', status: 'published' }] });
assert(affected.length === 1 && affected[0].status === 'pending_update', 'English changes must only affect matching published blocks');
assert(studioLocaleReport('es').publishable === false && studioLocaleReport('en').publishable === true, 'studio reporting must respect existing publication gates');
console.log('AI Native Localization Studio checks passed.');
