export const locales = ['en', 'vi'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeLabels: Record<Locale, string> = { en: 'EN', vi: 'VI' };

export const ogLocales: Record<Locale, string> = { en: 'en_US', vi: 'vi_VN' };

/** Locale-neutral path ("/about") → URL path for that locale ("/vi/about"). EN keeps the legacy URLs. */
export function localizedPath(locale: Locale, path: string): string {
  if (locale === defaultLocale) return path;
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

/** URL path for a locale → locale-neutral path. Inverse of localizedPath. */
export function stripLocale(rawPathname: string): { locale: Locale; path: string } {
  const pathname = rawPathname.length > 1 ? rawPathname.replace(/\/+$/, '') : rawPathname;
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (pathname === `/${locale}`) return { locale, path: '/' };
    if (pathname.startsWith(`/${locale}/`)) {
      return { locale, path: pathname.slice(locale.length + 1) };
    }
  }
  return { locale: defaultLocale, path: pathname };
}
