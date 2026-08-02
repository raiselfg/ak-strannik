'use client';
import {
  createMascotCostumeContentDtoSchema,
  type CreateMascotCostumeContentDto,
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
  createMascotCostumeContent,
  updateMascotCostumeContent,
} from '../_actions/mascot-costume.actions';
export function MascotCostumeForm({
  initialValues,
  costumeId,
}: {
  initialValues: CreateMascotCostumeContentDto;
  costumeId?: string;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const form = useForm<
    z.input<typeof createMascotCostumeContentDtoSchema>,
    undefined,
    CreateMascotCostumeContentDto
  >({
    resolver: zodResolver(createMascotCostumeContentDtoSchema),
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
    const result = costumeId
      ? await updateMascotCostumeContent(costumeId, values)
      : await createMascotCostumeContent(values);
    if (!result.success) return setFormError(result.message);
    toast.success(result.message);
    router.push('/rental/mascot-costume');
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
            label="Изображение ростовой куклы"
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
                    <FieldLabel htmlFor={`costume-text-${translation.locale}`}>
                      Описание ростовой куклы
                    </FieldLabel>
                    <Textarea
                      aria-invalid={Boolean(
                        form.formState.errors.translations?.[index]?.text
                      )}
                      id={`costume-text-${translation.locale}`}
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
          <Link href="/rental/mascot-costume">Отменить</Link>
        </Button>
        <Button disabled={isSubmitting || uploading} type="submit">
          {isSubmitting ? 'Сохранение…' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
}
