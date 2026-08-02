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
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import { useWatch, type UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';
import { SingleImageField } from '../../../../_components/single-image-field';

export function FestivalJuryPersonSection({
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
    z.input<typeof updateFestivalContentDtoSchema>,
    undefined,
    UpdateFestivalContentDto
  >;
  index: number;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onRemove: () => void;
  onUploadingChange: (active: boolean) => void;
}) {
  const image =
    useWatch({ control: form.control, name: `jury.persons.${index}.image` }) ??
    '';
  const translations =
    useWatch({
      control: form.control,
      name: `jury.persons.${index}.translations`,
    }) ?? [];
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Член жюри {index + 1}</CardTitle>
        <div className="flex gap-1">
          <Button
            aria-label="Переместить вверх"
            disabled={disabled || !canMoveUp}
            onClick={onMoveUp}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <ArrowUp />
          </Button>
          <Button
            aria-label="Переместить вниз"
            disabled={disabled || !canMoveDown}
            onClick={onMoveDown}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <ArrowDown />
          </Button>
          <Button
            aria-label="Удалить"
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
        <input type="hidden" {...form.register(`jury.persons.${index}.id`)} />
        <input
          type="hidden"
          {...form.register(`jury.persons.${index}.position`, {
            valueAsNumber: true,
          })}
        />
        <SingleImageField
          disabled={disabled}
          image={image}
          label="Фотография члена жюри"
          onChange={(value) =>
            form.setValue(`jury.persons.${index}.image`, value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          onUploadingChange={onUploadingChange}
        />
        {form.formState.errors.jury?.persons?.[index]?.image?.message ? (
          <FieldError>
            {form.formState.errors.jury.persons[index]?.image?.message}
          </FieldError>
        ) : null}
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
                  `jury.persons.${index}.translations.${translationIndex}.id`
                )}
              />
              <input
                type="hidden"
                {...form.register(
                  `jury.persons.${index}.translations.${translationIndex}.locale`
                )}
              />
              <FieldGroup>
                <Field>
                  <FieldLabel>Имя</FieldLabel>
                  <Input
                    aria-invalid={Boolean(
                      form.formState.errors.jury?.persons?.[index]
                        ?.translations?.[translationIndex]?.name
                    )}
                    {...form.register(
                      `jury.persons.${index}.translations.${translationIndex}.name`
                    )}
                  />
                  {form.formState.errors.jury?.persons?.[index]?.translations?.[
                    translationIndex
                  ]?.name?.message ? (
                    <FieldError>
                      {
                        form.formState.errors.jury.persons[index]
                          ?.translations?.[translationIndex]?.name?.message
                      }
                    </FieldError>
                  ) : null}
                </Field>
                <Field>
                  <FieldLabel>Должность</FieldLabel>
                  <Input
                    aria-invalid={Boolean(
                      form.formState.errors.jury?.persons?.[index]
                        ?.translations?.[translationIndex]?.position
                    )}
                    {...form.register(
                      `jury.persons.${index}.translations.${translationIndex}.position`
                    )}
                  />
                  {form.formState.errors.jury?.persons?.[index]?.translations?.[
                    translationIndex
                  ]?.position?.message ? (
                    <FieldError>
                      {
                        form.formState.errors.jury.persons[index]
                          ?.translations?.[translationIndex]?.position?.message
                      }
                    </FieldError>
                  ) : null}
                </Field>
              </FieldGroup>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
