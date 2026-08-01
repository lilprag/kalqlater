import { profileFor } from './profiles';
export function getJobs(code, lang) {
    const p = profileFor(code, lang);
    if (!p) return null;
    return [
        ['Product studio', 'Product strategy lead'], ['Experience team', 'Experience designer'], ['Research practice', 'Research partner'], ['Community venture', 'Community operator']].map(([company, title]) => ({ company, title, reason: `A potential place to use your ${p.focus}.` }));
}
