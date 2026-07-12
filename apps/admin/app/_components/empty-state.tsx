import { Button } from '@ak-strannik/ui/components/button';
import { Card, CardContent } from '@ak-strannik/ui/components/card';
import type { LucideIcon } from 'lucide-react';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <Card className="border-dashed bg-muted/10 py-12 shadow-none">
      <CardContent className="flex flex-col items-center text-center">
        <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-muted">
          <Icon className="size-6 text-muted-foreground" />
        </span>
        <h2 className="font-semibold">{title}</h2>
        <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        {actionLabel && actionHref ? (
          <Button asChild className="mt-5">
            <Link href={actionHref}>
              <Plus />
              {actionLabel}
            </Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
