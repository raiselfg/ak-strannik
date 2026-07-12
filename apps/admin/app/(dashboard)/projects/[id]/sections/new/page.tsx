import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { PageBreadcrumbs } from '../../../../../_components/page-breadcrumbs';
import { PageHeader } from '../../../../../_components/page-header';
import { ProjectSectionForm } from '../../../../../../features/project-sections/project-section-form';
import {
  getNextProjectSectionSortOrder,
  getProjectByIdForSection,
  getProjectSectionMediaOptions,
} from '../../../../../../features/project-sections/queries';

export const metadata: Metadata = { title: 'Новая секция проекта' };

export default async function NewProjectSectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const [project, nextSortOrder, mediaOptions] = await Promise.all([
    getProjectByIdForSection(id),
    getNextProjectSectionSortOrder(id),
    getProjectSectionMediaOptions(),
  ]);
  if (!project) notFound();

  return (
    <div className="space-y-8"><div><PageBreadcrumbs items={[{ label: 'Проекты', href: '/projects' }, { label: 'Редактирование проекта', href: `/projects/${id}` }, { label: 'Новая секция' }]} /><PageHeader description="Добавьте новый блок содержимого на страницу проекта." title="Новая секция" /></div><ProjectSectionForm defaultValues={{ sortOrder: nextSortOrder }} mediaOptions={mediaOptions} mode="create" projectId={id} /></div>
  );
}
