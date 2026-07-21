import type { UpdateEventsContentDto } from '@ak-strannik/types';
import type { Metadata } from 'next';
import { PageHeader } from '../../../../_components/page-header';
import { EventsContentForm } from '../_components/events-content-form';

export const metadata: Metadata = { title: 'Новый год событий' };
const initialValues: UpdateEventsContentDto = { year: '', events: [] };

export default function NewEventsContentPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        description="Добавьте все события года и сохраните агрегат целиком."
        title="Новый год событий"
      />
      <EventsContentForm initialValues={initialValues} />
    </div>
  );
}
