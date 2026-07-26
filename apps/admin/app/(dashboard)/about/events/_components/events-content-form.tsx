'use client';

import {
  createEventsContentDtoSchema,
  updateEventsContentDtoSchema,
  type UpdateEventsContentDto,
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
  FieldLabel,
} from '@ak-strannik/ui/components/field';
import { Input } from '@ak-strannik/ui/components/input';
import { toast } from '@ak-strannik/ui/components/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import type { z } from 'zod';
import {
  createEventsContent,
  updateEventsContent,
} from '../_actions/events.actions';
import { EventFormSection } from './event-form-section';

export function EventsContentForm({
  contentId,
  initialValues,
}: {
  contentId?: string;
  initialValues: UpdateEventsContentDto;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadCount, setUploadCount] = useState(0);
  const form = useForm<
    z.input<typeof updateEventsContentDtoSchema>,
    undefined,
    UpdateEventsContentDto
  >({
    resolver: zodResolver(updateEventsContentDtoSchema),
    defaultValues: initialValues,
  });
  const { append, fields, move, remove } = useFieldArray({
    control: form.control,
    name: 'events',
  });
  const isSubmitting = form.formState.isSubmitting;
  const uploading = uploadCount > 0;

  function trackUpload(active: boolean) {
    setUploadCount((count) => Math.max(0, count + (active ? 1 : -1)));
  }

  function addEvent() {
    const index = fields.length;

    append(
      {
        position: index,
        images: [],
        videos: [],
        translations: [
          { locale: 'ru', text: '' },
          { locale: 'en', text: '' },
        ],
      },
      {
        focusName: `events.${index}.translations.0.text`,
      }
    );
  }

  const onSubmit = form.handleSubmit(
    async (values) => {
      setFormError(null);
      const normalized: UpdateEventsContentDto = {
        year: values.year,
        events: (values.events ?? []).map((event, position) => ({
          ...event,
          position,
        })),
      };

      let result;
      if (contentId) {
        result = await updateEventsContent(contentId, normalized);
      } else {
        // The edit DTO contains optional database IDs. Do not pass those IDs to
        // the strict create schema, even when their values are undefined.
        const createInput = createEventsContentDtoSchema.safeParse({
          year: normalized.year,
          events: (normalized.events ?? []).map((event) => ({
            position: event.position,
            images: event.images,
            videos: event.videos,
            translations: (event.translations ?? []).map((translation) => ({
              locale: translation.locale,
              text: translation.text,
            })),
          })),
        });
        if (!createInput.success) {
          setFormError('Проверьте заполнение всех событий');
          return;
        }
        result = await createEventsContent(createInput.data);
      }

      if (!result.success) return setFormError(result.message);
      toast.success(result.message);
      router.push('/about/events');
      router.refresh();
    },
    () => setFormError('Проверьте поля, отмеченные красным')
  );

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Год</CardTitle>
        </CardHeader>
        <CardContent>
          <Field>
            <FieldLabel htmlFor="events-year">Год</FieldLabel>
            <Input
              aria-invalid={Boolean(form.formState.errors.year)}
              id="events-year"
              {...form.register('year')}
            />
            {form.formState.errors.year?.message ? (
              <FieldError>{form.formState.errors.year.message}</FieldError>
            ) : null}
          </Field>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">События</h2>
          <p className="text-sm text-muted-foreground">
            Все события этого года сохраняются одной кнопкой.
          </p>
        </div>
        <Button
          disabled={isSubmitting || uploading}
          onClick={addEvent}
          type="button"
        >
          <Plus />
          Добавить событие
        </Button>
      </div>
      {fields.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Событий пока нет. Добавьте первое событие.
          </CardContent>
        </Card>
      ) : null}
      <div className="space-y-5">
        {fields.map((field, index) => (
          <EventFormSection
            canMoveDown={index < fields.length - 1}
            canMoveUp={index > 0}
            disabled={isSubmitting}
            form={form}
            index={index}
            key={field.id}
            onMoveDown={() => move(index, index + 1)}
            onMoveUp={() => move(index, index - 1)}
            onRemove={() => remove(index)}
            onUploadingChange={trackUpload}
          />
        ))}
      </div>
      {form.formState.errors.events?.message ? (
        <FieldError>{form.formState.errors.events.message}</FieldError>
      ) : null}
      {formError ? <FieldError>{formError}</FieldError> : null}
      <div className="sticky bottom-4 z-10 flex flex-wrap justify-end gap-3 rounded-lg border bg-background/95 p-3 shadow-lg backdrop-blur">
        <Button asChild disabled={isSubmitting || uploading} variant="outline">
          <Link href="/about/events">Отменить</Link>
        </Button>
        <Button
          disabled={isSubmitting || uploading}
          onClick={addEvent}
          type="button"
          variant="outline"
        >
          <Plus />
          Добавить событие
        </Button>
        <Button disabled={isSubmitting || uploading} type="submit">
          {isSubmitting ? 'Сохранение…' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
}
