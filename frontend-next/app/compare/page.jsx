import Link from 'next/link';
import { comparisons } from '../../content/comparisons';

export const metadata = {
  title: 'Compare personality types | KalQLater',
  description: 'Explore how different personality types may communicate, make decisions, handle conflict, work together, and experience relationships.',
  alternates: { canonical: '/compare' },
};

const availableComparisons = Object.values(comparisons);

export default function ComparePage() {
  return (
    <div className="content-page compare-hub">
      <header className="content-header">
        <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">KalQLater</Link><span aria-hidden="true">/</span><span>Compare</span></nav>
        <p className="eyebrow">Personality comparisons</p>
        <h1>Compare personality types</h1>
        <p className="content-subtitle">Explore how different personality types may communicate, make decisions, handle conflict, work together, and experience relationships.</p>
      </header>

      <main className="comparison-grid" aria-label="Available comparisons">
        {availableComparisons.map((comparison, index) => (
          <Link className="comparison-card" href={`/compare/${comparison.slug}`} key={comparison.slug}>
            <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
            <h2>{comparison.title.split(':')[0]}</h2>
            <p>{comparison.subtitle}</p>
            <span className="card-link">Read comparison <span aria-hidden="true">→</span></span>
          </Link>
        ))}
      </main>
    </div>
  );
}
