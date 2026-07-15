'use client';

import { Button } from '@ak-strannik/ui/components/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@ak-strannik/ui/components/field';
import { Select } from '@ak-strannik/ui/components/select';
import { ArrowDown, ArrowUp, Plus, Trash2, Upload } from 'lucide-react';
import { useDropzone, type Accept, type FileRejection } from 'react-dropzone';
import { useState } from 'react';
import {
  ALLOWED_MEDIA_MIME_TYPES,
  MAX_MEDIA_FILE_SIZE,
  MEDIA_EXTENSIONS,
} from './constants';
import { formatFileSize } from './format';
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

const IMAGE_ACCEPT = Object.fromEntries(
  ALLOWED_MEDIA_MIME_TYPES.map((mimeType) => [
    mimeType,
    MEDIA_EXTENSIONS[mimeType].map((extension) => `.${extension}`),
  ])
) as Accept;

function fileToPending(file: File): PendingMedia {
  return {
    id: crypto.randomUUID(),
    file,
    previewUrl: URL.createObjectURL(file),
  };
}

function rejectionMessages(rejections: readonly FileRejection[]) {
  const messages = new Set<string>();
  for (const rejection of rejections) {
    for (const error of rejection.errors) {
      if (error.code === 'too-many-files') {
        messages.add('Можно выбрать только одно изображение');
      } else if (error.code === 'file-invalid-type') {
        messages.add(`${rejection.file.name}: неподдерживаемый формат`);
      } else if (error.code === 'file-too-large') {
        messages.add(
          `${rejection.file.name}: размер превышает ${formatFileSize(MAX_MEDIA_FILE_SIZE)}`
        );
      } else {
        messages.add(`${rejection.file.name}: файл не принят`);
      }
    }
  }
  return [...messages];
}

function ImageDropZone({
  id,
  multiple,
  onAccepted,
}: {
  id: string;
  multiple: boolean;
  onAccepted: (files: File[]) => void;
}) {
  const {
    fileRejections,
    getInputProps,
    getRootProps,
    isDragAccept,
    isDragActive,
    isDragReject,
  } = useDropzone({
    accept: IMAGE_ACCEPT,
    maxSize: MAX_MEDIA_FILE_SIZE,
    multiple,
    onDropAccepted: onAccepted,
  });
  const errors = rejectionMessages(fileRejections);
  const stateClass = isDragReject
    ? 'border-destructive bg-destructive/5'
    : isDragAccept
      ? 'border-primary bg-primary/5'
      : 'border-muted-foreground/30 hover:border-primary/60 hover:bg-muted/40';
  const message = isDragReject
    ? 'Некоторые файлы не подходят'
    : isDragActive
      ? 'Отпустите файлы здесь'
      : multiple
        ? 'Перетащите изображения сюда или нажмите, чтобы выбрать'
        : 'Перетащите изображение сюда или нажмите, чтобы выбрать';

  return (
    <div className="space-y-2">
      <div
        {...getRootProps({
          'aria-label': multiple
            ? 'Добавить изображения'
            : 'Добавить изображение',
          className: `flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${stateClass}`,
          role: 'button',
        })}
      >
        <input {...getInputProps({ id })} />
        <Upload className="size-6 text-muted-foreground" />
        <p className="text-sm font-medium">{message}</p>
        <p className="text-xs text-muted-foreground">
          JPG, PNG, WebP или AVIF до {formatFileSize(MAX_MEDIA_FILE_SIZE)}
        </p>
      </div>
      {errors.map((message) => (
        <FieldError key={message}>{message}</FieldError>
      ))}
    </div>
  );
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
      <ImageDropZone
        id={`${id}-upload`}
        multiple={false}
        onAccepted={(files) => selectFile(files[0] ?? null)}
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

  function addFiles(files: File[]) {
    if (!files.length) return;
    const next = files.map(fileToPending);
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
      <ImageDropZone id={`${id}-upload`} multiple onAccepted={addFiles} />
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
