import { notFound } from 'next/navigation';
import { getProject } from '@/data/projects';
import { ogContentType, ogSize, renderProjectOgImage } from '@/lib/og';
import { type ProjectRouteProps, projectStaticParams } from '@/lib/project-route';

export const dynamic = 'force-static';
export const generateStaticParams = projectStaticParams;
export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Project case study by Nguyễn Quốc Huy';

export default async function Image({ params }: ProjectRouteProps) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return renderProjectOgImage('en', project);
}
