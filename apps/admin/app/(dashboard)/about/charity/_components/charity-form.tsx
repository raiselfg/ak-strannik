'use client';

import {
  createCharityContentDtoSchema,
  type CreateCharityContentDto,
} from '@ak-strannik/types';
import { Button } from '@ak-strannik/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import {
  FieldError,
  FieldGroup,
  Field,
  FieldLabel,
} from '@ak-strannik/ui/components/field';
import { Input } from '@ak-strannik/ui/components/input';
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
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import { ImagesField } from '../../../../_components/images-field';
import { VideoUrlsField } from '../../../../_components/video-urls-field';
import {
  createCharityContent,
  updateCharityContent,
} from '../_actions/charity.actions';

export function CharityForm({
  charityId,
  initialValues,
}: {
  charityId?: string;
  initialValues: CreateCharityContentDto;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const form = useForm<
    z.input<typeof createCharityContentDtoSchema>,
    undefined,
    CreateCharityContentDto
  >({
    resolver: zodResolver(createCharityContentDtoSchema),
    defaultValues: initialValues,
  });
  const { fields } = useFieldArray({
    control: form.control,
    name: 'translations',
  });
  const images = useWatch({ control: form.control, name: 'images' }) ?? [];
  const videos = useWatch({ control: form.control, name: 'videos' }) ?? [];
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    const result = charityId
      ? await updateCharityContent(charityId, values)
      : await createCharityContent(values);
    if (!result.success) return setFormError(result.message);
    toast.success(result.message);
    router.push('/about/charity');
    router.refresh();
  });

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Общие данные</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <ImagesField
              disabled={isSubmitting}
              images={images}
              onChange={(value) =>
                form.setValue('images', value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              onUploadingChange={setUploading}
            />
            {form.formState.errors.images?.message ? (
              <FieldError>{form.formState.errors.images.message}</FieldError>
            ) : null}
            <VideoUrlsField
              disabled={isSubmitting || uploading}
              videos={videos}
              onChange={(value) =>
                form.setValue('videos', value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
            {form.formState.errors.videos?.message ? (
              <FieldError>{form.formState.errors.videos.message}</FieldError>
            ) : null}
          </FieldGroup>
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
            {fields.map((translation, index) => (
              <TabsContent key={translation.id} value={translation.locale}>
                <input
                  type="hidden"
                  {...form.register(`translations.${index}.locale`)}
                />
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor={`charity-title-${translation.locale}`}>
                      Название
                    </FieldLabel>
                    <Input
                      aria-invalid={Boolean(
                        form.formState.errors.translations?.[index]?.title
                      )}
                      id={`charity-title-${translation.locale}`}
                      {...form.register(`translations.${index}.title`)}
                    />
                    {form.formState.errors.translations?.[index]?.title
                      ?.message ? (
                      <FieldError>
                        {
                          form.formState.errors.translations[index]?.title
                            ?.message
                        }
                      </FieldError>
                    ) : null}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor={`charity-text-${translation.locale}`}>
                      Текст
                    </FieldLabel>
                    <Textarea
                      aria-invalid={Boolean(
                        form.formState.errors.translations?.[index]?.text
                      )}
                      id={`charity-text-${translation.locale}`}
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
            <FieldError className="mt-4">
              {form.formState.errors.translations.message}
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
          <Link href="/about/charity">Отменить</Link>
        </Button>
        <Button disabled={isSubmitting || uploading} type="submit">
          {isSubmitting ? 'Сохранение…' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
}
