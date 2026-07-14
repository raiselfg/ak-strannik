import { Badge } from '@ak-strannik/ui/components/badge';
import { Button } from '@ak-strannik/ui/components/button';
import { Card, CardContent } from '@ak-strannik/ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ak-strannik/ui/components/table';
import { ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { DeleteDialog } from '../../app/_components/delete-dialog';
import { MediaPreview } from '../media/media-preview';
import { deleteEventAction } from './actions';
import { getContentStatusLabel } from './constants';
import type { getEvents } from './queries';

type EventItem = Awaited<ReturnType<typeof getEvents>>[number];

export function EventsTable({ events }: { events: EventItem[] }) {
  return (
    <Card>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Обложка</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Год / даты</TableHead>
              <TableHead>Проект</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Медиа</TableHead>
              <TableHead>Порядок</TableHead>
              <TableHead>Обновлено</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => {
              const ru = event.translations.find(
                (item) => item.locale === 'ru'
              );
              const en = event.translations.find(
                (item) => item.locale === 'en'
              );
              return (
                <TableRow key={event.id}>
                  <TableCell>
                    {event.coverImage ? (
                      <MediaPreview
                        alt={event.coverImage.originalName}
                        className="size-14 rounded-md border"
                        url={event.coverImage.publicUrl}
                      />
                    ) : (
                      <div className="flex size-14 items-center justify-center rounded-md bg-muted">
                        <ImageIcon className="size-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {ru?.title || en?.title || 'Без названия'}
                  </TableCell>
                  <TableCell>
                    <div>{event.eventYear ?? '—'}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatEventDates(event.startDate, event.endDate)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {event.project?.translations[0]?.title ?? '—'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        event.status === 'published' ? 'default' : 'secondary'
                      }
                    >
                      {getContentStatusLabel(event.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {event.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    Фото: {event._count.images}, видео: {event._count.videos}
                  </TableCell>
                  <TableCell>{event.sortOrder}</TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat('ru-RU', {
                      dateStyle: 'medium',
                    }).format(event.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/events/${event.id}`}>Редактировать</Link>
                      </Button>
                      <DeleteDialog
                        args={[event.id]}
                        deleteAction={deleteEventAction}
                        description="Мероприятие, его переводы и связи с галереей будут удалены. Сами изображения останутся в медиатеке. Это действие нельзя отменить."
                        title="Удалить мероприятие?"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function formatEventDates(startDate: Date | null, endDate: Date | null) {
  if (!startDate && !endDate) return 'Точные даты не указаны';
  const format = (date: Date) =>
    new Intl.DateTimeFormat('ru-RU', {
      dateStyle: 'medium',
      timeZone: 'UTC',
    }).format(date);
  if (startDate && endDate) return `${format(startDate)} — ${format(endDate)}`;
  return format(startDate ?? endDate!);
}
