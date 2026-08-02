import { NextResponse } from 'next/server';

const locales = new Set(['en', 'hi']);
const typeOrder = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];

function parsedPair(firstValue, secondValue) {
  const first = String(firstValue || '').toUpperCase();
  const second = String(secondValue || '').toUpperCase();
  if (!typeOrder.includes(first) || !typeOrder.includes(second) || first === second) return null;
  return typeOrder.indexOf(first) < typeOrder.indexOf(second) ? [first, second] : [second, first];
}

function comparisonDestination(request, pair) {
  const locale = request.nextUrl.searchParams.get('lang') === 'hi' ? 'hi' : 'en';
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}/compare/${pair[0].toLowerCase()}-vs-${pair[1].toLowerCase()}`;
  url.search = '';
  return url;
}

function legacyComparisonResponse(request) {
  const path = request.nextUrl.pathname;
  if (path === '/compare') {
    const hasTypeQuery = request.nextUrl.searchParams.has('type1') || request.nextUrl.searchParams.has('type2');
    if (!hasTypeQuery) return NextResponse.next();
    const pair = parsedPair(request.nextUrl.searchParams.get('type1'), request.nextUrl.searchParams.get('type2'));
    return pair ? NextResponse.redirect(comparisonDestination(request, pair), 308) : new NextResponse('Not Found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' } });
  }
  const match = /^\/compare\/([a-z]{4})-vs-([a-z]{4})$/i.exec(path);
  if (!match) return new NextResponse('Not Found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' } });
  const pair = parsedPair(match[1], match[2]);
  return pair ? NextResponse.redirect(comparisonDestination(request, pair), 308) : new NextResponse('Not Found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' } });
}

export function proxy(request) {
  if (request.nextUrl.pathname === '/compare' || request.nextUrl.pathname.startsWith('/compare/')) return legacyComparisonResponse(request);

  const locale = request.nextUrl.pathname.split('/')[1];
  if (!locales.has(locale)) return NextResponse.next();
  const comparison = new RegExp(`^/(${locale})/compare/([a-z]{4})-vs-([a-z]{4})$`, 'i').exec(request.nextUrl.pathname);
  if (comparison) {
    const pair = parsedPair(comparison[2], comparison[3]);
    if (pair && `${comparison[2].toLowerCase()}-vs-${comparison[3].toLowerCase()}` !== `${pair[0].toLowerCase()}-vs-${pair[1].toLowerCase()}`) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/compare/${pair[0].toLowerCase()}-vs-${pair[1].toLowerCase()}`;
      return NextResponse.redirect(url, 308);
    }
  }
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-kalqlater-locale', locale);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = { matcher: ['/en/:path*', '/hi/:path*', '/compare', '/compare/:path*'] };
