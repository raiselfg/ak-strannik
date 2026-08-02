import { Button } from '@ak-strannik/ui/components/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import { CalendarDays, Pencil, Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DeleteDialog } from '../../../_components/delete-dialog';
import { EmptyState } from '../../../_components/empty-state';
import { PageHeader } from '../../../_components/page-header';
import { deleteEventsContent } from './_actions/events.actions';
import { getEventsContents } from './_lib/events-queries';

export const metadata: Metadata = { title: 'События' };

export default async function EventsPage() {
  const records = await getEventsContents();
  return (
    <div className="space-y-8">
      <PageHeader
        action={
          <Button asChild>
            <Link href="/about/events/new">
              <Plus />
              Создать год
            </Link>
          </Button>
        }
        description="Каждая запись содержит все события одного года."
        title="События"
      />
      {records.length === 0 ? (
        <EmptyState
          actionHref="/about/events/new"
          actionLabel="Создать год"
          description="Создайте первый год и добавьте его события."
          icon={CalendarDays}
          title="Событий пока нет"
        />
      ) : (
        <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {records.map((record) => (
            <Card className="h-full" key={record.id}>
              <CardHeader>
                <CardTitle>{record.year}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Событий: {record._count.events}
                </p>
              </CardContent>
              <CardFooter className="mt-auto gap-2">
                <Button asChild className="flex-1" variant="outline">
                  <Link href={`/about/events/${record.id}/edit`}>
                    <Pencil />
                    Редактировать
                  </Link>
                </Button>
                <DeleteDialog
                  args={[record.id]}
                  deleteAction={deleteEventsContent}
                  description={
                    <span>
                      Все события за {record.year} год будут удалены. Это
                      действие необратимо.
                    </span>
                  }
                  title={`Удалить ${record.year} год?`}
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
