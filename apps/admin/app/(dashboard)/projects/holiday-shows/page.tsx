import { Button } from '@ak-strannik/ui/components/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import { Pencil, Plus, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DeleteDialog } from '../../../_components/delete-dialog';
import { EmptyState } from '../../../_components/empty-state';
import { MediaImage } from '../../../_components/media-image';
import { PageHeader } from '../../../_components/page-header';
import { deleteHolidayShowContent } from './_actions/holiday-show.actions';
import { getHolidayShowContents } from './_lib/holiday-show-queries';
export const metadata: Metadata = { title: 'Праздничные представления' };
const fallback = 'Представление без русского названия';
export default async function HolidayShowsPage() {
  const records = await getHolidayShowContents();
  return (
    <div className="space-y-8">
      <PageHeader
        action={
          <Button asChild>
            <Link href="/projects/holiday-shows/new">
              <Plus />
              Новое представление
            </Link>
          </Button>
        }
        description="Управление праздничными представлениями."
        title="Праздничные представления"
      />
      {records.length === 0 ? (
        <EmptyState
          actionHref="/projects/holiday-shows/new"
          actionLabel="Добавить представление"
          description="Создайте первую карточку представления."
          icon={Sparkles}
          title="Представлений пока нет"
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
                    alt={`Изображение представления «${title}»`}
                    className="aspect-video w-full"
                    fit="cover"
                    src={record.images[0]}
                  />
                ) : (
                  <div className="grid aspect-video place-items-center bg-muted/50">
                    <Sparkles className="size-10 text-muted-foreground/60" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardFooter className="gap-2">
                  <Button asChild className="flex-1" variant="outline">
                    <Link href={`/projects/holiday-shows/${record.id}/edit`}>
                      <Pencil />
                      Редактировать
                    </Link>
                  </Button>
                  <DeleteDialog
                    args={[record.id]}
                    deleteAction={deleteHolidayShowContent}
                    description={
                      <span>
                        Представление «{title}» будет удалено вместе с
                        переводами. Это действие необратимо.
                      </span>
                    }
                    title="Удалить представление?"
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
