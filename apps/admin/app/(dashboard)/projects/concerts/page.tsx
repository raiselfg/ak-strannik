import { Button } from '@ak-strannik/ui/components/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import { Music, Pencil, Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DeleteDialog } from '../../../_components/delete-dialog';
import { EmptyState } from '../../../_components/empty-state';
import { MediaImage } from '../../../_components/media-image';
import { PageHeader } from '../../../_components/page-header';
import { deleteConcertContent } from './_actions/concert.actions';
import { getConcertContents } from './_lib/concert-queries';
export const metadata: Metadata = { title: 'Концерты' };
const fallback = 'Концерт без русского названия';
export default async function ConcertsPage() {
  const records = await getConcertContents();
  return (
    <div className="space-y-8">
      <PageHeader
        action={
          <Button asChild>
            <Link href="/projects/concerts/new">
              <Plus />
              Новый концерт
            </Link>
          </Button>
        }
        description="Управление концертами и переводами."
        title="Концерты"
      />
      {records.length === 0 ? (
        <EmptyState
          actionHref="/projects/concerts/new"
          actionLabel="Добавить концерт"
          description="Создайте первую карточку концерта."
          icon={Music}
          title="Концертов пока нет"
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
                    alt={`Изображение концерта «${title}»`}
                    className="aspect-video w-full"
                    fit="cover"
                    src={record.images[0]}
                  />
                ) : (
                  <div className="grid aspect-video place-items-center bg-muted/50">
                    <Music className="size-10 text-muted-foreground/60" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardFooter className="gap-2">
                  <Button asChild className="flex-1" variant="outline">
                    <Link href={`/projects/concerts/${record.id}/edit`}>
                      <Pencil />
                      Редактировать
                    </Link>
                  </Button>
                  <DeleteDialog
                    args={[record.id]}
                    deleteAction={deleteConcertContent}
                    description={
                      <span>
                        Концерт «{title}» будет удалён вместе с переводами. Это
                        действие необратимо.
                      </span>
                    }
                    title="Удалить концерт?"
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
