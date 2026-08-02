'use client';

import {
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

export function RequisiteItemSection({
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
    z.input<typeof updateRequisiteContentDtoSchema>,
    undefined,
    UpdateRequisiteContentDto
  >;
  index: number;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onRemove: () => void;
  onUploadingChange: (uploading: boolean) => void;
}) {
  const image =
    useWatch({ control: form.control, name: `requisites.${index}.image` }) ??
    '';
  const translations =
    useWatch({
      control: form.control,
      name: `requisites.${index}.translations`,
    }) ?? [];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle>Элемент {index + 1}</CardTitle>
        <div className="flex gap-1">
          <Button
            aria-label="Переместить элемент вверх"
            disabled={disabled || !canMoveUp}
            onClick={onMoveUp}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <ArrowUp />
          </Button>
          <Button
            aria-label="Переместить элемент вниз"
            disabled={disabled || !canMoveDown}
            onClick={onMoveDown}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <ArrowDown />
          </Button>
          <Button
            aria-label="Удалить элемент"
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
        <input type="hidden" {...form.register(`requisites.${index}.id`)} />
        <input
          type="hidden"
          {...form.register(`requisites.${index}.position`, {
            valueAsNumber: true,
          })}
        />
        <SingleImageField
          disabled={disabled}
          image={image}
          label="Изображение реквизита"
          onChange={(value) =>
            form.setValue(`requisites.${index}.image`, value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          onUploadingChange={onUploadingChange}
        />
        {form.formState.errors.requisites?.[index]?.image?.message ? (
          <FieldError>
            {form.formState.errors.requisites[index]?.image?.message}
          </FieldError>
        ) : null}

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
                  `requisites.${index}.translations.${translationIndex}.id`
                )}
              />
              <input
                type="hidden"
                {...form.register(
                  `requisites.${index}.translations.${translationIndex}.locale`
                )}
              />
              <FieldGroup>
                <Field>
                  <FieldLabel
                    htmlFor={`requisite-${index}-title-${translation.locale}`}
                  >
                    Название
                  </FieldLabel>
                  <Input
                    aria-invalid={Boolean(
                      form.formState.errors.requisites?.[index]?.translations?.[
                        translationIndex
                      ]?.title
                    )}
                    id={`requisite-${index}-title-${translation.locale}`}
                    {...form.register(
                      `requisites.${index}.translations.${translationIndex}.title`
                    )}
                  />
                  {form.formState.errors.requisites?.[index]?.translations?.[
                    translationIndex
                  ]?.title?.message ? (
                    <FieldError>
                      {
                        form.formState.errors.requisites[index]?.translations?.[
                          translationIndex
                        ]?.title?.message
                      }
                    </FieldError>
                  ) : null}
                </Field>
              </FieldGroup>
            </TabsContent>
          ))}
        </Tabs>
        {form.formState.errors.requisites?.[index]?.translations?.message ? (
          <FieldError>
            {form.formState.errors.requisites[index]?.translations?.message}
          </FieldError>
        ) : null}
      </CardContent>
    </Card>
  );
}
