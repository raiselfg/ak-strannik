'use client';

import type { VideoProvider } from '@ak-strannik/types';
import { Button } from '@ak-strannik/ui/components/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@ak-strannik/ui/components/field';
import { Input } from '@ak-strannik/ui/components/input';
import { Select } from '@ak-strannik/ui/components/select';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';

export const videoProviderOptions = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'vk', label: 'VK Видео' },
  { value: 'rutube', label: 'Rutube' },
  { value: 'external', label: 'Внешняя ссылка' },
] as const satisfies ReadonlyArray<{ value: VideoProvider; label: string }>;

export type VideoFieldValue = {
  provider: VideoProvider;
  url: string;
  sortOrder?: number;
};

export function VideoListField({
  value,
  onChange,
  error,
  label = 'Видео',
}: {
  value: VideoFieldValue[];
  onChange: (value: VideoFieldValue[]) => void;
  error?: string;
  label?: string;
}) {
  function normalize(items: VideoFieldValue[]) {
    onChange(items.map((item, index) => ({ ...item, sortOrder: index })));
  }

  function update(index: number, patch: Partial<VideoFieldValue>) {
    normalize(
      value.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    );
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target]!, next[index]!];
    normalize(next);
  }

  return (
    <Field data-invalid={Boolean(error)}>
      <div className="flex items-center justify-between gap-3">
        <FieldLabel>{label}</FieldLabel>
        <Button
          onClick={() =>
            normalize([
              ...value,
              { provider: 'youtube', url: '', sortOrder: value.length },
            ])
          }
          size="sm"
          type="button"
          variant="outline"
        >
          <Plus /> Добавить видео
        </Button>
      </div>
      <FieldDescription>
        Укажите провайдера и обычную ссылку на страницу видео. HTML/iframe не
        нужен.
      </FieldDescription>
      {value.map((video, index) => (
        <div
          className="grid gap-2 rounded-lg border p-3 md:grid-cols-[12rem_1fr_auto]"
          key={index}
        >
          <Select
            aria-label={`Провайдер видео ${index + 1}`}
            onChange={(event) =>
              update(index, { provider: event.target.value as VideoProvider })
            }
            value={video.provider}
          >
            {videoProviderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Input
            aria-label={`Ссылка на видео ${index + 1}`}
            onChange={(event) => update(index, { url: event.target.value })}
            placeholder="https://…"
            type="url"
            value={video.url}
          />
          <div className="flex gap-1">
            <Button
              aria-label="Переместить вверх"
              disabled={index === 0}
              onClick={() => move(index, -1)}
              size="icon-sm"
              type="button"
              variant="outline"
            >
              <ArrowUp />
            </Button>
            <Button
              aria-label="Переместить вниз"
              disabled={index === value.length - 1}
              onClick={() => move(index, 1)}
              size="icon-sm"
              type="button"
              variant="outline"
            >
              <ArrowDown />
            </Button>
            <Button
              aria-label="Удалить видео"
              onClick={() =>
                normalize(value.filter((_, itemIndex) => itemIndex !== index))
              }
              size="icon-sm"
              type="button"
              variant="destructive"
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      ))}
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}
