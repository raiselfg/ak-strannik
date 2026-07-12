import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageBreadcrumbs } from '../../../_components/page-breadcrumbs';
import { PageHeader } from '../../../_components/page-header';
import { DeleteRentalItemDialog } from '../../../../features/rentals/delete-rental-item-dialog';
import { getRentalItemById, getRentalMediaOptions } from '../../../../features/rentals/queries';
import { RentalItemForm } from '../../../../features/rentals/rental-item-form';

export const metadata: Metadata = {
  title: 'Редактирование позиции аренды',
};

export default async function RentalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, mediaOptions] = await Promise.all([getRentalItemById(id), getRentalMediaOptions()]);
  if (!item) notFound();
  return (
    <div className="space-y-8">
      <div><PageBreadcrumbs items={[{ label: 'Аренда', href: '/rentals' }, { label: 'Редактирование' }]} /><PageHeader description="Измените настройки, изображение и переводы позиции каталога." title="Редактирование позиции аренды" /></div>
      <RentalItemForm defaultValues={item.defaultValues} mediaOptions={mediaOptions} mode="edit" rentalItemId={item.id} />
      <div className="rounded-xl border border-destructive/30 p-5"><h2 className="font-semibold">Опасная зона</h2><p className="mb-4 mt-1 text-sm text-muted-foreground">Позиция и её переводы будут удалены, но изображение останется в медиатеке.</p><DeleteRentalItemDialog id={item.id} redirectAfterDelete /></div>
    </div>
  );
}
