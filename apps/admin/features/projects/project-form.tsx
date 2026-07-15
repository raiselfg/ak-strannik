'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@ak-strannik/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@ak-strannik/ui/components/field';
import { Input } from '@ak-strannik/ui/components/input';
import { Select } from '@ak-strannik/ui/components/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@ak-strannik/ui/components/tabs';
import { Textarea } from '@ak-strannik/ui/components/textarea';
import { toast } from '@ak-strannik/ui/components/sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Controller,
  type FieldPath,
  type UseFormReturn,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';
import { contentStatusOptions } from '../events/constants';
import { MediaSinglePicker, type PendingMedia } from '../media/media-picker';
import {
  mergeMediaOptions,
  replacePendingId,
  uploadPendingMedia,
} from '../media/pending-upload';
import { createProjectAction, updateProjectAction } from './actions';
import { projectTypeOptions } from './constants';
import { ProjectFormSchema, type ProjectFormValues } from './schema';

import type { MediaOption } from '../media/media-picker';
type ProjectFormProps =
  | {
      mode: 'create';
      projectId?: never;
      defaultValues?: Partial<ProjectFormValues>;
      mediaOptions: MediaOption[];
    }
  | {
      mode: 'edit';
      projectId: string;
      defaultValues: ProjectFormValues;
      mediaOptions: MediaOption[];
    };
type ProjectFormInput = z.input<typeof ProjectFormSchema>;
const emptyTranslation = {
  title: '',
  subtitle: null,
  excerpt: null,
  seoTitle: null,
  seoDescription: null,
};

function toDateTimeInput(value: Date | null) {
  if (!value) return '';
  const local = new Date(value.getTime() - value.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function ProjectForm(props: ProjectFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [mediaOptions, setMediaOptions] = useState(props.mediaOptions);
  const [pendingCover, setPendingCover] = useState<PendingMedia | null>(null);
  const form = useForm<ProjectFormInput, unknown, ProjectFormValues>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: {
      slug: '',
      type: 'musical',
      status: 'draft',
      coverImageId: null,
      sortOrder: 0,
      publishedAt: null,
      translations: {
        ru: { ...emptyTranslation },
        en: { ...emptyTranslation },
      },
      ...props.defaultValues,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    const upload = await uploadPendingMedia(pendingCover ? [pendingCover] : []);
    if (!upload.success) {
      setFormError(upload.message);
      return;
    }
    const coverImageId = replacePendingId(
      values.coverImageId,
      upload.replacements
    );
    if (pendingCover) {
      form.setValue('coverImageId', coverImageId);
      URL.revokeObjectURL(pendingCover.previewUrl);
      setPendingCover(null);
      setMediaOptions((current) => mergeMediaOptions(current, upload.assets));
    }
    const nextValues = { ...values, coverImageId };
    if (props.mode === 'create') {
      const result = await createProjectAction(nextValues);
      if (!result.success) {
        for (const [name, messages] of Object.entries(
          result.fieldErrors ?? {}
        )) {
          form.setError(name as FieldPath<ProjectFormInput>, {
            message: messages[0],
          });
        }
        setFormError(result.message);
        return;
      }
      toast.success(result.message);
      router.push(`/projects/${result.data.id}`);
      return;
    }

    const result = await updateProjectAction(props.projectId, nextValues);
    if (!result.success) {
      for (const [name, messages] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(name as FieldPath<ProjectFormInput>, {
          message: messages[0],
        });
      }
      setFormError(result.message);
      return;
    }
    toast.success(result.message);
    router.refresh();
  });

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={Boolean(form.formState.errors.slug)}>
              <FieldLabel htmlFor="project-slug">Slug</FieldLabel>
              <Input
                id="project-slug"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="novogodniy-myuzikl"
                aria-invalid={Boolean(form.formState.errors.slug)}
                {...form.register('slug')}
              />
              <FieldDescription>
                Используется в адресе проекта. Допустимы строчные латинские
                буквы, цифры и дефисы.
              </FieldDescription>
              {form.formState.errors.slug?.message ? (
                <FieldError>{form.formState.errors.slug.message}</FieldError>
              ) : null}
            </Field>
            <Controller
              control={form.control}
              name="type"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="project-type">Тип проекта</FieldLabel>
                  <Select
                    id="project-type"
                    value={field.value}
                    onChange={field.onChange}
                  >
                    {projectTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {fieldState.error?.message ? (
                    <FieldError>{fieldState.error.message}</FieldError>
                  ) : null}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="status"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="project-status">Статус</FieldLabel>
                  <Select
                    id="project-status"
                    value={field.value}
                    onChange={field.onChange}
                  >
                    {contentStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {fieldState.error?.message ? (
                    <FieldError>{fieldState.error.message}</FieldError>
                  ) : null}
                </Field>
              )}
            />
            <Field data-invalid={Boolean(form.formState.errors.sortOrder)}>
              <FieldLabel htmlFor="project-sort-order">
                Порядок отображения
              </FieldLabel>
              <Input
                id="project-sort-order"
                type="number"
                min={0}
                step={1}
                aria-invalid={Boolean(form.formState.errors.sortOrder)}
                {...form.register('sortOrder', { valueAsNumber: true })}
              />
              <FieldDescription>
                Проекты с меньшим значением отображаются раньше.
              </FieldDescription>
              {form.formState.errors.sortOrder?.message ? (
                <FieldError>
                  {form.formState.errors.sortOrder.message}
                </FieldError>
              ) : null}
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Публикация</CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            control={form.control}
            name="publishedAt"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="project-published-at">
                  Дата публикации
                </FieldLabel>
                <Input
                  id="project-published-at"
                  type="datetime-local"
                  value={toDateTimeInput(field.value)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value ? new Date(event.target.value) : null
                    )
                  }
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>
                  Если дата не указана при публикации, будет использовано
                  текущее время.
                </FieldDescription>
                {fieldState.error?.message ? (
                  <FieldError>{fieldState.error.message}</FieldError>
                ) : null}
              </Field>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Обложка</CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            control={form.control}
            name="coverImageId"
            render={({ field, fieldState }) => (
              <MediaSinglePicker
                description="Выберите изображение из медиатеки или загрузите новый файл."
                error={fieldState.error?.message}
                id="project-cover"
                label="Изображение обложки"
                mediaOptions={mediaOptions}
                onChange={field.onChange}
                onPendingFileChange={setPendingCover}
                pendingFile={pendingCover}
                value={field.value}
              />
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Контент и SEO</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ru">
            <TabsList>
              <TabsTrigger value="ru">Русский</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            <TranslationFields locale="ru" form={form} />
            <TranslationFields locale="en" form={form} />
          </Tabs>
        </CardContent>
      </Card>
      {formError ? (
        <p className="text-sm font-medium text-destructive" role="alert">
          {formError}
        </p>
      ) : null}
      <div className="flex gap-3">
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting
            ? 'Сохранение…'
            : props.mode === 'create'
              ? 'Создать проект'
              : 'Сохранить'}
        </Button>
        <Button
          asChild
          disabled={form.formState.isSubmitting}
          variant="outline"
        >
          <Link href="/projects">Отмена</Link>
        </Button>
      </div>
    </form>
  );
}

