import { Button } from '@ak-strannik/ui/components/button';
import { Card, CardContent, CardFooter } from '@ak-strannik/ui/components/card';
import { Pencil, Plus, Shirt } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DeleteDialog } from '../../../_components/delete-dialog';
import { EmptyState } from '../../../_components/empty-state';
import { MediaImage } from '../../../_components/media-image';
import { PageHeader } from '../../../_components/page-header';
import { deleteMascotCostumeContent } from './_actions/mascot-costume.actions';
import { getMascotCostumeContents } from './_lib/mascot-costume-queries';
export const metadata: Metadata = { title: 'Ростовые костюмы' };
const fallback = 'Костюм без русского описания';
function preview(value: string | null | undefined) {
  if (!value) return fallback;
  return value.length > 120 ? `${value.slice(0, 117)}…` : value;
}
export default async function MascotCostumesPage() {
  const records = await getMascotCostumeContents();
  return (
    <div className="space-y-8">
      <PageHeader
        action={
          <Button asChild>
            <Link href="/rental/mascot-costume/new">
              <Plus />
              Новый костюм
            </Link>
          </Button>
        }
        description="Управление ростовыми костюмами и переводами."
        title="Ростовые костюмы"
      />
      {records.length === 0 ? (
        <EmptyState
          actionHref="/rental/mascot-costume/new"
          actionLabel="Добавить костюм"
          description="Создайте первую карточку ростового костюма."
          icon={Shirt}
          title="Костюмов пока нет"
        />
      ) : (
        <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {records.map((record) => {
            const text = preview(
              record.translations.find((item) => item.locale === 'ru')?.text
            );
            return (
              <Card className="h-full" key={record.id}>
                <MediaImage
                  alt="Изображение ростового костюма"
                  className="aspect-video w-full"
                  fit="cover"
                  src={record.image}
                />
                <CardContent>
                  <p className="line-clamp-3 leading-6">{text}</p>
                </CardContent>
                <CardFooter className="mt-auto gap-2">
                  <Button asChild className="flex-1" variant="outline">
                    <Link href={`/rental/mascot-costume/${record.id}/edit`}>
                      <Pencil />
                      Редактировать
                    </Link>
                  </Button>
                  <DeleteDialog
                    args={[record.id]}
                    deleteAction={deleteMascotCostumeContent}
                    description={
                      <span>
                        Ростовой костюм «{text}» будет удалён вместе с
                        переводами. Это действие необратимо.
                      </span>
                    }
                    title="Удалить ростовой костюм?"
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
