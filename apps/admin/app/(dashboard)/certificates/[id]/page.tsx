import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageBreadcrumbs } from '../../../_components/page-breadcrumbs';
import { PageHeader } from '../../../_components/page-header';
import { CertificateForm } from '../../../../features/certificates/certificate-form';
import { DeleteCertificateDialog } from '../../../../features/certificates/delete-certificate-dialog';
import {
  getCertificateById,
  getCertificateMediaOptions,
} from '../../../../features/certificates/queries';

export const metadata: Metadata = { title: 'Редактирование сертификата' };

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [certificate, mediaOptions] = await Promise.all([
    getCertificateById(id),
    getCertificateMediaOptions(),
  ]);
  if (!certificate) notFound();

  return (
    <div className="space-y-8">
      <div>
        <PageBreadcrumbs items={[
          { label: 'Сертификаты', href: '/certificates' },
          { label: 'Редактирование' },
        ]} />
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
        <p className="mb-4 mt-1 text-sm text-muted-foreground">
          Сертификат и его переводы будут удалены, но изображение останется в медиатеке.
        </p>
        <DeleteCertificateDialog id={certificate.id} redirectAfterDelete />
      </div>
    </div>
  );
}
