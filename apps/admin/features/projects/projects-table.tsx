import { Badge } from '@ak-strannik/ui/components/badge';
import { Button } from '@ak-strannik/ui/components/button';
import { Card, CardContent } from '@ak-strannik/ui/components/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ak-strannik/ui/components/table';
import { ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { getContentStatusLabel } from '../events/constants';
import { MediaPreview } from '../media/media-preview';
import { getProjectTypeLabel } from './constants';
import { DeleteProjectDialog } from './delete-project-dialog';
import type { ProjectsResult } from './types';

type Project = ProjectsResult[number];

export function ProjectsTable({ projects }: { projects: Project[] }) {
  return <Card><CardContent className="px-0"><Table><TableHeader><TableRow><TableHead>Обложка</TableHead><TableHead>Название</TableHead><TableHead>Тип</TableHead><TableHead>Статус</TableHead><TableHead>Slug</TableHead><TableHead>Секции</TableHead><TableHead>Порядок</TableHead><TableHead>Обновлено</TableHead><TableHead className="text-right">Действия</TableHead></TableRow></TableHeader><TableBody>{projects.map((project) => {
    const ru = project.translations.find((item) => item.locale === 'ru');
    const en = project.translations.find((item) => item.locale === 'en');
    return <TableRow key={project.id}><TableCell>{project.coverImage ? <MediaPreview alt={project.coverImage.originalName} className="size-14 rounded-md border" url={project.coverImage.publicUrl} /> : <div className="flex size-14 items-center justify-center rounded-md bg-muted"><ImageIcon className="size-4 text-muted-foreground" /></div>}</TableCell><TableCell className="font-medium">{ru?.title || en?.title || 'Без названия'}</TableCell><TableCell>{getProjectTypeLabel(project.type)}</TableCell><TableCell><Badge variant={project.status === 'published' ? 'default' : 'secondary'}>{getContentStatusLabel(project.status)}</Badge></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{project.slug}</code></TableCell><TableCell>Секций: {project._count.sections}</TableCell><TableCell>{project.sortOrder}</TableCell><TableCell>{new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' }).format(project.updatedAt)}</TableCell><TableCell><div className="flex justify-end gap-2"><Button asChild size="sm" variant="outline"><Link href={`/projects/${project.id}`}>Редактировать</Link></Button><DeleteProjectDialog id={project.id} sectionCount={project._count.sections} /></div></TableCell></TableRow>;
  })}</TableBody></Table></CardContent></Card>;
}
