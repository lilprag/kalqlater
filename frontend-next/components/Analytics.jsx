'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  analyticsEnabled,
  createAnalyticsDispatcher,
  createProductionAnalyticsAdapter,
  normalizeAnalyticsRoute,
} from '../lib/analytics';
import { localeConfig } from '../lib/locales';

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function routeLocale(pathname) {
  const locale = String(pathname || '').split('/')[1];
  return localeConfig(locale) ? locale : 'en';
}

function routeEvent(pathname, locale) {
  const segments = String(pathname || '').split('/').filter(Boolean);
  if (segments[1] === 'personality' && segments[2]) return ['guide_view', { type: segments[2], locale }];
  if (segments[1] === 'careers' && segments[2]) return ['career_view', { type: segments[2], locale }];
  if (segments[1] === 'compare' && segments[2]) return ['compare_view', { pair: segments[2], locale }];
  if (segments[1] === 'insights' && ['communication', 'conflict', 'leadership', 'learning'].includes(segments[2]) && !segments[3]) return ['insight_view', { insight: segments[2], locale }];
  if (segments[1] === 'jobs' && segments[2] && segments[2] !== 'profile') return ['job_detail_view', { locale }];
  return null;
}

export function Analytics() {
  const pathname = usePathname();
  const dispatcher = useRef(null);

  useEffect(() => {
    const enabled = analyticsEnabled({
      environment: process.env.NODE_ENV,
      enabled: true,
      measurementId,
    });
    const adapter = enabled ? createProductionAnalyticsAdapter({ provider: 'ga4', measurementId }) : null;
    dispatcher.current = createAnalyticsDispatcher({
      adapter,
      enabled,
      environment: process.env.NODE_ENV,
      logger: console,
    });
  }, []);

  useEffect(() => {
    if (!dispatcher.current) return;
    const locale = routeLocale(pathname);
    dispatcher.current.dispatch('page_view', {
      route: normalizeAnalyticsRoute(pathname),
      locale,
    });
    const event = routeEvent(pathname, locale);
    if (event) dispatcher.current.dispatch(event[0], event[1]);
  }, [pathname]);

  return null;
}
