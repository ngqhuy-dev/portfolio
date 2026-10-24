import { buildStaticPageMetadata } from '@/lib/metadata';
import { ContactView } from '@/views/ContactView';

export const metadata = buildStaticPageMetadata('vi', 'contact', '/contact');

export default function ContactPage() {
  return <ContactView locale="vi" />;
}
