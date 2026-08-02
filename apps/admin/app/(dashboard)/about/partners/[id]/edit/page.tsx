import type { CreatePartnerContentDto } from '@ak-strannik/types/partner';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '../../../../../_components/page-header';
import { PartnerForm } from '../../_components/partner-form';
import { getPartnerContent } from '../../_lib/partner-queries';

export const metadata: Metadata = { title: 'Редактирование партнёра' };

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partner = await getPartnerContent(id);
  if (!partner) notFound();

  const ru = partner.translations.find(
    (translation) => translation.locale === 'ru'
  );
  const en = partner.translations.find(
    (translation) => translation.locale === 'en'
  );
  const initialValues: CreatePartnerContentDto = {
    link: partner.link ?? '',
    images: partner.images,
    translations: [
      { locale: 'ru', title: ru?.title ?? '', text: ru?.text ?? '' },
      { locale: 'en', title: en?.title ?? '', text: en?.text ?? '' },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        description="Измените общие данные и переводы партнёра."
        title={ru?.title || 'Редактирование партнёра'}
      />
      <PartnerForm initialValues={initialValues} partnerId={partner.id} />
    </div>
  );
}
