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
} from 'react-hook-form';
import { z } from 'zod';
import { MediaPreview } from '../media/media-preview';
import {
  EventGalleryField,
  type EventMediaOption,
} from '../events/event-gallery-field';
import { VideoListField } from '../media/video-list-field';
import { createPartnerAction, updatePartnerAction } from './actions';
import { PartnerFormSchema, type PartnerFormValues } from './schema';

type MediaOption = EventMediaOption;

type PartnerFormProps =
  | {
      mode: 'create';
      partnerId?: never;
      defaultValues?: Partial<PartnerFormValues>;
      mediaOptions: MediaOption[];
    }
  | {
      mode: 'edit';
      partnerId: string;
      defaultValues: PartnerFormValues;
      mediaOptions: MediaOption[];
    };

type PartnerFormInput = z.input<typeof PartnerFormSchema>;
const emptyTranslation = { name: '', description: null };

export function PartnerForm(props: PartnerFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<PartnerFormInput, unknown, PartnerFormValues>({
    resolver: zodResolver(PartnerFormSchema),
    defaultValues: {
      logoId: null,
      websiteUrl: null,
      sortOrder: 0,
      isActive: true,
      media: [],
      videos: [],
      translations: {
        ru: { ...emptyTranslation },
        en: { ...emptyTranslation },
      },
      ...props.defaultValues,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    const result =
      props.mode === 'create'
        ? await createPartnerAction(values)
        : await updatePartnerAction(props.partnerId, values);

    if (!result.success) {
      for (const [name, messages] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(name as FieldPath<PartnerFormInput>, {
          message: messages[0],
        });
      }
      setFormError(result.message);
      return;
    }

    toast.success(result.message);
    if (props.mode === 'create') router.push('/partners');
    else router.refresh();
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
              name="logoId"
              render={({ field, fieldState }) => {
                const selected = props.mediaOptions.find(
                  (asset) => asset.id === field.value
                );
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="partner-logo">Логотип</FieldLabel>
                    {selected ? (
                      <MediaPreview
                        alt={selected.alt}
                        className="h-40 rounded-lg border"
                        url={selected.publicUrl}
                      />
                    ) : null}
                    <Select
                      aria-invalid={fieldState.invalid}
                      id="partner-logo"
                      onChange={(event) =>
                        field.onChange(event.target.value || null)
                      }
                      value={field.value ?? ''}
                    >
                      <option value="">Без логотипа</option>
                      {props.mediaOptions.map((asset) => (
                        <option key={asset.id} value={asset.id}>
                          {asset.originalName}
                        </option>
                      ))}
                    </Select>
                    <FieldDescription>
                      Выберите одно изображение из существующей медиатеки.
                    </FieldDescription>
                    {fieldState.error?.message ? (
                      <FieldError>{fieldState.error.message}</FieldError>
                    ) : null}
                  </Field>
                );
              }}
            />

            <Field data-invalid={Boolean(form.formState.errors.websiteUrl)}>
              <FieldLabel htmlFor="partner-website">Сайт</FieldLabel>
              <Input
                aria-invalid={Boolean(form.formState.errors.websiteUrl)}
                id="partner-website"
                placeholder="https://example.com"
                type="url"
                {...form.register('websiteUrl')}
              />
              <FieldDescription>
                Ссылка на официальный сайт партнёра.
              </FieldDescription>
              {form.formState.errors.websiteUrl?.message ? (
                <FieldError>
                  {form.formState.errors.websiteUrl.message}
                </FieldError>
              ) : null}
            </Field>

            <Field data-invalid={Boolean(form.formState.errors.sortOrder)}>
              <FieldLabel htmlFor="partner-sort-order">
                Порядок отображения
              </FieldLabel>
              <Input
                aria-invalid={Boolean(form.formState.errors.sortOrder)}
                id="partner-sort-order"
                min={0}
                step={1}
                type="number"
                {...form.register('sortOrder', { valueAsNumber: true })}
              />
              <FieldDescription>
                Партнёры с меньшим значением отображаются раньше.
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
                  <div className="space-y-1">
                    <FieldLabel htmlFor="partner-active">
                      Показывать на сайте
                    </FieldLabel>
                    <FieldDescription>
                      Скрытый партнёр не отображается на публичном сайте.
                    </FieldDescription>
                  </div>
                  <Switch
                    aria-invalid={fieldState.invalid}
                    checked={field.value}
                    id="partner-active"
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
          <CardTitle>Портфолио</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Controller
              control={form.control}
              name="media"
              render={({ field, fieldState }) => (
                <EventGalleryField
                  value={field.value}
                  onChange={field.onChange}
                  mediaOptions={props.mediaOptions}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={form.control}
              name="videos"
              render={({ field, fieldState }) => (
                <VideoListField
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
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
            <TranslationFields form={form} locale="ru" required />
            <TranslationFields form={form} locale="en" />
          </Tabs>
        </CardContent>
      </Card>

      {formError ? (
        <p className="text-sm font-medium text-destructive" role="alert">
          {formError}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting
            ? 'Сохранение…'
            : props.mode === 'create'
              ? 'Добавить партнёра'
              : 'Сохранить'}
        </Button>
        <Button
          asChild
          disabled={form.formState.isSubmitting}
          variant="outline"
        >
          <Link href="/partners">Отмена</Link>
        </Button>
      </div>
    </form>
  );
}

function TranslationFields({
  locale,
  form,
  required = false,
}: {
  locale: 'ru' | 'en';
  form: UseFormReturn<PartnerFormInput, unknown, PartnerFormValues>;
  required?: boolean;
}) {
  const errors = form.formState.errors.translations?.[locale];
  return (
    <TabsContent value={locale}>
      <FieldGroup>
        <Field data-invalid={Boolean(errors?.name)}>
          <FieldLabel htmlFor={`${locale}-partner-name`}>
            {locale === 'ru' ? 'Название' : 'Name'}
            {required ? ' *' : ''}
          </FieldLabel>
          <Input
            aria-invalid={Boolean(errors?.name)}
            id={`${locale}-partner-name`}
            {...form.register(`translations.${locale}.name`)}
          />
          {errors?.name?.message ? (
            <FieldError>{errors.name.message}</FieldError>
          ) : null}
        </Field>
        <Field data-invalid={Boolean(errors?.description)}>
          <FieldLabel htmlFor={`${locale}-partner-description`}>
            {locale === 'ru' ? 'Описание' : 'Description'}
          </FieldLabel>
          <Textarea
            aria-invalid={Boolean(errors?.description)}
            id={`${locale}-partner-description`}
            rows={6}
            {...form.register(`translations.${locale}.description`)}
          />
          {errors?.description?.message ? (
            <FieldError>{errors.description.message}</FieldError>
          ) : null}
        </Field>
      </FieldGroup>
    </TabsContent>
  );
}
