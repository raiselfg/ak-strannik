"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@ak-strannik/ui/components/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@ak-strannik/ui/components/field";
import { Input } from "@ak-strannik/ui/components/input";
import { Select } from "@ak-strannik/ui/components/select";
import { Textarea } from "@ak-strannik/ui/components/textarea";
import { useTransition } from "react";
import {
  type DefaultValues,
  type FieldErrors,
  type Path,
  useForm,
} from "react-hook-form";
import type { z } from "zod/v4";
import type { AdminEntity } from "../_config/admin-entities";
import { createCrudRecord, updateCrudRecord } from "../_actions/crud";
import {
  getDefaultEntityWhere,
  getEntityFormDefinition,
} from "../_forms/entity-form-definitions";

type EntityFormProps = {
  entity: AdminEntity;
  mode: "create" | "edit";
  recordId?: string;
};

type EntityFormDefinition = NonNullable<
  ReturnType<typeof getEntityFormDefinition>
>;

type EntityFormClientValues<TDefinition extends EntityFormDefinition> = z.input<
  TDefinition["schema"]
> & {
  __where?: string;
};

function errorMessage<TValues extends Record<string, unknown>>(
  errors: FieldErrors<TValues>,
  name: string,
) {
  const error = errors[name];
  return typeof error?.message === "string" ? error.message : null;
}

export function EntityForm({ entity, mode, recordId }: EntityFormProps) {
  const definition = getEntityFormDefinition(entity.slug);

  if (!definition) {
    return (
      <p className="text-sm text-foreground/60">
        Form schema is not configured for {entity.model}.
      </p>
    );
  }

  return (
    <ConfiguredEntityForm
      definition={definition}
      entity={entity}
      mode={mode}
      recordId={recordId}
    />
  );
}

function ConfiguredEntityForm({
  definition,
  entity,
  mode,
  recordId,
}: EntityFormProps & {
  definition: EntityFormDefinition;
}) {
  const [isPending, startTransition] = useTransition();
  const defaultWhere = getDefaultEntityWhere(entity.slug, recordId ?? "");
  const form = useForm<EntityFormClientValues<typeof definition>>({
    resolver: zodResolver(definition.schema as never),
    defaultValues: {
      ...definition.defaultValues,
      ...(mode === "edit" ? { __where: defaultWhere } : {}),
    } as DefaultValues<EntityFormClientValues<typeof definition>>,
  });
  const actionLabel = mode === "create" ? "Create record" : "Save changes";

  const onSubmit = form.handleSubmit(
    (values: EntityFormClientValues<typeof definition>) => {
    const { __where: whereValue, ...data } = values;
    const formData = new FormData();
    formData.set("entitySlug", entity.slug);
    formData.set("data", JSON.stringify(data));

    if (mode === "edit") {
      formData.set(
        "where",
        typeof whereValue === "string" && whereValue.trim() !== ""
          ? whereValue
          : defaultWhere,
      );
    }

    startTransition(() => {
      void (mode === "create"
        ? createCrudRecord(formData)
        : updateCrudRecord(formData));
    });
    },
  );

  return (
    <form className="max-w-3xl space-y-6" onSubmit={onSubmit}>
      {mode === "edit" ? (
        <Field>
          <FieldLabel htmlFor="record-where">Where</FieldLabel>
          <Textarea
            className="font-mono"
            id="record-where"
            {...form.register(
              "__where" as Path<EntityFormClientValues<typeof definition>>,
            )}
          />
          <FieldDescription>
            Use Prisma where JSON. Composite ids can be edited here.
          </FieldDescription>
        </Field>
      ) : null}

      <FieldGroup>
        {definition.fields.map((field) => {
          const message = errorMessage(form.formState.errors, field.name);
          const fieldId = `field-${entity.slug}-${field.name}`;

          return (
            <Field key={field.name}>
              <FieldLabel htmlFor={fieldId}>{field.label}</FieldLabel>
              {field.kind === "textarea" || field.kind === "json" ? (
                <Textarea
                  aria-invalid={Boolean(message)}
                  className={field.kind === "json" ? "font-mono" : undefined}
                  id={fieldId}
                  placeholder={field.placeholder}
                  {...form.register(
                    field.name as Path<
                      EntityFormClientValues<typeof definition>
                    >,
                  )}
                />
              ) : field.kind === "select" ? (
                <Select
                  aria-invalid={Boolean(message)}
                  id={fieldId}
                  {...form.register(
                    field.name as Path<
                      EntityFormClientValues<typeof definition>
                    >,
                  )}
                >
                  <option value="">None</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              ) : field.kind === "checkbox" ? (
                <Checkbox
                  aria-invalid={Boolean(message)}
                  id={fieldId}
                  {...form.register(
                    field.name as Path<
                      EntityFormClientValues<typeof definition>
                    >,
                  )}
                />
              ) : (
                <Input
                  aria-invalid={Boolean(message)}
                  id={fieldId}
                  placeholder={field.placeholder}
                  type={field.kind}
                  {...form.register(
                    field.name as Path<
                      EntityFormClientValues<typeof definition>
                    >,
                  )}
                />
              )}
              {field.description ? (
                <FieldDescription>{field.description}</FieldDescription>
              ) : null}
              {message ? <FieldError>{message}</FieldError> : null}
            </Field>
          );
        })}
      </FieldGroup>

      <button
        className="inline-flex h-9 items-center justify-center rounded-md border border-foreground/15 bg-foreground px-3 text-sm font-medium text-background transition-colors hover:bg-foreground/85 disabled:pointer-events-none disabled:opacity-50"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Saving..." : actionLabel}
      </button>
    </form>
  );
}
