import { Button } from '@ak-strannik/ui/components/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import { Images, Pencil, Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DeleteDialog } from '../../../_components/delete-dialog';
import { EmptyState } from '../../../_components/empty-state';
import { MediaImage } from '../../../_components/media-image';
import { PageHeader } from '../../../_components/page-header';
import { deleteExhibitionContent } from './_actions/exhibition.actions';
import { getExhibitionContents } from './_lib/exhibition-queries';
export const metadata: Metadata = { title: 'Выставки' };
const fallback = 'Выставка без русского названия';
export default async function ExhibitionsPage() {
  const records = await getExhibitionContents();
  return (
    <div className="space-y-8">
      <PageHeader
        action={
          <Button asChild>
            <Link href="/projects/exhibitions/new">
              <Plus />
              Новая выставка
            </Link>
          </Button>
        }
        description="Управление выставками и переводами."
        title="Выставки"
      />
      {records.length === 0 ? (
        <EmptyState
          actionHref="/projects/exhibitions/new"
          actionLabel="Добавить выставку"
          description="Создайте первую карточку выставки."
          icon={Images}
          title="Выставок пока нет"
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
                    alt={`Изображение выставки «${title}»`}
                    className="aspect-video w-full"
                    fit="cover"
                    src={record.images[0]}
                  />
                ) : (
                  <div className="grid aspect-video place-items-center bg-muted/50">
                    <Images className="size-10 text-muted-foreground/60" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardFooter className="mt-auto gap-2">
                  <Button asChild className="flex-1" variant="outline">
                    <Link href={`/projects/exhibitions/${record.id}/edit`}>
                      <Pencil />
                      Редактировать
                    </Link>
                  </Button>
                  <DeleteDialog
                    args={[record.id]}
                    deleteAction={deleteExhibitionContent}
                    description={
                      <span>
                        Выставка «{title}» будет удалена вместе с переводами.
                        Это действие необратимо.
                      </span>
                    }
                    title="Удалить выставку?"
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
