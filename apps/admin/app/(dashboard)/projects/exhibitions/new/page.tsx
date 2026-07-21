import type { CreateExhibitionContentDto } from '@ak-strannik/types';
import type { Metadata } from 'next';
import { PageHeader } from '../../../../_components/page-header';
import { ExhibitionForm } from '../_components/exhibition-form';
export const metadata: Metadata = { title: 'Новая выставка' };
const initialValues: CreateExhibitionContentDto = {
  images: [],
  translations: [
    { locale: 'ru', title: '' },
    { locale: 'en', title: '' },
  ],
};
export default function NewExhibitionPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        description="Заполните изображения и переводы выставки."
        title="Новая выставка"
      />
      <ExhibitionForm initialValues={initialValues} />
    </div>
  );
}
