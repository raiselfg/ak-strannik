import { z } from 'zod';

export const MediaKindSchema = z.enum(['image', 'video', 'document']);
export type MediaKind = z.infer<typeof MediaKindSchema>;

export const MediaStatusSchema = z.enum(['pending', 'ready', 'failed']);
export type MediaStatus = z.infer<typeof MediaStatusSchema>;

export const MediaAssetSummarySchema = z.object({
  id: z.uuid(),
  kind: MediaKindSchema,
  bucket: z.string().min(1),
  objectKey: z.string().min(1),
  status: MediaStatusSchema,
  filename: z.string().optional(),
  contentType: z.string().optional(),
  sizeBytes: z.number().int().nonnegative().optional(),
  publicUrl: z.url().optional(),
  createdAt: z.iso.datetime().optional(),
  updatedAt: z.iso.datetime().optional(),
});
export type MediaAssetSummary = z.infer<typeof MediaAssetSummarySchema>;

export const MediaAssetDetailsSchema = MediaAssetSummarySchema.extend({
  checksumSha256: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});
export type MediaAssetDetails = z.infer<typeof MediaAssetDetailsSchema>;

export const PresignUploadRequestSchema = z.object({
  kind: MediaKindSchema,
  filename: z.string().trim().min(1).max(255),
  contentType: z.string().trim().min(1),
  sizeBytes: z.number().int().positive(),
});
export type PresignUploadRequest = z.infer<typeof PresignUploadRequestSchema>;

export const PresignUploadResponseSchema = z.object({
  media: MediaAssetSummarySchema,
  upload: z.object({
    method: z.literal('PUT'),
    url: z.url(),
    headers: z.record(z.string(), z.string()),
    expiresAt: z.iso.datetime(),
  }),
});
export type PresignUploadResponse = z.infer<typeof PresignUploadResponseSchema>;

export const CompleteUploadRequestSchema = z.object({
  checksumSha256: z.string().min(1).optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});
export type CompleteUploadRequest = z.infer<typeof CompleteUploadRequestSchema>;

export const UpdateMediaRequestSchema = z.object({
  filename: z.string().trim().min(1).max(255).optional(),
  status: MediaStatusSchema.optional(),
});
export type UpdateMediaRequest = z.infer<typeof UpdateMediaRequestSchema>;

export const MediaListResponseSchema = z.object({
  items: z.array(MediaAssetSummarySchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
});
export type MediaListResponse = z.infer<typeof MediaListResponseSchema>;

export const MediaAssetResponseSchema = z.object({
  media: MediaAssetDetailsSchema,
});
export type MediaAssetResponse = z.infer<typeof MediaAssetResponseSchema>;
