import { ogContentType, ogSize, renderPageOgImage } from '@/lib/og';

export const dynamic = 'force-static';
export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Nguyễn Quốc Huy — Frontend Developer';

export default function Image() {
  return renderPageOgImage('vi', 'home');
}
