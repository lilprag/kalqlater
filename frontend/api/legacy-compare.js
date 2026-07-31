const TYPES = new Set(['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']);

export default function handler(request, response) {
  const first = String(request.query.type1 || 'INTJ').toUpperCase();
  const second = String(request.query.type2 || 'ENFP').toUpperCase();
  const safeFirst = TYPES.has(first) ? first : 'INTJ';
  const safeSecond = TYPES.has(second) && second !== safeFirst ? second : 'ENFP';
  response.setHeader('Cache-Control', 'public, max-age=3600');
  response.redirect(301, `/compare/${safeFirst.toLowerCase()}-vs-${safeSecond.toLowerCase()}`);
}
