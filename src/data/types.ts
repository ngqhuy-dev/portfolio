import type { Localized } from '@/i18n';

export type ProjectCategory = 'mobile' | 'fullstack' | 'realtime';

export interface Project {
  id: number;
  /** URL segment of the case-study page: /portfolio/<slug>. */
  slug: string;
  title: string;
  category: ProjectCategory;
  date: string;
  technologies: string[];
  summary: Localized;
  /** Hex color tinting the card cover. */
  accent?: string;
  /** Screenshots under public/, e.g. "/assets/img/projects/linora/feed.webp". */
  images: string[];
  /** Source URL, or "#" for a private repository. */
  github: string;
  live: string;
  content: Localized<string[]>;
}

export interface SkillGroup {
  title: Localized;
  skills: string[];
}
