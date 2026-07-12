'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@ak-strannik/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@ak-strannik/ui/components/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@ak-strannik/ui/components/field';
import { Input } from '@ak-strannik/ui/components/input';
import { Select } from '@ak-strannik/ui/components/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ak-strannik/ui/components/tabs';
import { Textarea } from '@ak-strannik/ui/components/textarea';
import { toast } from '@ak-strannik/ui/components/sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, type FieldPath, type UseFormReturn, useForm } from 'react-hook-form';
import { z } from 'zod';
import { MediaPreview } from '../media/media-preview';
import { createEventAction, updateEventAction } from './actions';
import { contentStatusOptions } from './constants';
import { EventGalleryField, type EventMediaOption } from './event-gallery-field';
import { EventFormSchema, type EventFormValues } from './schema';

type EventFormProps =
  | { mode: 'create'; eventId?: never; defaultValues?: Partial<EventFormValues>; mediaOptions: EventMediaOption[] }
  | { mode: 'edit'; eventId: string; defaultValues: EventFormValues; mediaOptions: EventMediaOption[] };
type EventFormInput = z.input<typeof EventFormSchema>;
const emptyTranslation = { title: '', excerpt: null, body: null, seoTitle: null, seoDescription: null };

function toDateTimeInput(value: Date | null) {
  if (!value) return '';
  const local = new Date(value.getTime() - value.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function EventForm(props: EventFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<EventFormInput, unknown, EventFormValues>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
      slug: '', status: 'draft', eventDate: null, coverImageId: null,
      youtubeUrl: null, sortOrder: 0, publishedAt: null,
      translations: { ru: { ...emptyTranslation }, en: { ...emptyTranslation } },
      gallery: [],
      ...props.defaultValues,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    const result = props.mode === 'create'
      ? await createEventAction(values)
      : await updateEventAction(props.eventId, values);
    if (!result.success) {
      for (const [name, messages] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(name as FieldPath<EventFormInput>, { message: messages[0] });
      }
      setFormError(result.message);
      return;
    }
    toast.success(result.message);
    if (props.mode === 'create') router.push('/events'); else router.refresh();
  });

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <Card><CardHeader><CardTitle>Основная информация</CardTitle></CardHeader><CardContent><FieldGroup>
        <Field data-invalid={Boolean(form.formState.errors.slug)}><FieldLabel htmlFor="event-slug">Slug</FieldLabel><Input id="event-slug" autoCapitalize="none" autoCorrect="off" spellCheck={false} placeholder="novogodniy-spektakl-2026" aria-invalid={Boolean(form.formState.errors.slug)} {...form.register('slug')} /><FieldDescription>Строчные латинские буквы, цифры и дефисы.</FieldDescription>{form.formState.errors.slug?.message ? <FieldError>{form.formState.errors.slug.message}</FieldError> : null}</Field>
        <Controller control={form.control} name="status" render={({ field, fieldState }) => <Field data-invalid={fieldState.invalid}><FieldLabel htmlFor="event-status">Статус</FieldLabel><Select id="event-status" value={field.value} onChange={field.onChange}>{contentStatusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select>{fieldState.error?.message ? <FieldError>{fieldState.error.message}</FieldError> : null}</Field>} />
        <DateTimeField control={form} name="eventDate" label="Дата мероприятия" />
        <Field data-invalid={Boolean(form.formState.errors.youtubeUrl)}><FieldLabel htmlFor="event-youtube">YouTube</FieldLabel><Input id="event-youtube" type="url" placeholder="https://www.youtube.com/watch?v=..." aria-invalid={Boolean(form.formState.errors.youtubeUrl)} {...form.register('youtubeUrl')} />{form.formState.errors.youtubeUrl?.message ? <FieldError>{form.formState.errors.youtubeUrl.message}</FieldError> : null}</Field>
        <Field data-invalid={Boolean(form.formState.errors.sortOrder)}><FieldLabel htmlFor="event-sort-order">Порядок отображения</FieldLabel><Input id="event-sort-order" type="number" min={0} step={1} aria-invalid={Boolean(form.formState.errors.sortOrder)} {...form.register('sortOrder', { valueAsNumber: true })} /><FieldDescription>Мероприятия с меньшим значением отображаются раньше.</FieldDescription>{form.formState.errors.sortOrder?.message ? <FieldError>{form.formState.errors.sortOrder.message}</FieldError> : null}</Field>
      </FieldGroup></CardContent></Card>

      <Card><CardHeader><CardTitle>Публикация</CardTitle></CardHeader><CardContent><DateTimeField control={form} name="publishedAt" label="Дата публикации" description="Если дата не указана при публикации, будет использовано текущее время." /></CardContent></Card>

      <Card><CardHeader><CardTitle>Медиа</CardTitle></CardHeader><CardContent><FieldGroup>
        <Controller control={form.control} name="coverImageId" render={({ field, fieldState }) => {
          const selected = props.mediaOptions.find((asset) => asset.id === field.value);
          return <Field data-invalid={fieldState.invalid}><FieldLabel htmlFor="event-cover">Обложка</FieldLabel>{selected ? <MediaPreview alt={selected.alt} className="h-64 rounded-lg border" url={selected.publicUrl} /> : null}<Select id="event-cover" value={field.value ?? ''} onChange={(event) => field.onChange(event.target.value || null)}><option value="">Без обложки</option>{props.mediaOptions.map((asset) => <option key={asset.id} value={asset.id}>{asset.originalName}</option>)}</Select>{fieldState.error?.message ? <FieldError>{fieldState.error.message}</FieldError> : null}</Field>;
        }} />
        <Controller control={form.control} name="gallery" render={({ field, fieldState }) => <EventGalleryField value={field.value} onChange={field.onChange} mediaOptions={props.mediaOptions} error={fieldState.error?.message} />} />
      </FieldGroup></CardContent></Card>

      <Card><CardHeader><CardTitle>Контент и SEO</CardTitle></CardHeader><CardContent><Tabs defaultValue="ru"><TabsList><TabsTrigger value="ru">Русский</TabsTrigger><TabsTrigger value="en">English</TabsTrigger></TabsList><TranslationFields locale="ru" form={form} /><TranslationFields locale="en" form={form} /></Tabs></CardContent></Card>

      {formError ? <p className="text-sm font-medium text-destructive" role="alert">{formError}</p> : null}
      <div className="flex gap-3"><Button disabled={form.formState.isSubmitting} type="submit">{form.formState.isSubmitting ? 'Сохранение…' : props.mode === 'create' ? 'Добавить мероприятие' : 'Сохранить'}</Button><Button asChild disabled={form.formState.isSubmitting} variant="outline"><Link href="/events">Отмена</Link></Button></div>
    </form>
  );
}

