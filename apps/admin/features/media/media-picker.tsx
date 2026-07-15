'use client';

import { Button } from '@ak-strannik/ui/components/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@ak-strannik/ui/components/field';
import { Input } from '@ak-strannik/ui/components/input';
import { Select } from '@ak-strannik/ui/components/select';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ALLOWED_MEDIA_MIME_TYPES } from './constants';
import { MediaPreview } from './media-preview';

export type MediaOption = {
  id: string;
  originalName: string;
  publicUrl: string;
  alt: string;
};

export type PendingMedia = {
  id: string;
  file: File;
  previewUrl: string;
};

type GalleryItem = { mediaId: string; sortOrder: number };

function fileToPending(file: File): PendingMedia {
  return {
    id: crypto.randomUUID(),
    file,
    previewUrl: URL.createObjectURL(file),
  };
}

export function MediaSinglePicker({
  id,
  label,
  value,
  onChange,
  mediaOptions,
  pendingFile,
  onPendingFileChange,
  emptyLabel = 'Без изображения',
  description,
  error,
  previewClassName = 'h-56 rounded-lg border',
}: {
  id: string;
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  mediaOptions: MediaOption[];
  pendingFile: PendingMedia | null;
  onPendingFileChange: (value: PendingMedia | null) => void;
  emptyLabel?: string;
  description?: string;
  error?: string;
  previewClassName?: string;
}) {
  const selected = mediaOptions.find((asset) => asset.id === value);
  const preview = pendingFile
    ? { url: pendingFile.previewUrl, alt: pendingFile.file.name }
    : selected
      ? { url: selected.publicUrl, alt: selected.alt }
      : null;

  function selectFile(file: File | null) {
    if (!file) return;
    if (pendingFile) URL.revokeObjectURL(pendingFile.previewUrl);
    const pending = fileToPending(file);
    onPendingFileChange(pending);
    onChange(pending.id);
  }

  function selectExisting(nextValue: string) {
    if (pendingFile) URL.revokeObjectURL(pendingFile.previewUrl);
    onPendingFileChange(null);
    onChange(nextValue || null);
  }

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {preview ? (
        <MediaPreview
          alt={preview.alt}
          className={previewClassName}
          url={preview.url}
        />
      ) : null}
      <Select
        id={id}
        value={value ?? ''}
        onChange={(event) => selectExisting(event.target.value)}
      >
        <option value="">{emptyLabel}</option>
        {pendingFile ? (
          <option value={pendingFile.id}>
            Новый файл: {pendingFile.file.name}
          </option>
        ) : null}
        {mediaOptions.map((asset) => (
          <option key={asset.id} value={asset.id}>
            {asset.originalName}
          </option>
        ))}
      </Select>
      <Input
        accept={ALLOWED_MEDIA_MIME_TYPES.join(',')}
        id={`${id}-upload`}
        type="file"
        onChange={(event) => {
          selectFile(event.target.files?.[0] ?? null);
          event.currentTarget.value = '';
        }}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}

export function MediaGalleryPicker({
  id,
  value,
  onChange,
  mediaOptions,
  pendingFiles,
  onPendingFilesChange,
  error,
  description = 'Добавляйте изображения из медиатеки или локальные файлы и меняйте порядок кнопками.',
}: {
  id: string;
  value: GalleryItem[];
  onChange: (value: GalleryItem[]) => void;
  mediaOptions: MediaOption[];
  pendingFiles: PendingMedia[];
  onPendingFilesChange: (value: PendingMedia[]) => void;
  error?: string;
  description?: string;
}) {
  const [selectedId, setSelectedId] = useState('');
  const selectedIds = new Set(value.map((item) => item.mediaId));
  const available = mediaOptions.filter((asset) => !selectedIds.has(asset.id));

  function normalize(items: GalleryItem[]) {
    onChange(items.map((item, index) => ({ ...item, sortOrder: index })));
  }

  function addExisting() {
    if (!selectedId || selectedIds.has(selectedId)) return;
    normalize([...value, { mediaId: selectedId, sortOrder: value.length }]);
    setSelectedId('');
  }

  function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const next = Array.from(files).map(fileToPending);
    onPendingFilesChange([...pendingFiles, ...next]);
    normalize([
      ...value,
      ...next.map((item, index) => ({
        mediaId: item.id,
        sortOrder: value.length + index,
      })),
    ]);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    const current = next[index];
    const targetItem = next[target];
    if (!current || !targetItem) return;
    next[index] = targetItem;
    next[target] = current;
    normalize(next);
  }

  function remove(index: number) {
    const item = value[index];
    if (!item) return;
    const pending = pendingFiles.find((file) => file.id === item.mediaId);
    if (pending) {
      URL.revokeObjectURL(pending.previewUrl);
      onPendingFilesChange(
        pendingFiles.filter((file) => file.id !== pending.id)
      );
    }
    normalize(value.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>Галерея</FieldLabel>
      <div className="flex flex-wrap gap-2">
        <Select
          id={id}
          value={selectedId}
          onChange={(event) => setSelectedId(event.target.value)}
        >
          <option value="">Выберите изображение</option>
          {available.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.originalName}
            </option>
          ))}
        </Select>
        <Button
          disabled={!selectedId}
          onClick={addExisting}
          type="button"
          variant="outline"
        >
          <Plus />
          Добавить
        </Button>
      </div>
      <Input
        accept={ALLOWED_MEDIA_MIME_TYPES.join(',')}
        id={`${id}-upload`}
        multiple
        type="file"
        onChange={(event) => {
          addFiles(event.target.files);
          event.currentTarget.value = '';
        }}
      />
      <FieldDescription>{description}</FieldDescription>
      {value.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {value.map((item, index) => {
            const pending = pendingFiles.find(
              (file) => file.id === item.mediaId
            );
            const asset = mediaOptions.find(
              (option) => option.id === item.mediaId
            );
            const preview = pending
              ? { url: pending.previewUrl, alt: pending.file.name }
              : asset
                ? { url: asset.publicUrl, alt: asset.alt }
                : null;
            return (
              <div
                className="space-y-2 rounded-lg border p-2"
                key={item.mediaId}
              >
                {preview ? (
                  <MediaPreview
                    alt={preview.alt}
                    className="aspect-video rounded-md"
                    url={preview.url}
                  />
                ) : (
                  <div className="aspect-video rounded-md bg-muted" />
                )}
                <p
                  className="truncate text-xs"
                  title={pending?.file.name ?? asset?.originalName}
                >
                  {pending?.file.name ?? asset?.originalName ?? item.mediaId}
                </p>
                <div className="flex gap-1">
                  <Button
                    aria-label="Переместить вверх"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    size="icon-sm"
                    type="button"
                    variant="outline"
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    aria-label="Переместить вниз"
                    disabled={index === value.length - 1}
                    onClick={() => move(index, 1)}
                    size="icon-sm"
                    type="button"
                    variant="outline"
                  >
                    <ArrowDown />
                  </Button>
                  <Button
                    aria-label="Удалить из галереи"
                    className="ml-auto"
                    onClick={() => remove(index)}
                    size="icon-sm"
                    type="button"
                    variant="destructive"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Галерея пока пуста
        </p>
      )}
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}
