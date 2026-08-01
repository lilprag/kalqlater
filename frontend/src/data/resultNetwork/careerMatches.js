import { profileFor } from './profiles';

export function getCareerMatches(code, lang) {
    const p = profileFor(code, lang);
    if (!p) return null;
    return [
        { role: 'AI Product Manager', fit: 'Natural fit', why: `It rewards ${p.focus}.`, detail: 'A deeper role map appears when the network experience is available.' },
        { role: 'Strategy Consultant', fit: 'Strong fit', why: `You can bring ${p.focus} to complex decisions.`, detail: 'A deeper role map appears when the network experience is available.' },
        { role: 'Startup Founder', fit: 'Growth fit', why: `Your perspective can shape a distinct direction.`, detail: 'A deeper role map appears when the network experience is available.' },
    ];
}
