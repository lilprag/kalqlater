import { NextResponse } from 'next/server';
import { legacyResponseHeaders } from './lib/legacy-response-headers';
import { publishedLanguageLocales, resolveLocaleRoute } from './lib/locale-availability';
import { localeRuntimeRegistry } from './localization/runtime-policy';

const locales = new Set(publishedLanguageLocales());
const previewLocales = new Set(Object.values(localeRuntimeRegistry).filter((runtime) => runtime.state === 'preview').map((runtime) => runtime.locale));
const typeOrder = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
const legacyNoindexPaths = ['/community', '/login', '/signup', '/forgot-password', '/reset-password'];

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

function notFoundResponse() {
  return new NextResponse('Not Found', {
    status: 404,
    headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' },
  });
}

function legacyPersonalityResponse(request) {
  if (request.nextUrl.pathname === '/types/') return NextResponse.next();
  const match = /^\/types\/([^/]+)$/i.exec(request.nextUrl.pathname);
  if (!match) return notFoundResponse();
  const type = match[1].toUpperCase();
  if (!typeOrder.includes(type)) return notFoundResponse();

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
    return pair ? NextResponse.redirect(comparisonDestination(request, pair), 308) : notFoundResponse();
  }
  const match = /^\/compare\/([a-z]{4})-vs-([a-z]{4})$/i.exec(path);
  if (!match) return notFoundResponse();
  const pair = parsedPair(match[1], match[2]);
  return pair ? NextResponse.redirect(comparisonDestination(request, pair), 308) : notFoundResponse();
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

async function localizedLegacyApplicationResponse(request, locale, route) {
  const origin = process.env.LEGACY_CRA_ORIGIN?.replace(/\/$/, '');
  if (!origin) return notFoundResponse();
  const destination = new URL(`/${route}`, origin);
  destination.searchParams.set('locale', locale);
  const headers = new Headers();
  const accept = request.headers.get('accept');
  if (accept) headers.set('accept', accept);
  headers.set('accept-language', locale);
  const upstream = await fetch(destination, { method: request.method, headers, cache: 'no-store', redirect: 'manual' });
  return new NextResponse(upstream.body, { status: upstream.status, headers: legacyResponseHeaders(upstream.headers) });
}

function previewResponse(request, locale) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-kalqlater-locale', locale);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export async function proxy(request) {
  const path = request.nextUrl.pathname;
  const locale = path.split('/')[1]?.toLowerCase();
  if (previewLocales.has(locale)) {
    const availability = resolveLocaleRoute(locale, path);
    return availability.isPreview ? previewResponse(request, locale) : notFoundResponse();
  }
  const localizedLegacy = /^\/(en|hi|fr|ja)\/(test|types)\/?$/i.exec(path);
  if (localizedLegacy) return localizedLegacyApplicationResponse(request, localizedLegacy[1].toLowerCase(), localizedLegacy[2].toLowerCase());
  if (path.startsWith('/types/')) return legacyPersonalityResponse(request);
  if (path === '/compare' || path.startsWith('/compare/')) return legacyComparisonResponse(request);
  if (legacyNoindexPaths.some((legacyPath) => path === legacyPath || path.startsWith(`${legacyPath}/`))) return noindexLegacyApplicationResponse(request);

  if (!locales.has(locale)) return NextResponse.next();
  const comparison = new RegExp(`^/(${locale})/compare/([a-z]{4})-vs-([a-z]{4})$`, 'i').exec(path);
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

export const config = { matcher: ['/:locale/:path*', '/types/:path*', '/compare', '/compare/:path*', '/community/:path*', '/login', '/signup', '/forgot-password', '/reset-password'] };
