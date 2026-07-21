import type { CreateArtistContentDto } from '@ak-strannik/types';
import type { Metadata } from 'next';
import { PageHeader } from '../../../../_components/page-header';
import { ArtistForm } from '../_components/artist-form';

export const metadata: Metadata = { title: 'Новый артист' };
const initialValues: CreateArtistContentDto = {
  images: [],
  videos: [],
  translations: [
    { locale: 'ru', title: '', text: '' },
    { locale: 'en', title: '', text: '' },
  ],
};
export default function NewArtistPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        description="Заполните материалы и переводы артиста."
        title="Новый артист"
      />
      <ArtistForm initialValues={initialValues} />
    </div>
  );
}
