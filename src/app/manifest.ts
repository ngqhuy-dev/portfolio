import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

// Relative paths resolve against the manifest URL, so they follow the deploy sub-path.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nguyễn Quốc Huy — Frontend Developer',
    short_name: 'Quốc Huy',
    start_url: './',
    display: 'browser',
    background_color: '#050505',
    theme_color: '#050505',
    icons: [
      { src: 'assets/img/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'assets/img/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
