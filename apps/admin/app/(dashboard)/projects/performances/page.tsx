import { Button } from '@ak-strannik/ui/components/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import { Pencil, Plus, Theater } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DeleteDialog } from '../../../_components/delete-dialog';
import { EmptyState } from '../../../_components/empty-state';
import { MediaImage } from '../../../_components/media-image';
import { PageHeader } from '../../../_components/page-header';
import { deletePerformancesContent } from './_actions/performances.actions';
import { getPerformancesContents } from './_lib/performances-queries';

export const metadata: Metadata = { title: 'Постановки' };
const fallback = 'Постановка без русского названия';

export default async function PerformancesPage() {
  const records = await getPerformancesContents();
  return (
    <div className="space-y-8">
      <PageHeader
        action={
          <Button asChild>
            <Link href="/projects/performances/new">
              <Plus />
              Новая постановка
            </Link>
          </Button>
        }
        description="Управление постановками, участниками и переводами."
        title="Постановки"
      />
      {records.length === 0 ? (
        <EmptyState
          actionHref="/projects/performances/new"
          actionLabel="Добавить постановку"
          description="Создайте первую карточку постановки."
          icon={Theater}
          title="Постановок пока нет"
        />
      ) : (
        <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {records.map((record) => {
            const title =
              record.translations.find((item) => item.locale === 'ru')?.title ||
              fallback;
            return (
              <Card className="h-full" key={record.id}>
                {record.images[0] ? (
                  <MediaImage
                    alt={`Изображение постановки «${title}»`}
                    className="aspect-video w-full"
                    fit="cover"
                    src={record.images[0]}
                  />
                ) : (
                  <div className="grid aspect-video place-items-center bg-muted/50">
                    <Theater className="size-10 text-muted-foreground/60" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Участников: {record._count.persons}
                  </p>
                </CardContent>
                <CardFooter className="mt-auto gap-2">
                  <Button asChild className="flex-1" variant="outline">
                    <Link href={`/projects/performances/${record.id}/edit`}>
                      <Pencil />
                      Редактировать
                    </Link>
                  </Button>
                  <DeleteDialog
                    args={[record.id]}
                    deleteAction={deletePerformancesContent}
                    description={
                      <span>
                        Постановка «{title}» будет удалена вместе с участниками
                        и переводами. Это действие необратимо.
                      </span>
                    }
                    title="Удалить постановку?"
                  />
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
