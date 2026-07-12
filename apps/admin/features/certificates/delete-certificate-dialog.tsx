'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@ak-strannik/ui/components/alert-dialog';
import { Button } from '@ak-strannik/ui/components/button';
import { toast } from '@ak-strannik/ui/components/sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteCertificateAction } from './actions';

export function DeleteCertificateDialog({
  id,
  redirectAfterDelete = false,
}: {
  id: string;
  redirectAfterDelete?: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    const result = await deleteCertificateAction(id);
    setPending(false);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    if (redirectAfterDelete) router.push('/certificates');
    else router.refresh();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Удалить</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить сертификат?</AlertDialogTitle>
          <AlertDialogDescription>
            Сертификат и его переводы будут удалены. Изображение останется в
            медиатеке. Это действие нельзя отменить.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Отмена</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              disabled={pending}
              onClick={handleDelete}
              variant="destructive"
            >
              {pending ? 'Удаление…' : 'Удалить'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
