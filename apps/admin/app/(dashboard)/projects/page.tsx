import { Button } from '@ak-strannik/ui/components/button';
import { FolderKanban } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { EmptyState } from '../../_components/empty-state';
import { PageBreadcrumbs } from '../../_components/page-breadcrumbs';
import { PageHeader } from '../../_components/page-header';
import { contentStatusOptions } from '../../../features/events/constants';
import { ContentStatusSchema } from '../../../features/events/schema';
import { projectTypeOptions } from '../../../features/projects/constants';
import { ProjectsTable } from '../../../features/projects/projects-table';
import { getProjects } from '../../../features/projects/queries';
import { ProjectTypeSchema } from '../../../features/projects/schema';

export const metadata: Metadata = { title: 'Проекты' };

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ status?: string; type?: string }> }) {
  const params = await searchParams;
  const parsedStatus = ContentStatusSchema.safeParse(params.status);
  const parsedType = ProjectTypeSchema.safeParse(params.type);
  const status = parsedStatus.success ? parsedStatus.data : undefined;
  const type = parsedType.success ? parsedType.data : undefined;
  const projects = await getProjects({ status, type });
  function href(next: { status?: string; type?: string }) {
    const query = new URLSearchParams();
    const nextStatus = next.status ?? status;
    const nextType = next.type ?? type;
    if (nextStatus) query.set('status', nextStatus);
    if (nextType) query.set('type', nextType);
    const value = query.toString();
    return value ? `/projects?${value}` : '/projects';
  }
  return (
    <div className="space-y-8"><div><PageBreadcrumbs items={[{ label: 'Проекты' }]} /><PageHeader action={<Button asChild><Link href="/projects/new">Добавить проект</Link></Button>} description="Управление проектами и структурой их публичных страниц." title="Проекты" /></div>
      <div className="space-y-2"><div className="flex flex-wrap gap-2"><Button asChild size="sm" variant={!status ? 'default' : 'outline'}><Link href={type ? `/projects?type=${type}` : '/projects'}>Все статусы</Link></Button>{contentStatusOptions.map((option) => <Button asChild key={option.value} size="sm" variant={status === option.value ? 'default' : 'outline'}><Link href={href({ status: option.value })}>{option.label}</Link></Button>)}</div><div className="flex flex-wrap gap-2"><Button asChild size="sm" variant={!type ? 'default' : 'outline'}><Link href={status ? `/projects?status=${status}` : '/projects'}>Все типы</Link></Button>{projectTypeOptions.map((option) => <Button asChild key={option.value} size="sm" variant={type === option.value ? 'default' : 'outline'}><Link href={href({ type: option.value })}>{option.label}</Link></Button>)}</div></div>
      {projects.length ? <ProjectsTable projects={projects} /> : <EmptyState actionHref="/projects/new" actionLabel="Добавить проект" description="Добавьте первый проект и настройте его содержимое." icon={FolderKanban} title="Проекты пока не добавлены" />}
    </div>
  );
}
