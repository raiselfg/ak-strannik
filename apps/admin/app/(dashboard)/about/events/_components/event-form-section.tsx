'use client';

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
import {
  updateEventsContentDtoSchema,
  type UpdateEventsContentDto,
} from '@ak-strannik/types';
import { ImagesField } from '../../../../_components/images-field';
import { VideoUrlsField } from '../../../../_components/video-urls-field';

export function EventFormSection({
  canMoveDown,
  canMoveUp,
  disabled,
  form,
  index,
  onMoveDown,
  onMoveUp,
  onRemove,
  onUploadingChange,
}: {
  canMoveDown: boolean;
  canMoveUp: boolean;
  disabled: boolean;
  form: UseFormReturn<
    z.input<typeof updateEventsContentDtoSchema>,
    undefined,
    UpdateEventsContentDto
  >;
  index: number;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onRemove: () => void;
  onUploadingChange: (uploading: boolean) => void;
}) {
  const images =
    useWatch({ control: form.control, name: `events.${index}.images` }) ?? [];
  const eventId = useWatch({
    control: form.control,
    name: `events.${index}.id`,
  });
  const videos =
    useWatch({ control: form.control, name: `events.${index}.videos` }) ?? [];
  const translations =
    useWatch({ control: form.control, name: `events.${index}.translations` }) ??
    [];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle>Событие {index + 1}</CardTitle>
        <div className="flex gap-1">
          <Button
            aria-label="Переместить событие вверх"
            disabled={disabled || !canMoveUp}
            onClick={onMoveUp}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <ArrowUp />
          </Button>
          <Button
            aria-label="Переместить событие вниз"
            disabled={disabled || !canMoveDown}
            onClick={onMoveDown}
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
        {eventId ? (
          <input type="hidden" {...form.register(`events.${index}.id`)} />
        ) : null}
        <input
          type="hidden"
          {...form.register(`events.${index}.position`, {
            valueAsNumber: true,
          })}
        />
        <ImagesField
          disabled={disabled}
          images={images}
          onChange={(value) =>
            form.setValue(`events.${index}.images`, value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          onUploadingChange={onUploadingChange}
        />
        {form.formState.errors.events?.[index]?.images?.message ? (
          <FieldError>
            {form.formState.errors.events[index]?.images?.message}
          </FieldError>
        ) : null}
        <VideoUrlsField
          disabled={disabled}
          videos={videos}
          onChange={(value) =>
            form.setValue(`events.${index}.videos`, value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
        {form.formState.errors.events?.[index]?.videos?.message ? (
          <FieldError>
            {form.formState.errors.events[index]?.videos?.message}
          </FieldError>
        ) : null}
        <div>
          <h3 className="mb-3 text-sm font-medium">Переводы события</h3>
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
                {translation.id ? (
                  <input
                    type="hidden"
                    {...form.register(
                      `events.${index}.translations.${translationIndex}.id`
                    )}
                  />
                ) : null}
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
                      aria-invalid={Boolean(
                        form.formState.errors.events?.[index]?.translations?.[
                          translationIndex
                        ]?.text
                      )}
                      id={`event-${index}-text-${translation.locale}`}
                      {...form.register(
                        `events.${index}.translations.${translationIndex}.text`
                      )}
                    />
                    {form.formState.errors.events?.[index]?.translations?.[
                      translationIndex
                    ]?.text?.message ? (
                      <FieldError>
                        {
                          form.formState.errors.events[index]?.translations?.[
                            translationIndex
                          ]?.text?.message
                        }
                      </FieldError>
                    ) : null}
                  </Field>
                </FieldGroup>
              </TabsContent>
            ))}
          </Tabs>
          {form.formState.errors.events?.[index]?.translations?.message ? (
            <FieldError className="mt-3">
              {form.formState.errors.events[index]?.translations?.message}
            </FieldError>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
