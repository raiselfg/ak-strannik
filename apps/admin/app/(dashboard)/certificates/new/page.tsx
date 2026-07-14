import type { Metadata } from 'next';
import { PageBreadcrumbs } from '../../../_components/page-breadcrumbs';
import { PageHeader } from '../../../_components/page-header';
import { CertificateForm } from '../../../../features/certificates/certificate-form';
import { getImageMediaOptions } from '../../../../features/media/queries';

export const metadata: Metadata = { title: 'Новый сертификат' };

export default async function NewCertificatePage() {
  const mediaOptions = await getImageMediaOptions();
  return (
    <div className="space-y-8">
      <div>
        <PageBreadcrumbs
          items={[
            { label: 'Сертификаты', href: '/certificates' },
            { label: 'Новый сертификат' },
          ]}
        />
        <PageHeader
          description="Добавьте изображение, данные и переводы сертификата."
          title="Новый сертификат"
        />
      </div>
      <CertificateForm mediaOptions={mediaOptions} mode="create" />
    </div>
  );
}
