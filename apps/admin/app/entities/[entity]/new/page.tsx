import { notFound } from "next/navigation";
import {
  crudEntities,
  getCrudEntity,
} from "../../../_config/admin-entities";
import { CrudPageHeader } from "../../../_components/crud-page-header";
import { EntityForm } from "../../../_components/entity-form";
import { MediaAssetUploadForm } from "../../../_components/media-asset-form";

type NewEntityPageProps = {
  params: Promise<{ entity: string }>;
};

export function generateStaticParams() {
  return crudEntities.map((entity) => ({ entity: entity.slug }));
}

export default async function NewEntityPage({ params }: NewEntityPageProps) {
  const { entity: entitySlug } = await params;
  const entity = getCrudEntity(entitySlug);

  if (!entity) {
    notFound();
  }

  if (entity.slug === "media-assets") {
    return (
      <>
        <CrudPageHeader
          entity={entity}
          title="Upload media"
          description="Upload an image to S3 and create a MediaAsset record."
          showCreate={false}
        />
        <MediaAssetUploadForm />
      </>
    );
  }

  return (
    <>
      <CrudPageHeader
        entity={entity}
        title={`Create ${entity.label}`}
        description={`Add a new ${entity.model} record.`}
        showCreate={false}
      />
      <EntityForm entity={entity} mode="create" />
    </>
  );
}
