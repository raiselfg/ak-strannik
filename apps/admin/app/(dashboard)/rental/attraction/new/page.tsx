import type { CreateAttractionContentDto } from '@ak-strannik/types/attraction';
import type { Metadata } from 'next';
import { PageHeader } from '../../../../_components/page-header';
import { AttractionForm } from '../_components/attraction-form';
export const metadata: Metadata = { title: 'Новый аттракцион' };
const initialValues: CreateAttractionContentDto = {
  image: '',
  translations: [
    { locale: 'ru', text: '' },
    { locale: 'en', text: '' },
  ],
};
export default function NewAttractionPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        description="Загрузите изображение и заполните переводы."
        title="Новый аттракцион"
      />
      <AttractionForm initialValues={initialValues} />
    </div>
  );
}
