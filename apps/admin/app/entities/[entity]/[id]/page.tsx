/* eslint-disable @next/next/no-img-element */
import { prisma } from "@ak-strannik/database";
import { notFound } from "next/navigation";
import {
  adminEntities,
  getAdminEntity,
} from "../../../_config/admin-entities";
import { CrudActionLink } from "../../../_components/crud-action-link";
import { CrudPageHeader } from "../../../_components/crud-page-header";
import { getFileUrl } from "../../../../lib/s3cloud";

type EntityDetailPageProps = {
  params: Promise<{ entity: string; id: string }>;
};

export function generateStaticParams() {
  return adminEntities.map((entity) => ({
    entity: entity.slug,
    id: "example-id",
  }));
}

export default async function EntityDetailPage({
  params,
}: EntityDetailPageProps) {
  const { entity: entitySlug, id } = await params;
  const entity = getAdminEntity(entitySlug);

  if (!entity) {
    notFound();
  }

  if (entity.slug === "media-assets") {
    const asset = await prisma.mediaAsset.findUnique({
      where: { id },
      include: { translations: true, variants: true },
    });

    if (!asset) {
      notFound();
    }

    const fileUrl = getFileUrl(asset);

    return (
      <>
        <CrudPageHeader
          entity={entity}
          title={asset.originalFilename ?? asset.objectKey}
          description={`MediaAsset ${asset.id}`}
          showCreate={false}
        />

        <div className="mb-6 flex gap-2">
          <CrudActionLink href={`/entities/media-assets/${id}/edit`} tone="quiet">
            Edit
          </CrudActionLink>
          <CrudActionLink
            href={`/entities/media-assets/${id}/delete`}
            tone="danger"
          >
            Delete
          </CrudActionLink>
        </div>

        <section className="grid gap-6 lg:grid-cols-[minmax(16rem,28rem)_1fr]">
          <img
            alt={asset.translations[0]?.altText ?? ""}
            className="w-full rounded-md border border-foreground/10 object-cover"
            src={fileUrl}
          />
          <dl className="rounded-md border border-foreground/10 text-sm">
            <div className="grid grid-cols-3 border-b border-foreground/10 p-4">
              <dt className="font-medium text-foreground/60">URL</dt>
              <dd className="col-span-2 break-all font-mono text-xs">
                <a href={fileUrl} rel="noreferrer" target="_blank">
                  {fileUrl}
                </a>
              </dd>
            </div>
            <div className="grid grid-cols-3 border-b border-foreground/10 p-4">
              <dt className="font-medium text-foreground/60">Status</dt>
              <dd className="col-span-2">{asset.status}</dd>
            </div>
            <div className="grid grid-cols-3 border-b border-foreground/10 p-4">
              <dt className="font-medium text-foreground/60">Size</dt>
              <dd className="col-span-2">
                {Math.ceil(Number(asset.sizeBytes) / 1024)} KB
              </dd>
            </div>
            <div className="grid grid-cols-3 border-b border-foreground/10 p-4">
              <dt className="font-medium text-foreground/60">Dimensions</dt>
              <dd className="col-span-2">
                {asset.width ?? "?"} x {asset.height ?? "?"}
              </dd>
            </div>
            <div className="grid grid-cols-3 p-4">
              <dt className="font-medium text-foreground/60">Translations</dt>
              <dd className="col-span-2">{asset.translations.length}</dd>
            </div>
          </dl>
        </section>
      </>
    );
  }

  return (
    <>
      <CrudPageHeader
        entity={entity}
        title={`${entity.label} record`}
        description={`Read view for ${entity.model} record ${id}.`}
        showCreate={false}
      />

      <div className="mb-6 flex gap-2">
        <CrudActionLink href={`/entities/${entity.slug}/${id}/edit`} tone="quiet">
          Edit
        </CrudActionLink>
        <CrudActionLink
          href={`/entities/${entity.slug}/${id}/delete`}
          tone="danger"
        >
          Delete
        </CrudActionLink>
      </div>

      <dl className="max-w-3xl rounded-md border border-foreground/10 text-sm">
        <div className="grid grid-cols-3 border-b border-foreground/10 p-4">
          <dt className="font-medium text-foreground/60">Model</dt>
          <dd className="col-span-2">{entity.model}</dd>
        </div>
        <div className="grid grid-cols-3 border-b border-foreground/10 p-4">
          <dt className="font-medium text-foreground/60">ID</dt>
          <dd className="col-span-2 font-mono">{id}</dd>
        </div>
        <div className="grid grid-cols-3 p-4">
          <dt className="font-medium text-foreground/60">Data</dt>
          <dd className="col-span-2 text-foreground/60">
            Connect this view to Prisma to display record fields.
          </dd>
        </div>
      </dl>
    </>
  );
}
