import { buildStaticPageMetadata } from '@/lib/metadata';
import { AboutView } from '@/views/AboutView';

export const metadata = buildStaticPageMetadata('vi', 'about', '/about');

export default function AboutPage() {
  return <AboutView locale="vi" />;
}
