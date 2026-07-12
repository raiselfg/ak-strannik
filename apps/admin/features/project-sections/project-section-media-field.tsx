'use client';

import {
  EventGalleryField,
  type EventMediaOption,
} from '../events/event-gallery-field';

export type ProjectSectionMediaOption = EventMediaOption;

export function ProjectSectionMediaField({
  value,
  onChange,
  mediaOptions,
  error,
}: {
  value: Array<{ mediaId: string; sortOrder: number }>;
  onChange: (value: Array<{ mediaId: string; sortOrder: number }>) => void;
  mediaOptions: ProjectSectionMediaOption[];
  error?: string;
}) {
  return (
    <EventGalleryField
      error={error}
      mediaOptions={mediaOptions}
      onChange={onChange}
      value={value}
    />
  );
}
