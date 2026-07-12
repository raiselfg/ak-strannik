'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@ak-strannik/ui/components/alert-dialog';
import { Button } from '@ak-strannik/ui/components/button';
import { toast } from '@ak-strannik/ui/components/sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteMediaAssetAction } from './actions';

export function DeleteMediaAssetDialog({ id, usage }: { id: string; usage: string[] }) {
  const router = useRouter(); const [pending, setPending] = useState(false);
  async function remove() { setPending(true); const result = await deleteMediaAssetAction(id); setPending(false); if (!result.success) return toast.error(result.message); toast.success(result.message); router.push('/media'); }
  const inUse = usage.length > 0;
  return <div className="space-y-2"><AlertDialog><AlertDialogTrigger asChild><Button variant="destructive" disabled={inUse}>Удалить медиафайл</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Удалить медиафайл?</AlertDialogTitle><AlertDialogDescription>Файл будет удалён из хранилища и медиатеки. Это действие нельзя отменить.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel asChild><Button variant="outline">Отмена</Button></AlertDialogCancel><AlertDialogAction asChild><Button variant="destructive" disabled={pending} onClick={remove}>{pending ? 'Удаление…' : 'Удалить'}</Button></AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>{inUse ? <p className="text-sm text-destructive">Файл используется: {usage.join(', ')}. Удаление запрещено.</p> : null}</div>;
}
