'use client';

import * as React from 'react';
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui';
import { Button } from '@ak-strannik/ui/components/button';
import { cn } from '@ak-strannik/ui/lib/utils';

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogCancel = AlertDialogPrimitive.Cancel;
const AlertDialogAction = AlertDialogPrimitive.Action;

function AlertDialogContent({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs" />
      <AlertDialogPrimitive.Content className={cn('fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-background p-6 shadow-lg ring-1 ring-foreground/10', className)} {...props} />
    </AlertDialogPrimitive.Portal>
  );
}

function AlertDialogHeader(props: React.ComponentProps<'div'>) { return <div className="space-y-2" {...props} />; }
function AlertDialogFooter(props: React.ComponentProps<'div'>) { return <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end" {...props} />; }
function AlertDialogTitle(props: React.ComponentProps<typeof AlertDialogPrimitive.Title>) { return <AlertDialogPrimitive.Title className="text-lg font-semibold" {...props} />; }
function AlertDialogDescription(props: React.ComponentProps<typeof AlertDialogPrimitive.Description>) { return <AlertDialogPrimitive.Description className="text-sm text-muted-foreground" {...props} />; }

export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button as AlertDialogButton };
