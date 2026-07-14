import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageBreadcrumbs } from '../../../_components/page-breadcrumbs';
import { PageHeader } from '../../../_components/page-header';
import { DeleteDialog } from '../../../_components/delete-dialog';
import { deletePartnerAction } from '../../../../features/partners/actions';
import { PartnerForm } from '../../../../features/partners/partner-form';
import { getImageMediaOptions } from '../../../../features/media/queries';
import { getPartnerById } from '../../../../features/partners/queries';

export const metadata: Metadata = { title: 'Редактирование партнёра' };

export default async function PartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [partner, mediaOptions] = await Promise.all([
    getPartnerById(id),
    getImageMediaOptions(),
  ]);
  if (!partner) notFound();

  return (
    <div className="space-y-8">
      <div>
        <PageBreadcrumbs
          items={[
            { label: 'Партнёры', href: '/partners' },
            { label: 'Редактирование' },
          ]}
        />
        <PageHeader
          description="Измените основные настройки и переводы карточки партнёра."
          title="Редактирование партнёра"
        />
      </div>
      <PartnerForm
        defaultValues={partner.defaultValues}
        mediaOptions={mediaOptions}
        mode="edit"
        partnerId={partner.id}
      />
      <div className="rounded-xl border border-destructive/30 p-5">
        <h2 className="font-semibold">Опасная зона</h2>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          Партнёр и его переводы будут удалены, но логотип останется в
          медиатеке.
        </p>
        <DeleteDialog
          args={[partner.id]}
          deleteAction={deletePartnerAction}
          description="Партнёр и его переводы будут удалены. Логотип останется в медиатеке. Это действие нельзя отменить."
          redirectTo="/partners"
          title="Удалить партнёра?"
        />
      </div>
    </div>
  );
}
