'use client';

import {
  updateFestivalContentDtoSchema,
  type UpdateFestivalContentDto,
} from '@ak-strannik/types/festival';
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
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useWatch, type UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';
import { FestivalOrganizationSection } from './festival-organization-section';

export function FestivalOrganizationsSection({
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
  const block = useWatch({ control: form.control, name: 'organizations' });
  const items = useFieldArray({
    control: form.control,
    name: 'organizations.organizations',
  });
  if (!block)
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-between gap-3 py-6">
          <div>
            <h2 className="font-semibold">Организации</h2>
            <p className="text-sm text-muted-foreground">Блок не добавлен.</p>
          </div>
          <Button
            disabled={disabled}
            onClick={() =>
              form.setValue(
                'organizations',
                {
                  translations: [
                    { locale: 'ru', title: '' },
                    { locale: 'en', title: '' },
                  ],
                  organizations: [],
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
  const translations = block.translations ?? [];
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Организации</CardTitle>
        <Button
          disabled={disabled}
          onClick={() =>
            form.setValue('organizations', null, { shouldDirty: true })
          }
          type="button"
          variant="destructive"
        >
          <Trash2 />
          Удалить блок
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <input type="hidden" {...form.register('organizations.id')} />
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
                {...form.register(`organizations.translations.${index}.id`)}
              />
              <input
                type="hidden"
                {...form.register(`organizations.translations.${index}.locale`)}
              />
              <FieldGroup>
                <Field>
                  <FieldLabel>Заголовок</FieldLabel>
                  <Input
                    aria-invalid={Boolean(
                      form.formState.errors.organizations?.translations?.[index]
                        ?.title
                    )}
                    {...form.register(
                      `organizations.translations.${index}.title`
                    )}
                  />
                  {form.formState.errors.organizations?.translations?.[index]
                    ?.title?.message ? (
                    <FieldError>
                      {
                        form.formState.errors.organizations.translations?.[
                          index
                        ]?.title?.message
                      }
                    </FieldError>
                  ) : null}
                </Field>
              </FieldGroup>
            </TabsContent>
          ))}
        </Tabs>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Список организаций</h3>
          <Button
            disabled={disabled}
            onClick={() =>
              items.append({
                position: items.fields.length,
                value: '',
                translations: [
                  { locale: 'ru', name: '' },
                  { locale: 'en', name: '' },
                ],
              })
            }
            type="button"
          >
            <Plus />
            Добавить
          </Button>
        </div>
        <div className="space-y-4">
          {items.fields.map((field, index) => (
            <FestivalOrganizationSection
              canMoveDown={index < items.fields.length - 1}
              canMoveUp={index > 0}
              disabled={disabled}
              form={form}
              index={index}
              key={field.id}
              onMoveDown={() => items.move(index, index + 1)}
              onMoveUp={() => items.move(index, index - 1)}
              onRemove={() => items.remove(index)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
