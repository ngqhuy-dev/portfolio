import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/config/site';
import { projects } from '@/data/projects';
import { localizedPath, locales } from '@/i18n';

export const dynamic = 'force-static';

const ROUTES: { path: string; priority: number }[] = [
  { path: '/', priority: 1.0 },
  { path: '/about', priority: 0.8 },
  { path: '/portfolio', priority: 0.9 },
  { path: '/resume', priority: 0.9 },
  { path: '/contact', priority: 0.7 },
  ...projects.map(({ slug }) => ({ path: `/portfolio/${slug}`, priority: 0.6 })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.flatMap(({ path, priority }) => {
    const languages = Object.fromEntries(
      locales.map((locale) => [locale, absoluteUrl(localizedPath(locale, path))]),
    );
    return locales.map((locale) => ({
      url: absoluteUrl(localizedPath(locale, path)),
      lastModified,
      priority,
      alternates: { languages },
    }));
  });
}
