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
    dispatcher.current.dispatch('page_view', {
      route: normalizeAnalyticsRoute(pathname),
      locale: routeLocale(pathname),
    });
  }, [pathname]);

  return null;
}
