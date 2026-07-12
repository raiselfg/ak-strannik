import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageBreadcrumbs } from '../../../_components/page-breadcrumbs';
import { PageHeader } from '../../../_components/page-header';
import { DeleteProjectDialog } from '../../../../features/projects/delete-project-dialog';
import { ProjectForm } from '../../../../features/projects/project-form';
import { ProjectSectionsList } from '../../../../features/projects/project-sections-list';
import { getProjectById, getProjectMediaOptions } from '../../../../features/projects/queries';

export const metadata: Metadata = { title: 'Редактирование проекта' };

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, mediaOptions] = await Promise.all([
    getProjectById(id),
    getProjectMediaOptions(),
  ]);
  if (!project) notFound();

  return (
    <div className="space-y-8"><div><PageBreadcrumbs items={[{ label: 'Проекты', href: '/projects' }, { label: 'Редактирование' }]} /><PageHeader description="Измените настройки проекта и управляйте структурой его страницы." title="Редактирование проекта" /></div><ProjectForm defaultValues={project.defaultValues} mediaOptions={mediaOptions} mode="edit" projectId={project.id} /><ProjectSectionsList projectId={project.id} sections={project.sections} /><div className="rounded-xl border border-destructive/30 p-5"><h2 className="font-semibold">Опасная зона</h2><p className="mb-4 mt-1 text-sm text-muted-foreground">Проект, переводы и вложенные секции будут удалены. Изображения останутся в медиатеке.</p><DeleteProjectDialog id={project.id} redirectAfterDelete sectionCount={project.sections.length} /></div></div>
  );
}
