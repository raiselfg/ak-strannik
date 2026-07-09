/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { prisma } from "@ak-strannik/database";
import { notFound } from "next/navigation";
import {
  adminEntities,
  getAdminEntity,
} from "../../_config/admin-entities";
import { CrudActionLink } from "../../_components/crud-action-link";
import { CrudPageHeader } from "../../_components/crud-page-header";
import { getFileUrl } from "../../../lib/s3cloud";

type EntityPageProps = {
  params: Promise<{ entity: string }>;
};

type MediaAssetListItem = {
  id: string;
  bucket: string;
  objectKey: string;
  originalFilename: string | null;
  sizeBytes: bigint;
  status: string;
  translations: {
    title: string | null;
  }[];
};

export function generateStaticParams() {
  return adminEntities.map((entity) => ({ entity: entity.slug }));
}

export default async function EntityListPage({ params }: EntityPageProps) {
  const { entity: entitySlug } = await params;
  const entity = getAdminEntity(entitySlug);

  if (!entity) {
    notFound();
  }

  if (entity.slug === "media-assets") {
    const assets = (await prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { translations: true },
    })) as MediaAssetListItem[];

    return (
      <>
        <CrudPageHeader
          entity={entity}
          title={entity.label}
          description="Upload, inspect, edit metadata and delete media files stored in S3."
        />

        <section className="rounded-md border border-foreground/10">
          <div className="grid grid-cols-[5rem_minmax(12rem,1fr)_8rem_8rem_14rem] border-b border-foreground/10 px-4 py-3 text-sm font-medium text-foreground/60">
            <span>Preview</span>
            <span>File</span>
            <span>Status</span>
            <span>Size</span>
            <span>Actions</span>
          </div>
          {assets.length ? (
            assets.map((asset) => {
              const fileUrl = getFileUrl(asset);
              const title =
                asset.translations[0]?.title ??
                asset.originalFilename ??
                asset.objectKey;

              return (
                <div
                  className="grid grid-cols-[5rem_minmax(12rem,1fr)_8rem_8rem_14rem] items-center border-b border-foreground/10 px-4 py-3 text-sm last:border-b-0"
                  key={asset.id}
                >
                  <img
                    alt=""
                    className="size-14 rounded-md border border-foreground/10 object-cover"
                    src={fileUrl}
                  />
                  <div className="min-w-0">
                    <Link
                      className="font-medium underline-offset-4 hover:underline"
                      href={`/entities/media-assets/${asset.id}`}
                    >
                      {title}
                    </Link>
                    <p className="truncate font-mono text-xs text-foreground/50">
                      {asset.objectKey}
                    </p>
                  </div>
                  <span>{asset.status}</span>
                  <span>{Math.ceil(Number(asset.sizeBytes) / 1024)} KB</span>
                  <div className="flex gap-2">
                    <CrudActionLink
                      href={`/entities/media-assets/${asset.id}/edit`}
                      tone="quiet"
                    >
                      Edit
                    </CrudActionLink>
                    <CrudActionLink
                      href={`/entities/media-assets/${asset.id}/delete`}
                      tone="danger"
                    >
                      Delete
                    </CrudActionLink>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-medium">No media uploaded yet</p>
              <p className="mt-1 text-sm text-foreground/60">
                Upload an image to create the first MediaAsset record.
              </p>
              <div className="mt-5">
                <CrudActionLink href="/entities/media-assets/new">
                  Upload media
                </CrudActionLink>
              </div>
            </div>
          )}
        </section>
      </>
    );
  }

  return (
    <>
      <CrudPageHeader
        entity={entity}
        title={entity.label}
        description={`Browse, create, edit and delete ${entity.label.toLowerCase()} records.`}
      />

      <section className="rounded-md border border-foreground/10">
        <div className="grid grid-cols-[minmax(12rem,1fr)_8rem_10rem_13rem] border-b border-foreground/10 px-4 py-3 text-sm font-medium text-foreground/60">
          <span>ID</span>
          <span>Status</span>
          <span>Updated</span>
          <span>Actions</span>
        </div>
        <div className="px-4 py-10 text-center">
          <p className="text-sm font-medium">No records loaded yet</p>
          <p className="mt-1 text-sm text-foreground/60">
            Wire this page to Prisma queries when the admin API is ready.
          </p>
          <div className="mt-5">
            <CrudActionLink href={`/entities/${entity.slug}/new`}>
              Create first record
            </CrudActionLink>
          </div>
        </div>
      </section>

      <div className="mt-6 text-sm text-foreground/60">
        Detail route pattern:{" "}
        <Link
          className="font-mono underline underline-offset-4"
          href={`/entities/${entity.slug}/example-id`}
        >
          /entities/{entity.slug}/example-id
        </Link>
      </div>
    </>
  );
}
