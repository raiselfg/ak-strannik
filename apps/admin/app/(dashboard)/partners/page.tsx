import { Button } from '@ak-strannik/ui/components/button';
import { Handshake } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { EmptyState } from '../../_components/empty-state';
import { PageBreadcrumbs } from '../../_components/page-breadcrumbs';
import { PageHeader } from '../../_components/page-header';
import { getPartners } from '../../../features/partners/queries';
import { PartnersTable } from '../../../features/partners/partners-table';

export const metadata: Metadata = { title: 'Партнёры' };

export default async function PartnersPage() {
  const partners = await getPartners();
  return (
    <div className="space-y-8">
      <div>
        <PageBreadcrumbs items={[{ label: 'Партнёры' }]} />
        <PageHeader
          action={
            <Button asChild>
              <Link href="/partners/new">Добавить партнёра</Link>
            </Button>
          }
          description="Организации и компании, с которыми сотрудничает AK Strannik."
          title="Партнёры"
        />
      </div>
      {partners.length ? (
        <PartnersTable partners={partners} />
      ) : (
        <EmptyState
          actionHref="/partners/new"
          actionLabel="Добавить партнёра"
          description="Добавьте организации и компании, с которыми вы сотрудничаете."
          icon={Handshake}
          title="Партнёры пока не добавлены"
        />
      )}
    </div>
  );
}
