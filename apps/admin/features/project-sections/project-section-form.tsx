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
import { Switch } from '@ak-strannik/ui/components/switch';
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
  useWatch,
} from 'react-hook-form';
import { z } from 'zod';
import { videoProviderOptions } from '../media/video-list-field';
import {
  createProjectSectionAction,
  updateProjectSectionAction,
} from './actions';
import {
  getProjectSectionVariant,
  projectSectionVariantOptions,
} from './constants';
import {
  ProjectSectionMediaField,
  type ProjectSectionMediaOption,
} from './project-section-media-field';
import {
  ProjectSectionFormSchema,
  type ProjectSectionFormValues,
} from './schema';

type ProjectSectionFormProps =
  | {
      mode: 'create';
      projectId: string;
      sectionId?: never;
      defaultValues?: Partial<ProjectSectionFormValues>;
      mediaOptions: ProjectSectionMediaOption[];
    }
  | {
      mode: 'edit';
      projectId: string;
      sectionId: string;
      defaultValues: ProjectSectionFormValues;
      mediaOptions: ProjectSectionMediaOption[];
    };
type FormInput = z.input<typeof ProjectSectionFormSchema>;
const emptyTranslation = {
  title: null,
  subtitle: null,
  body: null,
  author: null,
};

export function ProjectSectionForm(props: ProjectSectionFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<FormInput, unknown, ProjectSectionFormValues>({
    resolver: zodResolver(ProjectSectionFormSchema),
    defaultValues: {
      variant: 'content',
      videoProvider: null,
      videoUrl: null,
      sortOrder: 0,
      isActive: true,
      translations: {
        ru: { ...emptyTranslation },
        en: { ...emptyTranslation },
      },
      media: [],
      ...props.defaultValues,
    },
  });
  const variant = useWatch({ control: form.control, name: 'variant' });
  const variantInfo = getProjectSectionVariant(variant);

  function applyFailure(result: {
    message: string;
    fieldErrors?: Record<string, string[]>;
  }) {
    for (const [name, messages] of Object.entries(result.fieldErrors ?? {})) {
      form.setError(name as FieldPath<FormInput>, { message: messages[0] });
    }
    setFormError(result.message);
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    if (props.mode === 'create') {
      const result = await createProjectSectionAction(props.projectId, values);
      if (!result.success) return applyFailure(result);
      toast.success(result.message);
      router.push(`/projects/${props.projectId}`);
      router.refresh();
      return;
    }
    const result = await updateProjectSectionAction(
      props.projectId,
      props.sectionId,
      values
    );
    if (!result.success) return applyFailure(result);
    toast.success(result.message);
    router.push(`/projects/${props.projectId}`);
    router.refresh();
  });

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Основные настройки</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Controller
              control={form.control}
              name="variant"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="section-variant">
                    Вариант секции
                  </FieldLabel>
                  <Select
                    id="section-variant"
                    value={field.value}
                    onChange={field.onChange}
                  >
                    {projectSectionVariantOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  <FieldDescription>{variantInfo.description}</FieldDescription>
                  {fieldState.error?.message ? (
                    <FieldError>{fieldState.error.message}</FieldError>
                  ) : null}
                </Field>
              )}
            />
            {variant === 'video' ? (
              <>
                <Controller
                  control={form.control}
                  name="videoProvider"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="section-video-provider">
                        Видеопровайдер
                      </FieldLabel>
                      <Select
                        id="section-video-provider"
                        value={field.value ?? ''}
                        onChange={(event) =>
                          field.onChange(event.target.value || null)
                        }
                      >
                        <option value="">Выберите провайдера</option>
                        {videoProviderOptions.map((option) => (
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
                <Field data-invalid={Boolean(form.formState.errors.videoUrl)}>
                  <FieldLabel htmlFor="section-video-url">
                    Ссылка на видео
                  </FieldLabel>
                  <Input
                    id="section-video-url"
                    type="url"
                    placeholder="https://…"
                    aria-invalid={Boolean(form.formState.errors.videoUrl)}
                    {...form.register('videoUrl')}
                  />
                  <FieldDescription>
                    Обычная ссылка на страницу видео, без HTML/iframe.
                  </FieldDescription>
                  {form.formState.errors.videoUrl?.message ? (
                    <FieldError>
                      {form.formState.errors.videoUrl.message}
                    </FieldError>
                  ) : null}
                </Field>
              </>
            ) : null}
            <Field data-invalid={Boolean(form.formState.errors.sortOrder)}>
              <FieldLabel htmlFor="section-sort-order">
                Порядок отображения
              </FieldLabel>
              <Input
                id="section-sort-order"
                type="number"
                min={0}
                step={1}
                aria-invalid={Boolean(form.formState.errors.sortOrder)}
                {...form.register('sortOrder', { valueAsNumber: true })}
              />
              <FieldDescription>
                Секции с меньшим значением отображаются раньше.
              </FieldDescription>
              {form.formState.errors.sortOrder?.message ? (
                <FieldError>
                  {form.formState.errors.sortOrder.message}
                </FieldError>
              ) : null}
            </Field>
            <Controller
              control={form.control}
              name="isActive"
              render={({ field, fieldState }) => (
                <Field
                  className="flex flex-row items-center justify-between rounded-lg border p-4"
                  data-invalid={fieldState.invalid}
                >
                  <div>
                    <FieldLabel htmlFor="section-active">
                      Показывать секцию
                    </FieldLabel>
                    <FieldDescription>
                      Скрытая секция не отображается на публичной странице
                      проекта.
                    </FieldDescription>
                  </div>
                  <Switch
                    id="section-active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Контент</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ru">
            <TabsList>
              <TabsTrigger value="ru">Русский</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            <TranslationFields
              locale="ru"
              form={form}
              quote={variant === 'quote'}
            />
            <TranslationFields
              locale="en"
              form={form}
              quote={variant === 'quote'}
            />
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Медиа</CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            control={form.control}
            name="media"
            render={({ field, fieldState }) => (
              <ProjectSectionMediaField
                value={field.value}
                onChange={field.onChange}
                mediaOptions={props.mediaOptions}
                error={fieldState.error?.message}
              />
            )}
          />
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
              ? 'Добавить секцию'
              : 'Сохранить'}
        </Button>
        <Button
          asChild
          disabled={form.formState.isSubmitting}
          variant="outline"
        >
          <Link href={`/projects/${props.projectId}`}>Отмена</Link>
        </Button>
      </div>
    </form>
  );
}

function TranslationFields({
  locale,
  form,
  quote,
}: {
  locale: 'ru' | 'en';
  form: UseFormReturn<FormInput, unknown, ProjectSectionFormValues>;
  quote: boolean;
}) {
  const errors = form.formState.errors.translations?.[locale];
  const russian = locale === 'ru';
  return (
    <TabsContent value={locale}>
      <FieldGroup>
        {!quote ? (
          <>
            <Field data-invalid={Boolean(errors?.title)}>
              <FieldLabel htmlFor={`${locale}-section-title`}>
                {russian ? 'Название' : 'Title'}
              </FieldLabel>
              <Input
                id={`${locale}-section-title`}
                aria-invalid={Boolean(errors?.title)}
                {...form.register(`translations.${locale}.title`)}
              />
              {errors?.title?.message ? (
                <FieldError>{errors.title.message}</FieldError>
              ) : null}
            </Field>
            <Field data-invalid={Boolean(errors?.subtitle)}>
              <FieldLabel htmlFor={`${locale}-section-subtitle`}>
                {russian ? 'Подзаголовок' : 'Subtitle'}
              </FieldLabel>
              <Input
                id={`${locale}-section-subtitle`}
                aria-invalid={Boolean(errors?.subtitle)}
                {...form.register(`translations.${locale}.subtitle`)}
              />
              {errors?.subtitle?.message ? (
                <FieldError>{errors.subtitle.message}</FieldError>
              ) : null}
            </Field>
          </>
        ) : null}
        <Field data-invalid={Boolean(errors?.body)}>
          <FieldLabel htmlFor={`${locale}-section-body`}>
            {quote
              ? russian
                ? 'Текст цитаты *'
                : 'Quote'
              : russian
                ? 'Основной текст'
                : 'Body'}
          </FieldLabel>
          <Textarea
            id={`${locale}-section-body`}
            rows={quote ? 6 : 10}
            aria-invalid={Boolean(errors?.body)}
            {...form.register(`translations.${locale}.body`)}
          />
          {!quote ? (
            <FieldDescription>Поддерживается Markdown.</FieldDescription>
          ) : null}
          {errors?.body?.message ? (
            <FieldError>{errors.body.message}</FieldError>
          ) : null}
        </Field>
        {quote ? (
          <Field data-invalid={Boolean(errors?.author)}>
            <FieldLabel htmlFor={`${locale}-section-author`}>
              {russian ? 'Автор' : 'Author'}
            </FieldLabel>
            <Input
              id={`${locale}-section-author`}
              aria-invalid={Boolean(errors?.author)}
              {...form.register(`translations.${locale}.author`)}
            />
            {errors?.author?.message ? (
              <FieldError>{errors.author.message}</FieldError>
            ) : null}
          </Field>
        ) : null}
      </FieldGroup>
    </TabsContent>
  );
}
