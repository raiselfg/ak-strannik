'use client';

import {
  createFestivalContentDtoSchema,
  updateFestivalContentDtoSchema,
  type UpdateFestivalContentDto,
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
import { SingleImageField } from '../../../../_components/single-image-field';
import { StringListField } from '../../../../_components/string-list-field';
import { VideoUrlsField } from '../../../../_components/video-urls-field';
import {
  createFestivalContent,
  updateFestivalContent,
} from '../_actions/festival.actions';
import { FestivalEventSection } from './festival-event-section';
import { FestivalJurySection } from './festival-jury-section';
import { FestivalNominationsSection } from './festival-nominations-section';
import { FestivalOrganizationsSection } from './festival-organizations-section';

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

function hasOptionalBlockContent(
  block:
    | {
        id?: string;
        translations?: unknown[];
        items?: unknown[];
      }
    | null
    | undefined
): boolean {
  return Boolean(
    block?.id || block?.translations?.length || block?.items?.length
  );
}

export function FestivalContentForm({
  contentId,
  initialValues,
}: {
  contentId?: string;
  initialValues: UpdateFestivalContentDto;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadCount, setUploadCount] = useState(0);
  const form = useForm<
    z.input<typeof updateFestivalContentDtoSchema>,
    undefined,
    UpdateFestivalContentDto
  >({
    resolver: (values, context, options) =>
      zodResolver(updateFestivalContentDtoSchema)(
        removeEmptyIds(values) as z.input<
          typeof updateFestivalContentDtoSchema
        >,
        context,
        options
      ),
    defaultValues: initialValues,
  });
  const events = useFieldArray({ control: form.control, name: 'events' });
  const logo = useWatch({ control: form.control, name: 'logo' }) ?? '';
  const images = useWatch({ control: form.control, name: 'images' }) ?? [];
  const videos = useWatch({ control: form.control, name: 'videos' }) ?? [];
  const achievements =
    useWatch({ control: form.control, name: 'achievements' }) ?? [];
  const socials = useWatch({ control: form.control, name: 'socials' }) ?? [];
  const translations =
    useWatch({ control: form.control, name: 'translations' }) ?? [];
  const isSubmitting = form.formState.isSubmitting;
  const uploading = uploadCount > 0;
  const trackUpload = (active: boolean) =>
    setUploadCount((count) => (active ? count + 1 : Math.max(0, count - 1)));

  const submit = form.handleSubmit(
    async (values) => {
      setFormError(null);
      const hasJury = hasOptionalBlockContent(
        values.jury
          ? {
              id: values.jury.id,
              translations: values.jury.translations,
              items: values.jury.persons,
            }
          : values.jury
      );
      const hasOrganizations = hasOptionalBlockContent(
        values.organizations
          ? {
              id: values.organizations.id,
              translations: values.organizations.translations,
              items: values.organizations.organizations,
            }
          : values.organizations
      );
      const normalized: UpdateFestivalContentDto = {
        ...values,
        events: (values.events ?? []).map((event, position) => ({
          ...event,
          position,
        })),
        jury:
          values.jury && hasJury
            ? {
                ...values.jury,
                persons: (values.jury.persons ?? []).map(
                  (person, position) => ({
                    ...person,
                    position,
                  })
                ),
              }
            : null,
        organizations:
          values.organizations && hasOrganizations
            ? {
                ...values.organizations,
                organizations: (values.organizations.organizations ?? []).map(
                  (item, position) => ({ ...item, position })
                ),
              }
            : null,
      };
      const result = contentId
        ? await updateFestivalContent(contentId, normalized)
        : await (async () => {
            const createInput = createFestivalContentDtoSchema.safeParse(
              removeIdsForCreate(normalized)
            );
            if (!createInput.success)
              return {
                success: false as const,
                message: 'Проверьте заполнение формы',
              };
            return createFestivalContent(createInput.data);
          })();
      if (!result.success) {
        const slugError = result.fieldErrors?.slug?.[0];
        if (slugError) form.setError('slug', { message: slugError });
        setFormError(result.message);
        return;
      }
      toast.success(result.message);
      router.push('/projects/festival');
      router.refresh();
    },
    () => setFormError('Проверьте заполнение обязательных полей')
  );

  return (
    <form className="space-y-6" onSubmit={submit}>
      <Card>
        <CardHeader>
          <CardTitle>Основные данные</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Field>
            <FieldLabel htmlFor="festival-slug">
              Адрес страницы (slug)
            </FieldLabel>
            <Input
              aria-invalid={Boolean(form.formState.errors.slug)}
              id="festival-slug"
              {...form.register('slug')}
            />
            {form.formState.errors.slug?.message ? (
              <FieldError>{form.formState.errors.slug.message}</FieldError>
            ) : null}
          </Field>
          <SingleImageField
            disabled={isSubmitting}
            image={logo}
            label="Логотип фестиваля"
            onChange={(value) =>
              form.setValue('logo', value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            onUploadingChange={trackUpload}
          />
          {form.formState.errors.logo?.message ? (
            <FieldError>{form.formState.errors.logo.message}</FieldError>
          ) : null}
          <ImagesField
            disabled={isSubmitting}
            images={images}
            label="Фотогалерея фестиваля"
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
          <VideoUrlsField
            disabled={isSubmitting}
            label="Видео фестиваля"
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
          <ImagesField
            disabled={isSubmitting}
            images={achievements}
            label="Достижения фестиваля"
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
          <StringListField
            description="Ссылки на социальные сети."
            disabled={isSubmitting}
            error={form.formState.errors.socials?.message}
            label="Социальные сети"
            onChange={(value) =>
              form.setValue('socials', value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            placeholder="https://…"
            values={socials}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Название фестиваля</CardTitle>
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
                    <FieldLabel>Название</FieldLabel>
                    <Input
                      aria-invalid={Boolean(
                        form.formState.errors.translations?.[index]?.title
                      )}
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
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">События</h2>
          <p className="text-sm text-muted-foreground">
            Порядок задаётся кнопками.
          </p>
        </div>
        <Button
          disabled={isSubmitting || uploading}
          onClick={() =>
            events.append({
              position: events.fields.length,
              translations: [
                { locale: 'ru', title: '', text: '' },
                { locale: 'en', title: '', text: '' },
              ],
            })
          }
          type="button"
        >
          <Plus />
          Добавить событие
        </Button>
      </div>
      <div className="space-y-4">
        {events.fields.map((field, index) => (
          <FestivalEventSection
            canMoveDown={index < events.fields.length - 1}
            canMoveUp={index > 0}
            disabled={isSubmitting}
            form={form}
            index={index}
            key={field.id}
            onMoveDown={() => events.move(index, index + 1)}
            onMoveUp={() => events.move(index, index - 1)}
            onRemove={() => events.remove(index)}
          />
        ))}
      </div>
      <FestivalNominationsSection disabled={isSubmitting} form={form} />
      <FestivalJurySection
        disabled={isSubmitting}
        form={form}
        onUploadingChange={trackUpload}
      />
      <FestivalOrganizationsSection disabled={isSubmitting} form={form} />
      {formError ? <FieldError>{formError}</FieldError> : null}
      <div className="flex justify-end gap-3">
        <Button asChild disabled={isSubmitting || uploading} variant="outline">
          <Link href="/projects/festival">Отменить</Link>
        </Button>
        <Button disabled={isSubmitting || uploading} type="submit">
          {isSubmitting ? 'Сохранение…' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
}
