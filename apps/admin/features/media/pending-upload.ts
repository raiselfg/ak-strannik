'use client';

import {
  deleteMediaAssetAction,
  uploadMediaAssetAction,
  type UploadedMediaAsset,
} from './actions';
import type { MediaOption, PendingMedia } from './media-picker';

export type PendingMediaUploadResult =
  | {
      success: true;
      replacements: Map<string, string>;
      assets: UploadedMediaAsset[];
    }
  | { success: false; message: string };

export async function uploadPendingMedia(
  pendingFiles: PendingMedia[]
): Promise<PendingMediaUploadResult> {
  const replacements = new Map<string, string>();
  const assets: UploadedMediaAsset[] = [];
  for (const pending of pendingFiles) {
    const formData = new FormData();
    formData.set('file', pending.file);
    const result = await uploadMediaAssetAction(formData);
    if (!result.success) {
      await Promise.all(
        assets.map((asset) => deleteMediaAssetAction(asset.id))
      );
      return {
        success: false,
        message: `${pending.file.name}: ${result.message}`,
      };
    }
    replacements.set(pending.id, result.data.id);
    assets.push(result.data);
  }
  return { success: true, replacements, assets };
}

export function replacePendingId(
  value: string | null,
  replacements: Map<string, string>
) {
  return value ? (replacements.get(value) ?? value) : value;
}

export function replacePendingIds<T extends { mediaId: string }>(
  values: T[],
  replacements: Map<string, string>
) {
  return values.map((value) => ({
    ...value,
    mediaId: replacements.get(value.mediaId) ?? value.mediaId,
  }));
}

export function mergeMediaOptions(
  current: MediaOption[],
  uploaded: UploadedMediaAsset[]
) {
  const ids = new Set(current.map((asset) => asset.id));
  return [...uploaded.filter((asset) => !ids.has(asset.id)), ...current];
}
