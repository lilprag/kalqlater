import { NextResponse } from 'next/server';

const locales = new Set(['en', 'hi']);
const typeOrder = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];

export function proxy(request) {
  const locale = request.nextUrl.pathname.split('/')[1];
  if (!locales.has(locale)) return NextResponse.next();
  const comparison = new RegExp(`^/(${locale})/compare/([a-z]{4})-vs-([a-z]{4})$`, 'i').exec(request.nextUrl.pathname);
  if (comparison) {
    const first = comparison[2].toUpperCase(); const second = comparison[3].toUpperCase();
    if (typeOrder.indexOf(first) > typeOrder.indexOf(second) && typeOrder.includes(first) && typeOrder.includes(second)) {
      const url = request.nextUrl.clone(); url.pathname = `/${locale}/compare/${second.toLowerCase()}-vs-${first.toLowerCase()}`;
      return NextResponse.redirect(url, 308);
    }
  }
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-kalqlater-locale', locale);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = { matcher: ['/en/:path*', '/hi/:path*'] };
