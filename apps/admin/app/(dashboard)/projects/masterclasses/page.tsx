import { Button } from '@ak-strannik/ui/components/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import { GraduationCap, Pencil, Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DeleteDialog } from '../../../_components/delete-dialog';
import { EmptyState } from '../../../_components/empty-state';
import { MediaImage } from '../../../_components/media-image';
import { PageHeader } from '../../../_components/page-header';
import { deleteMasterclassesContent } from './_actions/masterclasses.actions';
import { getMasterclassesContents } from './_lib/masterclasses-queries';
export const metadata: Metadata = { title: 'Мастер-классы' };
const fallback = 'Мастер-класс без русского названия';
export default async function MasterclassesPage() {
  const records = await getMasterclassesContents();
  return (
    <div className="space-y-8">
      <PageHeader
        action={
          <Button asChild>
            <Link href="/projects/masterclasses/new">
              <Plus />
              Новый мастер-класс
            </Link>
          </Button>
        }
        description="Управление мастер-классами и переводами."
        title="Мастер-классы"
      />
      {records.length === 0 ? (
        <EmptyState
          actionHref="/projects/masterclasses/new"
          actionLabel="Добавить мастер-класс"
          description="Создайте первую карточку мастер-класса."
          icon={GraduationCap}
          title="Мастер-классов пока нет"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {records.map((record) => {
            const title =
              record.translations.find((item) => item.locale === 'ru')?.title ||
              fallback;
            return (
              <Card key={record.id}>
                {record.images[0] ? (
                  <MediaImage
                    alt={`Изображение мастер-класса «${title}»`}
                    className="aspect-video w-full"
                    fit="cover"
                    src={record.images[0]}
                  />
                ) : (
                  <div className="grid aspect-video place-items-center bg-muted/50">
                    <GraduationCap className="size-10 text-muted-foreground/60" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardFooter className="gap-2">
                  <Button asChild className="flex-1" variant="outline">
                    <Link href={`/projects/masterclasses/${record.id}/edit`}>
                      <Pencil />
                      Редактировать
                    </Link>
                  </Button>
                  <DeleteDialog
                    args={[record.id]}
                    deleteAction={deleteMasterclassesContent}
                    description={
                      <span>
                        Мастер-класс «{title}» будет удалён вместе с переводами.
                        Это действие необратимо.
                      </span>
                    }
                    title="Удалить мастер-класс?"
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
