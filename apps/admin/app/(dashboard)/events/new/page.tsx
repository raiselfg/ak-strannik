import type { Metadata } from 'next';
import { PageBreadcrumbs } from '../../../_components/page-breadcrumbs';
import { PageHeader } from '../../../_components/page-header';
import { EventForm } from '../../../../features/events/event-form';
import { getEventMediaOptions } from '../../../../features/events/queries';

export const metadata: Metadata = { title: 'Новое мероприятие' };

export default async function NewEventPage() {
  const mediaOptions = await getEventMediaOptions();
  return (
    <div className="space-y-8"><div><PageBreadcrumbs items={[{ label: 'Мероприятия', href: '/events' }, { label: 'Новое мероприятие' }]} /><PageHeader description="Создайте публикацию, переводы и галерею мероприятия." title="Новое мероприятие" /></div><EventForm mediaOptions={mediaOptions} mode="create" /></div>
  );
}
