import type { CreateExhibitionContentDto } from '@ak-strannik/types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '../../../../../_components/page-header';
import { ExhibitionForm } from '../../_components/exhibition-form';
import { getExhibitionContent } from '../../_lib/exhibition-queries';
export const metadata: Metadata = { title: 'Редактирование выставки' };
export default async function EditExhibitionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await getExhibitionContent(id);
  if (!record) notFound();
  const ru = record.translations.find((item) => item.locale === 'ru');
  const en = record.translations.find((item) => item.locale === 'en');
  const initialValues: CreateExhibitionContentDto = {
    images: record.images,
    translations: [
      { locale: 'ru', title: ru?.title ?? '' },
      { locale: 'en', title: en?.title ?? '' },
    ],
  };
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        description="Измените изображения и переводы выставки."
        title={ru?.title || 'Редактирование выставки'}
      />
      <ExhibitionForm exhibitionId={record.id} initialValues={initialValues} />
    </div>
  );
}
