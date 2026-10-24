'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { navItems, siteConfig } from '@/config/site';
import {
  getDictionary,
  type Locale,
  localeLabels,
  localizedPath,
  locales,
  stripLocale,
} from '@/i18n';
import styles from './Header.module.css';

const MOBILE_MENU_ID = 'mobile-menu';

function isActiveRoute(currentPath: string, href: string): boolean {
  return href === '/' ? currentPath === '/' : currentPath.startsWith(href);
}

interface NavListProps {
  locale: Locale;
  currentPath: string;
  onNavigate?: () => void;
}

function NavList({ locale, currentPath, onNavigate }: NavListProps) {
  const labels = getDictionary(locale).layout.nav;
  return (
    <ul>
      {navItems.map(({ href, key }) => {
        const isActive = isActiveRoute(currentPath, href);
        return (
          <li key={href}>
            <Link
              href={localizedPath(locale, href)}
              className={isActive ? styles.active : undefined}
              aria-current={isActive ? 'page' : undefined}
              onClick={onNavigate}
            >
              {labels[key]}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function Header({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).layout;
  const { path: currentPath } = stripLocale(usePathname());
  const otherLocale = locales.find((code) => code !== locale) ?? locale;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    if (!isMenuOpen) return;

    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setIsMenuOpen(false);
      toggleRef.current?.focus();
    }

    function handleClick(event: MouseEvent) {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || toggleRef.current?.contains(target)) return;
      setIsMenuOpen(false);
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, [isMenuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.nav}>
        <div className={styles.logo}>
          <Link href={localizedPath(locale, '/')}>
            {siteConfig.name}
            <span className={styles.logoAccent}>.dev</span>
          </Link>
        </div>
        <div className={styles.actions}>
          <nav className={styles.desktopNav} aria-label={t.mainNav}>
            <NavList locale={locale} currentPath={currentPath} />
          </nav>
          <Link
            className={styles.languageSwitch}
            href={localizedPath(otherLocale, currentPath)}
            hrefLang={otherLocale}
            lang={otherLocale}
            aria-label={`${localeLabels[otherLocale]} — ${t.switchLanguage}`}
            title={t.switchLanguage}
          >
            {localeLabels[otherLocale]}
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className={styles.hamburger}
            aria-controls={MOBILE_MENU_ID}
            aria-expanded={isMenuOpen}
            aria-label={t.toggleMenu}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
      <div
        ref={menuRef}
        id={MOBILE_MENU_ID}
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}
        role="navigation"
        aria-label={t.mobileNav}
      >
        <NavList locale={locale} currentPath={currentPath} onNavigate={closeMenu} />
      </div>
    </header>
  );
}
