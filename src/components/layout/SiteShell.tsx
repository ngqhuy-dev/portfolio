import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Analytics } from '@/components/Analytics';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { absoluteUrl, siteConfig } from '@/config/site';
import { getDictionary, type Locale } from '@/i18n';
import { buildStaticPageMetadata } from '@/lib/metadata';
import { fontVariables } from '@/styles/fonts';
import '@/styles/globals.css';

export function buildRootMetadata(locale: Locale): Metadata {
  return {
    ...buildStaticPageMetadata(locale, 'home', '/'),
    // Resolves the file-based opengraph-image URLs; includes the deploy sub-path.
    metadataBase: new URL(absoluteUrl('/')),
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name, url: absoluteUrl('/') }],
    referrer: 'strict-origin-when-cross-origin',
    formatDetection: { telephone: false },
  };
}

export const rootViewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
};

/** Shared <html> shell for the per-locale root layouts. */
export function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = getDictionary(locale).layout;
  const { plausibleDomain, plausibleSrc } = siteConfig.analytics;

  return (
    <html lang={locale} className={fontVariables}>
      <body>
        <a className="skip-link" href="#main">
          {t.skipLink}
        </a>
        <Header locale={locale} />
        <main id="main" tabIndex={-1}>
          <div className="container">{children}</div>
        </main>
        <Footer locale={locale} />
        {plausibleDomain && <Analytics domain={plausibleDomain} src={plausibleSrc} />}
      </body>
    </html>
  );
}
