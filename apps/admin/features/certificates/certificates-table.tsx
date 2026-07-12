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
import { DeleteCertificateDialog } from './delete-certificate-dialog';
import type { CertificatesResult } from './types';

type Certificate = CertificatesResult[number];

export function CertificatesTable({
  certificates,
}: {
  certificates: Certificate[];
}) {
  return (
    <Card><CardContent className="px-0">
      <Table>
        <TableHeader><TableRow>
          <TableHead>Изображение</TableHead>
          <TableHead>Название</TableHead>
          <TableHead>Организация</TableHead>
          <TableHead>Год</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Порядок</TableHead>
          <TableHead>Обновлено</TableHead>
          <TableHead className="text-right">Действия</TableHead>
        </TableRow></TableHeader>
        <TableBody>{certificates.map((certificate) => {
          const ru = certificate.translations.find((item) => item.locale === 'ru');
          const en = certificate.translations.find((item) => item.locale === 'en');
          return (
            <TableRow key={certificate.id}>
              <TableCell>
                {certificate.image ? (
                  <MediaPreview
                    alt={certificate.image.originalName}
                    className="h-16 w-12 rounded-md border"
                    url={certificate.image.publicUrl}
                  />
                ) : (
                  <div className="flex h-16 w-12 items-center justify-center rounded-md bg-muted">
                    <ImageIcon className="size-4 text-muted-foreground" />
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">
                {ru?.title || en?.title || 'Без названия'}
              </TableCell>
              <TableCell>{ru?.issuer || en?.issuer || '—'}</TableCell>
              <TableCell>{certificate.year ?? '—'}</TableCell>
              <TableCell>
                <Badge variant={certificate.isActive ? 'default' : 'secondary'}>
                  {certificate.isActive ? 'Активен' : 'Скрыт'}
                </Badge>
              </TableCell>
              <TableCell>{certificate.sortOrder}</TableCell>
              <TableCell>
                {new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' })
                  .format(certificate.updatedAt)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/certificates/${certificate.id}`}>
                      Редактировать
                    </Link>
                  </Button>
                  <DeleteCertificateDialog id={certificate.id} />
                </div>
              </TableCell>
            </TableRow>
          );
        })}</TableBody>
      </Table>
    </CardContent></Card>
  );
}
