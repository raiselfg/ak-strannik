import type { UpdatePerformancesContentDto } from '@ak-strannik/types/performances';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '../../../../../_components/page-header';
import { PerformancesContentForm } from '../../_components/performances-content-form';
import { getPerformancesContent } from '../../_lib/performances-queries';

export const metadata: Metadata = { title: 'Редактирование постановки' };

export default async function EditPerformancesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await getPerformancesContent(id);
  if (!record) notFound();

  const ru = record.translations.find((item) => item.locale === 'ru');
  const en = record.translations.find((item) => item.locale === 'en');
  const initialValues: UpdatePerformancesContentDto = {
    images: record.images,
    videos: record.videos,
    translations: [
      { id: ru?.id, locale: 'ru', title: ru?.title ?? '' },
      { id: en?.id, locale: 'en', title: en?.title ?? '' },
    ],
    persons: record.persons.map((person) => {
      const personRu = person.translations.find((item) => item.locale === 'ru');
      const personEn = person.translations.find((item) => item.locale === 'en');
      return {
        id: person.id,
        position: person.position,
        translations: [
          { id: personRu?.id, locale: 'ru', name: personRu?.name ?? '' },
          { id: personEn?.id, locale: 'en', name: personEn?.name ?? '' },
        ],
      };
    }),
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        description="Измените весь агрегат и сохраните его одной кнопкой."
        title={ru?.title || 'Редактирование постановки'}
      />
      <PerformancesContentForm
        contentId={record.id}
        initialValues={initialValues}
      />
    </div>
  );
}
