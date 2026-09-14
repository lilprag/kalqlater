import Link from 'next/link';

export const metadata = {
  title: 'Personality insights for reflection and growth | KalQLater',
  description: 'KalQLater is an original personality insight platform for reflection, growth, and community.',
  alternates: { canonical: '/' },
};

function StartButton() {
  return (
    <Link className="button" href="/test">
      Start free test
      <span aria-hidden="true">→</span>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="page-shell">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="KalQLater home">KalQLater</Link>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <p className="eyebrow">Reflection · Growth · Community</p>
            <h1 id="hero-heading">Personality insights for reflection and growth</h1>
            <p className="hero-text">KalQLater is an original personality insight platform for reflection, growth, and community.</p>
            <StartButton />
          </div>

          <div className="pattern-mark" aria-hidden="true">
            <span className="orbit orbit-one" />
            <span className="orbit orbit-two" />
            <span className="orbit orbit-three" />
            <span className="center-mark">K</span>
          </div>
        </section>

        <section className="supporting" aria-labelledby="patterns-heading">
          <p className="section-number" aria-hidden="true">01</p>
          <div>
            <h2 id="patterns-heading">Understand your patterns. Use them better.</h2>
            <p>Personality is not a box to fit into. KalQLater is designed to help you notice the patterns behind how you think, decide, communicate and relate to other people — so you can use that understanding in real life.</p>
          </div>
        </section>

        <section className="closing" aria-labelledby="closing-heading">
          <div>
            <p className="eyebrow">Your next step</p>
            <h2 id="closing-heading">Ready? Begin now</h2>
          </div>
          <div className="closing-action">
            <p>There is no right type. There is only a more useful way to understand your patterns.</p>
            <StartButton />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>KalQLater presents personality preferences as a starting point for self-understanding. It is not a clinical, medical, employment, or compatibility assessment.</p>
      </footer>
    </div>
  );
}
