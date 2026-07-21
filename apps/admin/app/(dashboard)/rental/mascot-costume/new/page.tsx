import type { CreateMascotCostumeContentDto } from '@ak-strannik/types';
import type { Metadata } from 'next';
import { PageHeader } from '../../../../_components/page-header';
import { MascotCostumeForm } from '../_components/mascot-costume-form';
export const metadata: Metadata = { title: 'Новый ростовой костюм' };
const initialValues: CreateMascotCostumeContentDto = {
  image: '',
  translations: [
    { locale: 'ru', text: '' },
    { locale: 'en', text: '' },
  ],
};
export default function NewMascotCostumePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        description="Загрузите изображение и заполните переводы."
        title="Новый ростовой костюм"
      />
      <MascotCostumeForm initialValues={initialValues} />
    </div>
  );
}
