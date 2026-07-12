import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageBreadcrumbs } from '../../../_components/page-breadcrumbs';
import { PageHeader } from '../../../_components/page-header';
import { DeleteEventDialog } from '../../../../features/events/delete-event-dialog';
import { EventForm } from '../../../../features/events/event-form';
import { getEventById, getEventMediaOptions } from '../../../../features/events/queries';

export const metadata: Metadata = { title: 'Редактирование мероприятия' };

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [event, mediaOptions] = await Promise.all([getEventById(id), getEventMediaOptions()]);
  if (!event) notFound();
  return (
    <div className="space-y-8"><div><PageBreadcrumbs items={[{ label: 'Мероприятия', href: '/events' }, { label: 'Редактирование' }]} /><PageHeader description="Измените публикацию, переводы и галерею мероприятия." title="Редактирование мероприятия" /></div><EventForm defaultValues={event.defaultValues} eventId={event.id} mediaOptions={mediaOptions} mode="edit" /><div className="rounded-xl border border-destructive/30 p-5"><h2 className="font-semibold">Опасная зона</h2><p className="mb-4 mt-1 text-sm text-muted-foreground">Связи с переводами и галереей будут удалены, изображения останутся в медиатеке.</p><DeleteEventDialog id={event.id} redirectAfterDelete /></div></div>
  );
}
