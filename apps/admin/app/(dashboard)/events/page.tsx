import { Button } from '@ak-strannik/ui/components/button';
import { Select } from '@ak-strannik/ui/components/select';
import { CalendarDays } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { EmptyState } from '../../_components/empty-state';
import { PageBreadcrumbs } from '../../_components/page-breadcrumbs';
import { PageHeader } from '../../_components/page-header';
import { contentStatusOptions } from '../../../features/events/constants';
import { EventsTable } from '../../../features/events/events-table';
import {
  getEventFilterOptions,
  getEvents,
} from '../../../features/events/queries';
import { ContentStatusSchema } from '../../../features/events/schema';
import { isUuid } from '../../../lib/is-uuid';

export const metadata: Metadata = { title: 'Мероприятия' };

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; year?: string; projectId?: string }>;
}) {
  const params = await searchParams;
  const parsedStatus = ContentStatusSchema.safeParse(params.status);
  const status = parsedStatus.success ? parsedStatus.data : undefined;
  const year = /^\d{4}$/.test(params.year ?? '')
    ? Number(params.year)
    : undefined;
  const projectId =
    params.projectId && isUuid(params.projectId) ? params.projectId : undefined;
  const [events, options] = await Promise.all([
    getEvents({ status, year, projectId }),
    getEventFilterOptions(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <PageBreadcrumbs items={[{ label: 'Мероприятия' }]} />
        <PageHeader
          action={
            <Button asChild>
              <Link href="/events/new">Добавить мероприятие</Link>
            </Button>
          }
          description="Архив по годам, связанные проекты, видео и галереи."
          title="Мероприятия"
        />
      </div>
      <form className="grid gap-3 rounded-xl border p-4 md:grid-cols-[1fr_1fr_1fr_auto]">
        <Select defaultValue={status ?? ''} name="status">
          <option value="">Все статусы</option>
          {contentStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select defaultValue={year?.toString() ?? ''} name="year">
          <option value="">Все годы</option>
          {options.years.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Select defaultValue={projectId ?? ''} name="projectId">
          <option value="">Все проекты</option>
          {options.projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.label}
            </option>
          ))}
        </Select>
        <Button type="submit">Применить</Button>
      </form>
      {events.length ? (
        <EventsTable events={events} />
      ) : (
        <EmptyState
          actionHref="/events/new"
          actionLabel="Добавить мероприятие"
          description="Добавьте прошедшие или предстоящие мероприятия."
          icon={CalendarDays}
          title="Мероприятия пока не добавлены"
        />
      )}
    </div>
  );
}