function TranslationFields({
  locale,
  form,
}: {
  locale: 'ru' | 'en';
  form: UseFormReturn<ProjectFormInput, unknown, ProjectFormValues>;
}) {
  const errors = form.formState.errors.translations?.[locale];
  const russian = locale === 'ru';
  return (
    <TabsContent value={locale}>
      <FieldGroup>
        <Field data-invalid={Boolean(errors?.title)}>
          <FieldLabel htmlFor={`${locale}-project-title`}>
            {russian ? 'Название *' : 'Title'}
          </FieldLabel>
          <Input
            id={`${locale}-project-title`}
            aria-invalid={Boolean(errors?.title)}
            {...form.register(`translations.${locale}.title`)}
          />
          {errors?.title?.message ? (
            <FieldError>{errors.title.message}</FieldError>
          ) : null}
        </Field>
        <Field data-invalid={Boolean(errors?.subtitle)}>
          <FieldLabel htmlFor={`${locale}-project-subtitle`}>
            {russian ? 'Подзаголовок' : 'Subtitle'}
          </FieldLabel>
          <Input
            id={`${locale}-project-subtitle`}
            aria-invalid={Boolean(errors?.subtitle)}
            {...form.register(`translations.${locale}.subtitle`)}
          />
          {errors?.subtitle?.message ? (
            <FieldError>{errors.subtitle.message}</FieldError>
          ) : null}
        </Field>
        <Field data-invalid={Boolean(errors?.excerpt)}>
          <FieldLabel htmlFor={`${locale}-project-excerpt`}>
            {russian ? 'Краткое описание' : 'Excerpt'}
          </FieldLabel>
          <Textarea
            id={`${locale}-project-excerpt`}
            rows={5}
            aria-invalid={Boolean(errors?.excerpt)}
            {...form.register(`translations.${locale}.excerpt`)}
          />
          {errors?.excerpt?.message ? (
            <FieldError>{errors.excerpt.message}</FieldError>
          ) : null}
        </Field>
        <Field data-invalid={Boolean(errors?.seoTitle)}>
          <FieldLabel htmlFor={`${locale}-project-seo-title`}>
            SEO title
          </FieldLabel>
          <Input
            id={`${locale}-project-seo-title`}
            maxLength={70}
            aria-invalid={Boolean(errors?.seoTitle)}
            {...form.register(`translations.${locale}.seoTitle`)}
          />
          {errors?.seoTitle?.message ? (
            <FieldError>{errors.seoTitle.message}</FieldError>
          ) : null}
        </Field>
        <Field data-invalid={Boolean(errors?.seoDescription)}>
          <FieldLabel htmlFor={`${locale}-project-seo-description`}>
            SEO description
          </FieldLabel>
          <Textarea
            id={`${locale}-project-seo-description`}
            maxLength={170}
            rows={4}
            aria-invalid={Boolean(errors?.seoDescription)}
            {...form.register(`translations.${locale}.seoDescription`)}
          />
          {errors?.seoDescription?.message ? (
            <FieldError>{errors.seoDescription.message}</FieldError>
          ) : null}
        </Field>
      </FieldGroup>
    </TabsContent>
  );
}
