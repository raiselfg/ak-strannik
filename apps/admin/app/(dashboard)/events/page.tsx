import { Button } from '@ak-strannik/ui/components/button';
import { CalendarDays } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { EmptyState } from '../../_components/empty-state';
import { PageBreadcrumbs } from '../../_components/page-breadcrumbs';
import { PageHeader } from '../../_components/page-header';
import { contentStatusOptions } from '../../../features/events/constants';
import { EventsTable } from '../../../features/events/events-table';
import { getEvents } from '../../../features/events/queries';
import { ContentStatusSchema } from '../../../features/events/schema';

export const metadata: Metadata = { title: 'Мероприятия' };

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const parsedStatus = ContentStatusSchema.safeParse(params.status);
  const status = parsedStatus.success ? parsedStatus.data : undefined;
  const events = await getEvents({ status });
  return (
    <div className="space-y-8"><div><PageBreadcrumbs items={[{ label: 'Мероприятия' }]} /><PageHeader action={<Button asChild><Link href="/events/new">Добавить мероприятие</Link></Button>} description="Прошедшие и предстоящие мероприятия, публикации и галереи." title="Мероприятия" /></div>
      <div className="flex flex-wrap gap-2"><Button asChild size="sm" variant={!status ? 'default' : 'outline'}><Link href="/events">Все</Link></Button>{contentStatusOptions.map((option) => <Button asChild key={option.value} size="sm" variant={status === option.value ? 'default' : 'outline'}><Link href={`/events?status=${option.value}`}>{option.label}</Link></Button>)}</div>
      {events.length ? <EventsTable events={events} /> : <EmptyState actionHref="/events/new" actionLabel="Добавить мероприятие" description="Добавьте прошедшие или предстоящие мероприятия." icon={CalendarDays} title="Мероприятия пока не добавлены" />}
    </div>
  );
}
