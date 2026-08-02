import { Button } from '@ak-strannik/ui/components/button';
import { Card, CardFooter } from '@ak-strannik/ui/components/card';
import { MailCheck, Pencil, Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DeleteDialog } from '../../../_components/delete-dialog';
import { EmptyState } from '../../../_components/empty-state';
import { MediaImage } from '../../../_components/media-image';
import { PageHeader } from '../../../_components/page-header';
import { deleteThankYouNoteContent } from './_actions/thank-you-note.actions';
import { getThankYouNoteContents } from './_lib/thank-you-note-queries';

export const metadata: Metadata = { title: 'Благодарственные письма' };

export default async function ThankYouNotesPage() {
  const notes = await getThankYouNoteContents();
  return (
    <div className="space-y-8">
      <PageHeader
        action={
          <Button asChild>
            <Link href="/about/thank-you-notes/new">
              <Plus />
              Новое письмо
            </Link>
          </Button>
        }
        description="Управление изображениями благодарственных писем."
        title="Благодарственные письма"
      />
      {notes.length === 0 ? (
        <EmptyState
          actionHref="/about/thank-you-notes/new"
          actionLabel="Добавить письмо"
          description="Добавьте первое изображение благодарственного письма."
          icon={MailCheck}
          title="Писем пока нет"
        />
      ) : (
        <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {notes.map((note, index) => (
            <Card className="h-full" key={note.id}>
              <MediaImage
                alt={`Благодарственное письмо ${index + 1}`}
                className="aspect-3/4 w-full"
                src={note.image}
              />
              <CardFooter className="mt-auto gap-2">
                <Button asChild className="flex-1" variant="outline">
                  <Link href={`/about/thank-you-notes/${note.id}/edit`}>
                    <Pencil />
                    Редактировать
                  </Link>
                </Button>
                <DeleteDialog
                  args={[note.id]}
                  deleteAction={deleteThankYouNoteContent}
                  description={
                    <span>
                      Благодарственное письмо №{index + 1} будет удалено. Это
                      действие необратимо.
                    </span>
                  }
                  title="Удалить благодарственное письмо?"
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
