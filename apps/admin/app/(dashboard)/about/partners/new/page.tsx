import type { CreatePartnerContentDto } from '@ak-strannik/types/partner';
import type { Metadata } from 'next';
import { PageHeader } from '../../../../_components/page-header';
import { PartnerForm } from '../_components/partner-form';

export const metadata: Metadata = { title: 'Новый партнёр' };

const initialValues: CreatePartnerContentDto = {
  link: '',
  images: [],
  translations: [
    { locale: 'ru', title: '', text: '' },
    { locale: 'en', title: '', text: '' },
  ],
};

export default function NewPartnerPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        description="Заполните общие данные и переводы на двух языках."
        title="Новый партнёр"
      />
      <PartnerForm initialValues={initialValues} />
    </div>
  );
}
