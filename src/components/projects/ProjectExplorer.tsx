'use client';

import { useState } from 'react';
import type { Project, ProjectCategory } from '@/data/types';
import { getDictionary, type Locale } from '@/i18n';
import { ProjectCard } from './ProjectCard';
import styles from './ProjectExplorer.module.css';

type Filter = 'all' | ProjectCategory;

const FILTERS: Filter[] = ['all', 'mobile', 'fullstack', 'realtime'];

export function ProjectExplorer({ projects, locale }: { projects: Project[]; locale: Locale }) {
  const t = getDictionary(locale).portfolio;
  const [filter, setFilter] = useState<Filter>('all');
  const visibleProjects =
    filter === 'all' ? projects : projects.filter((project) => project.category === filter);

  return (
    <>
      <div className={styles.filters} role="group" aria-label={t.filterLabel}>
        {FILTERS.map((value) => {
          const isActive = value === filter;
          return (
            <button
              key={value}
              type="button"
              className={`btn ${isActive ? styles.active : ''}`}
              aria-pressed={isActive}
              onClick={() => setFilter(value)}
            >
              {t.filters[value]}
            </button>
          );
        })}
      </div>
      <div className={`grid cols-3 ${styles.list}`} aria-live="polite" aria-label={t.listLabel}>
        {visibleProjects.map((project) => (
          <ProjectCard key={project.id} project={project} locale={locale} />
        ))}
      </div>
    </>
  );
}
