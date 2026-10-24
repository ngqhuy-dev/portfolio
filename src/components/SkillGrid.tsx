import type { SkillGroup } from '@/data/types';
import type { Locale } from '@/i18n';
import { BadgeList } from './BadgeList';
import styles from './SkillGrid.module.css';

export function SkillGrid({ groups, locale }: { groups: SkillGroup[]; locale: Locale }) {
  return (
    <div className={`${styles.grid} stagger`}>
      {groups.map(({ title, skills }) => (
        <div key={title.en} className={`card card-interactive ${styles.card}`}>
          <h3>{title[locale]}</h3>
          <BadgeList items={skills} className={styles.list} />
        </div>
      ))}
    </div>
  );
}
