'use client';

import { Button } from '@ak-strannik/ui/components/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@ak-strannik/ui/components/field';
import { ImagePlus, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImage } from '../_actions/upload-image.action';
import { MediaImage } from './media-image';

const maxImageSize = 4 * 1024 * 1024;

export function SingleImageField({
  disabled,
  image,
  label,
  onChange,
  onUploadingChange,
}: {
  disabled: boolean;
  image: string;
  label: string;
  onChange: (image: string) => void;
  onUploadingChange: (uploading: boolean) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadFile = useCallback(
    async ([file]: File[]) => {
      if (!file) return;
      setError(null);
      setUploading(true);
      onUploadingChange(true);
      try {
        const formData = new FormData();
        formData.set('file', file);
        const result = await uploadImage(formData);
        if (!result.success) return setError(result.message);
        if (!result.data) {
          return setError('Сервер не вернул адрес загруженного изображения');
        }
        onChange(result.data.url);
      } finally {
        setUploading(false);
        onUploadingChange(false);
      }
    },
    [onChange, onUploadingChange]
  );

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    disabled: disabled || uploading,
    maxFiles: 1,
    maxSize: maxImageSize,
    multiple: false,
    onDropAccepted: uploadFile,
    onDropRejected: (rejections) => {
      const tooLarge = rejections.some((rejection) =>
        rejection.errors.some((item) => item.code === 'file-too-large')
      );
      setError(
        tooLarge
          ? 'Размер изображения не должен превышать 4 МБ'
          : 'Можно загрузить только одно изображение'
      );
    },
  });

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
            : image
              ? 'Перетащите или выберите замену'
              : 'Перетащите или выберите изображение'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">До 4 МБ</p>
      </div>
      <FieldDescription>
        Новое изображение заменит текущее только в форме.
      </FieldDescription>
      {error ? <FieldError>{error}</FieldError> : null}
      {image ? (
        <div className="overflow-hidden rounded-xl border bg-card">
          <MediaImage
            alt="Предпросмотр изображения"
            className="aspect-video w-full"
            src={image}
          />
          <div className="flex items-center justify-between gap-3 p-3">
            <span className="truncate text-xs text-muted-foreground">
              {image}
            </span>
            <Button
              disabled={disabled || uploading}
              onClick={() => onChange('')}
              type="button"
              variant="destructive"
            >
              <Trash2 />
              Убрать
            </Button>
          </div>
        </div>
      ) : null}
    </Field>
  );
}
