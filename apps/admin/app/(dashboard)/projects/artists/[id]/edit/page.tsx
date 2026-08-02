import type { CreateArtistContentDto } from '@ak-strannik/types/artist';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '../../../../../_components/page-header';
import { ArtistForm } from '../../_components/artist-form';
import { getArtistContent } from '../../_lib/artist-queries';

export const metadata: Metadata = { title: 'Редактирование артиста' };
export default async function EditArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await getArtistContent(id);
  if (!record) notFound();
  const ru = record.translations.find((item) => item.locale === 'ru');
  const en = record.translations.find((item) => item.locale === 'en');
  const initialValues: CreateArtistContentDto = {
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
        description="Измените материалы и переводы артиста."
        title={ru?.title || 'Редактирование артиста'}
      />
      <ArtistForm artistId={record.id} initialValues={initialValues} />
    </div>
  );
}
