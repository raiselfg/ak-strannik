import { Button } from '@ak-strannik/ui/components/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import { PackageOpen, Pencil, Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DeleteDialog } from '../../../_components/delete-dialog';
import { EmptyState } from '../../../_components/empty-state';
import { MediaImage } from '../../../_components/media-image';
import { PageHeader } from '../../../_components/page-header';
import { deleteRequisiteContent } from './_actions/requisite.actions';
import { getRequisiteContents } from './_lib/requisite-queries';

export const metadata: Metadata = { title: 'Реквизит' };
const fallback = 'Набор реквизита без русского названия';

export default async function RequisitePage() {
  const records = await getRequisiteContents();
  return (
    <div className="space-y-8">
      <PageHeader
        action={
          <Button asChild>
            <Link href="/rental/requisite/new">
              <Plus />
              Новый набор
            </Link>
          </Button>
        }
        description="Управление наборами и элементами реквизита."
        title="Реквизит"
      />
      {records.length === 0 ? (
        <EmptyState
          actionHref="/rental/requisite/new"
          actionLabel="Добавить набор"
          description="Создайте первый набор реквизита."
          icon={PackageOpen}
          title="Реквизита пока нет"
        />
      ) : (
        <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {records.map((record) => {
            const title = record.translations[0]?.title || fallback;
            const image = record.requisites[0]?.image;
            return (
              <Card className="h-full" key={record.id}>
                {image ? (
                  <MediaImage
                    alt={`Изображение набора «${title}»`}
                    className="aspect-video w-full"
                    fit="cover"
                    src={image}
                  />
                ) : (
                  <div className="grid aspect-video place-items-center bg-muted/50">
                    <PackageOpen className="size-10 text-muted-foreground/60" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Элементов: {record._count.requisites}
                  </p>
                </CardContent>
                <CardFooter className="mt-auto gap-2">
                  <Button asChild className="flex-1" variant="outline">
                    <Link href={`/rental/requisite/${record.id}/edit`}>
                      <Pencil />
                      Редактировать
                    </Link>
                  </Button>
                  <DeleteDialog
                    args={[record.id]}
                    deleteAction={deleteRequisiteContent}
                    description={
                      <span>
                        Набор «{title}» будет удалён вместе со всеми элементами
                        и переводами. Это действие необратимо.
                      </span>
                    }
                    title="Удалить набор реквизита?"
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
