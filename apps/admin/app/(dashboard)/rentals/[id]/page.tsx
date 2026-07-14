import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageBreadcrumbs } from '../../../_components/page-breadcrumbs';
import { PageHeader } from '../../../_components/page-header';
import { DeleteDialog } from '../../../_components/delete-dialog';
import { deleteRentalItemAction } from '../../../../features/rentals/actions';
import { getImageMediaOptions } from '../../../../features/media/queries';
import { getRentalItemById } from '../../../../features/rentals/queries';
import { RentalItemForm } from '../../../../features/rentals/rental-item-form';

export const metadata: Metadata = {
  title: 'Редактирование позиции аренды',
};

export default async function RentalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, mediaOptions] = await Promise.all([
    getRentalItemById(id),
    getImageMediaOptions(),
  ]);
  if (!item) notFound();
  return (
    <div className="space-y-8">
      <div>
        <PageBreadcrumbs
          items={[
            { label: 'Аренда', href: '/rentals' },
            { label: 'Редактирование' },
          ]}
        />
        <PageHeader
          description="Измените настройки, изображение и переводы позиции каталога."
          title="Редактирование позиции аренды"
        />
      </div>
      <RentalItemForm
        defaultValues={item.defaultValues}
        mediaOptions={mediaOptions}
        mode="edit"
        rentalItemId={item.id}
      />
      <div className="rounded-xl border border-destructive/30 p-5">
        <h2 className="font-semibold">Опасная зона</h2>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          Позиция и её переводы будут удалены, но изображение останется в
          медиатеке.
        </p>
        <DeleteDialog
          args={[item.id]}
          deleteAction={deleteRentalItemAction}
          description="Позиция и её переводы будут удалены. Изображение останется в медиатеке. Это действие нельзя отменить."
          redirectTo="/rentals"
          title="Удалить позицию аренды?"
        />
      </div>
    </div>
  );
}
