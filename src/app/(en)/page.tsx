import { buildStaticPageMetadata } from '@/lib/metadata';
import { HomeView } from '@/views/HomeView';

export const metadata = buildStaticPageMetadata('en', 'home', '/');

export default function HomePage() {
  return <HomeView locale="en" />;
}
