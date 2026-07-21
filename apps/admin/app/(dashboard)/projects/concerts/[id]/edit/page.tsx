import type { CreateConcertContentDto } from '@ak-strannik/types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '../../../../../_components/page-header';
import { ConcertForm } from '../../_components/concert-form';
import { getConcertContent } from '../../_lib/concert-queries';
export const metadata: Metadata = { title: 'Редактирование концерта' };
export default async function EditConcertPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await getConcertContent(id);
  if (!record) notFound();
  const ru = record.translations.find((item) => item.locale === 'ru');
  const en = record.translations.find((item) => item.locale === 'en');
  const initialValues: CreateConcertContentDto = {
    images: record.images,
    videos: record.videos,
    translations: [
      {
        locale: 'ru',
        title: ru?.title ?? '',
        text: ru?.text ?? '',
        duration: ru?.duration ?? '',
      },
      {
        locale: 'en',
        title: en?.title ?? '',
        text: en?.text ?? '',
        duration: en?.duration ?? '',
      },
    ],
  };
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        description="Измените материалы и переводы концерта."
        title={ru?.title || 'Редактирование концерта'}
      />
      <ConcertForm concertId={record.id} initialValues={initialValues} />
    </div>
  );
}
