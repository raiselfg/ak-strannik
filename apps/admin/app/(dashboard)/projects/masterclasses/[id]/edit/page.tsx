import type { CreateMasterclassesContentDto } from '@ak-strannik/types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '../../../../../_components/page-header';
import { MasterclassesForm } from '../../_components/masterclasses-form';
import { getMasterclassesContent } from '../../_lib/masterclasses-queries';
export const metadata: Metadata = { title: 'Редактирование мастер-класса' };
export default async function EditMasterclassesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await getMasterclassesContent(id);
  if (!record) notFound();
  const ru = record.translations.find((item) => item.locale === 'ru');
  const en = record.translations.find((item) => item.locale === 'en');
  const initialValues: CreateMasterclassesContentDto = {
    images: record.images,
    videos: record.videos,
    translations: [
      { locale: 'ru', title: ru?.title ?? '', text: ru?.text ?? '' },
      { locale: 'en', title: en?.title ?? '', text: en?.text ?? '' },
    ],
  };
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        description="Измените материалы и переводы мастер-класса."
        title={ru?.title || 'Редактирование мастер-класса'}
      />
      <MasterclassesForm
        initialValues={initialValues}
        masterclassId={record.id}
      />
    </div>
  );
}
