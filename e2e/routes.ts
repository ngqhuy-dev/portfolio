import { projects } from '../src/data/projects';
import { localizedPath, locales } from '../src/i18n/config';

const STATIC_PATHS = ['/', '/about', '/portfolio', '/resume', '/contact'];

/** Every exported page as a path relative to the Playwright baseURL, e.g. "vi/about/". */
export const allPages = locales.flatMap((locale) =>
  [...STATIC_PATHS, ...projects.map(({ slug }) => `/portfolio/${slug}`)].map((path) => {
    const url = localizedPath(locale, path);
    return { locale, path, url: url === '/' ? './' : `${url.slice(1)}/` };
  }),
);

export function pageUrl(locale: (typeof locales)[number], path: string): string {
  return allPages.find((page) => page.locale === locale && page.path === path)?.url ?? './';
}
