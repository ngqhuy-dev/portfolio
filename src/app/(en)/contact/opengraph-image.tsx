import { ogContentType, ogSize, renderPageOgImage } from '@/lib/og';

export const dynamic = 'force-static';
export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Contact Nguyễn Quốc Huy';

export default function Image() {
  return renderPageOgImage('en', 'contact');
}
