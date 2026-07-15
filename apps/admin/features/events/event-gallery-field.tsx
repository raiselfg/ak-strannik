'use client';

import {
  MediaGalleryPicker,
  type MediaOption,
  type PendingMedia,
} from '../media/media-picker';

export type EventMediaOption = MediaOption;
export type GalleryItem = { mediaId: string; sortOrder: number };

export function EventGalleryField({
  value,
  onChange,
  mediaOptions,
  pendingFiles,
  onPendingFilesChange,
  error,
}: {
  value: GalleryItem[];
  onChange: (value: GalleryItem[]) => void;
  mediaOptions: EventMediaOption[];
  pendingFiles: PendingMedia[];
  onPendingFilesChange: (value: PendingMedia[]) => void;
  error?: string;
}) {
  return (
    <MediaGalleryPicker
      error={error}
      id="media-gallery-select"
      mediaOptions={mediaOptions}
      onChange={onChange}
      onPendingFilesChange={onPendingFilesChange}
      pendingFiles={pendingFiles}
      value={value}
    />
  );
}
