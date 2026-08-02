import type { UpdateRequisiteContentDto } from '@ak-strannik/types/requisite';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '../../../../../_components/page-header';
import { RequisiteContentForm } from '../../_components/requisite-content-form';
import { getRequisiteContent } from '../../_lib/requisite-queries';

export const metadata: Metadata = { title: 'Редактирование реквизита' };

export default async function EditRequisitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await getRequisiteContent(id);
  if (!record) notFound();

  const ru = record.translations.find((item) => item.locale === 'ru');
  const en = record.translations.find((item) => item.locale === 'en');
  const initialValues: UpdateRequisiteContentDto = {
    translations: [
      { id: ru?.id, locale: 'ru', title: ru?.title ?? '' },
      { id: en?.id, locale: 'en', title: en?.title ?? '' },
    ],
    requisites: record.requisites.map((requisite) => {
      const itemRu = requisite.translations.find(
        (item) => item.locale === 'ru'
      );
      const itemEn = requisite.translations.find(
        (item) => item.locale === 'en'
      );
      return {
        id: requisite.id,
        image: requisite.image,
        position: requisite.position,
        translations: [
          { id: itemRu?.id, locale: 'ru', title: itemRu?.title ?? '' },
          { id: itemEn?.id, locale: 'en', title: itemEn?.title ?? '' },
        ],
      };
    }),
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        description="Измените весь агрегат и сохраните его одной кнопкой."
        title={ru?.title || 'Редактирование набора реквизита'}
      />
      <RequisiteContentForm
        contentId={record.id}
        initialValues={initialValues}
      />
    </div>
  );
}
