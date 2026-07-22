'use client';

import {
  updatePryalochkaOfTimeContentDtoSchema,
  type UpdatePryalochkaOfTimeContentDto,
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
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import { useWatch, type UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';
import { SingleImageField } from '../../../../_components/single-image-field';

type Form = UseFormReturn<
  z.input<typeof updatePryalochkaOfTimeContentDtoSchema>,
  undefined,
  UpdatePryalochkaOfTimeContentDto
>;

export function PryalochkaEventSection({
  form,
  index,
  count,
  disabled,
  onMove,
  onRemove,
  onUploadingChange,
}: {
  form: Form;
  index: number;
  count: number;
  disabled: boolean;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
  onUploadingChange: (active: boolean) => void;
}) {
  const image =
    useWatch({ control: form.control, name: `events.${index}.image` }) ?? '';
  const translations =
    useWatch({ control: form.control, name: `events.${index}.translations` }) ??
    [];
  const errors = form.formState.errors.events?.[index];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle>Событие {index + 1}</CardTitle>
        <div className="flex gap-1">
          <Button
            aria-label="Переместить событие вверх"
            disabled={disabled || index === 0}
            onClick={() => onMove(index, index - 1)}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <ArrowUp />
          </Button>
          <Button
            aria-label="Переместить событие вниз"
            disabled={disabled || index === count - 1}
            onClick={() => onMove(index, index + 1)}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <ArrowDown />
          </Button>
          <Button
            aria-label="Удалить событие"
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
      <CardContent className="space-y-6">
        <input type="hidden" {...form.register(`events.${index}.id`)} />
        <input
          type="hidden"
          {...form.register(`events.${index}.position`, {
            valueAsNumber: true,
          })}
        />
        <SingleImageField
          disabled={disabled}
          image={image}
          onChange={(value) =>
            form.setValue(`events.${index}.image`, value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          onUploadingChange={onUploadingChange}
        />
        {errors?.image?.message ? (
          <FieldError>{errors.image.message}</FieldError>
        ) : null}
        <Field>
          <FieldLabel htmlFor={`event-${index}-link`}>Ссылка</FieldLabel>
          <Input
            id={`event-${index}-link`}
            {...form.register(`events.${index}.link`)}
          />
          {errors?.link?.message ? (
            <FieldError>{errors.link.message}</FieldError>
          ) : null}
        </Field>
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Переводы события</h3>
          <Tabs defaultValue="ru">
            <TabsList>
              <TabsTrigger value="ru">Русский</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            {translations.map((translation, translationIndex) => (
              <TabsContent
                key={`${translation.locale}-${translationIndex}`}
                value={
                  translation.locale ?? (translationIndex === 0 ? 'ru' : 'en')
                }
              >
                <input
                  type="hidden"
                  {...form.register(
                    `events.${index}.translations.${translationIndex}.id`
                  )}
                />
                <input
                  type="hidden"
                  {...form.register(
                    `events.${index}.translations.${translationIndex}.locale`
                  )}
                />
                <FieldGroup>
                  <Field>
                    <FieldLabel
                      htmlFor={`event-${index}-text-${translation.locale}`}
                    >
                      Текст
                    </FieldLabel>
                    <Textarea
                      id={`event-${index}-text-${translation.locale}`}
                      aria-invalid={Boolean(
                        errors?.translations?.[translationIndex]?.text
                      )}
                      {...form.register(
                        `events.${index}.translations.${translationIndex}.text`
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
            <FieldError>{errors.translations.message}</FieldError>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
