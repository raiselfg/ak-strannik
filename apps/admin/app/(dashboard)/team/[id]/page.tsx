import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageBreadcrumbs } from '../../../_components/page-breadcrumbs';
import { PageHeader } from '../../../_components/page-header';
import { getImageMediaOptions } from '../../../../features/media/queries';
import { DeleteDialog } from '../../../_components/delete-dialog';
import { deleteTeamMemberAction } from '../../../../features/team/actions';
import { TeamMemberForm } from '../../../../features/team/team-member-form';
import { getTeamMemberById } from '../../../../features/team/queries';

export const metadata: Metadata = {
  title: 'Редактирование участника команды',
};

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [member, mediaOptions] = await Promise.all([
    getTeamMemberById(id),
    getImageMediaOptions(),
  ]);
  if (!member) notFound();
  return (
    <div className="space-y-8">
      <div>
        <PageBreadcrumbs
          items={[
            { label: 'Команда', href: '/team' },
            { label: 'Редактирование' },
          ]}
        />
        <PageHeader
          title="Редактирование участника"
          description="Измените настройки профиля и его переводы."
        />
      </div>
      <TeamMemberForm
        mode="edit"
        teamMemberId={member.id}
        defaultValues={member.defaultValues}
        mediaOptions={mediaOptions}
      />
      <div className="rounded-xl border border-destructive/30 p-5">
        <h2 className="font-semibold">Опасная зона</h2>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          Удаление участника и его переводов нельзя отменить.
        </p>
        <DeleteDialog
          args={[member.id]}
          deleteAction={deleteTeamMemberAction}
          description="Участник и его переводы будут удалены. Это действие нельзя отменить."
          redirectTo="/team"
          title="Удалить участника?"
        />
      </div>
    </div>
  );
}
