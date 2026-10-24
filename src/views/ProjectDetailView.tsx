/* eslint-disable @next/next/no-img-element -- static export: next/image cannot optimize, screenshots ship pre-sized */
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { BadgeList } from '@/components/BadgeList';
import { ProjectCover, SourceLink } from '@/components/projects/ProjectCard';
import { absoluteUrl, assetPath, siteConfig } from '@/config/site';
import { getAdjacentProjects, hasPublicLink } from '@/data/projects';
import type { Project } from '@/data/types';
import { getDictionary, type Locale, localizedPath } from '@/i18n';
import styles from './ProjectDetailView.module.css';

export function ProjectDetailView({ project, locale }: { project: Project; locale: Locale }) {
  const t = getDictionary(locale).project;
  const adjacent = getAdjacentProjects(project.slug);
  const projectHref = (slug: string) => localizedPath(locale, `/portfolio/${slug}`);

  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary[locale],
    url: absoluteUrl(projectHref(project.slug)),
    inLanguage: locale,
    keywords: project.technologies.join(', '),
    author: { '@type': 'Person', name: siteConfig.name, url: absoluteUrl('/') },
  };

  return (
    <article className={`section ${styles.detail}`} aria-labelledby="project-heading">
      <JsonLd data={projectJsonLd} />
      <Link className={styles.back} href={localizedPath(locale, '/portfolio')}>
        {t.back}
      </Link>
      <p className="eyebrow">
        {project.category.toUpperCase()} • {project.date}
      </p>
      <h1 id="project-heading" className={styles.title}>
        {project.title}
      </h1>
      <p className={styles.lead}>{project.summary[locale]}</p>

      <ProjectCover project={project} className={`fade-in ${styles.cover}`} />

      <div className={styles.layout}>
        <section className="card" aria-labelledby="highlights-heading">
          <h2 id="highlights-heading" className={styles.cardTitle}>
            {t.highlights}
          </h2>
          <ul className="timeline-list">
            {project.content[locale].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <aside className={`card ${styles.aside}`} aria-label={t.overview}>
          <h2 className={styles.cardTitle}>{t.stack}</h2>
          <BadgeList items={project.technologies} />
          <div className={styles.links}>
            <SourceLink project={project} locale={locale} />
            {hasPublicLink(project.live) && (
              <a href={project.live} target="_blank" rel="noopener noreferrer">
                Live ↗
              </a>
            )}
          </div>
        </aside>
      </div>

      {project.images.length > 0 && (
        <section className={styles.gallery} aria-labelledby="gallery-heading">
          <h2 id="gallery-heading" className={styles.cardTitle}>
            {t.gallery}
          </h2>
          <div className="grid cols-2">
            {project.images.map((src, index) => (
              <img
                key={src}
                src={assetPath(src)}
                alt={`${project.title} — ${index + 1}`}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </section>
      )}

      {adjacent && (
        <nav className={styles.pager} aria-label={t.pagerLabel}>
          <Link href={projectHref(adjacent.previous.slug)} rel="prev">
            <span>← {t.previous}</span>
            <strong>{adjacent.previous.title}</strong>
          </Link>
          <Link href={projectHref(adjacent.next.slug)} rel="next" className={styles.next}>
            <span>{t.next} →</span>
            <strong>{adjacent.next.title}</strong>
          </Link>
        </nav>
      )}
    </article>
  );
}
