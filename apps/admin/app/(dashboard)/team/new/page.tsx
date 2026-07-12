import type { Metadata } from 'next';
import { PageBreadcrumbs } from '../../../_components/page-breadcrumbs';
import { PageHeader } from '../../../_components/page-header';
import { getTeamMemberMediaOptions } from '../../../../features/team/queries';
import { TeamMemberForm } from '../../../../features/team/team-member-form';

export const metadata: Metadata = { title: 'Новый участник команды' };

export default async function NewTeamMemberPage() {
  const mediaOptions = await getTeamMemberMediaOptions();
  return (
    <div className="space-y-8">
      <div><PageBreadcrumbs items={[{ label: 'Команда', href: '/team' }, { label: 'Новый участник' }]} /><PageHeader title="Новый участник команды" description="Добавьте основную информацию и переводы профиля участника." /></div>
      <TeamMemberForm mode="create" mediaOptions={mediaOptions} />
    </div>
  );
}
