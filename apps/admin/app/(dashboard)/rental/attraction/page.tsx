import { Button } from '@ak-strannik/ui/components/button';
import { Card, CardContent, CardFooter } from '@ak-strannik/ui/components/card';
import { FerrisWheel, Pencil, Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DeleteDialog } from '../../../_components/delete-dialog';
import { EmptyState } from '../../../_components/empty-state';
import { MediaImage } from '../../../_components/media-image';
import { PageHeader } from '../../../_components/page-header';
import { deleteAttractionContent } from './_actions/attraction.actions';
import { getAttractionContents } from './_lib/attraction-queries';
export const metadata: Metadata = { title: 'Аттракционы' };
const fallback = 'Аттракцион без русского описания';
function preview(value: string | null | undefined) {
  if (!value) return fallback;
  return value.length > 120 ? `${value.slice(0, 117)}…` : value;
}
export default async function AttractionsPage() {
  const records = await getAttractionContents();
  return (
    <div className="space-y-8">
      <PageHeader
        action={
          <Button asChild>
            <Link href="/rental/attraction/new">
              <Plus />
              Новый аттракцион
            </Link>
          </Button>
        }
        description="Управление аттракционами и переводами."
        title="Аттракционы"
      />
      {records.length === 0 ? (
        <EmptyState
          actionHref="/rental/attraction/new"
          actionLabel="Добавить аттракцион"
          description="Создайте первую карточку аттракциона."
          icon={FerrisWheel}
          title="Аттракционов пока нет"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {records.map((record) => {
            const text = preview(
              record.translations.find((item) => item.locale === 'ru')?.text
            );
            return (
              <Card key={record.id}>
                <MediaImage
                  alt="Изображение аттракциона"
                  className="aspect-video w-full"
                  fit="cover"
                  src={record.image}
                />
                <CardContent>
                  <p className="line-clamp-3 leading-6">{text}</p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button asChild className="flex-1" variant="outline">
                    <Link href={`/rental/attraction/${record.id}/edit`}>
                      <Pencil />
                      Редактировать
                    </Link>
                  </Button>
                  <DeleteDialog
                    args={[record.id]}
                    deleteAction={deleteAttractionContent}
                    description={
                      <span>
                        Аттракцион «{text}» будет удалён вместе с переводами.
                        Это действие необратимо.
                      </span>
                    }
                    title="Удалить аттракцион?"
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
