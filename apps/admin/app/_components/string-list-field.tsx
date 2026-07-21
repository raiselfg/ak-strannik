'use client';

import { Button } from '@ak-strannik/ui/components/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@ak-strannik/ui/components/field';
import { Input } from '@ak-strannik/ui/components/input';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';

export function StringListField({
  description,
  disabled,
  error,
  label,
  onChange,
  placeholder,
  values,
}: {
  description?: string;
  disabled: boolean;
  error?: string;
  label: string;
  onChange: (values: string[]) => void;
  placeholder?: string;
  values: string[];
}) {
  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= values.length) return;
    const reordered = [...values];
    [reordered[index], reordered[target]] = [
      reordered[target]!,
      reordered[index]!,
    ];
    onChange(reordered);
  }

  return (
    <Field>
      <div className="flex items-center justify-between gap-3">
        <FieldLabel>{label}</FieldLabel>
        <Button
          disabled={disabled}
          onClick={() => onChange([...values, ''])}
          size="sm"
          type="button"
          variant="outline"
        >
          <Plus />
          Добавить
        </Button>
      </div>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <div className="space-y-3">
        {values.map((value, index) => (
          <div className="flex gap-2" key={index}>
            <Input
              aria-invalid={Boolean(error)}
              aria-label={`${label}, значение ${index + 1}`}
              disabled={disabled}
              onChange={(event) =>
                onChange(
                  values.map((item, itemIndex) =>
                    itemIndex === index ? event.target.value : item
                  )
                )
              }
              placeholder={placeholder}
              value={value}
            />
            <Button
              aria-label="Переместить вверх"
              disabled={disabled || index === 0}
              onClick={() => move(index, -1)}
              size="icon"
              type="button"
              variant="outline"
            >
              <ArrowUp />
            </Button>
            <Button
              aria-label="Переместить вниз"
              disabled={disabled || index === values.length - 1}
              onClick={() => move(index, 1)}
              size="icon"
              type="button"
              variant="outline"
            >
              <ArrowDown />
            </Button>
            <Button
              aria-label="Удалить значение"
              disabled={disabled}
              onClick={() =>
                onChange(values.filter((_, itemIndex) => itemIndex !== index))
              }
              size="icon"
              type="button"
              variant="destructive"
            >
              <Trash2 />
            </Button>
          </div>
        ))}
      </div>
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}
