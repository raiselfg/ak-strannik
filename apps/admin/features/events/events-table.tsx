import { Badge } from '@ak-strannik/ui/components/badge';
import { Button } from '@ak-strannik/ui/components/button';
import { Card, CardContent } from '@ak-strannik/ui/components/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ak-strannik/ui/components/table';
import { ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { MediaPreview } from '../media/media-preview';
import { getContentStatusLabel } from './constants';
import { DeleteEventDialog } from './delete-event-dialog';
import type { EventsResult } from './types';

type EventItem = EventsResult[number];

export function EventsTable({ events }: { events: EventItem[] }) {
  return <Card><CardContent className="px-0"><Table><TableHeader><TableRow><TableHead>Обложка</TableHead><TableHead>Название</TableHead><TableHead>Дата мероприятия</TableHead><TableHead>Статус</TableHead><TableHead>Slug</TableHead><TableHead>Галерея</TableHead><TableHead>Порядок</TableHead><TableHead>Обновлено</TableHead><TableHead className="text-right">Действия</TableHead></TableRow></TableHeader><TableBody>{events.map((event) => {
    const ru = event.translations.find((item) => item.locale === 'ru');
    const en = event.translations.find((item) => item.locale === 'en');
    return <TableRow key={event.id}>
      <TableCell>{event.coverImage ? <MediaPreview alt={event.coverImage.originalName} className="size-14 rounded-md border" url={event.coverImage.publicUrl} /> : <div className="flex size-14 items-center justify-center rounded-md bg-muted"><ImageIcon className="size-4 text-muted-foreground" /></div>}</TableCell>
      <TableCell className="font-medium">{ru?.title || en?.title || 'Без названия'}</TableCell>
      <TableCell>{event.eventDate ? new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium', timeStyle: 'short' }).format(event.eventDate) : '—'}</TableCell>
      <TableCell><Badge variant={event.status === 'published' ? 'default' : 'secondary'}>{getContentStatusLabel(event.status)}</Badge></TableCell>
      <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{event.slug}</code></TableCell>
      <TableCell>Фото: {event._count.images}</TableCell><TableCell>{event.sortOrder}</TableCell>
      <TableCell>{new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' }).format(event.updatedAt)}</TableCell>
      <TableCell><div className="flex justify-end gap-2"><Button asChild size="sm" variant="outline"><Link href={`/events/${event.id}`}>Редактировать</Link></Button><DeleteEventDialog id={event.id} /></div></TableCell>
    </TableRow>;
  })}</TableBody></Table></CardContent></Card>;
}
