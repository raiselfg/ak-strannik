import type { CreateMasterclassesContentDto } from '@ak-strannik/types';
import type { Metadata } from 'next';
import { PageHeader } from '../../../../_components/page-header';
import { MasterclassesForm } from '../_components/masterclasses-form';
export const metadata: Metadata = { title: 'Новый мастер-класс' };
const initialValues: CreateMasterclassesContentDto = {
  images: [],
  videos: [],
  translations: [
    { locale: 'ru', title: '', text: '' },
    { locale: 'en', title: '', text: '' },
  ],
};
export default function NewMasterclassesPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        description="Заполните материалы и переводы мастер-класса."
        title="Новый мастер-класс"
      />
      <MasterclassesForm initialValues={initialValues} />
    </div>
  );
}
