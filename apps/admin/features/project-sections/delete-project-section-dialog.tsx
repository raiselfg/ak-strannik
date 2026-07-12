'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@ak-strannik/ui/components/alert-dialog';
import { Button } from '@ak-strannik/ui/components/button';
import { toast } from '@ak-strannik/ui/components/sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteProjectSectionAction } from './actions';

export function DeleteProjectSectionDialog({ projectId, sectionId, redirectAfterDelete = false }: { projectId: string; sectionId: string; redirectAfterDelete?: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  async function handleDelete() {
    setPending(true);
    const result = await deleteProjectSectionAction(projectId, sectionId);
    setPending(false);
    if (!result.success) return toast.error(result.message);
    toast.success(result.message);
    if (redirectAfterDelete) router.push(`/projects/${projectId}`); else router.refresh();
  }
  return <AlertDialog><AlertDialogTrigger asChild><Button variant="destructive">Удалить</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Удалить секцию?</AlertDialogTitle><AlertDialogDescription>Секция, её переводы и связи с медиафайлами будут удалены. Сами файлы останутся в медиатеке. Это действие нельзя отменить.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel asChild><Button variant="outline">Отмена</Button></AlertDialogCancel><AlertDialogAction asChild><Button disabled={pending} onClick={handleDelete} variant="destructive">{pending ? 'Удаление…' : 'Удалить'}</Button></AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>;
}
