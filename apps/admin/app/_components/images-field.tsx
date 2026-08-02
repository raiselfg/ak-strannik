'use client';

import { Button } from '@ak-strannik/ui/components/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@ak-strannik/ui/components/field';
import { ArrowDown, ArrowUp, ImagePlus, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImage } from '../_actions/upload-image.action';
import { MediaImage } from './media-image';

const maxImageSize = 4 * 1024 * 1024;

export function ImagesField({
  disabled,
  images,
  label,
  onChange,
  onUploadingChange,
}: {
  disabled: boolean;
  images: string[];
  label: string;
  onChange: (images: string[]) => void;
  onUploadingChange: (uploading: boolean) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadFiles = useCallback(
    async (files: File[]) => {
      setError(null);
      setUploading(true);
      onUploadingChange(true);
      let nextImages = images;

      try {
        for (const file of files) {
          const formData = new FormData();
          formData.set('file', file);
          const result = await uploadImage(formData);
          if (!result.success) {
            setError(result.message);
            continue;
          }
          if (!result.data) {
            setError('Сервер не вернул адрес загруженного изображения');
            continue;
          }
          nextImages = [...nextImages, result.data.url];
          onChange(nextImages);
        }
      } finally {
        setUploading(false);
        onUploadingChange(false);
      }
    },
    [images, onChange, onUploadingChange]
  );

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    disabled: disabled || uploading,
    maxSize: maxImageSize,
    noClick: false,
    onDropAccepted: uploadFiles,
    onDropRejected: (rejections) => {
      const tooLarge = rejections.some((rejection) =>
        rejection.errors.some((item) => item.code === 'file-too-large')
      );
      setError(
        tooLarge
          ? 'Размер каждого изображения не должен превышать 4 МБ'
          : 'Можно загружать только изображения'
      );
    },
  });

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const reordered = [...images];
    [reordered[index], reordered[target]] = [
      reordered[target]!,
      reordered[index]!,
    ];
    onChange(reordered);
  }

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <div
        {...getRootProps({
          className: `flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'bg-muted/20'
          } ${disabled || uploading ? 'pointer-events-none opacity-60' : ''}`,
        })}
      >
        <input {...getInputProps()} />
        <ImagePlus className="mb-3 size-6 text-muted-foreground" />
        <p className="text-sm font-medium">
          {uploading
            ? 'Загрузка…'
            : 'Перетащите изображения или выберите файлы'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          До 4 МБ на файл, количество не ограничено
        </p>
      </div>
      <FieldDescription>
        Порядок изображений изменяется кнопками вверх и вниз.
      </FieldDescription>
      {error ? <FieldError>{error}</FieldError> : null}

      {images.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((url, index) => (
            <div
              className="overflow-hidden rounded-xl border bg-card"
              key={`${url}-${index}`}
            >
              <MediaImage
                alt={`Изображение ${index + 1}`}
                className="aspect-video w-full"
                fit="cover"
                src={url}
              />
              <div className="flex items-center justify-between gap-2 p-2">
                <span className="truncate text-xs text-muted-foreground">
                  {index + 1}. {url}
                </span>
                <div className="flex shrink-0 gap-1">
                  <Button
                    aria-label="Переместить изображение вверх"
                    disabled={disabled || uploading || index === 0}
                    onClick={() => move(index, -1)}
                    size="icon-sm"
                    type="button"
                    variant="outline"
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    aria-label="Переместить изображение вниз"
                    disabled={
                      disabled || uploading || index === images.length - 1
                    }
                    onClick={() => move(index, 1)}
                    size="icon-sm"
                    type="button"
                    variant="outline"
                  >
                    <ArrowDown />
                  </Button>
                  <Button
                    aria-label="Убрать изображение"
                    disabled={disabled || uploading}
                    onClick={() =>
                      onChange(
                        images.filter((_, itemIndex) => itemIndex !== index)
                      )
                    }
                    size="icon-sm"
                    type="button"
                    variant="destructive"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </Field>
  );
}
