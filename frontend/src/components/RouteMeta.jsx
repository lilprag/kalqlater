import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const privatePaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/community/profile', '/community/connections'];

export default function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    let robots = document.head.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', privatePaths.includes(pathname) || pathname.startsWith('/result/') || pathname.startsWith('/report/') ? 'noindex, nofollow' : 'index, follow');
  }, [pathname]);

  return null;
}
