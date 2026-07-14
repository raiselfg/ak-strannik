import { Badge } from '@ak-strannik/ui/components/badge';
import { Button } from '@ak-strannik/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ak-strannik/ui/components/table';
import { Layers3, Plus } from 'lucide-react';
import Link from 'next/link';
import { DeleteDialog } from '../../app/_components/delete-dialog';
import { deleteProjectSectionAction } from '../project-sections/actions';
import { getProjectSectionVariant } from '../project-sections/constants';
import type { getProjectById } from './queries';

type ProjectData = NonNullable<Awaited<ReturnType<typeof getProjectById>>>;

export function ProjectSectionsList({
  projectId,
  sections,
}: {
  projectId: string;
  sections: ProjectData['sections'];
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Секции проекта</CardTitle>
            <CardDescription>
              Секции формируют содержимое страницы проекта и отображаются в
              заданном порядке.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href={`/projects/${projectId}/sections/new`}>
              <Plus />
              Добавить секцию
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {sections.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Вариант</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Медиа</TableHead>
                <TableHead>Порядок</TableHead>
                <TableHead>Обновлено</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((section) => {
                const ru = section.translations.find(
                  (item) => item.locale === 'ru'
                );
                const en = section.translations.find(
                  (item) => item.locale === 'en'
                );
                const title =
                  ru?.title ||
                  en?.title ||
                  ru?.subtitle ||
                  'Секция без названия';
                return (
                  <TableRow key={section.id}>
                    <TableCell className="font-medium">{title}</TableCell>
                    <TableCell>
                      {getProjectSectionVariant(section.variant).label}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={section.isActive ? 'default' : 'secondary'}
                      >
                        {section.isActive ? 'Активна' : 'Скрыта'}
                      </Badge>
                    </TableCell>
                    <TableCell>{section._count.media}</TableCell>
                    <TableCell>{section.sortOrder}</TableCell>
                    <TableCell>
                      {new Intl.DateTimeFormat('ru-RU', {
                        dateStyle: 'medium',
                      }).format(section.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link
                            href={`/projects/${projectId}/sections/${section.id}`}
                          >
                            Редактировать
                          </Link>
                        </Button>
                        <DeleteDialog
                          args={[projectId, section.id]}
                          deleteAction={deleteProjectSectionAction}
                          description="Секция, её переводы и связи с медиафайлами будут удалены. Сами файлы останутся в медиатеке. Это действие нельзя отменить."
                          title="Удалить секцию?"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center rounded-lg border border-dashed px-4 py-10 text-center">
            <Layers3 className="mb-3 size-7 text-muted-foreground" />
            <p className="font-medium">Секции проекта пока не добавлены</p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Добавьте первую секцию, чтобы сформировать содержимое страницы
              проекта.
            </p>
            <Button asChild className="mt-5">
              <Link href={`/projects/${projectId}/sections/new`}>
                <Plus />
                Добавить секцию
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
