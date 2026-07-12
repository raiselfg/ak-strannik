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
import { MediaPreview } from '../media/media-preview';
import { DeletePartnerDialog } from './delete-partner-dialog';
import type { PartnersResult } from './types';

type Partner = PartnersResult[number];

export function PartnersTable({ partners }: { partners: Partner[] }) {
  return (
    <Card><CardContent className="px-0">
      <Table>
        <TableHeader><TableRow>
          <TableHead>Логотип</TableHead>
          <TableHead>Название</TableHead>
          <TableHead>Сайт</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Порядок</TableHead>
          <TableHead>Обновлено</TableHead>
          <TableHead className="text-right">Действия</TableHead>
        </TableRow></TableHeader>
        <TableBody>{partners.map((partner) => {
          const translation = partner.translations.find((item) => item.locale === 'ru')
            ?? partner.translations.find((item) => item.locale === 'en');
          return (
            <TableRow key={partner.id}>
              <TableCell>
                {partner.logo ? (
                  <MediaPreview
                    alt={partner.logo.originalName}
                    className="size-12 rounded-md border"
                    url={partner.logo.publicUrl}
                  />
                ) : (
                  <div className="flex size-12 items-center justify-center rounded-md bg-muted">
                    <ImageIcon className="size-4 text-muted-foreground" />
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">
                {translation?.name || 'Без названия'}
              </TableCell>
              <TableCell>
                {partner.websiteUrl ? (
                  <a
                    className="max-w-56 truncate text-primary hover:underline"
                    href={partner.websiteUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {formatWebsiteUrl(partner.websiteUrl)}
                  </a>
                ) : '—'}
              </TableCell>
              <TableCell>
                <Badge variant={partner.isActive ? 'default' : 'secondary'}>
                  {partner.isActive ? 'Активен' : 'Скрыт'}
                </Badge>
              </TableCell>
              <TableCell>{partner.sortOrder}</TableCell>
              <TableCell>
                {new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' })
                  .format(partner.updatedAt)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/partners/${partner.id}`}>Редактировать</Link>
                  </Button>
                  <DeletePartnerDialog id={partner.id} />
                </div>
              </TableCell>
            </TableRow>
          );
        })}</TableBody>
      </Table>
    </CardContent></Card>
  );
}

function formatWebsiteUrl(value: string) {
  try {
    const url = new URL(value);
    const path = url.pathname === '/' ? '' : url.pathname.replace(/\/$/, '');
    return `${url.hostname}${path}`;
  } catch {
    return value;
  }
}
