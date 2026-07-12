'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@ak-strannik/ui/components/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@ak-strannik/ui/components/field';
import { Input } from '@ak-strannik/ui/components/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ak-strannik/ui/components/tabs';
import { Textarea } from '@ak-strannik/ui/components/textarea';
import { toast } from '@ak-strannik/ui/components/sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { type FieldPath, type UseFormReturn, useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateMediaAssetMetadataAction } from './actions';
import { MediaAssetMetadataFormSchema, type MediaAssetMetadataFormValues } from './schema';

type InputValues = z.input<typeof MediaAssetMetadataFormSchema>;

export function MediaAssetMetadataForm({ id, defaultValues }: { id: string; defaultValues: MediaAssetMetadataFormValues }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<InputValues, unknown, MediaAssetMetadataFormValues>({ resolver: zodResolver(MediaAssetMetadataFormSchema), defaultValues });
  const submit = form.handleSubmit(async (values) => {
    setError(null);
    const result = await updateMediaAssetMetadataAction(id, values);
    if (!result.success) {
      for (const [name, messages] of Object.entries(result.fieldErrors ?? {})) form.setError(name as FieldPath<InputValues>, { message: messages[0] });
      setError(result.message); return;
    }
    toast.success(result.message); router.refresh();
  });
  return <form className="space-y-5" onSubmit={submit}>
    <Tabs defaultValue="ru"><TabsList><TabsTrigger value="ru">Русский</TabsTrigger><TabsTrigger value="en">English</TabsTrigger></TabsList><TranslationFields locale="ru" form={form} /><TranslationFields locale="en" form={form} /></Tabs>
    {error ? <p role="alert" className="text-sm font-medium text-destructive">{error}</p> : null}
    <Button disabled={form.formState.isSubmitting} type="submit">{form.formState.isSubmitting ? 'Сохранение…' : 'Сохранить метаданные'}</Button>
  </form>;
}

function TranslationFields({ locale, form }: { locale: 'ru' | 'en'; form: UseFormReturn<InputValues, unknown, MediaAssetMetadataFormValues> }) {
  const errors = form.formState.errors.translations?.[locale];
  return <TabsContent value={locale}><FieldGroup>
    <Field><FieldLabel htmlFor={`${locale}-alt`}>Alt</FieldLabel><Input id={`${locale}-alt`} aria-invalid={Boolean(errors?.alt)} {...form.register(`translations.${locale}.alt`)} /><FieldDescription>Краткое текстовое описание изображения для доступности и случаев, когда изображение не загрузилось.</FieldDescription>{errors?.alt?.message ? <FieldError>{errors.alt.message}</FieldError> : null}</Field>
    <Field><FieldLabel htmlFor={`${locale}-title`}>Title</FieldLabel><Input id={`${locale}-title`} aria-invalid={Boolean(errors?.title)} {...form.register(`translations.${locale}.title`)} /><FieldDescription>Дополнительный заголовок медиафайла.</FieldDescription>{errors?.title?.message ? <FieldError>{errors.title.message}</FieldError> : null}</Field>
    <Field><FieldLabel htmlFor={`${locale}-caption`}>Caption</FieldLabel><Textarea id={`${locale}-caption`} rows={5} aria-invalid={Boolean(errors?.caption)} {...form.register(`translations.${locale}.caption`)} /><FieldDescription>Подпись, которая может отображаться рядом с изображением.</FieldDescription>{errors?.caption?.message ? <FieldError>{errors.caption.message}</FieldError> : null}</Field>
  </FieldGroup></TabsContent>;
}
