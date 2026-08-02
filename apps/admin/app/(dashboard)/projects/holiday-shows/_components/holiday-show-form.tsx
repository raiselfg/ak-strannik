'use client';
import {
  createHolidayShowContentDtoSchema,
  type CreateHolidayShowContentDto,
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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import { ImagesField } from '../../../../_components/images-field';
import {
  createHolidayShowContent,
  updateHolidayShowContent,
} from '../_actions/holiday-show.actions';
export function HolidayShowForm({
  initialValues,
  showId,
}: {
  initialValues: CreateHolidayShowContentDto;
  showId?: string;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const form = useForm<
    z.input<typeof createHolidayShowContentDtoSchema>,
    undefined,
    CreateHolidayShowContentDto
  >({
    resolver: zodResolver(createHolidayShowContentDtoSchema),
    defaultValues: initialValues,
  });
  const { fields } = useFieldArray({
    control: form.control,
    name: 'translations',
  });
  const images = useWatch({ control: form.control, name: 'images' }) ?? [];
  const isSubmitting = form.formState.isSubmitting;
  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    const result = showId
      ? await updateHolidayShowContent(showId, values)
      : await createHolidayShowContent(values);
    if (!result.success) return setFormError(result.message);
    toast.success(result.message);
    router.push('/projects/holiday-shows');
    router.refresh();
  });
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Общие данные</CardTitle>
        </CardHeader>
        <CardContent>
          <ImagesField
            disabled={isSubmitting}
            images={images}
            label="Фотографии праздника"
            onChange={(value) =>
              form.setValue('images', value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            onUploadingChange={setUploading}
          />
          {form.formState.errors.images?.message ? (
            <FieldError className="mt-3">
              {form.formState.errors.images.message}
            </FieldError>
          ) : null}
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
            {fields.map((translation, index) => (
              <TabsContent key={translation.id} value={translation.locale}>
                <input
                  type="hidden"
                  {...form.register(`translations.${index}.locale`)}
                />
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor={`holiday-title-${translation.locale}`}>
                      Название
                    </FieldLabel>
                    <Input
                      aria-invalid={Boolean(
                        form.formState.errors.translations?.[index]?.title
                      )}
                      id={`holiday-title-${translation.locale}`}
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
            <FieldError className="mt-4">
              {form.formState.errors.translations.message}
            </FieldError>
          ) : null}
        </CardContent>
      </Card>
      {formError ? <FieldError>{formError}</FieldError> : null}
      <div className="flex justify-end gap-3">
        <Button asChild disabled={isSubmitting || uploading} variant="outline">
          <Link href="/projects/holiday-shows">Отменить</Link>
        </Button>
        <Button disabled={isSubmitting || uploading} type="submit">
          {isSubmitting ? 'Сохранение…' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
}
