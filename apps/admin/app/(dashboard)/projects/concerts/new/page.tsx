import type { CreateConcertContentDto } from '@ak-strannik/types';
import type { Metadata } from 'next';
import { PageHeader } from '../../../../_components/page-header';
import { ConcertForm } from '../_components/concert-form';
export const metadata: Metadata = { title: 'Новый концерт' };
const initialValues: CreateConcertContentDto = {
  images: [],
  videos: [],
  translations: [
    { locale: 'ru', title: '', text: '', duration: '' },
    { locale: 'en', title: '', text: '', duration: '' },
  ],
};
export default function NewConcertPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        description="Заполните материалы и переводы концерта."
        title="Новый концерт"
      />
      <ConcertForm initialValues={initialValues} />
    </div>
  );
}
