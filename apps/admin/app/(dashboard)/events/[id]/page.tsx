import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageBreadcrumbs } from '../../../_components/page-breadcrumbs';
import { PageHeader } from '../../../_components/page-header';
import { DeleteDialog } from '../../../_components/delete-dialog';
import { deleteEventAction } from '../../../../features/events/actions';
import { EventForm } from '../../../../features/events/event-form';
import {
  getEventById,
  getEventProjectOptions,
} from '../../../../features/events/queries';
import { getImageMediaOptions } from '../../../../features/media/queries';

export const metadata: Metadata = { title: 'Редактирование мероприятия' };

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [event, mediaOptions, projectOptions] = await Promise.all([
    getEventById(id),
    getImageMediaOptions(),
    getEventProjectOptions(),
  ]);
  if (!event) notFound();
  return (
    <div className="space-y-8">
      <div>
        <PageBreadcrumbs
          items={[
            { label: 'Мероприятия', href: '/events' },
            { label: 'Редактирование' },
          ]}
        />
        <PageHeader
          description="Измените публикацию, переводы, видео и галерею мероприятия."
          title="Редактирование мероприятия"
        />
      </div>
      <EventForm
        defaultValues={event.defaultValues}
        eventId={event.id}
        mediaOptions={mediaOptions}
        projectOptions={projectOptions}
        mode="edit"
      />
      <div className="rounded-xl border border-destructive/30 p-5">
        <h2 className="font-semibold">Опасная зона</h2>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          Связи с переводами, видео и галереей будут удалены, изображения
          останутся в медиатеке.
        </p>
        <DeleteDialog
          args={[event.id]}
          deleteAction={deleteEventAction}
          description="Мероприятие, его переводы, видео и связи с галереей будут удалены. Сами изображения останутся в медиатеке. Это действие нельзя отменить."
          redirectTo="/events"
          title="Удалить мероприятие?"
        />
      </div>
    </div>
  );
}
