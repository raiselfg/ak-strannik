import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageBreadcrumbs } from '../../../_components/page-breadcrumbs';
import { PageHeader } from '../../../_components/page-header';
import { getImageMediaOptions } from '../../../../features/media/queries';
import { DeleteDialog } from '../../../_components/delete-dialog';
import { deleteProjectAction } from '../../../../features/projects/actions';
import { ProjectForm } from '../../../../features/projects/project-form';
import { ProjectSectionsList } from '../../../../features/projects/project-sections-list';
import { getProjectById } from '../../../../features/projects/queries';

export const metadata: Metadata = { title: 'Редактирование проекта' };

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, mediaOptions] = await Promise.all([
    getProjectById(id),
    getImageMediaOptions(),
  ]);
  if (!project) notFound();

  return (
    <div className="space-y-8">
      <div>
        <PageBreadcrumbs
          items={[
            { label: 'Проекты', href: '/projects' },
            { label: 'Редактирование' },
          ]}
        />
        <PageHeader
          description="Измените настройки проекта и управляйте структурой его страницы."
          title="Редактирование проекта"
        />
      </div>
      <ProjectForm
        defaultValues={project.defaultValues}
        mediaOptions={mediaOptions}
        mode="edit"
        projectId={project.id}
      />
      <ProjectSectionsList projectId={project.id} sections={project.sections} />
      <div className="rounded-xl border border-destructive/30 p-5">
        <h2 className="font-semibold">Опасная зона</h2>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          Проект, переводы и вложенные секции будут удалены. Изображения
          останутся в медиатеке.
        </p>
        <DeleteDialog
          args={[project.id]}
          deleteAction={deleteProjectAction}
          description={`Проект, его переводы и все вложенные секции будут удалены. Изображения останутся в медиатеке. Это действие нельзя отменить.${project.sections.length ? ` В проекте находится секций: ${project.sections.length}.` : ''}`}
          redirectTo="/projects"
          title="Удалить проект?"
        />
      </div>
    </div>
  );
}
