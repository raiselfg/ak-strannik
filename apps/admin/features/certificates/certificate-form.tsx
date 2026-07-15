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
import {
  MediaSinglePicker,
  type MediaOption,
  type PendingMedia,
} from '../media/media-picker';
import {
  mergeMediaOptions,
  replacePendingId,
  uploadPendingMedia,
} from '../media/pending-upload';
import { createCertificateAction, updateCertificateAction } from './actions';
import { CertificateFormSchema, type CertificateFormValues } from './schema';

type CertificateFormProps =
  | {
      mode: 'create';
      certificateId?: never;
      defaultValues?: Partial<CertificateFormValues>;
      mediaOptions: MediaOption[];
    }
  | {
      mode: 'edit';
      certificateId: string;
      defaultValues: CertificateFormValues;
      mediaOptions: MediaOption[];
    };

type CertificateFormInput = z.input<typeof CertificateFormSchema>;

export function CertificateForm(props: CertificateFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [mediaOptions, setMediaOptions] = useState(props.mediaOptions);
  const [pendingImage, setPendingImage] = useState<PendingMedia | null>(null);
  const form = useForm<CertificateFormInput, unknown, CertificateFormValues>({
    resolver: zodResolver(CertificateFormSchema),
    defaultValues: {
      imageId: '',
      year: null,
      sortOrder: 0,
      isActive: true,
      translations: {
        ru: { title: '', issuer: null, description: null },
        en: { title: null, issuer: null, description: null },
      },
      ...props.defaultValues,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    const upload = await uploadPendingMedia(pendingImage ? [pendingImage] : []);
    if (!upload.success) {
      setFormError(upload.message);
      return;
    }
    const imageId = replacePendingId(values.imageId, upload.replacements) ?? '';
    if (pendingImage) {
      form.setValue('imageId', imageId);
      URL.revokeObjectURL(pendingImage.previewUrl);
      setPendingImage(null);
      setMediaOptions((current) => mergeMediaOptions(current, upload.assets));
    }
    const nextValues = { ...values, imageId };
    const result =
      props.mode === 'create'
        ? await createCertificateAction(nextValues)
        : await updateCertificateAction(props.certificateId, nextValues);

    if (!result.success) {
      for (const [name, messages] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(name as FieldPath<CertificateFormInput>, {
          message: messages[0],
        });
      }
      setFormError(result.message);
      return;
    }

    toast.success(result.message);
    if (props.mode === 'create') router.push('/certificates');
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
              name="imageId"
              render={({ field, fieldState }) => (
                <MediaSinglePicker
                  description="Выберите изображение сертификата из медиатеки или загрузите новый файл."
                  emptyLabel="Выберите изображение"
                  error={fieldState.error?.message}
                  id="certificate-image"
                  label="Изображение *"
                  mediaOptions={mediaOptions}
                  onChange={(value) => field.onChange(value ?? '')}
                  onPendingFileChange={setPendingImage}
                  pendingFile={pendingImage}
                  value={field.value || null}
                />
              )}
            />

            <Controller
              control={form.control}
              name="year"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="certificate-year">Год</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    id="certificate-year"
                    max={2100}
                    min={1900}
                    onBlur={field.onBlur}
                    onChange={(event) => {
                      field.onChange(
                        event.target.value === ''
                          ? null
                          : event.target.valueAsNumber
                      );
                    }}
                    placeholder="2026"
                    ref={field.ref}
                    type="number"
                    value={field.value ?? ''}
                  />
                  <FieldDescription>
                    Год выдачи сертификата или получения награды.
                  </FieldDescription>
                  {fieldState.error?.message ? (
                    <FieldError>{fieldState.error.message}</FieldError>
                  ) : null}
                </Field>
              )}
            />

            <Field data-invalid={Boolean(form.formState.errors.sortOrder)}>
              <FieldLabel htmlFor="certificate-sort-order">
                Порядок отображения
              </FieldLabel>
              <Input
                aria-invalid={Boolean(form.formState.errors.sortOrder)}
                id="certificate-sort-order"
                min={0}
                step={1}
                type="number"
                {...form.register('sortOrder', { valueAsNumber: true })}
              />
              <FieldDescription>
                Сертификаты с меньшим значением отображаются раньше.
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
                    <FieldLabel htmlFor="certificate-active">
                      Показывать на сайте
                    </FieldLabel>
                    <FieldDescription>
                      Скрытый сертификат не отображается на публичном сайте.
                    </FieldDescription>
                  </div>
                  <Switch
                    aria-invalid={fieldState.invalid}
                    checked={field.value}
                    id="certificate-active"
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
          <CardTitle>Переводы</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ru">
            <TabsList>
              <TabsTrigger value="ru">Русский</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            <TranslationFields form={form} locale="ru" />
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
              ? 'Добавить сертификат'
              : 'Сохранить'}
        </Button>
        <Button
          asChild
          disabled={form.formState.isSubmitting}
          variant="outline"
        >
          <Link href="/certificates">Отмена</Link>
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
  form: UseFormReturn<CertificateFormInput, unknown, CertificateFormValues>;
}) {
  const errors = form.formState.errors.translations?.[locale];
  const russian = locale === 'ru';
  return (
    <TabsContent value={locale}>
      <FieldGroup>
        <Field data-invalid={Boolean(errors?.title)}>
          <FieldLabel htmlFor={`${locale}-certificate-title`}>
            {russian ? 'Название *' : 'Title'}
          </FieldLabel>
          <Input
            aria-invalid={Boolean(errors?.title)}
            id={`${locale}-certificate-title`}
            {...form.register(`translations.${locale}.title`)}
          />
          {errors?.title?.message ? (
            <FieldError>{errors.title.message}</FieldError>
          ) : null}
        </Field>
        <Field data-invalid={Boolean(errors?.issuer)}>
          <FieldLabel htmlFor={`${locale}-certificate-issuer`}>
            {russian ? 'Кем выдан' : 'Issuer'}
          </FieldLabel>
          <Input
            aria-invalid={Boolean(errors?.issuer)}
            id={`${locale}-certificate-issuer`}
            placeholder={russian ? 'Название организации' : undefined}
            {...form.register(`translations.${locale}.issuer`)}
          />
          {errors?.issuer?.message ? (
            <FieldError>{errors.issuer.message}</FieldError>
          ) : null}
        </Field>
        <Field data-invalid={Boolean(errors?.description)}>
          <FieldLabel htmlFor={`${locale}-certificate-description`}>
            {russian ? 'Описание' : 'Description'}
          </FieldLabel>
          <Textarea
            aria-invalid={Boolean(errors?.description)}
            id={`${locale}-certificate-description`}
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
