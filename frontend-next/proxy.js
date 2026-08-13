import { NextResponse } from 'next/server';
import { legacyResponseHeaders } from './lib/legacy-response-headers';
import { publishedLocales } from './lib/locales';

const locales = new Set(publishedLocales);
const typeOrder = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
const legacyNoindexPaths = ['/community', '/login', '/signup', '/forgot-password', '/reset-password'];
const spanishPreviewPaths = new Set(['/es', '/es/personality/intj', '/es/personality/intp', '/es/personality/entj', '/es/personality/entp', '/es/personality/infj', '/es/personality/infp', '/es/personality/enfj', '/es/personality/enfp', '/es/personality/istj', '/es/personality/isfj', '/es/personality/estj', '/es/personality/esfj', '/es/personality/istp', '/es/personality/isfp', '/es/personality/estp', '/es/personality/esfp', '/es/personality/intj/careers', '/es/personality/intp/careers', '/es/personality/entj/careers', '/es/personality/entp/careers', '/es/personality/infj/careers', '/es/personality/infp/careers', '/es/personality/enfj/careers', '/es/personality/enfp/careers', '/es/personality/istj/careers', '/es/personality/isfj/careers', '/es/personality/estj/careers', '/es/personality/esfj/careers', '/es/personality/istp/careers', '/es/personality/isfp/careers', '/es/personality/estp/careers', '/es/personality/esfp/careers']);

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

function legacyPersonalityResponse(request) {
  if (request.nextUrl.pathname === '/types/') return NextResponse.next();
  const match = /^\/types\/([^/]+)$/i.exec(request.nextUrl.pathname);
  if (!match) {
    return new NextResponse('Not Found', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' },
    });
  }
  const type = match[1].toUpperCase();
  if (!typeOrder.includes(type)) {
    return new NextResponse('Not Found', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' },
    });
  }

  const locale = request.nextUrl.searchParams.get('lang') === 'hi' || request.nextUrl.searchParams.get('locale') === 'hi' ? 'hi' : 'en';
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}/personality/${type.toLowerCase()}`;
  url.search = '';
  return NextResponse.redirect(url, 308);
}

function legacyComparisonResponse(request) {
  const path = request.nextUrl.pathname;
  if (path === '/compare') {
    const hasTypeQuery = request.nextUrl.searchParams.has('type1') || request.nextUrl.searchParams.has('type2');
    if (!hasTypeQuery) {
      const url = request.nextUrl.clone();
      url.pathname = '/en/compare';
      return NextResponse.redirect(url, 308);
    }
    const pair = parsedPair(request.nextUrl.searchParams.get('type1'), request.nextUrl.searchParams.get('type2'));
    return pair ? NextResponse.redirect(comparisonDestination(request, pair), 308) : new NextResponse('Not Found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' } });
  }
  const match = /^\/compare\/([a-z]{4})-vs-([a-z]{4})$/i.exec(path);
  if (!match) return new NextResponse('Not Found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' } });
  const pair = parsedPair(match[1], match[2]);
  return pair ? NextResponse.redirect(comparisonDestination(request, pair), 308) : new NextResponse('Not Found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' } });
}

async function noindexLegacyApplicationResponse(request) {
  const origin = process.env.LEGACY_CRA_ORIGIN?.replace(/\/$/, '');
  if (!origin) return NextResponse.next();
  const destination = new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, origin);
  const upstream = await fetch(destination, { method: request.method, headers: request.headers, cache: 'no-store', redirect: 'manual' });
  const response = new NextResponse(upstream.body, { status: upstream.status, headers: legacyResponseHeaders(upstream.headers) });
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

export async function proxy(request) {
  if (spanishPreviewPaths.has(request.nextUrl.pathname)) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-kalqlater-locale', 'es');
    return NextResponse.next({ request: { headers: requestHeaders } });
  }
  if (request.nextUrl.pathname === '/es' || request.nextUrl.pathname.startsWith('/es/')) {
    return new NextResponse('Not Found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' } });
  }
  if (request.nextUrl.pathname.startsWith('/types/')) return legacyPersonalityResponse(request);
  if (request.nextUrl.pathname === '/compare' || request.nextUrl.pathname.startsWith('/compare/')) return legacyComparisonResponse(request);
  if (legacyNoindexPaths.some((path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`))) return noindexLegacyApplicationResponse(request);

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

export const config = { matcher: ['/en/:path*', '/hi/:path*', '/es/:path*', '/types/:path*', '/compare', '/compare/:path*', '/community/:path*', '/login', '/signup', '/forgot-password', '/reset-password'] };
