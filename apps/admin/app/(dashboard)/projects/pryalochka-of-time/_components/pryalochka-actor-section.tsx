'use client';

import {
  updatePryalochkaOfTimeContentDtoSchema,
  type UpdatePryalochkaOfTimeContentDto,
} from '@ak-strannik/types/pryalochka-of-time';
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
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import { useWatch, type UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';

type Form = UseFormReturn<
  z.input<typeof updatePryalochkaOfTimeContentDtoSchema>,
  undefined,
  UpdatePryalochkaOfTimeContentDto
>;

export function PryalochkaActorSection({
  form,
  index,
  count,
  disabled,
  onMove,
  onRemove,
}: {
  form: Form;
  index: number;
  count: number;
  disabled: boolean;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
}) {
  const translations =
    useWatch({ control: form.control, name: `actors.${index}.translations` }) ??
    [];
  const errors = form.formState.errors.actors?.[index];
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle>Актёр {index + 1}</CardTitle>
        <div className="flex gap-1">
          <Button
            aria-label="Переместить актёра вверх"
            disabled={disabled || index === 0}
            onClick={() => onMove(index, index - 1)}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <ArrowUp />
          </Button>
          <Button
            aria-label="Переместить актёра вниз"
            disabled={disabled || index === count - 1}
            onClick={() => onMove(index, index + 1)}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <ArrowDown />
          </Button>
          <Button
            aria-label="Удалить актёра"
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
        <input type="hidden" {...form.register(`actors.${index}.id`)} />
        <input
          type="hidden"
          {...form.register(`actors.${index}.position`, {
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
              className="space-y-4"
              key={`${translation.locale}-${translationIndex}`}
              value={
                translation.locale ?? (translationIndex === 0 ? 'ru' : 'en')
              }
            >
              <input
                type="hidden"
                {...form.register(
                  `actors.${index}.translations.${translationIndex}.id`
                )}
              />
              <input
                type="hidden"
                {...form.register(
                  `actors.${index}.translations.${translationIndex}.locale`
                )}
              />
              <FieldGroup>
                <Field>
                  <FieldLabel
                    htmlFor={`actor-${index}-name-${translation.locale}`}
                  >
                    Имя
                  </FieldLabel>
                  <Input
                    id={`actor-${index}-name-${translation.locale}`}
                    aria-invalid={Boolean(
                      errors?.translations?.[translationIndex]?.name
                    )}
                    {...form.register(
                      `actors.${index}.translations.${translationIndex}.name`
                    )}
                  />
                  {errors?.translations?.[translationIndex]?.name?.message ? (
                    <FieldError>
                      {errors.translations[translationIndex]?.name?.message}
                    </FieldError>
                  ) : null}
                </Field>
                <Field>
                  <FieldLabel
                    htmlFor={`actor-${index}-text-${translation.locale}`}
                  >
                    Описание актёра
                  </FieldLabel>
                  <Textarea
                    id={`actor-${index}-text-${translation.locale}`}
                    aria-invalid={Boolean(
                      errors?.translations?.[translationIndex]?.text
                    )}
                    {...form.register(
                      `actors.${index}.translations.${translationIndex}.text`
                    )}
                  />
                  {errors?.translations?.[translationIndex]?.text?.message ? (
                    <FieldError>
                      {errors.translations[translationIndex]?.text?.message}
                    </FieldError>
                  ) : null}
                </Field>
              </FieldGroup>
            </TabsContent>
          ))}
        </Tabs>
        {errors?.translations?.message ? (
          <FieldError className="mt-3">
            {errors.translations.message}
          </FieldError>
        ) : null}
      </CardContent>
    </Card>
  );
}
