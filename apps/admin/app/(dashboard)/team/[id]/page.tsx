import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageBreadcrumbs } from '../../../_components/page-breadcrumbs';
import { PageHeader } from '../../../_components/page-header';
import { DeleteTeamMemberDialog } from '../../../../features/team/delete-team-member-dialog';
import { TeamMemberForm } from '../../../../features/team/team-member-form';
import { getTeamMemberById, getTeamMemberMediaOptions } from '../../../../features/team/queries';

export const metadata: Metadata = {
  title: 'Редактирование участника команды',
};

export default async function TeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [member, mediaOptions] = await Promise.all([getTeamMemberById(id), getTeamMemberMediaOptions()]);
  if (!member) notFound();
  return (
    <div className="space-y-8">
      <div><PageBreadcrumbs items={[{ label: 'Команда', href: '/team' }, { label: 'Редактирование' }]} /><PageHeader title="Редактирование участника" description="Измените настройки профиля и его переводы." /></div>
      <TeamMemberForm mode="edit" teamMemberId={member.id} defaultValues={member.defaultValues} mediaOptions={mediaOptions} />
      <div className="rounded-xl border border-destructive/30 p-5"><h2 className="font-semibold">Опасная зона</h2><p className="mb-4 mt-1 text-sm text-muted-foreground">Удаление участника и его переводов нельзя отменить.</p><DeleteTeamMemberDialog id={member.id} redirectAfterDelete /></div>
    </div>
  );
}
