import type { CreateMascotCostumeContentDto } from '@ak-strannik/types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '../../../../../_components/page-header';
import { MascotCostumeForm } from '../../_components/mascot-costume-form';
import { getMascotCostumeContent } from '../../_lib/mascot-costume-queries';
export const metadata: Metadata = { title: 'Редактирование ростового костюма' };
export default async function EditMascotCostumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await getMascotCostumeContent(id);
  if (!record) notFound();
  const ru = record.translations.find((item) => item.locale === 'ru');
  const en = record.translations.find((item) => item.locale === 'en');
  const initialValues: CreateMascotCostumeContentDto = {
    image: record.image,
    translations: [
      { locale: 'ru', text: ru?.text ?? '' },
      { locale: 'en', text: en?.text ?? '' },
    ],
  };
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        description="Измените изображение и переводы костюма."
        title="Редактирование ростового костюма"
      />
      <MascotCostumeForm costumeId={record.id} initialValues={initialValues} />
    </div>
  );
}
