import { buildStaticPageMetadata } from '@/lib/metadata';
import { ContactView } from '@/views/ContactView';

export const metadata = buildStaticPageMetadata('en', 'contact', '/contact');

export default function ContactPage() {
  return <ContactView locale="en" />;
}
