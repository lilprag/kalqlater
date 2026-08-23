'use client';

import Link from 'next/link';
import { dispatchBrowserAnalytics } from '../lib/analytics';

export function TrafficIntentLink({ href, locale, fromEntity, toEntity, children, ...props }) {
  return <Link {...props} href={href} onClick={() => dispatchBrowserAnalytics('journey_continue', {
    from_entity: fromEntity,
    to_entity: toEntity,
    locale,
  })}>{children}</Link>;
}
