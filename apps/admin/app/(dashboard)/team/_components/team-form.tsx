'use client';
import {
  createTeamMemberDtoSchema,
  type CreateTeamMemberDto,
} from '@ak-strannik/types/team';
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

  const { fields: translationFields } = useFieldArray({
    control: form.control,
    name: 'translations',
  });

  const {
    append: appendLink,
    fields: linkFields,
    remove: removeLink,
  } = useFieldArray({
    control: form.control,
    name: 'links',
  });

  const image = useWatch({ control: form.control, name: 'image' }) ?? '';

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
              label="Фотография участника команды"
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
            <ImagesField
              disabled={isSubmitting}
              images={achievements}
              label="Достижения"
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
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Ссылки</CardTitle>
          <Button
            disabled={isSubmitting || uploading}
            onClick={() =>
              appendLink({
                href: '',
                translations: [
                  { locale: 'ru', label: '' },
                  { locale: 'en', label: '' },
                ],
              })
            }
            type="button"
            variant="outline"
          >
            Добавить ссылку
          </Button>
        </CardHeader>
        <CardContent className="space-y-5">
          {linkFields.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Ссылки пока не добавлены.
            </p>
          ) : null}
          {linkFields.map((link, linkIndex) => (
            <div className="space-y-4 rounded-lg border p-4" key={link.id}>
              <div className="flex items-end gap-3">
                <Field className="flex-1">
                  <FieldLabel htmlFor={`team-link-${linkIndex}`}>
                    URL
                  </FieldLabel>
                  <Input
                    aria-invalid={Boolean(
                      form.formState.errors.links?.[linkIndex]?.href
                    )}
                    id={`team-link-${linkIndex}`}
                    placeholder="https://…"
                    {...form.register(`links.${linkIndex}.href`)}
                  />
                  {form.formState.errors.links?.[linkIndex]?.href?.message ? (
                    <FieldError>
                      {form.formState.errors.links[linkIndex]?.href?.message}
                    </FieldError>
                  ) : null}
                </Field>
                <Button
                  disabled={isSubmitting}
                  onClick={() => removeLink(linkIndex)}
                  type="button"
                  variant="outline"
                >
                  Удалить
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {link.translations.map((translation, translationIndex) => (
                  <Field key={translation.locale}>
                    <input
                      type="hidden"
                      {...form.register(
                        `links.${linkIndex}.translations.${translationIndex}.locale`
                      )}
                    />
                    <FieldLabel
                      htmlFor={`team-link-${linkIndex}-${translation.locale}`}
                    >
                      Подпись ({translation.locale.toUpperCase()})
                    </FieldLabel>
                    <Input
                      aria-invalid={Boolean(
                        form.formState.errors.links?.[linkIndex]
                          ?.translations?.[translationIndex]?.label
                      )}
                      id={`team-link-${linkIndex}-${translation.locale}`}
                      {...form.register(
                        `links.${linkIndex}.translations.${translationIndex}.label`
                      )}
                    />
                    {form.formState.errors.links?.[linkIndex]?.translations?.[
                      translationIndex
                    ]?.label?.message ? (
                      <FieldError>
                        {
                          form.formState.errors.links[linkIndex]
                            ?.translations?.[translationIndex]?.label?.message
                        }
                      </FieldError>
                    ) : null}
                  </Field>
                ))}
              </div>
            </div>
          ))}
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
            {translationFields.map((translation, index) => (
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
