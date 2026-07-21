import type { CreateThankYouNoteContentDto } from '@ak-strannik/types';
import type { Metadata } from 'next';
import { PageHeader } from '../../../../_components/page-header';
import { ThankYouNoteForm } from '../_components/thank-you-note-form';

export const metadata: Metadata = { title: 'Новое благодарственное письмо' };
const initialValues: CreateThankYouNoteContentDto = { image: '' };

export default function NewThankYouNotePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        description="Загрузите изображение благодарственного письма."
        title="Новое благодарственное письмо"
      />
      <ThankYouNoteForm initialValues={initialValues} />
    </div>
  );
}
