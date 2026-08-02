import { TYPE_CODES } from '../data/types';

export function getPersonalityUrl(type, locale = 'en') {
  const code = String(type || '').toUpperCase();
  if (!TYPE_CODES.includes(code)) return null;
  return `/${locale === 'hi' ? 'hi' : 'en'}/personality/${code.toLowerCase()}`;
}
