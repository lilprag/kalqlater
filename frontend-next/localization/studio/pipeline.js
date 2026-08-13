import { HUMAN_APPROVALS, SCORE_DIMENSIONS, STUDIO_STAGES, validateStageResult } from './contracts.js';
import { suspiciousEnglishResidue } from '../validation.js';

/** Provider-neutral orchestration. A deployment injects a reviewed model adapter. */
export async function runNativeLocalizationPipeline(job, runStage) {
  if (typeof runStage !== 'function') throw new Error('A reviewed stage adapter is required');
  const trail = [];
  let context = { job };
  for (const stage of STUDIO_STAGES) {
    const result = validateStageResult(stage, await runStage(stage, context));
    trail.push(result);
    if (!result.approved) return Object.freeze({ status: 'rejected', rejectedAt: stage, trail });
    context = { ...context, [stage]: result.output };
  }
  const localized = context.native_editorial_writer?.text || context.ux_writer?.text || context.seo_localization_expert?.text;
  if (localized && suspiciousEnglishResidue(localized, job.locale).length) return Object.freeze({ status: 'rejected', rejectedAt: 'localization_validator', trail, reason: 'suspicious_english_residue' });
  return Object.freeze({ status: 'needs_human_review', trail, candidate: context });
}

export function scoreCandidate(scores) {
  if (!scores || !SCORE_DIMENSIONS.every((dimension) => Number.isFinite(scores[dimension]) && scores[dimension] >= 0 && scores[dimension] <= 100)) throw new Error('Every studio quality score must be between 0 and 100');
  const overall = SCORE_DIMENSIONS.reduce((sum, dimension) => sum + scores[dimension], 0) / SCORE_DIMENSIONS.length;
  return Object.freeze({ ...scores, overall: Number(overall.toFixed(2)) });
}

/** AI output never publishes itself; named human approvals remain mandatory. */
export function publicationDecision({ pipelineStatus, scores, approvals, blockers = [] }) {
  const approvedHumans = HUMAN_APPROVALS.every((gate) => approvals?.[gate] === 'approved');
  const quality = scoreCandidate(scores);
  const thresholdsMet = SCORE_DIMENSIONS.every((dimension) => quality[dimension] >= 90);
  return Object.freeze({ publishable: pipelineStatus === 'needs_human_review' && approvedHumans && thresholdsMet && blockers.length === 0, quality, missingApprovals: HUMAN_APPROVALS.filter((gate) => approvals?.[gate] !== 'approved'), blockers: [...blockers] });
}
