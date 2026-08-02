'use client';

import { Button } from '@ak-strannik/ui/components/button';
import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@ak-strannik/ui/components/field';
import { Input } from '@ak-strannik/ui/components/input';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';

export function VideoUrlsField({
  disabled,
  label,
  onChange,
  videos,
}: {
  disabled: boolean;
  label: string;
  onChange: (videos: string[]) => void;
  videos: string[];
}) {
  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= videos.length) return;
    const reordered = [...videos];
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
          onClick={() => onChange([...videos, ''])}
          size="sm"
          type="button"
          variant="outline"
        >
          <Plus />
          Добавить ссылку
        </Button>
      </div>
      <FieldDescription>
        Ссылки на YouTube или Rutube в нужном порядке.
      </FieldDescription>
      <div className="space-y-3">
        {videos.map((video, index) => (
          <div className="flex gap-2" key={index}>
            <Input
              aria-label={`Ссылка на видео ${index + 1}`}
              disabled={disabled}
              onChange={(event) =>
                onChange(
                  videos.map((item, itemIndex) =>
                    itemIndex === index ? event.target.value : item
                  )
                )
              }
              placeholder="https://…"
              value={video}
            />
            <Button
              aria-label="Переместить видео вверх"
              disabled={disabled || index === 0}
              onClick={() => move(index, -1)}
              size="icon"
              type="button"
              variant="outline"
            >
              <ArrowUp />
            </Button>
            <Button
              aria-label="Переместить видео вниз"
              disabled={disabled || index === videos.length - 1}
              onClick={() => move(index, 1)}
              size="icon"
              type="button"
              variant="outline"
            >
              <ArrowDown />
            </Button>
            <Button
              aria-label="Удалить ссылку"
              disabled={disabled}
              onClick={() =>
                onChange(videos.filter((_, itemIndex) => itemIndex !== index))
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
    </Field>
  );
}
