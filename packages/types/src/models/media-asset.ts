import { z } from 'zod';
import { IdSchema, DateTimeSchema } from './common';

export const MediaAssetSchema = z.object({
  id: IdSchema,
  objectKey: z.string(),
  checksumSha256: z.string().nullable(),
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number().int().nullable(),
  width: z.number().int().nullable(),
  height: z.number().int().nullable(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export const CreateMediaAssetDtoSchema = MediaAssetSchema.pick({
  objectKey: true,
  checksumSha256: true,
  originalName: true,
  mimeType: true,
  size: true,
  width: true,
  height: true,
}).partial({ checksumSha256: true, size: true, width: true, height: true });
export const UpdateMediaAssetDtoSchema = CreateMediaAssetDtoSchema.partial();
export const FindOneMediaAssetDtoSchema = z.object({ id: IdSchema });
export const DeleteMediaAssetDtoSchema = FindOneMediaAssetDtoSchema;
export type MediaAsset = z.infer<typeof MediaAssetSchema>;
export type CreateMediaAssetDto = z.infer<typeof CreateMediaAssetDtoSchema>;
export type UpdateMediaAssetDto = z.infer<typeof UpdateMediaAssetDtoSchema>;
export type FindOneMediaAssetDto = z.infer<typeof FindOneMediaAssetDtoSchema>;
export type DeleteMediaAssetDto = z.infer<typeof DeleteMediaAssetDtoSchema>;
