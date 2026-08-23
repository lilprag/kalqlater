import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '../../../../components/JsonLd';
import { JobActions } from '../../../../components/JobActions';
import { TrafficIntentLink } from '../../../../components/TrafficIntentLink';
import { fetchJobs, JobsApiError } from '../../../../lib/jobs-api';
import { jobPostingSchema } from '../../../../lib/job-seo';

export const dynamic = 'force-dynamic';
async function job(slug) { try { return await fetchJobs(`/${slug}`); } catch (error) { if (error instanceof JobsApiError && error.status === 404) return null; throw error; } }
async function relatedJobs(current) {
  try {
    const query = new URLSearchParams({ posted_within: '30', limit: '5' });
    if (current.department) query.set('department', current.department);
    else query.set('keyword', current.title.split(/\s+/).slice(0, 2).join(' '));
    const data = await fetchJobs(`?${query}`);
    return (data.items || []).filter((item) => item.id !== current.id && item.status === 'active').slice(0, 3);
  } catch { return []; }
}
export async function generateMetadata({ params }) { const { locale, slug } = await params, current = await job(slug); if (!current) return { robots: { index: false, follow: false } }; const indexable = locale === 'en' && current.status === 'active' && Boolean(current.posted_at && current.last_verified_at && jobPostingSchema(current, locale)); return { title: `${current.title} at ${current.company_name} | KalQLater Jobs`, description: (current.description || '').slice(0, 155), alternates: { canonical: `https://kalqlater.com/${locale}/jobs/${slug}` }, robots: { index: indexable, follow: indexable } }; }
export default async function JobPage({ params }) {
  const { locale, slug } = await params, current = await job(slug); if (!current) notFound();
  const schema = locale === 'en' ? jobPostingSchema(current, locale) : null;
  const related = current.status === 'active' ? await relatedJobs(current) : [];
  return <>{schema ? <JsonLd data={schema} /> : null}<main className="mx-auto max-w-5xl px-4 py-12"><nav aria-label="Breadcrumb" className="mb-5 text-sm text-brand-subtle"><Link href={`/${locale}`}>KalQLater</Link><span aria-hidden="true"> / </span><Link href={`/${locale}/jobs`}>Jobs</Link><span aria-hidden="true"> / </span>{current.title}</nav><header className="rounded-[2rem] bg-brand-ink p-8 text-white"><p className="section-kicker text-brand-sand">{current.company_name} · {current.source_name}</p><h1 className="display-font mt-3 text-4xl sm:text-6xl">{current.title}</h1><p className="mt-4">{current.location_text || 'Location not specified'} · {current.work_mode} · Posted {current.posted_age_days} days ago</p><p className="mt-2 text-white/70">Verified {new Date(current.last_verified_at).toLocaleString()}</p><div className="mt-7"><JobActions jobId={current.id} applyUrl={current.external_apply_url} locale={locale} slug={slug} /></div></header>{current.status !== 'active' && <p className="mt-6 rounded-2xl bg-brand-sand p-5">This role is no longer listed as active. Applications may be unavailable.</p>}<section className="mt-10 grid gap-8 lg:grid-cols-[1fr_.35fr]"><article><h2 className="display-font text-3xl">About the role</h2><p className="mt-4 whitespace-pre-line leading-relaxed">{current.description}</p><h2 className="display-font mt-10 text-3xl">Requirements</h2><p className="mt-4 whitespace-pre-line leading-relaxed">{current.requirements_text}</p></article><aside><h2 className="font-bold">Skills</h2><div className="mt-3 flex flex-wrap gap-2">{(current.skills || []).map((skill) => <span className="rounded-full bg-brand-cream px-3 py-2 text-sm" key={skill}>{skill}</span>)}</div><p className="mt-8 text-sm">Source: <a className="underline" href={current.source_url} rel="nofollow">{current.source_name}</a></p><Link className="button-secondary mt-6" href="/en/careers">Explore career direction</Link></aside></section>{related.length ? <section className="mt-14"><p className="section-kicker">Related opportunities</p><h2 className="display-font mt-2 text-3xl">More roles worth comparing</h2><div className="mt-5 grid gap-4 md:grid-cols-3">{related.map((item) => <TrafficIntentLink key={item.id} href={`/${locale}/jobs/${item.slug}`} locale={locale} fromEntity="jobs:detail" toEntity="jobs:detail" className="rounded-2xl border border-brand-line bg-white p-5"><p className="text-sm font-semibold text-brand-teal">{item.company_name}</p><h3 className="mt-2 font-bold text-brand-ink">{item.title}</h3><p className="mt-2 text-sm text-brand-subtle">{item.location_text || 'Location not specified'}</p></TrafficIntentLink>)}</div></section> : null}</main></>;
}
