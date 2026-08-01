import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const privatePaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/community/profile', '/community/me', '/community/connections', '/community/messages', '/community/jobs/new', '/community/jobs/mine'];

export default function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    let robots = document.head.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    const isPrivate = privatePaths.includes(pathname) || (pathname.startsWith('/community/jobs/') && pathname.endsWith('/edit')) || pathname.startsWith('/result/') || pathname.startsWith('/report/');
    robots.setAttribute('content', isPrivate ? 'noindex, nofollow' : 'index, follow');
  }, [pathname]);

  return null;
}
