'use client';

import {
  createPryalochkaOfTimeContentDtoSchema,
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
import { FieldError } from '@ak-strannik/ui/components/field';
import { toast } from '@ak-strannik/ui/components/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import { ImagesField } from '../../../../_components/images-field';
import {
  createPryalochkaOfTimeContent,
  updatePryalochkaOfTimeContent,
} from '../_actions/pryalochka-of-time.actions';
import { PryalochkaActorSection } from './pryalochka-actor-section';
import { PryalochkaEventSection } from './pryalochka-event-section';

export function PryalochkaOfTimeForm({
  contentId,
  initialValues,
}: {
  contentId?: string;
  initialValues: UpdatePryalochkaOfTimeContentDto;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadCount, setUploadCount] = useState(0);
  const form = useForm<
    z.input<typeof updatePryalochkaOfTimeContentDtoSchema>,
    undefined,
    UpdatePryalochkaOfTimeContentDto
  >({
    resolver: zodResolver(updatePryalochkaOfTimeContentDtoSchema),
    defaultValues: initialValues,
  });
  const events = useFieldArray({ control: form.control, name: 'events' });
  const actors = useFieldArray({ control: form.control, name: 'actors' });
  const images = useWatch({ control: form.control, name: 'images' }) ?? [];
  const isSubmitting = form.formState.isSubmitting;
  const uploading = uploadCount > 0;
  const trackUpload = (active: boolean) =>
    setUploadCount((count) => Math.max(0, count + (active ? 1 : -1)));

  const submit = form.handleSubmit(async (values) => {
    setFormError(null);
    const normalized: UpdatePryalochkaOfTimeContentDto = {
      images: values.images ?? [],
      events: (values.events ?? []).map((event, position) => ({
        ...event,
        link: event.link?.trim() ? event.link : null,
        position,
      })),
      actors: (values.actors ?? []).map((actor, position) => ({
        ...actor,
        position,
      })),
    };
    let result;
    if (contentId)
      result = await updatePryalochkaOfTimeContent(contentId, normalized);
    else {
      const parsed =
        createPryalochkaOfTimeContentDtoSchema.safeParse(normalized);
      if (!parsed.success)
        return setFormError('Проверьте заполнение событий и актёров');
      result = await createPryalochkaOfTimeContent(parsed.data);
    }
    if (!result.success) return setFormError(result.message);
    toast.success(result.message);
    router.push('/projects/pryalochka-of-time');
    router.refresh();
  });

  return (
    <form className="space-y-8" onSubmit={submit}>
      <Card>
        <CardHeader>
          <CardTitle>Изображения</CardTitle>
        </CardHeader>
        <CardContent>
          <ImagesField
            disabled={isSubmitting}
            images={images}
            onChange={(value) =>
              form.setValue('images', value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            onUploadingChange={trackUpload}
          />
          {form.formState.errors.images?.message ? (
            <FieldError>{form.formState.errors.images.message}</FieldError>
          ) : null}
        </CardContent>
      </Card>
      <section className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">События</h2>
            <p className="text-sm text-muted-foreground">
              Изменения применятся после общего сохранения.
            </p>
          </div>
          <Button
            disabled={isSubmitting || uploading}
            onClick={() =>
              events.append({
                image: '',
                link: null,
                position: events.fields.length,
                translations: [
                  { locale: 'ru', text: '' },
                  { locale: 'en', text: '' },
                ],
              })
            }
            type="button"
          >
            <Plus />
            Добавить событие
          </Button>
        </div>
        {events.fields.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Событий пока нет.
            </CardContent>
          </Card>
        ) : null}
        {events.fields.map((field, index) => (
          <PryalochkaEventSection
            count={events.fields.length}
            disabled={isSubmitting}
            form={form}
            index={index}
            key={field.id}
            onMove={events.move}
            onRemove={() => events.remove(index)}
            onUploadingChange={trackUpload}
          />
        ))}
        {form.formState.errors.events?.message ? (
          <FieldError>{form.formState.errors.events.message}</FieldError>
        ) : null}
      </section>
      <section className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Актёры</h2>
            <p className="text-sm text-muted-foreground">
              Изменения применятся после общего сохранения.
            </p>
          </div>
          <Button
            disabled={isSubmitting || uploading}
            onClick={() =>
              actors.append({
                position: actors.fields.length,
                translations: [
                  { locale: 'ru', name: '', text: '' },
                  { locale: 'en', name: '', text: '' },
                ],
              })
            }
            type="button"
          >
            <Plus />
            Добавить актёра
          </Button>
        </div>
        {actors.fields.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Актёров пока нет.
            </CardContent>
          </Card>
        ) : null}
        {actors.fields.map((field, index) => (
          <PryalochkaActorSection
            count={actors.fields.length}
            disabled={isSubmitting}
            form={form}
            index={index}
            key={field.id}
            onMove={actors.move}
            onRemove={() => actors.remove(index)}
          />
        ))}
        {form.formState.errors.actors?.message ? (
          <FieldError>{form.formState.errors.actors.message}</FieldError>
        ) : null}
      </section>
      {formError ? <FieldError>{formError}</FieldError> : null}
      <div className="flex justify-end gap-3">
        <Button asChild disabled={isSubmitting || uploading} variant="outline">
          <Link href="/projects">Отменить</Link>
        </Button>
        <Button disabled={isSubmitting || uploading} type="submit">
          {isSubmitting ? 'Сохранение…' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
}
