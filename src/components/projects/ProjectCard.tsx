import Link from 'next/link';
import type { CSSProperties } from 'react';
import { BadgeList } from '@/components/BadgeList';
import { hasPublicLink, projectInitials } from '@/data/projects';
import type { Project } from '@/data/types';
import { getDictionary, type Locale, localizedPath } from '@/i18n';
import styles from './ProjectCard.module.css';

type CoverStyle = CSSProperties & { '--project-accent'?: string };

export function ProjectCover({ project, className }: { project: Project; className?: string }) {
  const coverStyle: CoverStyle | undefined = project.accent
    ? { '--project-accent': project.accent }
    : undefined;

  return (
    <div className={`${styles.cover} ${className ?? ''}`} style={coverStyle} aria-hidden="true">
      <span className={styles.coverLabel}>~/{project.category}</span>
      <span className={styles.coverMark}>{projectInitials(project.title)}</span>
    </div>
  );
}

export function SourceLink({ project, locale }: { project: Project; locale: Locale }) {
  const t = getDictionary(locale).project;
  if (!hasPublicLink(project.github)) {
    return <span className={styles.private}>{t.privateRepo}</span>;
  }
  return (
    <a
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.sourceLabel(project.title)}
    >
      {t.source}
    </a>
  );
}

export function ProjectCard({ project, locale }: { project: Project; locale: Locale }) {
  const t = getDictionary(locale).project;

  return (
    <article className={`card ${styles.card}`}>
      <ProjectCover project={project} />
      <div className={styles.body}>
        <div className={styles.meta}>
          {project.category.toUpperCase()} • {project.date}
        </div>
        <h3>{project.title}</h3>
        <p className={styles.summary}>{project.summary[locale]}</p>
        <BadgeList items={project.technologies} className={styles.badges} />
        <div className={styles.footer}>
          <SourceLink project={project} locale={locale} />
          <Link
            href={localizedPath(locale, `/portfolio/${project.slug}`)}
            aria-label={t.caseStudyLabel(project.title)}
          >
            {t.caseStudy}
          </Link>
        </div>
      </div>
    </article>
  );
}
