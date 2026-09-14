import ComparisonArticle from '../../../components/ComparisonArticle';
import { comparisons } from '../../../content/comparisons';

const comparison = comparisons['istj-vs-isfp'];

export const metadata = {
  title: `${comparison.title} | KalQLater`,
  description: comparison.quickAnswer,
  alternates: { canonical: `/compare/istj-vs-isfp` },
};

export default function Page() {
  return <ComparisonArticle comparison={comparison} />;
}
