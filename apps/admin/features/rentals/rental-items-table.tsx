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
import { deleteRentalItemAction } from './actions';
import { getRentalTypeLabel } from './constants';
import type { getRentalItems } from './queries';

type RentalItem = Awaited<ReturnType<typeof getRentalItems>>[number];

export function RentalItemsTable({ items }: { items: RentalItem[] }) {
  return (
    <Card>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Изображение</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Галерея</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Порядок</TableHead>
              <TableHead>Обновлено</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const ru = item.translations.find(
                (translation) => translation.locale === 'ru'
              );
              const en = item.translations.find(
                (translation) => translation.locale === 'en'
              );
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.image ? (
                      <MediaPreview
                        alt={item.image.originalName}
                        className="size-14 rounded-md border"
                        url={item.image.publicUrl}
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
                  <TableCell>{getRentalTypeLabel(item.type)}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {item.slug}
                    </code>
                  </TableCell>
                  <TableCell>{ru?.priceText || en?.priceText || '—'}</TableCell>
                  <TableCell>{item._count.images}</TableCell>
                  <TableCell>
                    <Badge variant={item.isActive ? 'default' : 'secondary'}>
                      {item.isActive ? 'Активна' : 'Скрыта'}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.sortOrder}</TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat('ru-RU', {
                      dateStyle: 'medium',
                    }).format(item.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/rentals/${item.id}`}>Редактировать</Link>
                      </Button>
                      <DeleteDialog
                        args={[item.id]}
                        deleteAction={deleteRentalItemAction}
                        description="Позиция и её переводы будут удалены. Изображение останется в медиатеке. Это действие нельзя отменить."
                        title="Удалить позицию аренды?"
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