function DateTimeField({ control, name, label, description }: { control: UseFormReturn<EventFormInput, unknown, EventFormValues>; name: 'eventDate' | 'publishedAt'; label: string; description?: string }) {
  return <Controller control={control.control} name={name} render={({ field, fieldState }) => <Field data-invalid={fieldState.invalid}><FieldLabel htmlFor={`event-${name}`}>{label}</FieldLabel><Input id={`event-${name}`} type="datetime-local" value={toDateTimeInput(field.value)} onBlur={field.onBlur} ref={field.ref} onChange={(event) => field.onChange(event.target.value ? new Date(event.target.value) : null)} aria-invalid={fieldState.invalid} />{description ? <FieldDescription>{description}</FieldDescription> : null}{fieldState.error?.message ? <FieldError>{fieldState.error.message}</FieldError> : null}</Field>} />;
}

function TranslationFields({ locale, form }: { locale: 'ru' | 'en'; form: UseFormReturn<EventFormInput, unknown, EventFormValues> }) {
  const errors = form.formState.errors.translations?.[locale];
  const russian = locale === 'ru';
  return <TabsContent value={locale}><FieldGroup>
    <Field data-invalid={Boolean(errors?.title)}><FieldLabel htmlFor={`${locale}-event-title`}>{russian ? 'Название *' : 'Title'}</FieldLabel><Input id={`${locale}-event-title`} aria-invalid={Boolean(errors?.title)} {...form.register(`translations.${locale}.title`)} />{errors?.title?.message ? <FieldError>{errors.title.message}</FieldError> : null}</Field>
    <Field data-invalid={Boolean(errors?.excerpt)}><FieldLabel htmlFor={`${locale}-event-excerpt`}>{russian ? 'Краткое описание' : 'Excerpt'}</FieldLabel><Textarea id={`${locale}-event-excerpt`} rows={3} aria-invalid={Boolean(errors?.excerpt)} {...form.register(`translations.${locale}.excerpt`)} />{errors?.excerpt?.message ? <FieldError>{errors.excerpt.message}</FieldError> : null}</Field>
    <Field data-invalid={Boolean(errors?.body)}><FieldLabel htmlFor={`${locale}-event-body`}>{russian ? 'Основной текст' : 'Body'}</FieldLabel><Textarea id={`${locale}-event-body`} rows={10} aria-invalid={Boolean(errors?.body)} {...form.register(`translations.${locale}.body`)} />{errors?.body?.message ? <FieldError>{errors.body.message}</FieldError> : null}</Field>
    <Field data-invalid={Boolean(errors?.seoTitle)}><FieldLabel htmlFor={`${locale}-event-seo-title`}>SEO title</FieldLabel><Input id={`${locale}-event-seo-title`} maxLength={70} aria-invalid={Boolean(errors?.seoTitle)} {...form.register(`translations.${locale}.seoTitle`)} />{errors?.seoTitle?.message ? <FieldError>{errors.seoTitle.message}</FieldError> : null}</Field>
    <Field data-invalid={Boolean(errors?.seoDescription)}><FieldLabel htmlFor={`${locale}-event-seo-description`}>SEO description</FieldLabel><Textarea id={`${locale}-event-seo-description`} maxLength={170} rows={4} aria-invalid={Boolean(errors?.seoDescription)} {...form.register(`translations.${locale}.seoDescription`)} />{errors?.seoDescription?.message ? <FieldError>{errors.seoDescription.message}</FieldError> : null}</Field>
  </FieldGroup></TabsContent>;
}
