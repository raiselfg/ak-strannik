import type { UpdateFestivalContentDto } from '@ak-strannik/types/festival';
import type { Metadata } from 'next';
import { PageHeader } from '../../../../_components/page-header';
import { FestivalContentForm } from '../_components/festival-content-form';

export const metadata: Metadata = { title: 'Новый фестиваль' };

const initialValues: UpdateFestivalContentDto = {
  logo: '',
  slug: '',
  images: [],
  videos: [],
  achievements: [],
  socials: [],
  translations: [
    { locale: 'ru', title: '' },
    { locale: 'en', title: '' },
  ],
  events: [],
  nominations: null,
  jury: null,
  organizations: null,
};

export default function NewFestivalPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        description="Заполните все необходимые разделы фестиваля."
        title="Новый фестиваль"
      />
      <FestivalContentForm initialValues={initialValues} />
    </div>
  );
}
