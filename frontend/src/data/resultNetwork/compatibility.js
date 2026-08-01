import { profileFor } from './profiles';

const partners = { INTJ: ['ENFP', 'ENTP', 'INFJ'], INTP: ['ENTJ', 'ENFJ', 'ENFP'], ENTJ: ['INTP', 'INFP', 'ENFP'], ENTP: ['INFJ', 'INTJ', 'ISFJ'], INFJ: ['ENFP', 'ENTP', 'INTJ'], INFP: ['ENFJ', 'ENTJ', 'ISFJ'], ENFJ: ['INFP', 'INTP', 'ISFP'], ENFP: ['INFJ', 'INTJ', 'ISTJ'], ISTJ: ['ESFP', 'ENFP', 'ESTP'], ISFJ: ['ESFP', 'ESTP', 'ENFP'], ESTJ: ['ISFP', 'ISTP', 'INFP'], ESFJ: ['ISFP', 'ISTP', 'INFP'], ISTP: ['ESFJ', 'ESTJ', 'ENFJ'], ISFP: ['ENFJ', 'ESFJ', 'ESTJ'], ESTP: ['ISFJ', 'ISTJ', 'INFJ'], ESFP: ['ISTJ', 'ISFJ', 'INTJ'] };
export function getCompatibility(code, lang) {
    const p = profileFor(code, lang);
    if (!p) return null;
    return (partners[code] || []).map((type, index) => ({ type, dynamic: ['Complementary energy', 'A thoughtful counterweight', 'A growth-oriented connection'][index], reason: `They can add a new angle to ${p.focus}.`, detail: 'Compatibility is interpretive—not a prediction or promise.' }));
}
