import { Button } from '@ak-strannik/ui/components/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import { HandHeart, Pencil, Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DeleteDialog } from '../../../_components/delete-dialog';
import { EmptyState } from '../../../_components/empty-state';
import { PageHeader } from '../../../_components/page-header';
import { deleteCharityContent } from './_actions/charity.actions';
import { getCharityContents } from './_lib/charity-queries';

export const metadata: Metadata = { title: 'Благотворительность' };
const titleFallback = 'Благотворительный проект без русского названия';

export default async function CharityPage() {
  const records = await getCharityContents();
  return (
    <div className="space-y-8">
      <PageHeader
        action={
          <Button asChild>
            <Link href="/about/charity/new">
              <Plus />
              Новый проект
            </Link>
          </Button>
        }
        description="Управление благотворительными проектами и переводами."
        title="Благотворительность"
      />
      {records.length === 0 ? (
        <EmptyState
          actionHref="/about/charity/new"
          actionLabel="Добавить проект"
          description="Создайте первую карточку благотворительного проекта."
          icon={HandHeart}
          title="Проектов пока нет"
        />
      ) : (
        <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {records.map((record) => {
            const title =
              record.translations.find(
                (translation) => translation.locale === 'ru'
              )?.title || titleFallback;
            return (
              <Card className="h-full" key={record.id}>
                {record.images[0] ? (
                  <div
                    aria-label={`Изображение проекта «${title}»`}
                    className="aspect-video bg-muted bg-cover bg-center"
                    role="img"
                    style={{
                      backgroundImage: `url(${JSON.stringify(record.images[0])})`,
                    }}
                  />
                ) : (
                  <div className="grid aspect-video place-items-center bg-muted/50">
                    <HandHeart className="size-10 text-muted-foreground/60" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardFooter className="mt-auto gap-2">
                  <Button asChild className="flex-1" variant="outline">
                    <Link href={`/about/charity/${record.id}/edit`}>
                      <Pencil />
                      Редактировать
                    </Link>
                  </Button>
                  <DeleteDialog
                    args={[record.id]}
                    deleteAction={deleteCharityContent}
                    description={
                      <span>
                        Проект «{title}» будет удалён вместе с переводами. Это
                        действие необратимо.
                      </span>
                    }
                    title="Удалить благотворительный проект?"
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
