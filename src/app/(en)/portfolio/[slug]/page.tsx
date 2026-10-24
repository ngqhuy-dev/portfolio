import { notFound } from 'next/navigation';
import { getProject } from '@/data/projects';
import { projectMetadata, type ProjectRouteProps, projectStaticParams } from '@/lib/project-route';
import { ProjectDetailView } from '@/views/ProjectDetailView';

export const dynamicParams = false;
export const generateStaticParams = projectStaticParams;

export function generateMetadata(props: ProjectRouteProps) {
  return projectMetadata('en', props);
}

export default async function ProjectPage({ params }: ProjectRouteProps) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return <ProjectDetailView project={project} locale="en" />;
}
