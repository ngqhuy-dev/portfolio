import { buildStaticPageMetadata } from '@/lib/metadata';
import { AboutView } from '@/views/AboutView';

export const metadata = buildStaticPageMetadata('en', 'about', '/about');

export default function AboutPage() {
  return <AboutView locale="en" />;
}
