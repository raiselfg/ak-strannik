import type { UpdatePerformancesContentDto } from '@ak-strannik/types';
import type { Metadata } from 'next';
import { PageHeader } from '../../../../_components/page-header';
import { PerformancesContentForm } from '../_components/performances-content-form';

export const metadata: Metadata = { title: 'Новая постановка' };

const initialValues: UpdatePerformancesContentDto = {
  images: [],
  videos: [],
  translations: [
    { locale: 'ru', title: '' },
    { locale: 'en', title: '' },
  ],
  persons: [],
};

export default function NewPerformancesPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        description="Заполните материалы, переводы и список участников."
        title="Новая постановка"
      />
      <PerformancesContentForm initialValues={initialValues} />
    </div>
  );
}
