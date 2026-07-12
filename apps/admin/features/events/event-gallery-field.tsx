'use client';

import { Button } from '@ak-strannik/ui/components/button';
import { Field, FieldDescription, FieldError, FieldLabel } from '@ak-strannik/ui/components/field';
import { Select } from '@ak-strannik/ui/components/select';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { MediaPreview } from '../media/media-preview';

export type EventMediaOption = {
  id: string;
  originalName: string;
  publicUrl: string;
  alt: string;
};

type GalleryItem = { mediaId: string; sortOrder: number };

export function EventGalleryField({
  value,
  onChange,
  mediaOptions,
  error,
}: {
  value: GalleryItem[];
  onChange: (value: GalleryItem[]) => void;
  mediaOptions: EventMediaOption[];
  error?: string;
}) {
  const [selectedId, setSelectedId] = useState('');
  const selectedIds = new Set(value.map((item) => item.mediaId));
  const available = mediaOptions.filter((asset) => !selectedIds.has(asset.id));

  function normalize(items: GalleryItem[]) {
    onChange(items.map((item, index) => ({ ...item, sortOrder: index })));
  }

  function add() {
    if (!selectedId || selectedIds.has(selectedId)) return;
    normalize([...value, { mediaId: selectedId, sortOrder: value.length }]);
    setSelectedId('');
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    const currentItem = next[index];
    const targetItem = next[target];
    if (!currentItem || !targetItem) return;
    next[index] = targetItem;
    next[target] = currentItem;
    normalize(next);
  }

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor="event-gallery-select">Галерея</FieldLabel>
      <div className="flex gap-2">
        <Select
          id="event-gallery-select"
          value={selectedId}
          onChange={(event) => setSelectedId(event.target.value)}
        >
          <option value="">Выберите изображение</option>
          {available.map((asset) => (
            <option key={asset.id} value={asset.id}>{asset.originalName}</option>
          ))}
        </Select>
        <Button disabled={!selectedId} onClick={add} type="button" variant="outline">
          <Plus />Добавить
        </Button>
      </div>
      <FieldDescription>
        Добавляйте изображения из медиатеки и меняйте порядок кнопками.
      </FieldDescription>
      {value.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {value.map((item, index) => {
            const asset = mediaOptions.find((option) => option.id === item.mediaId);
            return (
              <div className="space-y-2 rounded-lg border p-2" key={item.mediaId}>
                {asset ? (
                  <MediaPreview alt={asset.alt} className="aspect-video rounded-md" url={asset.publicUrl} />
                ) : <div className="aspect-video rounded-md bg-muted" />}
                <p className="truncate text-xs" title={asset?.originalName}>{asset?.originalName ?? item.mediaId}</p>
                <div className="flex gap-1">
                  <Button aria-label="Переместить вверх" disabled={index === 0} onClick={() => move(index, -1)} size="icon-sm" type="button" variant="outline"><ArrowUp /></Button>
                  <Button aria-label="Переместить вниз" disabled={index === value.length - 1} onClick={() => move(index, 1)} size="icon-sm" type="button" variant="outline"><ArrowDown /></Button>
                  <Button aria-label="Удалить из галереи" className="ml-auto" onClick={() => normalize(value.filter((_, itemIndex) => itemIndex !== index))} size="icon-sm" type="button" variant="destructive"><Trash2 /></Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Галерея пока пуста</p>}
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}
