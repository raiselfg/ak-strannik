import { Button } from '@ak-strannik/ui/components/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import { Handshake, Pencil, Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DeleteDialog } from '../../../_components/delete-dialog';
import { EmptyState } from '../../../_components/empty-state';
import { PageHeader } from '../../../_components/page-header';
import { deletePartnerContent } from './_actions/partner.actions';
import { getPartnerContents } from './_lib/partner-queries';

export const metadata: Metadata = { title: 'Партнёры' };

const titleFallback = 'Партнёр без русского названия';

export default async function PartnersPage() {
  const partners = await getPartnerContents();

  return (
    <div className="space-y-8">
      <PageHeader
        action={
          <Button asChild>
            <Link href="/about/partners/new">
              <Plus />
              Новый партнёр
            </Link>
          </Button>
        }
        description="Управление партнёрами и их переводами."
        title="Партнёры"
      />

      {partners.length === 0 ? (
        <EmptyState
          actionHref="/about/partners/new"
          actionLabel="Добавить партнёра"
          description="Создайте первую карточку партнёра."
          icon={Handshake}
          title="Партнёров пока нет"
        />
      ) : (
        <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {partners.map((partner) => {
            const title =
              partner.translations.find(
                (translation) => translation.locale === 'ru'
              )?.title || titleFallback;

            return (
              <Card className="h-full" key={partner.id}>
                {partner.images[0] ? (
                  <div
                    aria-label={`Изображение партнёра «${title}»`}
                    className="aspect-video bg-muted bg-cover bg-center"
                    role="img"
                    style={{
                      backgroundImage: `url(${JSON.stringify(partner.images[0])})`,
                    }}
                  />
                ) : (
                  <div className="grid aspect-video place-items-center bg-muted/50">
                    <Handshake className="size-10 text-muted-foreground/60" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                {partner.link ? (
                  <CardContent>
                    <p className="truncate text-sm text-muted-foreground">
                      {partner.link}
                    </p>
                  </CardContent>
                ) : null}
                <CardFooter className="mt-auto gap-2">
                  <Button asChild className="flex-1" variant="outline">
                    <Link href={`/about/partners/${partner.id}/edit`}>
                      <Pencil />
                      Редактировать
                    </Link>
                  </Button>
                  <DeleteDialog
                    args={[partner.id]}
                    deleteAction={deletePartnerContent}
                    description={
                      <span>
                        Партнёр «{title}» будет удалён вместе с переводами. Это
                        действие необратимо.
                      </span>
                    }
                    title="Удалить партнёра?"
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
