import { Button } from '@ak-strannik/ui/components/button';
import { Users } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { EmptyState } from '../../_components/empty-state';
import { PageBreadcrumbs } from '../../_components/page-breadcrumbs';
import { PageHeader } from '../../_components/page-header';
import { getTeamMembers } from '../../../features/team/queries';
import { TeamMembersTable } from '../../../features/team/team-members-table';

export const metadata: Metadata = { title: 'Команда' };

export default async function TeamPage() {
  const members = await getTeamMembers();
  return (
    <div className="space-y-8">
      <div><PageBreadcrumbs items={[{ label: 'Команда' }]} /><PageHeader title="Команда" description="Участники команды и информация для публичных страниц." action={<Button asChild><Link href="/team/new">Добавить участника</Link></Button>} /></div>
      {members.length ? <TeamMembersTable members={members} /> : <EmptyState icon={Users} title="Участники команды пока не добавлены" description="Добавьте первого участника команды, чтобы он появился на сайте." actionHref="/team/new" actionLabel="Добавить участника" />}
    </div>
  );
}
