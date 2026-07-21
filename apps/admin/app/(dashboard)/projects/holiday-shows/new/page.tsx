import type { CreateHolidayShowContentDto } from '@ak-strannik/types';
import type { Metadata } from 'next';
import { PageHeader } from '../../../../_components/page-header';
import { HolidayShowForm } from '../_components/holiday-show-form';
export const metadata: Metadata = { title: 'Новое праздничное представление' };
const initialValues: CreateHolidayShowContentDto = {
  images: [],
  translations: [
    { locale: 'ru', title: '' },
    { locale: 'en', title: '' },
  ],
};
export default function NewHolidayShowPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        description="Заполните изображения и переводы представления."
        title="Новое праздничное представление"
      />
      <HolidayShowForm initialValues={initialValues} />
    </div>
  );
}
