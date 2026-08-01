const measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;
const enabled = process.env.NODE_ENV === 'production' && Boolean(measurementId);
let initialized = false;
let lastPagePath = '';
const dispatchedEvents = new Set();

export function initializeAnalytics() {
  if (!enabled || initialized) return false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  // Page views are sent explicitly on route changes, avoiding the default duplicate.
  window.gtag('config', measurementId, { send_page_view: false });

  const script = document.createElement('script');
  script.id = 'ga4-gtag-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
  initialized = true;
  return true;
}

export function trackPageView(path) {
  if (!enabled || lastPagePath === path) return;
  initializeAnalytics();
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
  lastPagePath = path;
}

/** Tracks product interactions only. Callers must never pass personal data. */
export function trackEvent(name, parameters = {}, dedupeKey) {
  if (!enabled) return;
  if (dedupeKey && dispatchedEvents.has(dedupeKey)) return;
  initializeAnalytics();
  window.gtag('event', name, parameters);
  if (dedupeKey) dispatchedEvents.add(dedupeKey);
}
