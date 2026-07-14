import type { Metadata } from 'next';
import { PageBreadcrumbs } from '../../../_components/page-breadcrumbs';
import { PageHeader } from '../../../_components/page-header';
import { EventForm } from '../../../../features/events/event-form';
import { getImageMediaOptions } from '../../../../features/media/queries';
import { getEventProjectOptions } from '../../../../features/events/queries';

export const metadata: Metadata = { title: 'Новое мероприятие' };

export default async function NewEventPage() {
  const [mediaOptions, projectOptions] = await Promise.all([
    getImageMediaOptions(),
    getEventProjectOptions(),
  ]);
  return (
    <div className="space-y-8">
      <div>
        <PageBreadcrumbs
          items={[
            { label: 'Мероприятия', href: '/events' },
            { label: 'Новое мероприятие' },
          ]}
        />
        <PageHeader
          description="Создайте публикацию, переводы, видео и галерею мероприятия."
          title="Новое мероприятие"
        />
      </div>
      <EventForm
        mediaOptions={mediaOptions}
        projectOptions={projectOptions}
        mode="create"
      />
    </div>
  );
}
