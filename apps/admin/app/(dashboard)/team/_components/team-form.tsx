'use client';
import {
  createTeamMemberDtoSchema,
  type CreateTeamMemberDto,
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
import { toast } from '@ak-strannik/ui/components/sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@ak-strannik/ui/components/tabs';
import { Textarea } from '@ak-strannik/ui/components/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import { ImagesField } from '../../../_components/images-field';
import { SingleImageField } from '../../../_components/single-image-field';
import { StringListField } from '../../../_components/string-list-field';
import { createTeamMember, updateTeamMember } from '../_actions/team.actions';
export function TeamForm({
  initialValues,
  memberId,
}: {
  initialValues: CreateTeamMemberDto;
  memberId?: string;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadCount, setUploadCount] = useState(0);
  const form = useForm<
    z.input<typeof createTeamMemberDtoSchema>,
    undefined,
    CreateTeamMemberDto
  >({
    resolver: zodResolver(createTeamMemberDtoSchema),
    defaultValues: initialValues,
  });
  const { fields } = useFieldArray({
    control: form.control,
    name: 'translations',
  });
  const image = useWatch({ control: form.control, name: 'image' }) ?? '';
  const links = useWatch({ control: form.control, name: 'links' }) ?? [];
  const achievements =
    useWatch({ control: form.control, name: 'achievements' }) ?? [];
  const isSubmitting = form.formState.isSubmitting;
  const uploading = uploadCount > 0;
  function trackUpload(active: boolean) {
    setUploadCount((count) => Math.max(0, count + (active ? 1 : -1)));
  }
  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    const result = memberId
      ? await updateTeamMember(memberId, values)
      : await createTeamMember(values);
    if (!result.success) return setFormError(result.message);
    toast.success(result.message);
    router.push('/team');
    router.refresh();
  });
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Общие данные</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <SingleImageField
              disabled={isSubmitting}
              image={image}
              onChange={(value) =>
                form.setValue('image', value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              onUploadingChange={trackUpload}
            />
            {form.formState.errors.image?.message ? (
              <FieldError>{form.formState.errors.image.message}</FieldError>
            ) : null}
            <StringListField
              description="Ссылки на страницы и социальные сети."
              disabled={isSubmitting || uploading}
              error={form.formState.errors.links?.message}
              label="Ссылки"
              onChange={(value) =>
                form.setValue('links', value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              placeholder="https://…"
              values={links}
            />
            <ImagesField
              disabled={isSubmitting}
              images={achievements}
              onChange={(value) =>
                form.setValue('achievements', value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              onUploadingChange={trackUpload}
            />
            {form.formState.errors.achievements?.message ? (
              <FieldError>
                {form.formState.errors.achievements.message}
              </FieldError>
            ) : null}
          </FieldGroup>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Переводы</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ru">
            <TabsList>
              <TabsTrigger value="ru">Русский</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            {fields.map((translation, index) => (
              <TabsContent key={translation.id} value={translation.locale}>
                <input
                  type="hidden"
                  {...form.register(`translations.${index}.locale`)}
                />
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor={`team-name-${translation.locale}`}>
                      Имя
                    </FieldLabel>
                    <Input
                      aria-invalid={Boolean(
                        form.formState.errors.translations?.[index]?.name
                      )}
                      id={`team-name-${translation.locale}`}
                      {...form.register(`translations.${index}.name`)}
                    />
                    {form.formState.errors.translations?.[index]?.name
                      ?.message ? (
                      <FieldError>
                        {
                          form.formState.errors.translations[index]?.name
                            ?.message
                        }
                      </FieldError>
                    ) : null}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor={`team-role-${translation.locale}`}>
                      Роль
                    </FieldLabel>
                    <Input
                      aria-invalid={Boolean(
                        form.formState.errors.translations?.[index]?.role
                      )}
                      id={`team-role-${translation.locale}`}
                      {...form.register(`translations.${index}.role`)}
                    />
                    {form.formState.errors.translations?.[index]?.role
                      ?.message ? (
                      <FieldError>
                        {
                          form.formState.errors.translations[index]?.role
                            ?.message
                        }
                      </FieldError>
                    ) : null}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor={`team-bio-${translation.locale}`}>
                      Биография
                    </FieldLabel>
                    <Textarea
                      aria-invalid={Boolean(
                        form.formState.errors.translations?.[index]?.bio
                      )}
                      id={`team-bio-${translation.locale}`}
                      {...form.register(`translations.${index}.bio`)}
                    />
                    {form.formState.errors.translations?.[index]?.bio
                      ?.message ? (
                      <FieldError>
                        {
                          form.formState.errors.translations[index]?.bio
                            ?.message
                        }
                      </FieldError>
                    ) : null}
                  </Field>
                </FieldGroup>
              </TabsContent>
            ))}
          </Tabs>
          {form.formState.errors.translations?.message ? (
            <FieldError className="mt-4">
              {form.formState.errors.translations.message}
            </FieldError>
          ) : null}
        </CardContent>
      </Card>
      {formError ? <FieldError>{formError}</FieldError> : null}
      <div className="flex justify-end gap-3">
        <Button asChild disabled={isSubmitting || uploading} variant="outline">
          <Link href="/team">Отменить</Link>
        </Button>
        <Button disabled={isSubmitting || uploading} type="submit">
          {isSubmitting ? 'Сохранение…' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
}
