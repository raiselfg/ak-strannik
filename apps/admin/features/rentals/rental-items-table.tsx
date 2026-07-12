import { Badge } from '@ak-strannik/ui/components/badge';
import { Button } from '@ak-strannik/ui/components/button';
import { Card, CardContent } from '@ak-strannik/ui/components/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ak-strannik/ui/components/table';
import { ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { MediaPreview } from '../media/media-preview';
import { getRentalTypeLabel } from './constants';
import { DeleteRentalItemDialog } from './delete-rental-item-dialog';
import type { RentalItemsResult } from './types';

type RentalItem = RentalItemsResult[number];

export function RentalItemsTable({ items }: { items: RentalItem[] }) {
  return (
    <Card><CardContent className="px-0"><Table>
      <TableHeader><TableRow><TableHead>Изображение</TableHead><TableHead>Название</TableHead><TableHead>Тип</TableHead><TableHead>Slug</TableHead><TableHead>Цена</TableHead><TableHead>Статус</TableHead><TableHead>Порядок</TableHead><TableHead>Обновлено</TableHead><TableHead className="text-right">Действия</TableHead></TableRow></TableHeader>
      <TableBody>{items.map((item) => {
        const ru = item.translations.find((translation) => translation.locale === 'ru');
        const en = item.translations.find((translation) => translation.locale === 'en');
        return (
          <TableRow key={item.id}>
            <TableCell>{item.image ? <MediaPreview alt={item.image.originalName} className="size-14 rounded-md border" url={item.image.publicUrl} /> : <div className="flex size-14 items-center justify-center rounded-md bg-muted"><ImageIcon className="size-4 text-muted-foreground" /></div>}</TableCell>
            <TableCell className="font-medium">{ru?.title || en?.title || 'Без названия'}</TableCell>
            <TableCell>{getRentalTypeLabel(item.type)}</TableCell>
            <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{item.slug}</code></TableCell>
            <TableCell>{ru?.priceText || en?.priceText || '—'}</TableCell>
            <TableCell><Badge variant={item.isActive ? 'default' : 'secondary'}>{item.isActive ? 'Активна' : 'Скрыта'}</Badge></TableCell>
            <TableCell>{item.sortOrder}</TableCell>
            <TableCell>{new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' }).format(item.updatedAt)}</TableCell>
            <TableCell><div className="flex justify-end gap-2"><Button asChild size="sm" variant="outline"><Link href={`/rentals/${item.id}`}>Редактировать</Link></Button><DeleteRentalItemDialog id={item.id} /></div></TableCell>
          </TableRow>
        );
      })}</TableBody>
    </Table></CardContent></Card>
  );
}
