'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@ak-strannik/ui/components/alert-dialog';
import { Button } from '@ak-strannik/ui/components/button';
import { toast } from '@ak-strannik/ui/components/sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteProjectAction } from './actions';

export function DeleteProjectDialog({ id, sectionCount = 0, redirectAfterDelete = false }: { id: string; sectionCount?: number; redirectAfterDelete?: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  async function handleDelete() {
    setPending(true);
    const result = await deleteProjectAction(id);
    setPending(false);
    if (!result.success) return toast.error(result.message);
    toast.success(result.message);
    if (redirectAfterDelete) router.push('/projects'); else router.refresh();
  }
  return <AlertDialog><AlertDialogTrigger asChild><Button variant="destructive">Удалить</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Удалить проект?</AlertDialogTitle><AlertDialogDescription>Проект, его переводы и все вложенные секции будут удалены. Изображения останутся в медиатеке. Это действие нельзя отменить.{sectionCount ? ` В проекте находится секций: ${sectionCount}.` : ''}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel asChild><Button variant="outline">Отмена</Button></AlertDialogCancel><AlertDialogAction asChild><Button disabled={pending} onClick={handleDelete} variant="destructive">{pending ? 'Удаление…' : 'Удалить'}</Button></AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>;
}
