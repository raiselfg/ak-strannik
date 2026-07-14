import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageBreadcrumbs } from '../../../_components/page-breadcrumbs';
import { PageHeader } from '../../../_components/page-header';
import { CertificateForm } from '../../../../features/certificates/certificate-form';
import { DeleteDialog } from '../../../_components/delete-dialog';
import { deleteCertificateAction } from '../../../../features/certificates/actions';
import { getCertificateById } from '../../../../features/certificates/queries';
import { getImageMediaOptions } from '../../../../features/media/queries';

export const metadata: Metadata = { title: 'Редактирование сертификата' };

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [certificate, mediaOptions] = await Promise.all([
    getCertificateById(id),
    getImageMediaOptions(),
  ]);
  if (!certificate) notFound();

  return (
    <div className="space-y-8">
      <div>
        <PageBreadcrumbs
          items={[
            { label: 'Сертификаты', href: '/certificates' },
            { label: 'Редактирование' },
          ]}
        />
        <PageHeader
          description="Измените изображение, настройки и переводы сертификата."
          title="Редактирование сертификата"
        />
      </div>
      <CertificateForm
        certificateId={certificate.id}
        defaultValues={certificate.defaultValues}
        mediaOptions={mediaOptions}
        mode="edit"
      />
      <div className="rounded-xl border border-destructive/30 p-5">
        <h2 className="font-semibold">Опасная зона</h2>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          Сертификат и его переводы будут удалены, но изображение останется в
          медиатеке.
        </p>
        <DeleteDialog
          args={[certificate.id]}
          deleteAction={deleteCertificateAction}
          description="Сертификат и его переводы будут удалены. Изображение останется в медиатеке. Это действие нельзя отменить."
          redirectTo="/certificates"
          title="Удалить сертификат?"
        />
      </div>
    </div>
  );
}
