import { notFound } from "next/navigation";
import {
  crudEntities,
  getCrudEntity,
} from "../../../../_config/admin-entities";
import { deleteCrudRecord } from "../../../../_actions/crud";
import { deleteMediaAssetWithFile } from "../../../../_actions/media";
import { CrudActionLink } from "../../../../_components/crud-action-link";
import { CrudPageHeader } from "../../../../_components/crud-page-header";
import { getDefaultEntityWhere } from "../../../../_forms/entity-form-definitions";

type DeleteEntityPageProps = {
  params: Promise<{ entity: string; id: string }>;
};

export function generateStaticParams() {
  return crudEntities.map((entity) => ({
    entity: entity.slug,
    id: "example-id",
  }));
}

export default async function DeleteEntityPage({
  params,
}: DeleteEntityPageProps) {
  const { entity: entitySlug, id } = await params;
  const entity = getCrudEntity(entitySlug);

  if (!entity) {
    notFound();
  }

  const defaultWhere = getDefaultEntityWhere(entity.slug, id);

  if (entity.slug === "media-assets") {
    return (
      <>
        <CrudPageHeader
          entity={entity}
          title="Delete media file"
          description={`Delete MediaAsset ${id} and remove its object from S3.`}
          showCreate={false}
        />

        <section className="max-w-2xl rounded-md border border-red-500/30 bg-red-500/5 p-5">
          <h2 className="text-lg font-semibold">Delete media file?</h2>
          <p className="mt-2 text-sm text-foreground/70">
            This removes both the Prisma MediaAsset record and the stored object.
          </p>
          <form action={deleteMediaAssetWithFile} className="mt-5 flex gap-2">
            <input name="id" type="hidden" value={id} />
            <CrudActionLink href={`/entities/media-assets/${id}`} tone="quiet">
              Cancel
            </CrudActionLink>
            <button
              className="inline-flex h-9 items-center justify-center rounded-md border border-red-500/30 px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10"
              type="submit"
            >
              Delete file
            </button>
          </form>
        </section>
      </>
    );
  }

  return (
    <>
      <CrudPageHeader
        entity={entity}
        title={`Delete ${entity.label}`}
        description={`Confirm deletion for ${entity.model} record ${id}.`}
        showCreate={false}
      />

      <section className="max-w-2xl rounded-md border border-red-500/30 bg-red-500/5 p-5">
        <h2 className="text-lg font-semibold">Delete record?</h2>
        <p className="mt-2 text-sm text-foreground/70">
          Review the Prisma where JSON before submitting this destructive
          action.
        </p>
        <form action={deleteCrudRecord} className="mt-5 grid gap-4">
          <input name="entitySlug" type="hidden" value={entity.slug} />
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="delete-where">
              Where
            </label>
            <textarea
              className="min-h-32 rounded-md border border-red-500/30 bg-transparent p-3 font-mono text-sm outline-none focus:border-red-500/60"
              defaultValue={defaultWhere}
              id="delete-where"
              name="where"
            />
          </div>
          <div className="flex gap-2">
            <CrudActionLink href={`/entities/${entity.slug}/${id}`} tone="quiet">
              Cancel
            </CrudActionLink>
            <button
              className="inline-flex h-9 items-center justify-center rounded-md border border-red-500/30 px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10"
              type="submit"
            >
              Delete
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
