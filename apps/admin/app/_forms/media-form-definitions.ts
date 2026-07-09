import { z } from "zod/v4";

const emptyToNull = (value: unknown) => (value === "" ? null : value);
const nullableText = z.preprocess(emptyToNull, z.string().nullable().optional());
const nullableInt = z.preprocess(
  emptyToNull,
  z.coerce.number().int().nullable().optional(),
);

export const mediaAssetUploadMetadataSchema = z.object({
  localeCode: z.string().min(1),
  title: nullableText,
  altText: nullableText,
  caption: nullableText,
  copyrightText: nullableText,
});

export const mediaAssetEditSchema = z.object({
  id: z.string().min(1),
  originalFilename: nullableText,
  status: z.enum([
    "pending",
    "processing",
    "ready",
    "failed",
    "deleting",
    "deleted",
  ]),
  width: nullableInt,
  height: nullableInt,
  localeCode: z.string().min(1),
  title: nullableText,
  altText: nullableText,
  caption: nullableText,
  copyrightText: nullableText,
});

export type MediaAssetUploadMetadataValues = z.input<
  typeof mediaAssetUploadMetadataSchema
>;
export type MediaAssetEditValues = z.input<typeof mediaAssetEditSchema>;
