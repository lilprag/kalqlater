import { QUESTIONS } from '../data/questions';

// Compute type from answers array of length 60 (values 1..5).
// Returns { code: 'INTJ', percentages: { E: 60, I: 40, S: 70, N: 30, T: 55, F: 45, J: 40, P: 60 } }
export function computeResult(answers) {
    const sums = { EI: 0, SN: 0, TF: 0, JP: 0 };
    const perDim = { EI: 0, SN: 0, TF: 0, JP: 0 };

    QUESTIONS.forEach((q, idx) => {
        const raw = answers[idx];
        if (raw == null) return;
        const delta = raw - 3; // -2..+2
        // If direction is the first letter of the axis pair, positive delta = first letter.
        // Axis first letters: EI->E, SN->S, TF->T, JP->J
        const firstLetter = q.dim[0];
        const sign = q.dir === firstLetter ? 1 : -1;
        sums[q.dim] += delta * sign;
        perDim[q.dim] += 1;
    });

    const axisMap = { EI: ['E', 'I'], SN: ['S', 'N'], TF: ['T', 'F'], JP: ['J', 'P'] };
    const letters = [];
    const percentages = {};

    for (const dim of ['EI', 'SN', 'TF', 'JP']) {
        const [first, second] = axisMap[dim];
        const maxAbs = perDim[dim] * 2; // Max possible |sum|
        const raw = sums[dim];
        // Percent for first letter: 50 + (raw / maxAbs) * 50, clamped
        let pctFirst = 50 + (raw / maxAbs) * 50;
        pctFirst = Math.max(0, Math.min(100, Math.round(pctFirst)));
        const pctSecond = 100 - pctFirst;
        letters.push(pctFirst >= 50 ? first : second);
        percentages[first] = pctFirst;
        percentages[second] = pctSecond;
    }

    return { code: letters.join(''), percentages };
}

export const LS_KEY = 'mv_test_state_v1';
export const LS_LANG = 'mv_lang_v1';
