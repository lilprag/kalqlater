import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../services/analytics';

export default function Analytics() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    trackPageView(`${pathname}${search}${hash}`);
  }, [pathname, search, hash]);

  return null;
}
