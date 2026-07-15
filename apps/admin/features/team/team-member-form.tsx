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
import { createTeamMemberAction, updateTeamMemberAction } from './actions';
import { TeamMemberFormSchema, type TeamMemberFormValues } from './schema';
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

type TeamMemberFormProps =
  | {
      mode: 'create';
      teamMemberId?: never;
      defaultValues?: Partial<TeamMemberFormValues>;
      mediaOptions: MediaOption[];
    }
  | {
      mode: 'edit';
      teamMemberId: string;
      defaultValues: TeamMemberFormValues;
      mediaOptions: MediaOption[];
    };

const emptyTranslation = { name: '', role: null, description: null };

export function TeamMemberForm(props: TeamMemberFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [mediaOptions, setMediaOptions] = useState(props.mediaOptions);
  const [pendingImage, setPendingImage] = useState<PendingMedia | null>(null);
  type TeamMemberFormInput = z.input<typeof TeamMemberFormSchema>;
  const form = useForm<TeamMemberFormInput, unknown, TeamMemberFormValues>({
    resolver: zodResolver(TeamMemberFormSchema),
    defaultValues: {
      imageId: null,
      sortOrder: 0,
      isActive: true,
      translations: {
        ru: { ...emptyTranslation },
        en: { ...emptyTranslation },
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
    const imageId = replacePendingId(values.imageId, upload.replacements);
    if (imageId !== values.imageId) {
      form.setValue('imageId', imageId);
      if (pendingImage) URL.revokeObjectURL(pendingImage.previewUrl);
      setPendingImage(null);
      setMediaOptions((current) => mergeMediaOptions(current, upload.assets));
    }
    const nextValues = { ...values, imageId };
    const result =
      props.mode === 'create'
        ? await createTeamMemberAction(nextValues)
        : await updateTeamMemberAction(props.teamMemberId, nextValues);
    if (!result.success) {
      if (result.fieldErrors) {
        for (const [name, messages] of Object.entries(result.fieldErrors)) {
          form.setError(name as FieldPath<TeamMemberFormInput>, {
            message: messages[0],
          });
        }
      }
      setFormError(result.message);
      return;
    }
    toast.success(result.message);
    if (props.mode === 'create') router.push('/team');
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
                  description="Выберите изображение из медиатеки или загрузите новый файл. Загрузка произойдёт после сохранения формы."
                  error={fieldState.error?.message}
                  id="team-member-image"
                  label="Фотография"
                  mediaOptions={mediaOptions}
                  onChange={field.onChange}
                  onPendingFileChange={setPendingImage}
                  pendingFile={pendingImage}
                  value={field.value}
                />
              )}
            />
            <Field data-invalid={Boolean(form.formState.errors.sortOrder)}>
              <FieldLabel htmlFor="team-member-sort-order">
                Порядок сортировки
              </FieldLabel>
              <Input
                id="team-member-sort-order"
                type="number"
                min={0}
                step={1}
                aria-invalid={Boolean(form.formState.errors.sortOrder)}
                {...form.register('sortOrder', { valueAsNumber: true })}
              />
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
                  data-invalid={fieldState.invalid}
                  className="flex flex-row items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <FieldLabel htmlFor="team-member-active">
                      Показывать на сайте
                    </FieldLabel>
                    <FieldDescription>
                      Скрытого участника не будет видно на публичном сайте.
                    </FieldDescription>
                  </div>
                  <Switch
                    id="team-member-active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={fieldState.invalid}
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
            <TranslationFields locale="ru" form={form} required />
            <TranslationFields locale="en" form={form} />
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
              ? 'Добавить участника'
              : 'Сохранить'}
        </Button>
        <Button asChild variant="outline">
          <Link href="/team">Отмена</Link>
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
  form: UseFormReturn<
    z.input<typeof TeamMemberFormSchema>,
    unknown,
    TeamMemberFormValues
  >;
  required?: boolean;
}) {
  const errors = form.formState.errors.translations?.[locale];
  return (
    <TabsContent value={locale}>
      <FieldGroup>
        <Field data-invalid={Boolean(errors?.name)}>
          <FieldLabel htmlFor={`${locale}-name`}>
            {locale === 'ru' ? 'Имя' : 'Name'}
            {required ? ' *' : ''}
          </FieldLabel>
          <Input
            id={`${locale}-name`}
            aria-invalid={Boolean(errors?.name)}
            {...form.register(`translations.${locale}.name`)}
          />
          {errors?.name?.message ? (
            <FieldError>{errors.name.message}</FieldError>
          ) : null}
        </Field>
        <Field data-invalid={Boolean(errors?.role)}>
          <FieldLabel htmlFor={`${locale}-role`}>
            {locale === 'ru' ? 'Должность' : 'Role'}
          </FieldLabel>
          <Input
            id={`${locale}-role`}
            aria-invalid={Boolean(errors?.role)}
            {...form.register(`translations.${locale}.role`)}
          />
          {errors?.role?.message ? (
            <FieldError>{errors.role.message}</FieldError>
          ) : null}
        </Field>
        <Field data-invalid={Boolean(errors?.description)}>
          <FieldLabel htmlFor={`${locale}-description`}>
            {locale === 'ru' ? 'Описание' : 'Description'}
          </FieldLabel>
          <Textarea
            id={`${locale}-description`}
            rows={6}
            aria-invalid={Boolean(errors?.description)}
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
