import type { Metadata } from 'next';
import { PageBreadcrumbs } from '../../../_components/page-breadcrumbs';
import { PageHeader } from '../../../_components/page-header';
import { getImageMediaOptions } from '../../../../features/media/queries';
import { ProjectForm } from '../../../../features/projects/project-form';

export const metadata: Metadata = { title: 'Новый проект' };

export default async function NewProjectPage() {
  const mediaOptions = await getImageMediaOptions();
  return (
    <div className="space-y-8">
      <div>
        <PageBreadcrumbs
          items={[
            { label: 'Проекты', href: '/projects' },
            { label: 'Новый проект' },
          ]}
        />
        <PageHeader
          description="Создайте проект, после чего сможете добавить секции его страницы."
          title="Новый проект"
        />
      </div>
      <ProjectForm mediaOptions={mediaOptions} mode="create" />
    </div>
  );
}
