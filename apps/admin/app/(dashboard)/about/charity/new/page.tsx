import type { CreateCharityContentDto } from '@ak-strannik/types/charity';
import type { Metadata } from 'next';
import { PageHeader } from '../../../../_components/page-header';
import { CharityForm } from '../_components/charity-form';

export const metadata: Metadata = { title: 'Новый благотворительный проект' };

const initialValues: CreateCharityContentDto = {
  images: [],
  videos: [],
  translations: [
    { locale: 'ru', title: '', text: '' },
    { locale: 'en', title: '', text: '' },
  ],
};

export default function NewCharityPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        description="Заполните материалы и переводы на двух языках."
        title="Новый благотворительный проект"
      />
      <CharityForm initialValues={initialValues} />
    </div>
  );
}
