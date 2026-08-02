import { Button } from '@ak-strannik/ui/components/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import { Pencil, Plus, UserRound } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DeleteDialog } from '../../../_components/delete-dialog';
import { EmptyState } from '../../../_components/empty-state';
import { MediaImage } from '../../../_components/media-image';
import { PageHeader } from '../../../_components/page-header';
import { deleteArtistContent } from './_actions/artist.actions';
import { getArtistContents } from './_lib/artist-queries';

export const metadata: Metadata = { title: 'Артисты' };
const fallback = 'Артист без русского названия';

export default async function ArtistsPage() {
  const records = await getArtistContents();
  return (
    <div className="space-y-8">
      <PageHeader
        action={
          <Button asChild>
            <Link href="/projects/artists/new">
              <Plus />
              Новый артист
            </Link>
          </Button>
        }
        description="Управление артистами и переводами."
        title="Артисты"
      />
      {records.length === 0 ? (
        <EmptyState
          actionHref="/projects/artists/new"
          actionLabel="Добавить артиста"
          description="Создайте первую карточку артиста."
          icon={UserRound}
          title="Артистов пока нет"
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
                    alt={`Изображение артиста «${title}»`}
                    className="aspect-video w-full"
                    fit="cover"
                    src={record.images[0]}
                  />
                ) : (
                  <div className="grid aspect-video place-items-center bg-muted/50">
                    <UserRound className="size-10 text-muted-foreground/60" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardFooter className="mt-auto gap-2">
                  <Button asChild className="flex-1" variant="outline">
                    <Link href={`/projects/artists/${record.id}/edit`}>
                      <Pencil />
                      Редактировать
                    </Link>
                  </Button>
                  <DeleteDialog
                    args={[record.id]}
                    deleteAction={deleteArtistContent}
                    description={
                      <span>
                        Артист «{title}» будет удалён вместе с переводами. Это
                        действие необратимо.
                      </span>
                    }
                    title="Удалить артиста?"
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
