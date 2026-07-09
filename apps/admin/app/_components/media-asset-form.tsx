"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@ak-strannik/ui/components/field";
import { Input } from "@ak-strannik/ui/components/input";
import { Select } from "@ak-strannik/ui/components/select";
import { Textarea } from "@ak-strannik/ui/components/textarea";
import { useTransition } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod/v4";
import {
  updateMediaAssetMetadata,
  uploadMediaAsset,
} from "../_actions/media";
import {
  mediaAssetEditSchema,
  mediaAssetUploadMetadataSchema,
} from "../_forms/media-form-definitions";

const mediaAssetUploadSchema = mediaAssetUploadMetadataSchema.extend({
  file: z.custom<FileList>(
    (value) =>
      typeof FileList !== "undefined" &&
      value instanceof FileList &&
      value.length > 0,
    {
      message: "Select a file.",
    },
  ),
});

type MediaAssetUploadClientValues = {
  file: FileList;
  localeCode: string;
  title?: string | null;
  altText?: string | null;
  caption?: string | null;
  copyrightText?: string | null;
};

type MediaAssetStatus =
  | "pending"
  | "processing"
  | "ready"
  | "failed"
  | "deleting"
  | "deleted";

type MediaAssetEditClientValues = {
  id: string;
  originalFilename?: string | null;
  status: MediaAssetStatus;
  width?: number | string | null;
  height?: number | string | null;
  localeCode: string;
  title?: string | null;
  altText?: string | null;
  caption?: string | null;
  copyrightText?: string | null;
};

type MediaAssetFormAsset = {
  id: string;
  originalFilename: string | null;
  status: string;
  width: number | null;
  height: number | null;
  translations: {
    localeCode: string;
    title: string | null;
    altText: string | null;
    caption: string | null;
    copyrightText: string | null;
  }[];
};

function message(value: unknown) {
  return typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
    ? value.message
    : null;
}

export function MediaAssetUploadForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<MediaAssetUploadClientValues>({
    resolver: zodResolver(mediaAssetUploadSchema as never),
    defaultValues: {
      localeCode: "ru",
      title: "",
      altText: "",
      caption: "",
      copyrightText: "",
    },
  });

  const onSubmit = form.handleSubmit((values: MediaAssetUploadClientValues) => {
    const file = values.file.item(0);
    const formData = new FormData();

    if (file) {
      formData.set("file", file);
    }

    formData.set("localeCode", values.localeCode);
    formData.set("title", values.title ?? "");
    formData.set("altText", values.altText ?? "");
    formData.set("caption", values.caption ?? "");
    formData.set("copyrightText", values.copyrightText ?? "");

    startTransition(() => {
      void uploadMediaAsset(formData);
    });
  });

  return (
    <form className="max-w-3xl space-y-5" onSubmit={onSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="media-file">File</FieldLabel>
          <Input
            accept="image/*"
            aria-invalid={Boolean(form.formState.errors.file)}
            id="media-file"
            type="file"
            {...form.register("file")}
          />
          {message(form.formState.errors.file) ? (
            <FieldError>{message(form.formState.errors.file)}</FieldError>
          ) : null}
        </Field>
        <MediaUploadTranslationFields form={form} />
      </FieldGroup>
      <SubmitButton isPending={isPending}>Upload media</SubmitButton>
    </form>
  );
}

export function MediaAssetEditForm({ asset }: { asset: MediaAssetFormAsset }) {
  const [isPending, startTransition] = useTransition();
  const translation = asset.translations[0];
  const form = useForm<MediaAssetEditClientValues>({
    resolver: zodResolver(mediaAssetEditSchema as never),
    defaultValues: {
      id: asset.id,
      originalFilename: asset.originalFilename ?? "",
      status: asset.status as MediaAssetStatus,
      width: asset.width ?? "",
      height: asset.height ?? "",
      localeCode: translation?.localeCode ?? "ru",
      title: translation?.title ?? "",
      altText: translation?.altText ?? "",
      caption: translation?.caption ?? "",
      copyrightText: translation?.copyrightText ?? "",
    },
  });

  const onSubmit = form.handleSubmit((values: MediaAssetEditClientValues) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
      formData.set(key, value == null ? "" : String(value));
    }

    startTransition(() => {
      void updateMediaAssetMetadata(formData);
    });
  });

  return (
    <form className="max-w-3xl space-y-5" onSubmit={onSubmit}>
      <FieldGroup>
        <input type="hidden" {...form.register("id")} />
        <Field>
          <FieldLabel htmlFor="media-original">Original filename</FieldLabel>
          <Input id="media-original" {...form.register("originalFilename")} />
        </Field>
        <Field>
          <FieldLabel htmlFor="media-status">Status</FieldLabel>
          <Select id="media-status" {...form.register("status")}>
            <option value="pending">pending</option>
            <option value="processing">processing</option>
            <option value="ready">ready</option>
            <option value="failed">failed</option>
            <option value="deleting">deleting</option>
            <option value="deleted">deleted</option>
          </Select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="media-width">Width</FieldLabel>
            <Input id="media-width" type="number" {...form.register("width")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="media-height">Height</FieldLabel>
            <Input id="media-height" type="number" {...form.register("height")} />
          </Field>
        </div>
        <MediaEditTranslationFields form={form} />
      </FieldGroup>
      <SubmitButton isPending={isPending}>Save media</SubmitButton>
    </form>
  );
}

function MediaUploadTranslationFields({
  form,
}: {
  form: UseFormReturn<MediaAssetUploadClientValues>;
}) {
  return (
    <>
      <Field>
        <FieldLabel htmlFor="media-locale">Locale</FieldLabel>
        <Input id="media-locale" {...form.register("localeCode")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="media-title">Title</FieldLabel>
        <Input id="media-title" {...form.register("title")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="media-alt">Alt text</FieldLabel>
        <Textarea id="media-alt" {...form.register("altText")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="media-caption">Caption</FieldLabel>
        <Textarea id="media-caption" {...form.register("caption")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="media-copyright">Copyright</FieldLabel>
        <Input id="media-copyright" {...form.register("copyrightText")} />
      </Field>
    </>
  );
}

function MediaEditTranslationFields({
  form,
}: {
  form: UseFormReturn<MediaAssetEditClientValues>;
}) {
  return (
    <>
      <Field>
        <FieldLabel htmlFor="media-locale">Locale</FieldLabel>
        <Input id="media-locale" {...form.register("localeCode")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="media-title">Title</FieldLabel>
        <Input id="media-title" {...form.register("title")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="media-alt">Alt text</FieldLabel>
        <Textarea id="media-alt" {...form.register("altText")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="media-caption">Caption</FieldLabel>
        <Textarea id="media-caption" {...form.register("caption")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="media-copyright">Copyright</FieldLabel>
        <Input id="media-copyright" {...form.register("copyrightText")} />
      </Field>
    </>
  );
}

function SubmitButton({
  children,
  isPending,
}: {
  children: React.ReactNode;
  isPending: boolean;
}) {
  return (
    <button
      className="inline-flex h-9 items-center justify-center rounded-md border border-foreground/15 bg-foreground px-3 text-sm font-medium text-background transition-colors hover:bg-foreground/85 disabled:pointer-events-none disabled:opacity-50"
      disabled={isPending}
      type="submit"
    >
      {isPending ? "Saving..." : children}
    </button>
  );
}
