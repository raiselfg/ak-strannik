'use client';

import {
  EventGalleryField,
  type EventMediaOption,
} from '../events/event-gallery-field';
import type { PendingMedia } from '../media/media-picker';

export type ProjectSectionMediaOption = EventMediaOption;

export function ProjectSectionMediaField({
  value,
  onChange,
  mediaOptions,
  pendingFiles,
  onPendingFilesChange,
  error,
}: {
  value: Array<{ mediaId: string; sortOrder: number }>;
  onChange: (value: Array<{ mediaId: string; sortOrder: number }>) => void;
  mediaOptions: ProjectSectionMediaOption[];
  pendingFiles: PendingMedia[];
  onPendingFilesChange: (value: PendingMedia[]) => void;
  error?: string;
}) {
  return (
    <EventGalleryField
      error={error}
      mediaOptions={mediaOptions}
      onChange={onChange}
      onPendingFilesChange={onPendingFilesChange}
      pendingFiles={pendingFiles}
      value={value}
    />
  );
}
