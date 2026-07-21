'use client';

import {
  createPartnerContentDtoSchema,
  type CreatePartnerContentDto,
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
import { Textarea } from '@ak-strannik/ui/components/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import {
  createPartnerContent,
  updatePartnerContent,
} from '../_actions/partner.actions';
import { ImagesField } from './images-field';

export function PartnerForm({
  initialValues,
  partnerId,
}: {
  initialValues: CreatePartnerContentDto;
  partnerId?: string;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const form = useForm<
    z.input<typeof createPartnerContentDtoSchema>,
    undefined,
    CreatePartnerContentDto
  >({
    resolver: zodResolver(createPartnerContentDtoSchema),
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
    const result = partnerId
      ? await updatePartnerContent(partnerId, values)
      : await createPartnerContent(values);

    if (!result.success) {
      setFormError(result.message);
      return;
    }

    toast.success(result.message);
    router.push('/about/partners');
    router.refresh();
  });

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Общие данные</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="partner-link">Ссылка</FieldLabel>
              <Input
                aria-invalid={Boolean(form.formState.errors.link)}
                id="partner-link"
                placeholder="https://example.com"
                {...form.register('link')}
              />
              {form.formState.errors.link?.message ? (
                <FieldError>{form.formState.errors.link.message}</FieldError>
              ) : null}
            </Field>
            <ImagesField
              disabled={isSubmitting}
              images={images}
              onChange={(nextImages) =>
                form.setValue('images', nextImages, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              onUploadingChange={setUploading}
            />
            {form.formState.errors.images?.message ? (
              <FieldError>{form.formState.errors.images.message}</FieldError>
            ) : null}
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
            {fields.map((translation, index) => (
              <TabsContent key={translation.id} value={translation.locale}>
                <input
                  type="hidden"
                  {...form.register(`translations.${index}.locale`)}
                />
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor={`partner-title-${translation.locale}`}>
                      Название
                    </FieldLabel>
                    <Input
                      aria-invalid={Boolean(
                        form.formState.errors.translations?.[index]?.title
                      )}
                      id={`partner-title-${translation.locale}`}
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
                  <Field>
                    <FieldLabel htmlFor={`partner-text-${translation.locale}`}>
                      Текст
                    </FieldLabel>
                    <Textarea
                      aria-invalid={Boolean(
                        form.formState.errors.translations?.[index]?.text
                      )}
                      id={`partner-text-${translation.locale}`}
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
        <Button
          asChild
          disabled={isSubmitting || uploading}
          type="button"
          variant="outline"
        >
          <Link href="/about/partners">Отменить</Link>
        </Button>
        <Button disabled={isSubmitting || uploading} type="submit">
          {isSubmitting ? 'Сохранение…' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
}
