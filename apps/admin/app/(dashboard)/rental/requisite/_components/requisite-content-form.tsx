'use client';

import {
  createRequisiteContentDtoSchema,
  updateRequisiteContentDtoSchema,
  type UpdateRequisiteContentDto,
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
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import {
  createRequisiteContent,
  updateRequisiteContent,
} from '../_actions/requisite.actions';
import { RequisiteItemSection } from './requisite-item-section';

function nullableTitle(value: string | null | undefined): string | null {
  return value === '' || value == null ? null : value;
}

export function RequisiteContentForm({
  contentId,
  initialValues,
}: {
  contentId?: string;
  initialValues: UpdateRequisiteContentDto;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadCount, setUploadCount] = useState(0);
  const form = useForm<
    z.input<typeof updateRequisiteContentDtoSchema>,
    undefined,
    UpdateRequisiteContentDto
  >({
    resolver: zodResolver(updateRequisiteContentDtoSchema),
    defaultValues: initialValues,
  });
  const { append, fields, move, remove } = useFieldArray({
    control: form.control,
    name: 'requisites',
  });
  const translations =
    useWatch({ control: form.control, name: 'translations' }) ?? [];
  const isSubmitting = form.formState.isSubmitting;
  const uploading = uploadCount > 0;
  const trackUpload = (active: boolean) =>
    setUploadCount((count) => (active ? count + 1 : Math.max(0, count - 1)));

  const submit = form.handleSubmit(async (values) => {
    setFormError(null);
    const normalized: UpdateRequisiteContentDto = {
      ...values,
      translations: (values.translations ?? []).map((translation) => ({
        ...translation,
        title: nullableTitle(translation.title),
      })),
      requisites: (values.requisites ?? []).map((requisite, position) => ({
        ...requisite,
        position,
        translations: (requisite.translations ?? []).map((translation) => ({
          ...translation,
          title: nullableTitle(translation.title),
        })),
      })),
    };
    const result = contentId
      ? await updateRequisiteContent(contentId, normalized)
      : await (async () => {
          const createInput =
            createRequisiteContentDtoSchema.safeParse(normalized);
          if (!createInput.success)
            return {
              success: false as const,
              message: 'Проверьте заполнение формы',
            };
          return createRequisiteContent(createInput.data);
        })();
    if (!result.success) {
      setFormError(result.message);
      return;
    }
    toast.success(result.message);
    router.push('/rental/requisite');
    router.refresh();
  });

  return (
    <form className="space-y-6" onSubmit={submit}>
      <Card>
        <CardHeader>
          <CardTitle>Название набора</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ru">
            <TabsList>
              <TabsTrigger value="ru">Русский</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            {translations.map((translation, index) => (
              <TabsContent
                key={`${translation.locale ?? 'translation'}-${index}`}
                value={translation.locale ?? (index === 0 ? 'ru' : 'en')}
              >
                <input
                  type="hidden"
                  {...form.register(`translations.${index}.id`)}
                />
                <input
                  type="hidden"
                  {...form.register(`translations.${index}.locale`)}
                />
                <FieldGroup>
                  <Field>
                    <FieldLabel
                      htmlFor={`requisite-root-title-${translation.locale}`}
                    >
                      Название
                    </FieldLabel>
                    <Input
                      aria-invalid={Boolean(
                        form.formState.errors.translations?.[index]?.title
                      )}
                      id={`requisite-root-title-${translation.locale}`}
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
            <FieldError className="mt-3">
              {form.formState.errors.translations.message}
            </FieldError>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Элементы реквизита</h2>
          <p className="text-sm text-muted-foreground">
            Все элементы сохраняются одной кнопкой.
          </p>
        </div>
        <Button
          disabled={isSubmitting || uploading}
          onClick={() =>
            append({
              image: '',
              position: fields.length,
              translations: [
                { locale: 'ru', title: '' },
                { locale: 'en', title: '' },
              ],
            })
          }
          type="button"
        >
          <Plus />
          Добавить элемент
        </Button>
      </div>
      {fields.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Элементов пока нет.
          </CardContent>
        </Card>
      ) : null}
      <div className="space-y-5">
        {fields.map((field, index) => (
          <RequisiteItemSection
            canMoveDown={index < fields.length - 1}
            canMoveUp={index > 0}
            disabled={isSubmitting}
            form={form}
            index={index}
            key={field.id}
            onMoveDown={() => move(index, index + 1)}
            onMoveUp={() => move(index, index - 1)}
            onRemove={() => remove(index)}
            onUploadingChange={trackUpload}
          />
        ))}
      </div>
      {form.formState.errors.requisites?.message ? (
        <FieldError>{form.formState.errors.requisites.message}</FieldError>
      ) : null}
      {formError ? <FieldError>{formError}</FieldError> : null}
      <div className="flex justify-end gap-3">
        <Button asChild disabled={isSubmitting || uploading} variant="outline">
          <Link href="/rental/requisite">Отменить</Link>
        </Button>
        <Button disabled={isSubmitting || uploading} type="submit">
          {isSubmitting ? 'Сохранение…' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
}
