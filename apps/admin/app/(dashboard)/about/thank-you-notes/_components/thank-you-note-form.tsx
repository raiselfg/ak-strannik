'use client';

import {
  createThankYouNoteContentDtoSchema,
  type CreateThankYouNoteContentDto,
} from '@ak-strannik/types/thank-you-note';
import { Button } from '@ak-strannik/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import { FieldError } from '@ak-strannik/ui/components/field';
import { toast } from '@ak-strannik/ui/components/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import { SingleImageField } from '../../../../_components/single-image-field';
import {
  createThankYouNoteContent,
  updateThankYouNoteContent,
} from '../_actions/thank-you-note.actions';

export function ThankYouNoteForm({
  initialValues,
  noteId,
}: {
  initialValues: CreateThankYouNoteContentDto;
  noteId?: string;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const form = useForm<
    z.input<typeof createThankYouNoteContentDtoSchema>,
    undefined,
    CreateThankYouNoteContentDto
  >({
    resolver: zodResolver(createThankYouNoteContentDtoSchema),
    defaultValues: initialValues,
  });
  const image = useWatch({ control: form.control, name: 'image' }) ?? '';
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    const result = noteId
      ? await updateThankYouNoteContent(noteId, values)
      : await createThankYouNoteContent(values);
    if (!result.success) return setFormError(result.message);
    toast.success(result.message);
    router.push('/about/thank-you-notes');
    router.refresh();
  });

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Изображение письма</CardTitle>
        </CardHeader>
        <CardContent>
          <SingleImageField
            disabled={isSubmitting}
            image={image}
            label="Изображение благодарственного письма"
            onChange={(value) =>
              form.setValue('image', value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            onUploadingChange={setUploading}
          />
          {form.formState.errors.image?.message ? (
            <FieldError className="mt-3">
              {form.formState.errors.image.message}
            </FieldError>
          ) : null}
        </CardContent>
      </Card>
      {formError ? <FieldError>{formError}</FieldError> : null}
      <div className="flex justify-end gap-3">
        <Button
          asChild
          disabled={isSubmitting || uploading}
          type="button"
          variant="outline"
        >
          <Link href="/about/thank-you-notes">Отменить</Link>
        </Button>
        <Button disabled={isSubmitting || uploading} type="submit">
          {isSubmitting ? 'Сохранение…' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
}
