import { SkillGrid } from '@/components/SkillGrid';
import { TerminalPanel } from '@/components/TerminalPanel';
import { skillGroups } from '@/data/skills';
import { getDictionary, type Locale } from '@/i18n';
import styles from './AboutView.module.css';

export function AboutView({ locale }: { locale: Locale }) {
  const { about, education } = getDictionary(locale);

  return (
    <>
      <section className={`section fade-in ${styles.profile}`} aria-labelledby="about-heading">
        <TerminalPanel label={about.panelLabel} signals={about.signals} />
        <div>
          <p className="eyebrow">{about.eyebrow}</p>
          <h1 id="about-heading">{about.heading}</h1>
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className={`grid cols-2 stagger ${styles.cards}`}>
            <div className="card card-interactive">
              <h3>{about.focusTitle}</h3>
              <ul className="timeline-list">
                {about.focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="card card-interactive">
              <h3>{about.educationTitle}</h3>
              <ul className={`timeline ${styles.education}`}>
                <li>
                  <strong>{education.degree}</strong> — {education.school}, {education.years}
                </li>
                <li>{education.detail}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="skills-heading">
        <div className="section-head">
          <div>
            <p className="eyebrow">{about.skillsEyebrow}</p>
            <h2 id="skills-heading">{about.skillsHeading}</h2>
          </div>
        </div>
        <SkillGrid groups={skillGroups} locale={locale} />
      </section>
    </>
  );
}
