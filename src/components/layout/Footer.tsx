'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { assetPath, siteConfig } from '@/config/site';
import { getDictionary, type Locale, localizedPath, stripLocale } from '@/i18n';
import styles from './Footer.module.css';

// Inlined by next.config so server HTML and client hydration always agree.
const BUILD_YEAR = process.env.NEXT_PUBLIC_BUILD_YEAR;

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).layout;
  const isResumePage = stripLocale(usePathname()).path === '/resume';

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div>
          © {BUILD_YEAR} {siteConfig.name}
        </div>
        <div className={styles.links}>
          <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={`mailto:${siteConfig.email}`}>Email</a>
          {isResumePage ? (
            <a href={assetPath(siteConfig.cv.path)} download={siteConfig.cv.downloadName}>
              {t.footerCv}
            </a>
          ) : (
            <Link href={localizedPath(locale, '/resume')}>{t.nav.resume}</Link>
          )}
        </div>
      </div>
    </footer>
  );
}
