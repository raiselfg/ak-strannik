import { Button } from '@ak-strannik/ui/components/button';
import { PackageOpen } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { EmptyState } from '../../_components/empty-state';
import { PageBreadcrumbs } from '../../_components/page-breadcrumbs';
import { PageHeader } from '../../_components/page-header';
import { getRentalItems } from '../../../features/rentals/queries';
import { RentalItemsTable } from '../../../features/rentals/rental-items-table';

export const metadata: Metadata = { title: 'Аренда' };

export default async function RentalsPage() {
  const items = await getRentalItems();
  return (
    <div className="space-y-8">
      <div><PageBreadcrumbs items={[{ label: 'Аренда' }]} /><PageHeader action={<Button asChild><Link href="/rentals/new">Добавить позицию</Link></Button>} description="Каталог ростовых кукол, аттракционов и реквизита, доступных для аренды." title="Аренда" /></div>
      {items.length ? <RentalItemsTable items={items} /> : <EmptyState actionHref="/rentals/new" actionLabel="Добавить позицию" description="Добавьте ростовые куклы, аттракционы и реквизит, доступные для аренды." icon={PackageOpen} title="Позиции аренды пока не добавлены" />}
    </div>
  );
}
