import { Button } from '@ak-strannik/ui/components/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import { PartyPopper, Pencil, Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DeleteDialog } from '../../../_components/delete-dialog';
import { EmptyState } from '../../../_components/empty-state';
import { MediaImage } from '../../../_components/media-image';
import { PageHeader } from '../../../_components/page-header';
import { deleteFestivalContent } from './_actions/festival.actions';
import { getFestivalContents } from './_lib/festival-queries';

export const metadata: Metadata = { title: 'Фестивали' };

export default async function FestivalPage() {
  const records = await getFestivalContents();
  return (
    <div className="space-y-8">
      <PageHeader
        action={
          <Button asChild>
            <Link href="/projects/festival/new">
              <Plus />
              Новый фестиваль
            </Link>
          </Button>
        }
        description="Управление фестивалями и их вложенными разделами."
        title="Фестивали"
      />
      {records.length === 0 ? (
        <EmptyState
          actionHref="/projects/festival/new"
          actionLabel="Добавить фестиваль"
          description="Создайте первую карточку фестиваля."
          icon={PartyPopper}
          title="Фестивалей пока нет"
        />
      ) : (
        <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {records.map((record) => {
            const title = record.translations[0]?.title || record.slug;
            const image = record.logo || record.images[0];
            return (
              <Card className="h-full" key={record.id}>
                {image ? (
                  <MediaImage
                    alt={`Изображение фестиваля «${title}»`}
                    className="aspect-video w-full"
                    fit="cover"
                    src={image}
                  />
                ) : (
                  <div className="grid aspect-video place-items-center bg-muted/50">
                    <PartyPopper className="size-10 text-muted-foreground/60" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    /{record.slug}
                  </p>
                </CardContent>
                <CardFooter className="mt-auto gap-2">
                  <Button asChild className="flex-1" variant="outline">
                    <Link href={`/projects/festival/${record.id}/edit`}>
                      <Pencil />
                      Редактировать
                    </Link>
                  </Button>
                  <DeleteDialog
                    args={[record.id]}
                    deleteAction={deleteFestivalContent}
                    description={
                      <span>
                        Фестиваль «{title}» и все вложенные данные будут
                        удалены. Это действие необратимо.
                      </span>
                    }
                    title="Удалить фестиваль?"
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
