import type { CreateCharityContentDto } from '@ak-strannik/types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '../../../../../_components/page-header';
import { CharityForm } from '../../_components/charity-form';
import { getCharityContent } from '../../_lib/charity-queries';

export const metadata: Metadata = {
  title: 'Редактирование благотворительности',
};

export default async function EditCharityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await getCharityContent(id);
  if (!record) notFound();
  const ru = record.translations.find(
    (translation) => translation.locale === 'ru'
  );
  const en = record.translations.find(
    (translation) => translation.locale === 'en'
  );
  const initialValues: CreateCharityContentDto = {
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
        description="Измените материалы и переводы проекта."
        title={ru?.title || 'Редактирование проекта'}
      />
      <CharityForm charityId={record.id} initialValues={initialValues} />
    </div>
  );
}
