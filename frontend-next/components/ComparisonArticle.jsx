import Link from 'next/link';

export default function ComparisonArticle({ comparison }) {
  return (
    <div className="content-page">
      <header className="content-header">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">KalQLater</Link>
          <span aria-hidden="true">/</span>
          <Link href="/compare">Compare</Link>
        </nav>
        <p className="eyebrow">Personality comparison</p>
        <h1>{comparison.title}</h1>
        <p className="content-subtitle">{comparison.subtitle}</p>
      </header>

      <main className="article-layout">
        <article className="comparison-article">
          <section className="quick-answer" aria-labelledby="quick-answer-heading">
            <h2 id="quick-answer-heading">Quick answer</h2>
            <p>{comparison.quickAnswer}</p>
          </section>

          {comparison.sections.map((section, index) => (
            <section className={section.heading === 'Bottom line' ? 'article-section bottom-line' : 'article-section'} key={`${section.heading}-${index}`}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets.length > 0 && (
                <ul>
                  {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              )}
            </section>
          ))}
        </article>

        <aside className="article-actions" aria-label="Continue exploring">
          <p>Not sure which type you are? Take the personality test</p>
          <Link className="button" href="/test">Start free test <span aria-hidden="true">→</span></Link>
          <Link className="back-link" href="/compare">← Back to all comparisons</Link>
        </aside>
      </main>
    </div>
  );
}
