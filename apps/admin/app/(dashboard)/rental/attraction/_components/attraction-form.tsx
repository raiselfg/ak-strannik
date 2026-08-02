'use client';
import {
  createAttractionContentDtoSchema,
  type CreateAttractionContentDto,
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
import { toast } from '@ak-strannik/ui/components/sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@ak-strannik/ui/components/tabs';
import { Textarea } from '@ak-strannik/ui/components/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import { SingleImageField } from '../../../../_components/single-image-field';
import {
  createAttractionContent,
  updateAttractionContent,
} from '../_actions/attraction.actions';
export function AttractionForm({
  attractionId,
  initialValues,
}: {
  attractionId?: string;
  initialValues: CreateAttractionContentDto;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const form = useForm<
    z.input<typeof createAttractionContentDtoSchema>,
    undefined,
    CreateAttractionContentDto
  >({
    resolver: zodResolver(createAttractionContentDtoSchema),
    defaultValues: initialValues,
  });
  const { fields } = useFieldArray({
    control: form.control,
    name: 'translations',
  });
  const image = useWatch({ control: form.control, name: 'image' }) ?? '';
  const isSubmitting = form.formState.isSubmitting;
  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    const result = attractionId
      ? await updateAttractionContent(attractionId, values)
      : await createAttractionContent(values);
    if (!result.success) return setFormError(result.message);
    toast.success(result.message);
    router.push('/rental/attraction');
    router.refresh();
  });
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Изображение</CardTitle>
        </CardHeader>
        <CardContent>
          <SingleImageField
            disabled={isSubmitting}
            image={image}
            label="Изображение аттракциона"
            onChange={(value) =>
              form.setValue('image', value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            onUploadingChange={setUploading}
          />
          {form.formState.errors.image?.message ? (
            <FieldError className="mt-3">
              {form.formState.errors.image.message}
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
                    <FieldLabel
                      htmlFor={`attraction-text-${translation.locale}`}
                    >
                      Описание аттракциона
                    </FieldLabel>
                    <Textarea
                      aria-invalid={Boolean(
                        form.formState.errors.translations?.[index]?.text
                      )}
                      id={`attraction-text-${translation.locale}`}
                      {...form.register(`translations.${index}.text`)}
                    />
                    {form.formState.errors.translations?.[index]?.text
                      ?.message ? (
                      <FieldError>
                        {
                          form.formState.errors.translations[index]?.text
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
          <Link href="/rental/attraction">Отменить</Link>
        </Button>
        <Button disabled={isSubmitting || uploading} type="submit">
          {isSubmitting ? 'Сохранение…' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
}
