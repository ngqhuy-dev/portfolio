import type { Metadata } from 'next';
import Link from 'next/link';
import { rootViewport, SiteShell } from '@/components/layout/SiteShell';
import { siteConfig } from '@/config/site';
import { getDictionary, localizedPath } from '@/i18n';
import hero from '@/styles/hero.module.css';

const en = getDictionary('en').notFound;
const vi = getDictionary('vi').notFound;

export const metadata: Metadata = {
  title: `${en.title} | ${siteConfig.name}`,
  robots: { index: false, follow: true },
};

export const viewport = rootViewport;

// One 404.html serves both locales, so the message is shown in both languages.
export default function GlobalNotFound() {
  return (
    <SiteShell locale="en">
      <section className={hero.hero} aria-labelledby="not-found-heading">
        <div>
          <p className="eyebrow">{en.eyebrow}</p>
          <h1 id="not-found-heading">{en.heading}</h1>
          <p className={hero.lead}>{en.body}</p>
          <p className={hero.lead} lang="vi">
            {vi.body}
          </p>
          <div className={hero.actions}>
            <Link className="btn btn-primary" href="/">
              {en.home}
            </Link>
            <Link className="btn" href="/portfolio">
              {en.projects}
            </Link>
            <Link className="btn" href={localizedPath('vi', '/')} lang="vi">
              {vi.home}
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
