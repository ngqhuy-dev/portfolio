import type { Metadata } from 'next';
import { absoluteUrl, siteConfig } from '@/config/site';
import { getDictionary, type Locale, localizedPath, locales, ogLocales } from '@/i18n';

type PageKey = 'home' | 'about' | 'portfolio' | 'resume' | 'contact';

interface PageMetadataInput {
  locale: Locale;
  /** Locale-neutral route, e.g. "/about". */
  path: string;
  title?: string;
  description: string;
  /** Shorter copy for Open Graph / Twitter cards; falls back to `description`. */
  socialDescription?: string;
}

export function pageTitle(locale: Locale, title?: string): string {
  return title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} | ${getDictionary(locale).meta.jobTitle}`;
}

// URLs are built by hand because metadataBase drops its own sub-path when resolving "/about".
// Images come from each route's opengraph-image / twitter-image file.
export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  socialDescription = description,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(localizedPath(locale, path));
  const fullTitle = pageTitle(locale, title);
  const languages = Object.fromEntries(
    locales.map((code) => [code, absoluteUrl(localizedPath(code, path))]),
  );

  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: url,
      languages: { ...languages, 'x-default': absoluteUrl(path) },
    },
    openGraph: {
      type: 'website',
      url,
      title: fullTitle,
      description: socialDescription,
      siteName: siteConfig.name,
      locale: ogLocales[locale],
      alternateLocale: locales.filter((code) => code !== locale).map((code) => ogLocales[code]),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: socialDescription,
    },
  };
}

export function buildStaticPageMetadata(locale: Locale, page: PageKey, path: string): Metadata {
  const meta = getDictionary(locale).meta[page];
  return buildPageMetadata({
    locale,
    path,
    title: 'title' in meta ? meta.title : undefined,
    description: meta.description,
    socialDescription: meta.social,
  });
}
