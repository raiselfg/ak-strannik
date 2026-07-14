import { Button } from '@ak-strannik/ui/components/button';
import { ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { EmptyState } from '../../_components/empty-state';
import { PageBreadcrumbs } from '../../_components/page-breadcrumbs';
import { PageHeader } from '../../_components/page-header';
import { CertificatesTable } from '../../../features/certificates/certificates-table';
import { getCertificates } from '../../../features/certificates/queries';

export const metadata: Metadata = { title: 'Сертификаты' };

export default async function CertificatesPage() {
  const certificates = await getCertificates();
  return (
    <div className="space-y-8">
      <div>
        <PageBreadcrumbs items={[{ label: 'Сертификаты' }]} />
        <PageHeader
          action={
            <Button asChild>
              <Link href="/certificates/new">Добавить сертификат</Link>
            </Button>
          }
          description="Сертификаты, дипломы, благодарственные письма и награды."
          title="Сертификаты"
        />
      </div>
      {certificates.length ? (
        <CertificatesTable certificates={certificates} />
      ) : (
        <EmptyState
          actionHref="/certificates/new"
          actionLabel="Добавить сертификат"
          description="Добавьте дипломы, сертификаты, благодарности и награды."
          icon={ShieldCheck}
          title="Сертификаты пока не добавлены"
        />
      )}
    </div>
  );
}
