"use server";

import { prisma } from "@ak-strannik/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteFile,
  getFileUrl,
  uploadMediaFile,
} from "../../lib/s3cloud";
import { requireAdminSession } from "../../lib/require-admin-session";
import {
  mediaAssetEditSchema,
  mediaAssetUploadMetadataSchema,
} from "../_forms/media-form-definitions";

type PrismaTransactionClient = Omit<
  typeof prisma,
  "$connect" | "$disconnect" | "$on" | "$use" | "$extends"
>;

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function revalidateMedia() {
  revalidatePath("/");
  revalidatePath("/entities/media-assets");
}

export async function uploadMediaAsset(formData: FormData) {
  await requireAdminSession();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Select a media file before uploading.");
  }

  const uploadMetadata = mediaAssetUploadMetadataSchema.parse({
    localeCode: textValue(formData, "localeCode") ?? "ru",
    title: textValue(formData, "title"),
    altText: textValue(formData, "altText"),
    caption: textValue(formData, "caption"),
    copyrightText: textValue(formData, "copyrightText"),
  });

  const uploaded = await uploadMediaFile(file);
  let assetId: string;

  try {
    const asset = await prisma.$transaction(async (tx: PrismaTransactionClient) => {
      const createdAsset = await tx.mediaAsset.create({
        data: {
          kind: "image",
          bucket: uploaded.bucket,
          objectKey: uploaded.objectKey,
          originalFilename: file.name || null,
          contentType: uploaded.contentType,
          sizeBytes: BigInt(uploaded.sizeBytes),
          width: uploaded.width,
          height: uploaded.height,
          status: "ready",
        },
      });

      await tx.mediaAssetTranslation.create({
        data: {
          mediaAssetId: createdAsset.id,
          localeCode: uploadMetadata.localeCode,
          title: uploadMetadata.title,
          altText: uploadMetadata.altText,
          caption: uploadMetadata.caption,
          copyrightText: uploadMetadata.copyrightText,
        },
      });

      return createdAsset;
    });

    assetId = asset.id;
  } catch (error) {
    await deleteFile(uploaded.url).catch((deleteError) => {
      console.error("Failed to delete uploaded media after DB error.", {
        deleteError,
        objectKey: uploaded.objectKey,
      });
    });
    throw error;
  }

  revalidateMedia();
  redirect(`/entities/media-assets/${assetId}`);
}

export async function updateMediaAssetMetadata(formData: FormData) {
  await requireAdminSession();
  const values = mediaAssetEditSchema.parse({
    id: textValue(formData, "id"),
    originalFilename: textValue(formData, "originalFilename"),
    status: textValue(formData, "status") ?? "ready",
    width: textValue(formData, "width"),
    height: textValue(formData, "height"),
    localeCode: textValue(formData, "localeCode") ?? "ru",
    title: textValue(formData, "title"),
    altText: textValue(formData, "altText"),
    caption: textValue(formData, "caption"),
    copyrightText: textValue(formData, "copyrightText"),
  });
  const id = values.id;

  if (!id) {
    throw new Error("Media asset id is required.");
  }

  await prisma.mediaAsset.update({
    where: { id },
    data: {
      originalFilename: values.originalFilename,
      status: values.status,
      width: values.width,
      height: values.height,
    },
  });

  const localeCode = values.localeCode;

  if (localeCode) {
    await prisma.mediaAssetTranslation.upsert({
      where: {
        mediaAssetId_localeCode: {
          mediaAssetId: id,
          localeCode,
        },
      },
      create: {
        mediaAssetId: id,
        localeCode,
        title: values.title,
        altText: values.altText,
        caption: values.caption,
        copyrightText: values.copyrightText,
      },
      update: {
        title: values.title,
        altText: values.altText,
        caption: values.caption,
        copyrightText: values.copyrightText,
      },
    });
  }

  revalidateMedia();
  revalidatePath(`/entities/media-assets/${id}`);
  redirect(`/entities/media-assets/${id}`);
}

export async function deleteMediaAssetWithFile(formData: FormData) {
  await requireAdminSession();
  const id = textValue(formData, "id");

  if (!id) {
    throw new Error("Media asset id is required.");
  }

  const asset = await prisma.mediaAsset.findUnique({
    where: { id },
    select: {
      bucket: true,
      objectKey: true,
      variants: {
        select: {
          bucket: true,
          objectKey: true,
        },
      },
    },
  });

  if (!asset) {
    throw new Error("Media asset was not found.");
  }

  await prisma.mediaAsset.update({
    where: { id },
    data: { status: "deleting" },
  });
  await prisma.mediaAsset.delete({ where: { id } });

  const deletedFiles = await Promise.allSettled([
    deleteFile(getFileUrl(asset)),
    ...asset.variants.map(
      (variant: { bucket: string; objectKey: string }) =>
        deleteFile(getFileUrl(variant)),
    ),
  ]);
  const failedDeletes = deletedFiles.filter(
    (result) => result.status === "rejected",
  );

  if (failedDeletes.length > 0) {
    throw new Error("Media record was deleted, but some S3 files remain.");
  }

  revalidateMedia();
  redirect("/entities/media-assets");
}
