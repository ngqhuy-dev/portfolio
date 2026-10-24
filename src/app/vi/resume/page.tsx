import { buildStaticPageMetadata } from '@/lib/metadata';
import { ResumeView } from '@/views/ResumeView';

export const metadata = buildStaticPageMetadata('vi', 'resume', '/resume');

export default function ResumePage() {
  return <ResumeView locale="vi" />;
}
