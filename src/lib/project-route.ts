import type { Metadata } from 'next';
import { getProject, projects } from '@/data/projects';
import type { Locale } from '@/i18n';
import { buildPageMetadata } from './metadata';

export interface ProjectRouteProps {
  params: Promise<{ slug: string }>;
}

export function projectStaticParams(): { slug: string }[] {
  return projects.map(({ slug }) => ({ slug }));
}

export async function projectMetadata(
  locale: Locale,
  { params }: ProjectRouteProps,
): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return buildPageMetadata({
    locale,
    path: `/portfolio/${slug}`,
    title: project.title,
    description: project.summary[locale],
  });
}
