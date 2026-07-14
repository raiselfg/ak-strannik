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
import { type ReactNode, useState } from 'react';
import type { ActionResult } from '../../lib/action-utils';

export function DeleteDialog<TArgs extends string[]>({
  args,
  deleteAction,
  description,
  disabledReason,
  redirectTo,
  title,
  triggerLabel = 'Удалить',
}: {
  args: TArgs;
  deleteAction: (...args: TArgs) => Promise<ActionResult>;
  description: ReactNode;
  disabledReason?: string;
  redirectTo?: string;
  title: string;
  triggerLabel?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    try {
      const result = await deleteAction(...args);
      if (!result.success) return toast.error(result.message);
      toast.success(result.message);
      if (redirectTo) router.push(redirectTo);
      else router.refresh();
    } finally {
      setPending(false);
    }
  }

  const dialog = (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={Boolean(disabledReason)} variant="destructive">
          {triggerLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
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

  return disabledReason ? (
    <div className="space-y-2">
      {dialog}
      <p className="text-sm text-destructive">{disabledReason}</p>
    </div>
  ) : (
    dialog
  );
}
