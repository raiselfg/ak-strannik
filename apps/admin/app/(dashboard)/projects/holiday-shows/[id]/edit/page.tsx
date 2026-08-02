import type { CreateHolidayShowContentDto } from '@ak-strannik/types/holiday-show';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '../../../../../_components/page-header';
import { HolidayShowForm } from '../../_components/holiday-show-form';
import { getHolidayShowContent } from '../../_lib/holiday-show-queries';
export const metadata: Metadata = { title: 'Редактирование представления' };
export default async function EditHolidayShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await getHolidayShowContent(id);
  if (!record) notFound();
  const ru = record.translations.find((item) => item.locale === 'ru');
  const en = record.translations.find((item) => item.locale === 'en');
  const initialValues: CreateHolidayShowContentDto = {
    images: record.images,
    translations: [
      { locale: 'ru', title: ru?.title ?? '' },
      { locale: 'en', title: en?.title ?? '' },
    ],
  };
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        description="Измените изображения и переводы представления."
        title={ru?.title || 'Редактирование представления'}
      />
      <HolidayShowForm initialValues={initialValues} showId={record.id} />
    </div>
  );
}
