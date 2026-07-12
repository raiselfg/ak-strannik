import { Badge } from '@ak-strannik/ui/components/badge';
import { Button } from '@ak-strannik/ui/components/button';
import { Card, CardContent } from '@ak-strannik/ui/components/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ak-strannik/ui/components/table';
import { ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { DeleteTeamMemberDialog } from './delete-team-member-dialog';
import type { AwaitedReturn } from './types';

type Member = AwaitedReturn[number];

export function TeamMembersTable({ members }: { members: Member[] }) {
  return (
    <Card><CardContent className="px-0">
      <Table>
        <TableHeader><TableRow><TableHead>Фотография</TableHead><TableHead>Имя</TableHead><TableHead>Должность</TableHead><TableHead>Статус</TableHead><TableHead>Порядок</TableHead><TableHead>Обновлено</TableHead><TableHead className="text-right">Действия</TableHead></TableRow></TableHeader>
        <TableBody>{members.map((member) => {
          const translation = member.translations.find((item) => item.locale === 'ru') ?? member.translations.find((item) => item.locale === 'en');
          return <TableRow key={member.id}>
            <TableCell><div className="flex size-10 items-center justify-center rounded-md bg-muted" title={member.image?.originalName}>{member.image ? <ImageIcon className="size-4" /> : <span className="text-xs text-muted-foreground">—</span>}</div></TableCell>
            <TableCell className="font-medium">{translation?.name || 'Без имени'}</TableCell>
            <TableCell>{translation?.role || '—'}</TableCell>
            <TableCell><Badge variant={member.isActive ? 'default' : 'secondary'}>{member.isActive ? 'Активен' : 'Скрыт'}</Badge></TableCell>
            <TableCell>{member.sortOrder}</TableCell>
            <TableCell>{new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' }).format(member.updatedAt)}</TableCell>
            <TableCell><div className="flex justify-end gap-2"><Button asChild size="sm" variant="outline"><Link href={`/team/${member.id}`}>Редактировать</Link></Button><DeleteTeamMemberDialog id={member.id} /></div></TableCell>
          </TableRow>;
        })}</TableBody>
      </Table>
    </CardContent></Card>
  );
}
