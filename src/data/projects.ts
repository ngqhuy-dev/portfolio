import rawProjects from './projects.json' with { type: 'json' };
import type { Project, ProjectCategory } from './types';

const CATEGORIES: readonly ProjectCategory[] = ['mobile', 'fullstack', 'realtime'];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isProjectCategory(value: string): value is ProjectCategory {
  return (CATEGORIES as readonly string[]).includes(value);
}

// Fails the build instead of shipping a broken card or case-study URL from a JSON typo.
function parseProjects(items: typeof rawProjects): Project[] {
  const slugs = new Set<string>();
  return items.map((item) => {
    if (!isProjectCategory(item.category)) {
      throw new Error(`projects.json: unknown category "${item.category}" for "${item.title}"`);
    }
    if (!SLUG_PATTERN.test(item.slug) || slugs.has(item.slug)) {
      throw new Error(`projects.json: invalid or duplicate slug "${item.slug}"`);
    }
    const images: string[] = item.images;
    const remoteImage = images.find((src) => !src.startsWith('/'));
    if (remoteImage) {
      throw new Error(`projects.json: "${remoteImage}" must be a local path under public/`);
    }
    slugs.add(item.slug);
    return { ...item, category: item.category, images };
  });
}

export const projects: Project[] = parseProjects(rawProjects);

export const FEATURED_PROJECT_COUNT = 3;

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Neighbours in list order, wrapping around, for the case-study pager. */
export function getAdjacentProjects(slug: string): { previous: Project; next: Project } | null {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1 || projects.length < 2) return null;
  const at = (offset: number) => projects[(index + offset + projects.length) % projects.length];
  const previous = at(-1);
  const next = at(1);
  return previous && next ? { previous, next } : null;
}

export function hasPublicLink(url: string | undefined): url is string {
  return Boolean(url) && url !== '#';
}

export function projectInitials(title: string): string {
  return title
    .split(/[\s—-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}
