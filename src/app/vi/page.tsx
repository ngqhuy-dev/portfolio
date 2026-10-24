import { buildStaticPageMetadata } from '@/lib/metadata';
import { HomeView } from '@/views/HomeView';

export const metadata = buildStaticPageMetadata('vi', 'home', '/');

export default function HomePage() {
  return <HomeView locale="vi" />;
}
