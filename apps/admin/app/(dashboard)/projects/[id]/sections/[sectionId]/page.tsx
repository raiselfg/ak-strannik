import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { PageBreadcrumbs } from '../../../../../_components/page-breadcrumbs';
import { PageHeader } from '../../../../../_components/page-header';
import { getImageMediaOptions } from '../../../../../../features/media/queries';
import { DeleteDialog } from '../../../../../_components/delete-dialog';
import { deleteProjectSectionAction } from '../../../../../../features/project-sections/actions';
import { ProjectSectionForm } from '../../../../../../features/project-sections/project-section-form';
import {
  getProjectByIdForSection,
  getProjectSectionById,
} from '../../../../../../features/project-sections/queries';

export const metadata: Metadata = { title: 'Редактирование секции проекта' };

export default async function ProjectSectionPage({
  params,
}: {
  params: Promise<{ id: string; sectionId: string }>;
}) {
  const { id, sectionId } = await params;
  if (
    !z.uuid().safeParse(id).success ||
    !z.uuid().safeParse(sectionId).success
  ) {
    notFound();
  }
  const [project, section, mediaOptions] = await Promise.all([
    getProjectByIdForSection(id),
    getProjectSectionById(id, sectionId),
    getImageMediaOptions(),
  ]);
  if (!project || !section || section.projectId !== id) notFound();

  return (
    <div className="space-y-8">
      <div>
        <PageBreadcrumbs
          items={[
            { label: 'Проекты', href: '/projects' },
            { label: 'Редактирование проекта', href: `/projects/${id}` },
            { label: 'Редактирование секции' },
          ]}
        />
        <PageHeader
          description="Измените вариант, контент и медиа блока страницы проекта."
          title="Редактирование секции проекта"
        />
      </div>
      <ProjectSectionForm
        defaultValues={section.defaultValues}
        mediaOptions={mediaOptions}
        mode="edit"
        projectId={id}
        sectionId={sectionId}
      />
      <div className="rounded-xl border border-destructive/30 p-5">
        <h2 className="font-semibold">Опасная зона</h2>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          Переводы и связи секции с медиа будут удалены. Файлы останутся в
          медиатеке.
        </p>
        <DeleteDialog
          args={[id, sectionId]}
          deleteAction={deleteProjectSectionAction}
          description="Секция, её переводы и связи с медиафайлами будут удалены. Сами файлы останутся в медиатеке. Это действие нельзя отменить."
          redirectTo={`/projects/${id}`}
          title="Удалить секцию?"
        />
      </div>
    </div>
  );
}
