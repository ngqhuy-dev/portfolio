import { ogContentType, ogSize, renderPageOgImage } from '@/lib/og';

export const dynamic = 'force-static';
export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Kinh nghiệm của Nguyễn Quốc Huy';

export default function Image() {
  return renderPageOgImage('vi', 'resume');
}
