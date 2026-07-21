import type { CreateTeamMemberDto } from '@ak-strannik/types';
import type { Metadata } from 'next';
import { PageHeader } from '../../../_components/page-header';
import { TeamForm } from '../_components/team-form';
export const metadata: Metadata = { title: 'Новый участник команды' };
const initialValues: CreateTeamMemberDto = {
  image: '',
  links: [],
  achievements: [],
  translations: [
    { locale: 'ru', name: '', role: '', bio: '' },
    { locale: 'en', name: '', role: '', bio: '' },
  ],
};
export default function NewTeamMemberPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        description="Заполните данные и переводы участника команды."
        title="Новый участник команды"
      />
      <TeamForm initialValues={initialValues} />
    </div>
  );
}
