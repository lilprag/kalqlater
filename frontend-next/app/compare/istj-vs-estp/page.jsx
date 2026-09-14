import ComparisonArticle from '../../../components/ComparisonArticle';
import { comparisons } from '../../../content/comparisons';

const comparison = comparisons['istj-vs-estp'];

export const metadata = {
  title: `${comparison.title} | KalQLater`,
  description: comparison.quickAnswer,
  alternates: { canonical: `/compare/istj-vs-estp` },
};

export default function Page() {
  return <ComparisonArticle comparison={comparison} />;
}
