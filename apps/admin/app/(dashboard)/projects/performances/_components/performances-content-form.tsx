'use client';

import {
  createPerformancesContentDtoSchema,
  updatePerformancesContentDtoSchema,
  type UpdatePerformancesContentDto,
} from '@ak-strannik/types/performances';
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
import { Input } from '@ak-strannik/ui/components/input';
import { toast } from '@ak-strannik/ui/components/sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@ak-strannik/ui/components/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import { ImagesField } from '../../../../_components/images-field';
import { VideoUrlsField } from '../../../../_components/video-urls-field';
import {
  createPerformancesContent,
  updatePerformancesContent,
} from '../_actions/performances.actions';
import { PerformancePersonSection } from './performance-person-section';

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

export function PerformancesContentForm({
  contentId,
  initialValues,
}: {
  contentId?: string;
  initialValues: UpdatePerformancesContentDto;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const form = useForm<
    z.input<typeof updatePerformancesContentDtoSchema>,
    undefined,
    UpdatePerformancesContentDto
  >({
    resolver: (values, context, options) =>
      zodResolver(updatePerformancesContentDtoSchema)(
        removeEmptyIds(values) as z.input<
          typeof updatePerformancesContentDtoSchema
        >,
        context,
        options
      ),
    defaultValues: initialValues,
  });
  const { append, fields, move, remove } = useFieldArray({
    control: form.control,
    name: 'persons',
  });
  const images = useWatch({ control: form.control, name: 'images' }) ?? [];
  const videos = useWatch({ control: form.control, name: 'videos' }) ?? [];
  const translations =
    useWatch({ control: form.control, name: 'translations' }) ?? [];
  const isSubmitting = form.formState.isSubmitting;

  const submit = form.handleSubmit(
    async (values) => {
      setFormError(null);
      const normalized: UpdatePerformancesContentDto = {
        ...values,
        persons: (values.persons ?? []).map((person, position) => ({
          ...person,
          position,
        })),
      };
      const result = contentId
        ? await updatePerformancesContent(contentId, normalized)
        : await (async () => {
            const createInput = createPerformancesContentDtoSchema.safeParse(
              removeIdsForCreate(normalized)
            );
            if (!createInput.success) {
              return {
                success: false as const,
                message: 'Проверьте заполнение формы',
              };
            }
            return createPerformancesContent(createInput.data);
          })();

      if (!result.success) {
        setFormError(result.message);
        return;
      }
      toast.success(result.message);
      router.push('/projects/performances');
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
          <ImagesField
            disabled={isSubmitting}
            images={images}
            label="Фотографии спектакля"
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
            disabled={isSubmitting}
            label="Видео спектакля"
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Название постановки</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ru">
            <TabsList>
              <TabsTrigger value="ru">Русский</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            {translations.map((translation, index) => (
              <TabsContent
                key={`${translation.locale ?? 'translation'}-${index}`}
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
                    <FieldLabel
                      htmlFor={`performance-title-${translation.locale}`}
                    >
                      Название
                    </FieldLabel>
                    <Input
                      aria-invalid={Boolean(
                        form.formState.errors.translations?.[index]?.title
                      )}
                      id={`performance-title-${translation.locale}`}
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

      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Участники</h2>
          <p className="text-sm text-muted-foreground">
            Список сохраняется вместе со всей постановкой.
          </p>
        </div>
        <Button
          disabled={isSubmitting || uploading}
          onClick={() =>
            append({
              position: fields.length,
              translations: [
                { locale: 'ru', name: '' },
                { locale: 'en', name: '' },
              ],
            })
          }
          type="button"
        >
          <Plus />
          Добавить участника
        </Button>
      </div>
      {fields.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Участников пока нет.
          </CardContent>
        </Card>
      ) : null}
      <div className="space-y-5">
        {fields.map((field, index) => (
          <PerformancePersonSection
            canMoveDown={index < fields.length - 1}
            canMoveUp={index > 0}
            disabled={isSubmitting}
            form={form}
            index={index}
            key={field.id}
            onMoveDown={() => move(index, index + 1)}
            onMoveUp={() => move(index, index - 1)}
            onRemove={() => remove(index)}
          />
        ))}
      </div>
      {form.formState.errors.persons?.message ? (
        <FieldError>{form.formState.errors.persons.message}</FieldError>
      ) : null}
      {formError ? <FieldError>{formError}</FieldError> : null}
      <div className="flex justify-end gap-3">
        <Button asChild disabled={isSubmitting || uploading} variant="outline">
          <Link href="/projects/performances">Отменить</Link>
        </Button>
        <Button disabled={isSubmitting || uploading} type="submit">
          {isSubmitting ? 'Сохранение…' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
}
