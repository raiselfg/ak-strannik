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
import { FestivalJuryPersonSection } from './festival-jury-person-section';

export function FestivalJurySection({
  disabled,
  form,
  onUploadingChange,
}: {
  disabled: boolean;
  form: UseFormReturn<
    z.input<typeof updateFestivalContentDtoSchema>,
    undefined,
    UpdateFestivalContentDto
  >;
  onUploadingChange: (active: boolean) => void;
}) {
  const jury = useWatch({ control: form.control, name: 'jury' });
  const persons = useFieldArray({
    control: form.control,
    name: 'jury.persons',
  });
  if (!jury)
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-between gap-3 py-6">
          <div>
            <h2 className="font-semibold">Жюри</h2>
            <p className="text-sm text-muted-foreground">Блок не добавлен.</p>
          </div>
          <Button
            disabled={disabled}
            onClick={() =>
              form.setValue(
                'jury',
                {
                  translations: [
                    { locale: 'ru', title: '' },
                    { locale: 'en', title: '' },
                  ],
                  persons: [],
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
  const translations = jury.translations ?? [];
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Жюри</CardTitle>
        <Button
          disabled={disabled}
          onClick={() => form.setValue('jury', null, { shouldDirty: true })}
          type="button"
          variant="destructive"
        >
          <Trash2 />
          Удалить блок
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <input type="hidden" {...form.register('jury.id')} />
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
                {...form.register(`jury.translations.${index}.id`)}
              />
              <input
                type="hidden"
                {...form.register(`jury.translations.${index}.locale`)}
              />
              <FieldGroup>
                <Field>
                  <FieldLabel>Заголовок</FieldLabel>
                  <Input
                    aria-invalid={Boolean(
                      form.formState.errors.jury?.translations?.[index]?.title
                    )}
                    {...form.register(`jury.translations.${index}.title`)}
                  />
                  {form.formState.errors.jury?.translations?.[index]?.title
                    ?.message ? (
                    <FieldError>
                      {
                        form.formState.errors.jury.translations?.[index]?.title
                          ?.message
                      }
                    </FieldError>
                  ) : null}
                </Field>
              </FieldGroup>
            </TabsContent>
          ))}
        </Tabs>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Состав жюри</h3>
          <Button
            disabled={disabled}
            onClick={() =>
              persons.append({
                image: '',
                position: persons.fields.length,
                translations: [
                  { locale: 'ru', name: '', position: '' },
                  { locale: 'en', name: '', position: '' },
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
          {persons.fields.map((field, index) => (
            <FestivalJuryPersonSection
              canMoveDown={index < persons.fields.length - 1}
              canMoveUp={index > 0}
              disabled={disabled}
              form={form}
              index={index}
              key={field.id}
              onMoveDown={() => persons.move(index, index + 1)}
              onMoveUp={() => persons.move(index, index - 1)}
              onRemove={() => persons.remove(index)}
              onUploadingChange={onUploadingChange}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
