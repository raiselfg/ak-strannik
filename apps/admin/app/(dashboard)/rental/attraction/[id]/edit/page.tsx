import type { CreateAttractionContentDto } from '@ak-strannik/types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '../../../../../_components/page-header';
import { AttractionForm } from '../../_components/attraction-form';
import { getAttractionContent } from '../../_lib/attraction-queries';
export const metadata: Metadata = { title: 'Редактирование аттракциона' };
export default async function EditAttractionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await getAttractionContent(id);
  if (!record) notFound();
  const ru = record.translations.find((item) => item.locale === 'ru');
  const en = record.translations.find((item) => item.locale === 'en');
  const initialValues: CreateAttractionContentDto = {
    image: record.image,
    translations: [
      { locale: 'ru', text: ru?.text ?? '' },
      { locale: 'en', text: en?.text ?? '' },
    ],
  };
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        description="Измените изображение и переводы аттракциона."
        title="Редактирование аттракциона"
      />
      <AttractionForm attractionId={record.id} initialValues={initialValues} />
    </div>
  );
}
