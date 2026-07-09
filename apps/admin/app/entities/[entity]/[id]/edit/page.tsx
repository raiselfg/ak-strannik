import { prisma } from "@ak-strannik/database";
import { notFound } from "next/navigation";
import {
  crudEntities,
  getCrudEntity,
} from "../../../../_config/admin-entities";
import { CrudPageHeader } from "../../../../_components/crud-page-header";
import { EntityForm } from "../../../../_components/entity-form";
import { MediaAssetEditForm } from "../../../../_components/media-asset-form";

type EditEntityPageProps = {
  params: Promise<{ entity: string; id: string }>;
};

export function generateStaticParams() {
  return crudEntities.map((entity) => ({
    entity: entity.slug,
    id: "example-id",
  }));
}

export default async function EditEntityPage({ params }: EditEntityPageProps) {
  const { entity: entitySlug, id } = await params;
  const entity = getCrudEntity(entitySlug);

  if (!entity) {
    notFound();
  }

  if (entity.slug === "media-assets") {
    const asset = await prisma.mediaAsset.findUnique({
      where: { id },
      include: { translations: true },
    });

    if (!asset) {
      notFound();
    }

    return (
      <>
        <CrudPageHeader
          entity={entity}
          title="Edit media metadata"
          description={`Update MediaAsset ${id} metadata and translation fields.`}
          showCreate={false}
        />
        <MediaAssetEditForm asset={asset} />
      </>
    );
  }

  return (
    <>
      <CrudPageHeader
        entity={entity}
        title={`Edit ${entity.label}`}
        description={`Update ${entity.model} record ${id}.`}
        showCreate={false}
      />
      <EntityForm entity={entity} mode="edit" recordId={id} />
    </>
  );
}
