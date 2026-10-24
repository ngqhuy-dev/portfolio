import { buildStaticPageMetadata } from '@/lib/metadata';
import { ResumeView } from '@/views/ResumeView';

export const metadata = buildStaticPageMetadata('en', 'resume', '/resume');

export default function ResumePage() {
  return <ResumeView locale="en" />;
}
