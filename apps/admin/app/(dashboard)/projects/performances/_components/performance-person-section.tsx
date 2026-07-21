'use client';

import {
  updatePerformancesContentDtoSchema,
  type UpdatePerformancesContentDto,
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
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import { useWatch, type UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';

export function PerformancePersonSection({
  canMoveDown,
  canMoveUp,
  disabled,
  form,
  index,
  onMoveDown,
  onMoveUp,
  onRemove,
}: {
  canMoveDown: boolean;
  canMoveUp: boolean;
  disabled: boolean;
  form: UseFormReturn<
    z.input<typeof updatePerformancesContentDtoSchema>,
    undefined,
    UpdatePerformancesContentDto
  >;
  index: number;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onRemove: () => void;
}) {
  const translations =
    useWatch({
      control: form.control,
      name: `persons.${index}.translations`,
    }) ?? [];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle>Участник {index + 1}</CardTitle>
        <div className="flex gap-1">
          <Button
            aria-label="Переместить участника вверх"
            disabled={disabled || !canMoveUp}
            onClick={onMoveUp}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <ArrowUp />
          </Button>
          <Button
            aria-label="Переместить участника вниз"
            disabled={disabled || !canMoveDown}
            onClick={onMoveDown}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <ArrowDown />
          </Button>
          <Button
            aria-label="Удалить участника"
            disabled={disabled}
            onClick={onRemove}
            size="icon-sm"
            type="button"
            variant="destructive"
          >
            <Trash2 />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <input type="hidden" {...form.register(`persons.${index}.id`)} />
        <input
          type="hidden"
          {...form.register(`persons.${index}.position`, {
            valueAsNumber: true,
          })}
        />
        <Tabs defaultValue="ru">
          <TabsList>
            <TabsTrigger value="ru">Русский</TabsTrigger>
            <TabsTrigger value="en">English</TabsTrigger>
          </TabsList>
          {translations.map((translation, translationIndex) => (
            <TabsContent
              key={`${translation.locale ?? 'translation'}-${translationIndex}`}
              value={
                translation.locale ?? (translationIndex === 0 ? 'ru' : 'en')
              }
            >
              <input
                type="hidden"
                {...form.register(
                  `persons.${index}.translations.${translationIndex}.id`
                )}
              />
              <input
                type="hidden"
                {...form.register(
                  `persons.${index}.translations.${translationIndex}.locale`
                )}
              />
              <FieldGroup>
                <Field>
                  <FieldLabel
                    htmlFor={`person-${index}-name-${translation.locale}`}
                  >
                    Имя
                  </FieldLabel>
                  <Input
                    aria-invalid={Boolean(
                      form.formState.errors.persons?.[index]?.translations?.[
                        translationIndex
                      ]?.name
                    )}
                    id={`person-${index}-name-${translation.locale}`}
                    {...form.register(
                      `persons.${index}.translations.${translationIndex}.name`
                    )}
                  />
                  {form.formState.errors.persons?.[index]?.translations?.[
                    translationIndex
                  ]?.name?.message ? (
                    <FieldError>
                      {
                        form.formState.errors.persons[index]?.translations?.[
                          translationIndex
                        ]?.name?.message
                      }
                    </FieldError>
                  ) : null}
                </Field>
              </FieldGroup>
            </TabsContent>
          ))}
        </Tabs>
        {form.formState.errors.persons?.[index]?.translations?.message ? (
          <FieldError className="mt-3">
            {form.formState.errors.persons[index]?.translations?.message}
          </FieldError>
        ) : null}
      </CardContent>
    </Card>
  );
}
