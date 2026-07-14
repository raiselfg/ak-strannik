import type { Metadata } from 'next';
import { PageBreadcrumbs } from '../../../_components/page-breadcrumbs';
import { PageHeader } from '../../../_components/page-header';
import { getImageMediaOptions } from '../../../../features/media/queries';
import { RentalItemForm } from '../../../../features/rentals/rental-item-form';

export const metadata: Metadata = { title: 'Новая позиция аренды' };

export default async function NewRentalPage() {
  const mediaOptions = await getImageMediaOptions();
  return (
    <div className="space-y-8">
      <div>
        <PageBreadcrumbs
          items={[
            { label: 'Аренда', href: '/rentals' },
            { label: 'Новая позиция' },
          ]}
        />
        <PageHeader
          description="Добавьте основные настройки и переводы новой позиции каталога."
          title="Новая позиция аренды"
        />
      </div>
      <RentalItemForm mediaOptions={mediaOptions} mode="create" />
    </div>
  );
}
