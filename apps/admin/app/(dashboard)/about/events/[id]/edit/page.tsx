import type { UpdateEventsContentDto } from '@ak-strannik/types/events';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '../../../../../_components/page-header';
import { EventsContentForm } from '../../_components/events-content-form';
import { getEventsContent } from '../../_lib/events-queries';

export const metadata: Metadata = { title: 'Редактирование событий' };

export default async function EditEventsContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await getEventsContent(id);
  if (!record) notFound();
  const initialValues: UpdateEventsContentDto = {
    year: record.year,
    events: record.events.map((event) => ({
      id: event.id,
      position: event.position,
      images: event.images,
      videos: event.videos,
      translations: [
        {
          id: event.translations.find((item) => item.locale === 'ru')?.id,
          locale: 'ru',
          text:
            event.translations.find((item) => item.locale === 'ru')?.text ?? '',
        },
        {
          id: event.translations.find((item) => item.locale === 'en')?.id,
          locale: 'en',
          text:
            event.translations.find((item) => item.locale === 'en')?.text ?? '',
        },
      ],
    })),
  };
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        description="Изменения событий сохранятся вместе одной транзакцией."
        title={`События ${record.year}`}
      />
      <EventsContentForm contentId={record.id} initialValues={initialValues} />
    </div>
  );
}
