import { Button } from '@ak-strannik/ui/components/button';
import { Input } from '@ak-strannik/ui/components/input';
import type { LucideIcon } from 'lucide-react';
import { ListFilter, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { DataTablePlaceholder } from './data-table-placeholder';
import { EmptyState } from './empty-state';
import { PageHeader } from './page-header';

export function ListPage({
  title,
  description,
  actionLabel,
  actionHref,
  columns,
  emptyTitle,
  emptyDescription,
  icon,
  mediaAction = false,
}: {
  title: string;
  description: string;
  actionLabel: string;
  actionHref?: string;
  columns: readonly string[];
  emptyTitle: string;
  emptyDescription: string;
  icon: LucideIcon;
  mediaAction?: boolean;
}) {
  const action = actionHref ? (
    <Button asChild>
      <Link href={actionHref}>
        <Plus />
        {actionLabel}
      </Link>
    </Button>
  ) : (
    <Button disabled={mediaAction}>
      <Plus />
      {actionLabel}
    </Button>
  );

  return (
    <div className="space-y-7">
      <PageHeader action={action} description={description} title={title} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label={`Поиск: ${title}`}
            className="pl-9"
            placeholder="Поиск будет доступен позже"
            readOnly
          />
        </div>
        <Button disabled variant="outline">
          <ListFilter />
          Фильтры
        </Button>
      </div>

      <DataTablePlaceholder columns={columns}>
        <EmptyState
          actionHref={actionHref}
          actionLabel={actionHref ? actionLabel : undefined}
          description={emptyDescription}
          icon={icon}
          title={emptyTitle}
        />
      </DataTablePlaceholder>
    </div>
  );
}
