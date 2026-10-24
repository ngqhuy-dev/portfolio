import Link from 'next/link';
import { BadgeList } from '@/components/BadgeList';
import { assetPath, siteConfig } from '@/config/site';
import { experiences } from '@/data/experience';
import { allSkills } from '@/data/skills';
import { getDictionary, type Locale, localizedPath } from '@/i18n';
import styles from './ResumeView.module.css';

export function ResumeView({ locale }: { locale: Locale }) {
  const { resume: t, education } = getDictionary(locale);

  return (
    <section className="section" aria-labelledby="resume-heading">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1 id="resume-heading">{t.heading}</h1>
      <div className={styles.actions}>
        <a
          className="btn btn-primary"
          href={assetPath(siteConfig.cv.path)}
          download={siteConfig.cv.downloadName}
          aria-label={t.downloadCvLabel}
        >
          {t.downloadCv}
        </a>
        <Link className="btn" href={localizedPath(locale, '/contact')}>
          {t.contactCta}
        </Link>
      </div>
      <div className={`${styles.grid} stagger`}>
        <div className="card">
          <h3>{t.contactTitle}</h3>
          <p>
            <strong>{t.email}</strong> <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </p>
          <p>
            <strong>{t.location}</strong> {siteConfig.location}
          </p>
          <p>
            <strong>GitHub:</strong>{' '}
            <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
              github.com/ngqhuy-dev
            </a>
          </p>
          <p>
            <strong>Bitbucket:</strong>{' '}
            <a href={siteConfig.links.bitbucket} target="_blank" rel="noopener noreferrer">
              {t.bitbucketProject}
            </a>
          </p>
        </div>
        <div className={`${styles.stack} stagger`}>
          <div className={`card ${styles.section}`}>
            <h3>{t.experienceTitle}</h3>
            <ul className="timeline">
              {experiences.map((item) => (
                <li
                  key={`${item.period.en}-${item.organization.en}`}
                  className={styles.timelineItem}
                >
                  <div className={styles.timelineMeta}>
                    {item.period[locale]} · {item.organization[locale]}
                  </div>
                  <div className={styles.timelineTitle}>{item.role[locale]}</div>
                  {item.summary && <p>{item.summary[locale]}</p>}
                  <ul className="timeline-list">
                    {item.highlights.map(({ lead, text }) => (
                      <li key={lead ?? text.en}>
                        {lead && (
                          <>
                            <strong>{lead}</strong>{' '}
                          </>
                        )}
                        {text[locale]}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          <div className={`card ${styles.section}`}>
            <h3>{t.educationTitle}</h3>
            <p>
              <strong>{education.school}</strong> — {education.degree}, {education.years}
            </p>
            <p>{education.detail}</p>
          </div>
          <div className={`card ${styles.section}`}>
            <h3>{t.skillsTitle}</h3>
            <BadgeList items={allSkills} className={styles.skills} />
          </div>
        </div>
      </div>
    </section>
  );
}
