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
import { createRentalItemAction, updateRentalItemAction } from './actions';
import { rentalTypeOptions } from './constants';
import { RentalItemFormSchema, type RentalItemFormValues } from './schema';

type MediaOption = EventMediaOption;
type RentalItemFormProps =
  | {
      mode: 'create';
      rentalItemId?: never;
      defaultValues?: Partial<RentalItemFormValues>;
      mediaOptions: MediaOption[];
    }
  | {
      mode: 'edit';
      rentalItemId: string;
      defaultValues: RentalItemFormValues;
      mediaOptions: MediaOption[];
    };
type RentalItemFormInput = z.input<typeof RentalItemFormSchema>;
const emptyTranslation = { title: '', description: null, priceText: null };

export function RentalItemForm(props: RentalItemFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<RentalItemFormInput, unknown, RentalItemFormValues>({
    resolver: zodResolver(RentalItemFormSchema),
    defaultValues: {
      slug: '',
      type: 'mascot',
      imageId: null,
      sortOrder: 0,
      isActive: true,
      translations: {
        ru: { ...emptyTranslation },
        en: { ...emptyTranslation },
      },
      gallery: [],
      ...props.defaultValues,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    const result =
      props.mode === 'create'
        ? await createRentalItemAction(values)
        : await updateRentalItemAction(props.rentalItemId, values);
    if (!result.success) {
      for (const [name, messages] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(name as FieldPath<RentalItemFormInput>, {
          message: messages[0],
        });
      }
      setFormError(result.message);
      return;
    }
    toast.success(result.message);
    if (props.mode === 'create') router.push('/rentals');
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
            <Field data-invalid={Boolean(form.formState.errors.slug)}>
              <FieldLabel htmlFor="rental-slug">Slug</FieldLabel>
              <Input
                aria-invalid={Boolean(form.formState.errors.slug)}
                autoCapitalize="none"
                autoCorrect="off"
                id="rental-slug"
                placeholder="rostovaya-kukla-mickey"
                spellCheck={false}
                {...form.register('slug')}
              />
              <FieldDescription>
                Используется в адресе страницы. Допустимы строчные латинские
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
                  <FieldLabel htmlFor="rental-type">Тип аренды</FieldLabel>
                  <Select
                    id="rental-type"
                    aria-invalid={fieldState.invalid}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    {rentalTypeOptions.map((option) => (
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
              name="imageId"
              render={({ field, fieldState }) => {
                const selected = props.mediaOptions.find(
                  (asset) => asset.id === field.value
                );
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="rental-image">Изображение</FieldLabel>
                    {selected ? (
                      <MediaPreview
                        alt={selected.alt}
                        className="h-56 rounded-lg border"
                        url={selected.publicUrl}
                      />
                    ) : null}
                    <Select
                      id="rental-image"
                      aria-invalid={fieldState.invalid}
                      value={field.value ?? ''}
                      onChange={(event) =>
                        field.onChange(event.target.value || null)
                      }
                    >
                      <option value="">Без изображения</option>
                      {props.mediaOptions.map((asset) => (
                        <option key={asset.id} value={asset.id}>
                          {asset.originalName}
                        </option>
                      ))}
                    </Select>
                    <FieldDescription>
                      Основное изображение позиции аренды.
                    </FieldDescription>
                    {fieldState.error?.message ? (
                      <FieldError>{fieldState.error.message}</FieldError>
                    ) : null}
                  </Field>
                );
              }}
            />

            <Field data-invalid={Boolean(form.formState.errors.sortOrder)}>
              <FieldLabel htmlFor="rental-sort-order">
                Порядок отображения
              </FieldLabel>
              <Input
                id="rental-sort-order"
                type="number"
                min={0}
                step={1}
                aria-invalid={Boolean(form.formState.errors.sortOrder)}
                {...form.register('sortOrder', { valueAsNumber: true })}
              />
              <FieldDescription>
                Позиции с меньшим значением отображаются раньше.
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
                    <FieldLabel htmlFor="rental-active">
                      Показывать на сайте
                    </FieldLabel>
                    <FieldDescription>
                      Скрытая позиция не отображается на публичном сайте.
                    </FieldDescription>
                  </div>
                  <Switch
                    id="rental-active"
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
          <CardTitle>Галерея</CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            control={form.control}
            name="gallery"
            render={({ field, fieldState }) => (
              <EventGalleryField
                value={field.value}
                onChange={field.onChange}
                mediaOptions={props.mediaOptions}
                error={fieldState.error?.message}
              />
            )}
          />
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
      <div className="flex flex-wrap gap-3">
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting
            ? 'Сохранение…'
            : props.mode === 'create'
              ? 'Добавить позицию'
              : 'Сохранить'}
        </Button>
        <Button
          asChild
          disabled={form.formState.isSubmitting}
          variant="outline"
        >
          <Link href="/rentals">Отмена</Link>
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
  form: UseFormReturn<RentalItemFormInput, unknown, RentalItemFormValues>;
}) {
  const errors = form.formState.errors.translations?.[locale];
  const russian = locale === 'ru';
  return (
    <TabsContent value={locale}>
      <FieldGroup>
        <Field data-invalid={Boolean(errors?.title)}>
          <FieldLabel htmlFor={`${locale}-rental-title`}>
            {russian ? 'Название *' : 'Title'}
          </FieldLabel>
          <Input
            id={`${locale}-rental-title`}
            aria-invalid={Boolean(errors?.title)}
            {...form.register(`translations.${locale}.title`)}
          />
          {errors?.title?.message ? (
            <FieldError>{errors.title.message}</FieldError>
          ) : null}
        </Field>
        <Field data-invalid={Boolean(errors?.description)}>
          <FieldLabel htmlFor={`${locale}-rental-description`}>
            {russian ? 'Описание' : 'Description'}
          </FieldLabel>
          <Textarea
            id={`${locale}-rental-description`}
            rows={6}
            aria-invalid={Boolean(errors?.description)}
            {...form.register(`translations.${locale}.description`)}
          />
          {errors?.description?.message ? (
            <FieldError>{errors.description.message}</FieldError>
          ) : null}
        </Field>
        <Field data-invalid={Boolean(errors?.priceText)}>
          <FieldLabel htmlFor={`${locale}-rental-price`}>
            {russian ? 'Цена' : 'Price'}
          </FieldLabel>
          <Input
            id={`${locale}-rental-price`}
            placeholder={russian ? 'от 15 000 ₽' : undefined}
            aria-invalid={Boolean(errors?.priceText)}
            {...form.register(`translations.${locale}.priceText`)}
          />
          <FieldDescription>
            Текст цены в том виде, в котором он будет отображаться на сайте.
          </FieldDescription>
          {errors?.priceText?.message ? (
            <FieldError>{errors.priceText.message}</FieldError>
          ) : null}
        </Field>
      </FieldGroup>
    </TabsContent>
  );
}
