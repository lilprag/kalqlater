import { CompareSelector } from '../../components/CompareSelector';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export const metadata = {
  title: 'Compare personalities',
  description: 'Choose two personality types to explore their relationship intelligence on KalQLater.',
  robots: { index: false, follow: true },
};

export default function CompareSelectorPage() {
  return <><Header locale="en" /><CompareSelector locale="en" mainId="main-content" /><Footer locale="en" /></>;
}
