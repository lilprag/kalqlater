'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { analyticsEnabled, createAnalyticsDispatcher, createProductionAnalyticsAdapter } from '../lib/analytics';

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function dispatcherForBrowser() {
  const enabled = analyticsEnabled({ environment: process.env.NODE_ENV, enabled: true, measurementId });
  return createAnalyticsDispatcher({
    enabled,
    environment: process.env.NODE_ENV,
    adapter: enabled ? createProductionAnalyticsAdapter({ provider: 'ga4', measurementId }) : null,
    logger: console,
  });
}

export function recommendationAnalyticsProperties(item, sourceType) {
  return {
    source_type: sourceType,
    target_type: item.entityType,
    edge_kind: item.relationshipType,
    locale: item.locale,
  };
}

export function RelatedContentAnalytics({ sourceType, items }) {
  const dispatcher = useMemo(() => dispatcherForBrowser(), []);
  useEffect(() => {
    items.forEach((item) => dispatcher.dispatch('recommendation_impressed', recommendationAnalyticsProperties(item, sourceType)));
  }, [dispatcher, items, sourceType]);
  return null;
}

export function RecommendationLink({ item, sourceType, children, className }) {
  const dispatcher = useMemo(() => dispatcherForBrowser(), []);
  return <Link href={item.path} className={className} onClick={() => dispatcher.dispatch('recommendation_clicked', recommendationAnalyticsProperties(item, sourceType))}>{children}</Link>;
}
