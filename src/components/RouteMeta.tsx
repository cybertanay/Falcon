import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE = 'Falcon International Traders';

// Page titles for static routes (WCAG 2.4.2). Product pages and legal pages set their own.
const TITLES: Record<string, string> = {
  '/': `${SITE} | Indian Spices & Agro-Commodity Export Desk`,
  '/products': `Export Products | ${SITE}`,
  '/about': `About Us | ${SITE}`,
  '/quality': `Quality & Specifications | ${SITE}`,
  '/export': `Export Process | ${SITE}`,
  '/private-label': `Private Label | ${SITE}`,
  '/contact': `Contact the Export Team | ${SITE}`,
  '/admin/login': `Staff Sign In | ${SITE}`
};

/**
 * Sets the document title per route and keeps the staff dashboard out of search engines.
 * The server also sends an X-Robots-Tag header for /admin paths.
 */
export function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
    if (TITLES[pathname]) {
      document.title = TITLES[pathname];
    } else if (isAdmin) {
      document.title = `Staff Dashboard | ${SITE}`;
    }

    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    robots.content = isAdmin ? 'noindex, nofollow' : 'index, follow';
  }, [pathname]);

  return null;
}
