import type { NextConfig } from 'next';

// Vercel serves the site from the domain root; GitHub Pages serves it under /<repo>.
// Explicit NEXT_PUBLIC_* values (set by CI or .env.local) always win over these defaults.
const isVercel = process.env.VERCEL === '1';
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : '';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (isVercel ? '' : '/portfolio');
// Preview deployments also point canonical URLs at production.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  vercelProductionUrl ||
  'https://ngqhuy-dev.github.io/portfolio';

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
    NEXT_PUBLIC_SITE_URL: siteUrl,
    NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
  },
};

export default nextConfig;
