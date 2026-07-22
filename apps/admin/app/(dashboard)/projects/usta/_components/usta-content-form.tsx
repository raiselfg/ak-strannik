'use client';

import {
  createUstaContentDtoSchema,
  updateUstaContentDtoSchema,
  type UpdateUstaContentDto,
} from '@ak-strannik/types';
import { Button } from '@ak-strannik/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@ak-strannik/ui/components/field';
import { toast } from '@ak-strannik/ui/components/sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@ak-strannik/ui/components/tabs';
import { Textarea } from '@ak-strannik/ui/components/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import { ImagesField } from '../../../../_components/images-field';
import { VideoUrlsField } from '../../../../_components/video-urls-field';
import { createUstaContent, updateUstaContent } from '../_actions/usta.actions';

function removeIdsForCreate(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(removeIdsForCreate);
  if (value === null || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => key !== 'id')
      .map(([key, nestedValue]) => [key, removeIdsForCreate(nestedValue)])
  );
}

function removeEmptyIds(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(removeEmptyIds);
  if (value === null || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key, nestedValue]) => key !== 'id' || nestedValue !== '')
      .map(([key, nestedValue]) => [key, removeEmptyIds(nestedValue)])
  );
}

export function UstaContentForm({
  contentId,
  initialValues,
}: {
  contentId?: string;
  initialValues: UpdateUstaContentDto;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadCount, setUploadCount] = useState(0);
  const form = useForm<
    z.input<typeof updateUstaContentDtoSchema>,
    undefined,
    UpdateUstaContentDto
  >({
    resolver: (values, context, options) =>
      zodResolver(updateUstaContentDtoSchema)(
        removeEmptyIds(values) as z.input<typeof updateUstaContentDtoSchema>,
        context,
        options
      ),
    defaultValues: initialValues,
  });
  const videos = useWatch({ control: form.control, name: 'videos' }) ?? [];
  const images = useWatch({ control: form.control, name: 'images' }) ?? [];
  const achievements =
    useWatch({ control: form.control, name: 'achievements' }) ?? [];
  const translations =
    useWatch({ control: form.control, name: 'translations' }) ?? [];
  const isSubmitting = form.formState.isSubmitting;
  const uploading = uploadCount > 0;
  const trackUpload = (active: boolean) =>
    setUploadCount((count) => (active ? count + 1 : Math.max(0, count - 1)));

  const submit = form.handleSubmit(
    async (values) => {
      setFormError(null);
      const result = contentId
        ? await updateUstaContent(contentId, values)
        : await (async () => {
            const createInput = createUstaContentDtoSchema.safeParse(
              removeIdsForCreate(values)
            );
            if (!createInput.success)
              return {
                success: false as const,
                message: 'Проверьте заполнение формы',
              };
            return createUstaContent(createInput.data);
          })();
      if (!result.success) {
        setFormError(result.message);
        return;
      }
      toast.success(result.message);
      router.push('/projects/usta');
      router.refresh();
    },
    () => setFormError('Проверьте заполнение обязательных полей')
  );

  return (
    <form className="space-y-6" onSubmit={submit}>
      <Card>
        <CardHeader>
          <CardTitle>Материалы</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <VideoUrlsField
            disabled={isSubmitting || uploading}
            onChange={(value) =>
              form.setValue('videos', value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            videos={videos}
          />
          {form.formState.errors.videos?.message ? (
            <FieldError>{form.formState.errors.videos.message}</FieldError>
          ) : null}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Изображения</h3>
            <ImagesField
              disabled={isSubmitting}
              images={images}
              onChange={(value) =>
                form.setValue('images', value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              onUploadingChange={trackUpload}
            />
            {form.formState.errors.images?.message ? (
              <FieldError>{form.formState.errors.images.message}</FieldError>
            ) : null}
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Достижения</h3>
            <ImagesField
              disabled={isSubmitting}
              images={achievements}
              onChange={(value) =>
                form.setValue('achievements', value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              onUploadingChange={trackUpload}
            />
            {form.formState.errors.achievements?.message ? (
              <FieldError>
                {form.formState.errors.achievements.message}
              </FieldError>
            ) : null}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Переводы</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ru">
            <TabsList>
              <TabsTrigger value="ru">Русский</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            {translations.map((translation, index) => (
              <TabsContent
                key={`${translation.locale}-${index}`}
                value={translation.locale ?? (index === 0 ? 'ru' : 'en')}
              >
                <input
                  type="hidden"
                  {...form.register(`translations.${index}.id`)}
                />
                <input
                  type="hidden"
                  {...form.register(`translations.${index}.locale`)}
                />
                <FieldGroup>
                  <Field>
                    <FieldLabel>Текст</FieldLabel>
                    <Textarea
                      aria-invalid={Boolean(
                        form.formState.errors.translations?.[index]?.text
                      )}
                      {...form.register(`translations.${index}.text`)}
                    />
                    {form.formState.errors.translations?.[index]?.text
                      ?.message ? (
                      <FieldError>
                        {
                          form.formState.errors.translations[index]?.text
                            ?.message
                        }
                      </FieldError>
                    ) : null}
                  </Field>
                </FieldGroup>
              </TabsContent>
            ))}
          </Tabs>
          {form.formState.errors.translations?.message ? (
            <FieldError className="mt-3">
              {form.formState.errors.translations.message}
            </FieldError>
          ) : null}
        </CardContent>
      </Card>
      {formError ? <FieldError>{formError}</FieldError> : null}
      <div className="flex justify-end gap-3">
        <Button asChild disabled={isSubmitting || uploading} variant="outline">
          <Link href="/projects">Отменить</Link>
        </Button>
        <Button disabled={isSubmitting || uploading} type="submit">
          {isSubmitting ? 'Сохранение…' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
}
