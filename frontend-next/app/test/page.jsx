import Link from 'next/link';
import TestExperience from './TestExperience';

export const metadata = {
  title: 'Discover your personality type | KalQLater',
  description: 'Answer a few questions about how you usually think, decide, communicate, and approach everyday situations.',
  alternates: { canonical: '/test' },
};

export default function TestPage() {
  return (
    <div className="content-page test-page">
      <header className="content-header">
        <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">KalQLater</Link><span aria-hidden="true">/</span><span>Test</span></nav>
        <p className="eyebrow">Personality test</p>
        <h1>Discover your personality type</h1>
        <p className="content-subtitle">Answer a few questions about how you usually think, decide, communicate, and approach everyday situations.</p>
      </header>
      <main><TestExperience /></main>
    </div>
  );
}
