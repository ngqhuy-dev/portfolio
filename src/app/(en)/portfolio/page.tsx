import { buildStaticPageMetadata } from '@/lib/metadata';
import { PortfolioView } from '@/views/PortfolioView';

export const metadata = buildStaticPageMetadata('en', 'portfolio', '/portfolio');

export default function PortfolioPage() {
  return <PortfolioView locale="en" />;
}
