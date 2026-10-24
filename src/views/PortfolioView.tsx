import { ProjectExplorer } from '@/components/projects/ProjectExplorer';
import { projects } from '@/data/projects';
import { getDictionary, type Locale } from '@/i18n';

export function PortfolioView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).portfolio;

  return (
    <section className="section" aria-labelledby="projects-heading">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1 id="projects-heading">{t.heading}</h1>
      <p>{t.intro}</p>
      <ProjectExplorer projects={projects} locale={locale} />
    </section>
  );
}
