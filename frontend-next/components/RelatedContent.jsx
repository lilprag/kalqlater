import { recommendationService } from '../lib/recommendation-service';
import { buildRelatedContentModel } from '../lib/related-content';
import { RelatedContentAnalytics, RecommendationLink } from './RelatedContentAnalytics';

/** Server-rendered internal links backed exclusively by PR-006 responses. */
export function RelatedContent({ sourceEntityId, sourceType, locale, mode = 'public', service = recommendationService }) {
  const model = buildRelatedContentModel({ sourceEntityId, sourceType, locale, mode, service });
  if (!model) return null;
  const { copy, primary, secondary } = model;
  const items = [primary, ...secondary];
  return <section aria-labelledby={`related-content-${sourceEntityId.replace(/[^a-z0-9]/gi, '-')}`} className="mt-14 rounded-[2rem] border border-brand-line bg-brand-cream/70 p-6 sm:p-8">
    <RelatedContentAnalytics sourceType={sourceType === 'result' ? 'insight' : sourceType} items={items} />
    <p className="section-kicker">KalQLater</p>
    <h2 id={`related-content-${sourceEntityId.replace(/[^a-z0-9]/gi, '-')}`} className="display-font mt-2 text-3xl text-brand-ink">{copy.heading}</h2>
    <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
      <article className="rounded-3xl bg-brand-ink p-6 text-white sm:p-7"><p className="text-xs font-bold uppercase tracking-[.14em] text-brand-sand">{copy.primary}</p><RecommendationLink item={primary} sourceType={sourceType === 'result' ? 'insight' : sourceType} className="display-font mt-3 block break-words text-3xl text-white underline decoration-brand-sand/70 underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-sand">{primary.label}</RecommendationLink></article>
      <div className="grid gap-3">{secondary.map((item) => <article key={item.entityId} className="rounded-2xl border border-brand-line bg-white p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-brand-teal">{copy.secondary}</p><RecommendationLink item={item} sourceType={sourceType === 'result' ? 'insight' : sourceType} className="mt-2 block break-words font-semibold text-brand-ink underline decoration-brand-teal/40 underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal">{item.label}</RecommendationLink></article>)}</div>
    </div>
  </section>;
}
