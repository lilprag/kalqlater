'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const enabled = process.env.NODE_ENV === 'production' && Boolean(measurementId);

function ensureGtag() {
  if (!enabled || typeof window === 'undefined') return false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  if (!document.getElementById('ga4-gtag-script')) {
    const script = document.createElement('script');
    script.id = 'ga4-gtag-script'; script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { send_page_view: false });
  }
  return true;
}

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef('');
  useEffect(() => {
    const path = `${pathname}${searchParams.size ? `?${searchParams.toString()}` : ''}`;
    if (path === lastPath.current || !ensureGtag()) return;
    window.gtag('event', 'page_view', { page_path: path, page_location: window.location.href, page_title: document.title });
    lastPath.current = path;
  }, [pathname, searchParams]);
  return null;
}
