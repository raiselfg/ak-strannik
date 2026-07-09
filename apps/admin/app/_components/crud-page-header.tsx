import type { AdminEntity } from "../_config/admin-entities";
import { CrudActionLink } from "./crud-action-link";

type CrudPageHeaderProps = {
  entity: AdminEntity;
  title: string;
  description: string;
  showCreate?: boolean;
};

export function CrudPageHeader({
  entity,
  title,
  description,
  showCreate = true,
}: CrudPageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-foreground/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-sm font-medium text-foreground/60">{entity.model}</p>
        <h1 className="mt-1 text-3xl font-semibold">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-foreground/65">
          {description}
        </p>
      </div>
      {showCreate ? (
        <CrudActionLink href={`/entities/${entity.slug}/new`}>
          Create
        </CrudActionLink>
      ) : null}
    </header>
  );
}
