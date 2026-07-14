'use client';

import { Button } from '@ak-strannik/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ak-strannik/ui/components/dialog';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@ak-strannik/ui/components/field';
import { Input } from '@ak-strannik/ui/components/input';
import { toast } from '@ak-strannik/ui/components/sonner';
import { Plus, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { uploadMediaAssetAction } from './actions';
import { ALLOWED_MEDIA_MIME_TYPES, MAX_MEDIA_FILE_SIZE } from './constants';
import { formatFileSize } from './format';

export function MediaUploadDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    []
  );

  function selectFile(nextFile: File | null) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    const nextPreview = nextFile ? URL.createObjectURL(nextFile) : null;
    previewRef.current = nextPreview;
    setPreview(nextPreview);
    setFile(nextFile);
    setError(null);
  }

  async function upload() {
    if (!file) {
      setError('Файл не выбран');
      return;
    }
    setPending(true);
    setError(null);
    const data = new FormData();
    data.set('file', file);
    const result = await uploadMediaAssetAction(data);
    setPending(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    toast.success(result.message);
    selectFile(null);
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Загрузить файл
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Загрузить изображение</DialogTitle>
          <DialogDescription>
            Поддерживаются JPG, PNG, WebP, AVIF, GIF и SVG размером до{' '}
            {formatFileSize(MAX_MEDIA_FILE_SIZE)}.
          </DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="media-file">Файл</FieldLabel>
          <Input
            id="media-file"
            type="file"
            accept={ALLOWED_MEDIA_MIME_TYPES.join(',')}
            disabled={pending}
            onChange={(event) => selectFile(event.target.files?.[0] ?? null)}
          />
          <FieldDescription>
            {file
              ? `${file.name} · ${formatFileSize(file.size)}`
              : 'Выберите одно изображение.'}
          </FieldDescription>
          {error ? <FieldError>{error}</FieldError> : null}
        </Field>
        {preview ? (
          <div
            className="h-48 rounded-lg border bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${JSON.stringify(preview)})` }}
          />
        ) : null}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={pending}
          >
            Отмена
          </Button>
          <Button type="button" onClick={upload} disabled={pending || !file}>
            <Upload />
            {pending ? 'Загрузка…' : 'Загрузить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
