import type { NextConfig } from 'next';

// GitHub Pages serves the site under /portfolio; set NEXT_PUBLIC_BASE_PATH="" for a root domain.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/portfolio';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  // Pages export as <route>/index.html: a sibling <route>.html would collide with the <route>/ data folder.
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
  // Two root layouts (EN at "/", VI at "/vi") leave no single layout for an app-wide 404.
  experimental: { globalNotFound: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
  },
};

export default nextConfig;
