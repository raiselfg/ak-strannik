import type { UpdateRequisiteContentDto } from '@ak-strannik/types/requisite';
import type { Metadata } from 'next';
import { PageHeader } from '../../../../_components/page-header';
import { RequisiteContentForm } from '../_components/requisite-content-form';

export const metadata: Metadata = { title: 'Новый набор реквизита' };

const initialValues: UpdateRequisiteContentDto = {
  translations: [
    { locale: 'ru', title: '' },
    { locale: 'en', title: '' },
  ],
  requisites: [],
};

export default function NewRequisitePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        description="Заполните переводы и добавьте элементы реквизита."
        title="Новый набор реквизита"
      />
      <RequisiteContentForm initialValues={initialValues} />
    </div>
  );
}
