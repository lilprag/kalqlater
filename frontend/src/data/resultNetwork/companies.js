import { profileFor } from './profiles';

const companies = ['Product studios', 'Research teams', 'Mission-led ventures', 'Design-led businesses', 'Scaling startups', 'Independent consultancies'];
export function getCompanies(code, lang) {
    const p = profileFor(code, lang);
    if (!p) return null;
    return companies.map((name, index) => ({ name, signal: index % 2 ? `${p.career} signal` : `${p.team} signal`, detail: `Illustrative patterns for ${p.name}-style contributors.` }));
}
