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

export function FestivalOrganizationSection({
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
    z.input<typeof updateFestivalContentDtoSchema>,
    undefined,
    UpdateFestivalContentDto
  >;
  index: number;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onRemove: () => void;
}) {
  const translations =
    useWatch({
      control: form.control,
      name: `organizations.organizations.${index}.translations`,
    }) ?? [];
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Организация {index + 1}</CardTitle>
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
      <CardContent className="space-y-5">
        <input
          type="hidden"
          {...form.register(`organizations.organizations.${index}.id`)}
        />
        <input
          type="hidden"
          {...form.register(`organizations.organizations.${index}.position`, {
            valueAsNumber: true,
          })}
        />
        <Field>
          <FieldLabel>Значение</FieldLabel>
          <Input
            aria-invalid={Boolean(
              form.formState.errors.organizations?.organizations?.[index]?.value
            )}
            {...form.register(`organizations.organizations.${index}.value`)}
          />
          {form.formState.errors.organizations?.organizations?.[index]?.value
            ?.message ? (
            <FieldError>
              {
                form.formState.errors.organizations.organizations?.[index]
                  ?.value?.message
              }
            </FieldError>
          ) : null}
        </Field>
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
                  `organizations.organizations.${index}.translations.${translationIndex}.id`
                )}
              />
              <input
                type="hidden"
                {...form.register(
                  `organizations.organizations.${index}.translations.${translationIndex}.locale`
                )}
              />
              <FieldGroup>
                <Field>
                  <FieldLabel>Название</FieldLabel>
                  <Input
                    aria-invalid={Boolean(
                      form.formState.errors.organizations?.organizations?.[
                        index
                      ]?.translations?.[translationIndex]?.name
                    )}
                    {...form.register(
                      `organizations.organizations.${index}.translations.${translationIndex}.name`
                    )}
                  />
                  {form.formState.errors.organizations?.organizations?.[index]
                    ?.translations?.[translationIndex]?.name?.message ? (
                    <FieldError>
                      {
                        form.formState.errors.organizations.organizations?.[
                          index
                        ]?.translations?.[translationIndex]?.name?.message
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
