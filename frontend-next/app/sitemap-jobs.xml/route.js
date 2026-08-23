import { jobsApiUrl } from '../../lib/jobs-api';
import { siteUrl } from '../../lib/site';

const escapeXml = (value) => String(value).replace(/[<>&'"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character]);
const trustworthyDate = (value) => { const date = new Date(value); return value && !Number.isNaN(date.valueOf()) ? date.toISOString() : null; };

export async function GET() {
  try {
    const response = await fetch(jobsApiUrl('/sitemap'), { cache: 'no-store' });
    if (!response.ok) throw new Error('Job inventory unavailable');
    const payload = await response.json();
    if (!Array.isArray(payload.items)) throw new Error('Invalid job sitemap inventory');
    const urls = payload.items.flatMap((job) => {
      if (!job?.slug || !job.posted_at || !job.last_verified_at) return [];
      const lastmod = trustworthyDate(job.last_verified_at) || trustworthyDate(job.posted_at);
      return [`<url><loc>${escapeXml(`${siteUrl()}/en/jobs/${job.slug}`)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`];
    });
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`, { status: 200, headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=900, stale-while-revalidate=3600' } });
  } catch {
    return new Response('Job sitemap temporarily unavailable', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Retry-After': '900', 'Cache-Control': 'no-store' } });
  }
}
