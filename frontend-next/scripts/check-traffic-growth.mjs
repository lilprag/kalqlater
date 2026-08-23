import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { jobPostingSchema } from '../lib/job-seo.js';

const dataSource = await readFile(new URL('../data/career-guides.js', import.meta.url), 'utf8');
assert.equal((dataSource.match(/^ {2}[A-Z]{4}: \[/gm) || []).length, 16, 'Career registry must retain 16 canonical types');
const hubSource = await readFile(new URL('../components/careers/CareersHub.jsx', import.meta.url), 'utf8');
assert(hubSource.includes('guides.map((guide'), 'Careers hub must render every canonical career-guide child');
const staticSitemap = await readFile(new URL('../app/sitemap.js', import.meta.url), 'utf8');
assert(staticSitemap.includes("entry('en', 'careers'"), 'English Careers hub must enter the canonical sitemap');
assert(!staticSitemap.includes("entry('hi', 'careers'") && !staticSitemap.includes("entry('fr', 'careers'") && !staticSitemap.includes("entry('ja', 'careers'"), 'Unlocalized Careers hubs must remain unpublished');

const guideSource = await readFile(new URL('../components/careers/CareerGuide.jsx', import.meta.url), 'utf8');
assert(guideSource.includes('?q=${encodeURIComponent(guide.careers[0])}'), 'Career guide must transfer editable role intent');
assert(guideSource.includes("localePath(locale, 'careers')"), 'Career guide must link back to its published hub');

const sitemapRoute = await readFile(new URL('../app/sitemap-jobs.xml/route.js', import.meta.url), 'utf8');
assert(sitemapRoute.includes("status: 503"), 'Job sitemap dependency failure must be retryable');
assert(sitemapRoute.includes("/en/jobs/${job.slug}"), 'Job sitemap must expose English detail URLs only');
assert(sitemapRoute.includes('job.last_verified_at'), 'Job sitemap must use a trustworthy verification timestamp');

const job = { status: 'active', slug: 'example-role', title: 'Example role', description: 'Substantive description', company_name: 'Example', posted_at: '2026-08-01T00:00:00Z', last_verified_at: '2026-08-02T00:00:00Z', work_mode: 'onsite', city: 'Pune', country: 'India' };
const schema = jobPostingSchema(job, 'en');
for (const key of ['title', 'description', 'datePosted', 'hiringOrganization', 'jobLocation', 'url']) assert(schema[key], `JobPosting missing ${key}`);
assert.equal(jobPostingSchema({ ...job, status: 'closed' }, 'en'), null, 'Inactive job must not emit JobPosting');

console.log('Traffic Growth Batch 1 checks: PASS — 16 hub children, EN-only publication, intent transfer, sitemap safety, and JobPosting contract.');
