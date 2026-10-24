import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { SkillGrid } from '@/components/SkillGrid';
import { TerminalPanel } from '@/components/TerminalPanel';
import { absoluteUrl, assetPath, siteConfig } from '@/config/site';
import { FEATURED_PROJECT_COUNT, projects } from '@/data/projects';
import { knowsAbout, skillGroups } from '@/data/skills';
import { getDictionary, type Locale, localizedPath } from '@/i18n';
import styles from './HomeView.module.css';

export function HomeView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const home = t.home;

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    jobTitle: t.meta.jobTitle,
    url: absoluteUrl(localizedPath(locale, '/')),
    email: siteConfig.email,
    address: { '@type': 'PostalAddress', addressLocality: 'Huế', addressCountry: 'VN' },
    sameAs: [siteConfig.links.github, siteConfig.links.bitbucket],
    knowsAbout,
  };

  return (
    <>
      <JsonLd data={personJsonLd} />
      <section
        className={`${styles.hero} fade-in`}
        aria-labelledby="hero-heading"
        data-status={home.status}
      >
        <div className={styles.intro}>
          <p className={`eyebrow ${styles.eyebrow}`}>{home.eyebrow}</p>
          <h1 id="hero-heading">{siteConfig.name}</h1>
          <p className={styles.subtitle}>
            <span>{home.subtitlePrefix}</span> <strong>React Native_</strong>
          </p>
          <p className={styles.lead}>{home.lead}</p>
          <div className={styles.actions}>
            <a
              className="btn btn-primary"
              href={assetPath(siteConfig.cv.path)}
              download={siteConfig.cv.downloadName}
            >
              {home.downloadCv}
            </a>
            <Link className="btn" href={localizedPath(locale, '/contact')}>
              {home.contactCta}
            </Link>
          </div>
          <div className={styles.stats}>
            {home.stats.map(({ value, label }) => (
              <div key={value} className={styles.stat}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <TerminalPanel label={home.panelLabel} signals={home.signals} />
      </section>

      <section className="section" aria-labelledby="projects-heading">
        <div className="section-head">
          <div>
            <p className="eyebrow">{home.projectsEyebrow}</p>
            <h2 id="projects-heading">{home.projectsHeading}</h2>
          </div>
        </div>
        <div className="grid cols-3" aria-label={home.featuredLabel}>
          {projects.slice(0, FEATURED_PROJECT_COUNT).map((project) => (
            <ProjectCard key={project.id} project={project} locale={locale} />
          ))}
        </div>
        <div className="section-cta">
          <Link className="btn" href={localizedPath(locale, '/portfolio')}>
            {home.allProjects}
          </Link>
        </div>
      </section>

      <section className="section" aria-labelledby="stack-heading">
        <div className="section-head">
          <div>
            <p className="eyebrow">{home.skillsEyebrow}</p>
            <h2 id="stack-heading">{home.skillsHeading}</h2>
          </div>
        </div>
        <SkillGrid groups={skillGroups} locale={locale} />
      </section>
    </>
  );
}
