import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '../../../../../_components/page-header';
import { ThankYouNoteForm } from '../../_components/thank-you-note-form';
import { getThankYouNoteContent } from '../../_lib/thank-you-note-queries';

export const metadata: Metadata = {
  title: 'Редактирование благодарственного письма',
};

export default async function EditThankYouNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const note = await getThankYouNoteContent(id);
  if (!note) notFound();
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        description="Замените или удалите выбранное изображение в форме."
        title="Редактирование благодарственного письма"
      />
      <ThankYouNoteForm
        initialValues={{ image: note.image }}
        noteId={note.id}
      />
    </div>
  );
}
