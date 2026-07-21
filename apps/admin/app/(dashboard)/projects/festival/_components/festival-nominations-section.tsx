'use client';

import {
  updateFestivalContentDtoSchema,
  type UpdateFestivalContentDto,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@ak-strannik/ui/components/tabs';
import { Textarea } from '@ak-strannik/ui/components/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { useWatch, type UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';

export function FestivalNominationsSection({
  disabled,
  form,
}: {
  disabled: boolean;
  form: UseFormReturn<
    z.input<typeof updateFestivalContentDtoSchema>,
    undefined,
    UpdateFestivalContentDto
  >;
}) {
  const nominations = useWatch({ control: form.control, name: 'nominations' });
  if (!nominations)
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-between gap-3 py-6">
          <div>
            <h2 className="font-semibold">Номинации</h2>
            <p className="text-sm text-muted-foreground">Блок не добавлен.</p>
          </div>
          <Button
            disabled={disabled}
            onClick={() =>
              form.setValue(
                'nominations',
                {
                  translations: [
                    { locale: 'ru', title: '', text: '' },
                    { locale: 'en', title: '', text: '' },
                  ],
                },
                { shouldDirty: true }
              )
            }
            type="button"
          >
            <Plus />
            Добавить блок
          </Button>
        </CardContent>
      </Card>
    );
  const translations = nominations.translations ?? [];
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Номинации</CardTitle>
        <Button
          disabled={disabled}
          onClick={() =>
            form.setValue('nominations', null, { shouldDirty: true })
          }
          type="button"
          variant="destructive"
        >
          <Trash2 />
          Удалить блок
        </Button>
      </CardHeader>
      <CardContent>
        <input type="hidden" {...form.register('nominations.id')} />
        <Tabs defaultValue="ru">
          <TabsList>
            <TabsTrigger value="ru">Русский</TabsTrigger>
            <TabsTrigger value="en">English</TabsTrigger>
          </TabsList>
          {translations.map((translation, index) => (
            <TabsContent
              key={`${translation.locale}-${index}`}
              value={translation.locale ?? (index === 0 ? 'ru' : 'en')}
            >
              <input
                type="hidden"
                {...form.register(`nominations.translations.${index}.id`)}
              />
              <input
                type="hidden"
                {...form.register(`nominations.translations.${index}.locale`)}
              />
              <FieldGroup>
                <Field>
                  <FieldLabel>Название</FieldLabel>
                  <Input
                    aria-invalid={Boolean(
                      form.formState.errors.nominations?.translations?.[index]
                        ?.title
                    )}
                    {...form.register(
                      `nominations.translations.${index}.title`
                    )}
                  />
                  {form.formState.errors.nominations?.translations?.[index]
                    ?.title?.message ? (
                    <FieldError>
                      {
                        form.formState.errors.nominations.translations?.[index]
                          ?.title?.message
                      }
                    </FieldError>
                  ) : null}
                </Field>
                <Field>
                  <FieldLabel>Текст</FieldLabel>
                  <Textarea
                    aria-invalid={Boolean(
                      form.formState.errors.nominations?.translations?.[index]
                        ?.text
                    )}
                    {...form.register(`nominations.translations.${index}.text`)}
                  />
                  {form.formState.errors.nominations?.translations?.[index]
                    ?.text?.message ? (
                    <FieldError>
                      {
                        form.formState.errors.nominations.translations?.[index]
                          ?.text?.message
                      }
                    </FieldError>
                  ) : null}
                </Field>
              </FieldGroup>
            </TabsContent>
          ))}
        </Tabs>
        {form.formState.errors.nominations?.translations?.message ? (
          <FieldError>
            {form.formState.errors.nominations.translations.message}
          </FieldError>
        ) : null}
      </CardContent>
    </Card>
  );
}
