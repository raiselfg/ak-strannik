import { z } from "zod/v4";

type FieldKind =
  | "checkbox"
  | "date"
  | "datetime-local"
  | "json"
  | "number"
  | "select"
  | "text"
  | "textarea";

type EntityField<TName extends string> = {
  name: TName;
  label: string;
  kind: FieldKind;
  options?: readonly string[];
  placeholder?: string;
  description?: string;
};

type EntityFormDefinition<TSchema extends z.ZodObject> = {
  schema: TSchema;
  fields: readonly EntityField<Extract<keyof z.input<TSchema>, string>>[];
  defaultValues: z.input<TSchema>;
};

const entityStatus = ["active", "archived"] as const;
const translationStatus = ["draft", "review", "published", "archived"] as const;
const mediaKind = ["image", "video", "document"] as const;
const mediaStatus = [
  "pending",
  "processing",
  "ready",
  "failed",
  "deleting",
  "deleted",
] as const;
const projectKind = ["charity", "showcase", "festival"] as const;
const showcaseCategory = [
  "concert",
  "artist",
  "performance",
  "master_class",
  "holiday_event",
  "exhibition",
] as const;
const rentalCategory = ["prop", "attraction", "mascot"] as const;
const metricQualifier = ["exact", "at_least", "at_most"] as const;

const emptyToNull = (value: unknown) => (value === "" ? null : value);

const requiredText = z.string().min(1);
const nullableText = z.preprocess(emptyToNull, z.string().nullable().optional());
const nullableInt = z.preprocess(emptyToNull, z.coerce.number().int().nullable().optional());
const requiredInt = z.coerce.number().int();
const requiredBigInt = z.coerce.bigint();
const requiredDecimal = z.union([z.string().min(1), z.number()]).transform(String);
const nullableDecimal = z.preprocess(
  emptyToNull,
  z.union([z.string().min(1), z.number()]).transform(String).nullable().optional(),
);
const nullableDate = z.preprocess(
  emptyToNull,
  z
    .string()
    .nullable()
    .optional()
    .transform((value, ctx) => {
      if (!value) {
        return null;
      }

      const date = new Date(`${value}T00:00:00.000Z`);

      if (Number.isNaN(date.getTime())) {
        ctx.addIssue({ code: "custom", message: "Invalid date" });
        return z.NEVER;
      }

      return date;
    }),
);
const requiredDateTime = z.string().min(1).transform((value, ctx) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    ctx.addIssue({ code: "custom", message: "Invalid date time" });
    return z.NEVER;
  }

  return date;
});
const nullableDateTime = z.preprocess(
  emptyToNull,
  z
    .string()
    .nullable()
    .optional()
    .transform((value, ctx) => {
      if (!value) {
        return null;
      }

      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        ctx.addIssue({ code: "custom", message: "Invalid date time" });
        return z.NEVER;
      }

      return date;
    }),
);
const jsonValue = z.union([
  z.string().transform((value, ctx) => {
    try {
      return JSON.parse(value) as unknown;
    } catch {
      ctx.addIssue({ code: "custom", message: "Invalid JSON" });
      return z.NEVER;
    }
  }),
  z.unknown(),
]);

function defineEntityForm<TSchema extends z.ZodObject>(
  definition: EntityFormDefinition<TSchema>,
) {
  return definition;
}

const f = <TName extends string>(
  name: TName,
  label: string,
  kind: FieldKind,
  extra: Omit<EntityField<TName>, "kind" | "label" | "name"> = {},
) => ({ name, label, kind, ...extra });

export const entityFormDefinitions = {
  locales: defineEntityForm({
    schema: z.object({
      code: requiredText,
      name: requiredText,
      nativeName: requiredText,
      pathPrefix: z.string(),
      isDefault: z.coerce.boolean(),
      isEnabled: z.coerce.boolean(),
      sortOrder: requiredInt,
    }),
    defaultValues: {
      code: "",
      name: "",
      nativeName: "",
      pathPrefix: "",
      isDefault: false,
      isEnabled: true,
      sortOrder: 0,
    },
    fields: [
      f("code", "Code", "text"),
      f("name", "Name", "text"),
      f("nativeName", "Native name", "text"),
      f("pathPrefix", "Path prefix", "text"),
      f("isDefault", "Default locale", "checkbox"),
      f("isEnabled", "Enabled", "checkbox"),
      f("sortOrder", "Sort order", "number"),
    ],
  }),
  "audit-logs": defineEntityForm({
    schema: z.object({
      actorAdminAccountId: nullableText,
      sessionId: nullableText,
      action: requiredText,
      entityType: nullableText,
      entityId: nullableText,
      ipAddress: nullableText,
      userAgent: nullableText,
      metadata: jsonValue.optional(),
    }),
    defaultValues: {
      actorAdminAccountId: "",
      sessionId: "",
      action: "",
      entityType: "",
      entityId: "",
      ipAddress: "",
      userAgent: "",
      metadata: "{}",
    },
    fields: [
      f("actorAdminAccountId", "Actor admin account id", "text"),
      f("sessionId", "Session id", "text"),
      f("action", "Action", "text"),
      f("entityType", "Entity type", "text"),
      f("entityId", "Entity id", "text"),
      f("ipAddress", "IP address", "text"),
      f("userAgent", "User agent", "textarea"),
      f("metadata", "Metadata", "json"),
    ],
  }),
  redirects: defineEntityForm({
    schema: z.object({
      fromPath: requiredText,
      toPath: requiredText,
      httpStatus: requiredInt,
      isActive: z.coerce.boolean(),
    }),
    defaultValues: {
      fromPath: "",
      toPath: "",
      httpStatus: 301,
      isActive: true,
    },
    fields: [
      f("fromPath", "From path", "text"),
      f("toPath", "To path", "text"),
      f("httpStatus", "HTTP status", "number"),
      f("isActive", "Active", "checkbox"),
    ],
  }),
  jobs: defineEntityForm({
    schema: z.object({
      type: requiredText,
      payload: jsonValue,
      status: requiredText,
      attempts: requiredInt,
      runAfter: requiredDateTime,
      lockedAt: nullableDateTime,
      lockedBy: nullableText,
      lastError: nullableText,
    }),
    defaultValues: {
      type: "",
      payload: "{}",
      status: "queued",
      attempts: 0,
      runAfter: "",
      lockedAt: "",
      lockedBy: "",
      lastError: "",
    },
    fields: [
      f("type", "Type", "text"),
      f("payload", "Payload", "json"),
      f("status", "Status", "text"),
      f("attempts", "Attempts", "number"),
      f("runAfter", "Run after", "datetime-local"),
      f("lockedAt", "Locked at", "datetime-local"),
      f("lockedBy", "Locked by", "text"),
      f("lastError", "Last error", "textarea"),
    ],
  }),
  "content-seed-registry": defineEntityForm({
    schema: z.object({
      seedKey: requiredText,
      entityType: requiredText,
      entityId: requiredText,
    }),
    defaultValues: { seedKey: "", entityType: "", entityId: "" },
    fields: [
      f("seedKey", "Seed key", "text"),
      f("entityType", "Entity type", "text"),
      f("entityId", "Entity id", "text"),
    ],
  }),
  "media-assets": defineEntityForm({
    schema: z.object({
      kind: z.enum(mediaKind),
      bucket: requiredText,
      objectKey: requiredText,
      originalFilename: nullableText,
      contentType: requiredText,
      sizeBytes: requiredBigInt,
      width: nullableInt,
      height: nullableInt,
      checksumSha256: nullableText,
      status: z.enum(mediaStatus),
      uploadedByAdminAccountId: nullableText,
    }),
    defaultValues: {
      kind: "image",
      bucket: "",
      objectKey: "",
      originalFilename: "",
      contentType: "",
      sizeBytes: "",
      width: "",
      height: "",
      checksumSha256: "",
      status: "ready",
      uploadedByAdminAccountId: "",
    },
    fields: [
      f("kind", "Kind", "select", { options: mediaKind }),
      f("bucket", "Bucket", "text"),
      f("objectKey", "Object key", "text"),
      f("originalFilename", "Original filename", "text"),
      f("contentType", "Content type", "text"),
      f("sizeBytes", "Size bytes", "text"),
      f("width", "Width", "number"),
      f("height", "Height", "number"),
      f("checksumSha256", "Checksum SHA256", "text"),
      f("status", "Status", "select", { options: mediaStatus }),
      f("uploadedByAdminAccountId", "Uploaded by admin account id", "text"),
    ],
  }),
  "media-variants": defineEntityForm({
    schema: z.object({
      mediaAssetId: requiredText,
      code: requiredText,
      bucket: requiredText,
      objectKey: requiredText,
      contentType: requiredText,
      sizeBytes: requiredBigInt,
      width: nullableInt,
      height: nullableInt,
    }),
    defaultValues: {
      mediaAssetId: "",
      code: "",
      bucket: "",
      objectKey: "",
      contentType: "",
      sizeBytes: "",
      width: "",
      height: "",
    },
    fields: [
      f("mediaAssetId", "Media asset id", "text"),
      f("code", "Code", "text"),
      f("bucket", "Bucket", "text"),
      f("objectKey", "Object key", "text"),
      f("contentType", "Content type", "text"),
      f("sizeBytes", "Size bytes", "text"),
      f("width", "Width", "number"),
      f("height", "Height", "number"),
    ],
  }),
  "media-asset-translations": defineEntityForm({
    schema: z.object({
      mediaAssetId: requiredText,
      localeCode: requiredText,
      altText: nullableText,
      title: nullableText,
      caption: nullableText,
      copyrightText: nullableText,
    }),
    defaultValues: {
      mediaAssetId: "",
      localeCode: "ru",
      altText: "",
      title: "",
      caption: "",
      copyrightText: "",
    },
    fields: [
      f("mediaAssetId", "Media asset id", "text"),
      f("localeCode", "Locale code", "text"),
      f("altText", "Alt text", "textarea"),
      f("title", "Title", "text"),
      f("caption", "Caption", "textarea"),
      f("copyrightText", "Copyright text", "text"),
    ],
  }),
  "content-documents": defineEntityForm({
    schema: z.object({}),
    defaultValues: {},
    fields: [],
  }),
  "content-blocks": defineEntityForm({
    schema: z.object({
      documentId: requiredText,
      type: requiredText,
      sortOrder: requiredInt,
      settings: jsonValue,
      payload: jsonValue,
    }),
    defaultValues: {
      documentId: "",
      type: "",
      sortOrder: 0,
      settings: "{}",
      payload: "{}",
    },
    fields: [
      f("documentId", "Document id", "text"),
      f("type", "Type", "text"),
      f("sortOrder", "Sort order", "number"),
      f("settings", "Settings", "json"),
      f("payload", "Payload", "json"),
    ],
  }),
  pages: defineEntityForm({
    schema: z.object({
      code: requiredText,
      status: z.enum(entityStatus),
    }),
    defaultValues: { code: "", status: "active" },
    fields: [
      f("code", "Code", "text"),
      f("status", "Status", "select", { options: entityStatus }),
    ],
  }),
  "page-translations": defineEntityForm({
    schema: z.object({
      pageId: requiredText,
      localeCode: requiredText,
      title: nullableText,
      slug: nullableText,
      bodyDocumentId: nullableText,
      seoTitle: nullableText,
      seoDescription: nullableText,
      seoOgMediaId: nullableText,
      status: z.enum(translationStatus),
      publishedAt: nullableDateTime,
    }),
    defaultValues: {
      pageId: "",
      localeCode: "ru",
      title: "",
      slug: "",
      bodyDocumentId: "",
      seoTitle: "",
      seoDescription: "",
      seoOgMediaId: "",
      status: "draft",
      publishedAt: "",
    },
    fields: [
      f("pageId", "Page id", "text"),
      f("localeCode", "Locale code", "text"),
      f("title", "Title", "text"),
      f("slug", "Slug", "text"),
      f("bodyDocumentId", "Body document id", "text"),
      f("seoTitle", "SEO title", "text"),
      f("seoDescription", "SEO description", "textarea"),
      f("seoOgMediaId", "SEO OG media id", "text"),
      f("status", "Status", "select", { options: translationStatus }),
      f("publishedAt", "Published at", "datetime-local"),
    ],
  }),
  documents: defineEntityForm({
    schema: z.object({
      category: requiredText,
      issuedAt: nullableDate,
      status: z.enum(entityStatus),
    }),
    defaultValues: { category: "", issuedAt: "", status: "active" },
    fields: [
      f("category", "Category", "text"),
      f("issuedAt", "Issued at", "date"),
      f("status", "Status", "select", { options: entityStatus }),
    ],
  }),
  "document-translations": defineEntityForm({
    schema: z.object({
      documentId: requiredText,
      localeCode: requiredText,
      title: requiredText,
      slug: nullableText,
      description: nullableText,
      fileMediaId: nullableText,
      status: z.enum(translationStatus),
      publishedAt: nullableDateTime,
    }),
    defaultValues: {
      documentId: "",
      localeCode: "ru",
      title: "",
      slug: "",
      description: "",
      fileMediaId: "",
      status: "draft",
      publishedAt: "",
    },
    fields: [
      f("documentId", "Document id", "text"),
      f("localeCode", "Locale code", "text"),
      f("title", "Title", "text"),
      f("slug", "Slug", "text"),
      f("description", "Description", "textarea"),
      f("fileMediaId", "File media id", "text"),
      f("status", "Status", "select", { options: translationStatus }),
      f("publishedAt", "Published at", "datetime-local"),
    ],
  }),
  people: defineEntityForm({
    schema: z.object({
      avatarMediaId: nullableText,
      status: z.enum(entityStatus),
    }),
    defaultValues: { avatarMediaId: "", status: "active" },
    fields: [
      f("avatarMediaId", "Avatar media id", "text"),
      f("status", "Status", "select", { options: entityStatus }),
    ],
  }),
  "person-translations": defineEntityForm({
    schema: z.object({
      personId: requiredText,
      localeCode: requiredText,
      fullName: requiredText,
      slug: nullableText,
      shortBio: nullableText,
      bodyDocumentId: nullableText,
      seoTitle: nullableText,
      seoDescription: nullableText,
      status: z.enum(translationStatus),
      publishedAt: nullableDateTime,
    }),
    defaultValues: {
      personId: "",
      localeCode: "ru",
      fullName: "",
      slug: "",
      shortBio: "",
      bodyDocumentId: "",
      seoTitle: "",
      seoDescription: "",
      status: "draft",
      publishedAt: "",
    },
    fields: [
      f("personId", "Person id", "text"),
      f("localeCode", "Locale code", "text"),
      f("fullName", "Full name", "text"),
      f("slug", "Slug", "text"),
      f("shortBio", "Short bio", "textarea"),
      f("bodyDocumentId", "Body document id", "text"),
      f("seoTitle", "SEO title", "text"),
      f("seoDescription", "SEO description", "textarea"),
      f("status", "Status", "select", { options: translationStatus }),
      f("publishedAt", "Published at", "datetime-local"),
    ],
  }),
  "team-memberships": defineEntityForm({
    schema: z.object({
      personId: requiredText,
      status: z.enum(entityStatus),
      sortOrder: requiredInt,
    }),
    defaultValues: { personId: "", status: "active", sortOrder: 0 },
    fields: [
      f("personId", "Person id", "text"),
      f("status", "Status", "select", { options: entityStatus }),
      f("sortOrder", "Sort order", "number"),
    ],
  }),
  "team-membership-translations": defineEntityForm({
    schema: z.object({
      teamMembershipId: requiredText,
      localeCode: requiredText,
      roleTitle: nullableText,
      status: z.enum(translationStatus),
      publishedAt: nullableDateTime,
    }),
    defaultValues: {
      teamMembershipId: "",
      localeCode: "ru",
      roleTitle: "",
      status: "draft",
      publishedAt: "",
    },
    fields: [
      f("teamMembershipId", "Team membership id", "text"),
      f("localeCode", "Locale code", "text"),
      f("roleTitle", "Role title", "text"),
      f("status", "Status", "select", { options: translationStatus }),
      f("publishedAt", "Published at", "datetime-local"),
    ],
  }),
  "person-links": defineEntityForm({
    schema: z.object({
      personId: requiredText,
      url: requiredText,
      linkType: requiredText,
      sortOrder: requiredInt,
    }),
    defaultValues: { personId: "", url: "", linkType: "", sortOrder: 0 },
    fields: [
      f("personId", "Person id", "text"),
      f("url", "URL", "text"),
      f("linkType", "Link type", "text"),
      f("sortOrder", "Sort order", "number"),
    ],
  }),
  "person-link-translations": defineEntityForm({
    schema: z.object({
      personLinkId: requiredText,
      localeCode: requiredText,
      label: nullableText,
    }),
    defaultValues: { personLinkId: "", localeCode: "ru", label: "" },
    fields: [
      f("personLinkId", "Person link id", "text"),
      f("localeCode", "Locale code", "text"),
      f("label", "Label", "text"),
    ],
  }),
  "person-awards": defineEntityForm({
    schema: z.object({
      personId: requiredText,
      imageMediaId: nullableText,
      awardedOn: nullableDate,
      sortOrder: requiredInt,
    }),
    defaultValues: { personId: "", imageMediaId: "", awardedOn: "", sortOrder: 0 },
    fields: [
      f("personId", "Person id", "text"),
      f("imageMediaId", "Image media id", "text"),
      f("awardedOn", "Awarded on", "date"),
      f("sortOrder", "Sort order", "number"),
    ],
  }),
  "person-award-translations": defineEntityForm({
    schema: z.object({
      personAwardId: requiredText,
      localeCode: requiredText,
      title: nullableText,
      description: nullableText,
    }),
    defaultValues: {
      personAwardId: "",
      localeCode: "ru",
      title: "",
      description: "",
    },
    fields: [
      f("personAwardId", "Person award id", "text"),
      f("localeCode", "Locale code", "text"),
      f("title", "Title", "text"),
      f("description", "Description", "textarea"),
    ],
  }),
  partners: defineEntityForm({
    schema: z.object({
      logoMediaId: nullableText,
      websiteUrl: nullableText,
      status: z.enum(entityStatus),
      sortOrder: requiredInt,
    }),
    defaultValues: {
      logoMediaId: "",
      websiteUrl: "",
      status: "active",
      sortOrder: 0,
    },
    fields: [
      f("logoMediaId", "Logo media id", "text"),
      f("websiteUrl", "Website URL", "text"),
      f("status", "Status", "select", { options: entityStatus }),
      f("sortOrder", "Sort order", "number"),
    ],
  }),
  "partner-translations": defineEntityForm({
    schema: z.object({
      partnerId: requiredText,
      localeCode: requiredText,
      name: requiredText,
      description: nullableText,
      status: z.enum(translationStatus),
      publishedAt: nullableDateTime,
    }),
    defaultValues: {
      partnerId: "",
      localeCode: "ru",
      name: "",
      description: "",
      status: "draft",
      publishedAt: "",
    },
    fields: [
      f("partnerId", "Partner id", "text"),
      f("localeCode", "Locale code", "text"),
      f("name", "Name", "text"),
      f("description", "Description", "textarea"),
      f("status", "Status", "select", { options: translationStatus }),
      f("publishedAt", "Published at", "datetime-local"),
    ],
  }),
  projects: defineEntityForm({
    schema: z.object({
      kind: z.enum(projectKind),
      showcaseCategory: z.preprocess(
        emptyToNull,
        z.enum(showcaseCategory).nullable().optional(),
      ),
      startsOn: nullableDate,
      endsOn: nullableDate,
      coverMediaId: nullableText,
      status: z.enum(entityStatus),
      sortOrder: requiredInt,
    }),
    defaultValues: {
      kind: "charity",
      showcaseCategory: "",
      startsOn: "",
      endsOn: "",
      coverMediaId: "",
      status: "active",
      sortOrder: 0,
    },
    fields: [
      f("kind", "Kind", "select", { options: projectKind }),
      f("showcaseCategory", "Showcase category", "select", {
        options: showcaseCategory,
      }),
      f("startsOn", "Starts on", "date"),
      f("endsOn", "Ends on", "date"),
      f("coverMediaId", "Cover media id", "text"),
      f("status", "Status", "select", { options: entityStatus }),
      f("sortOrder", "Sort order", "number"),
    ],
  }),
  "project-translations": defineEntityForm({
    schema: z.object({
      projectId: requiredText,
      localeCode: requiredText,
      title: requiredText,
      slug: nullableText,
      subtitle: nullableText,
      excerpt: nullableText,
      periodLabel: nullableText,
      bodyDocumentId: nullableText,
      seoTitle: nullableText,
      seoDescription: nullableText,
      seoOgMediaId: nullableText,
      status: z.enum(translationStatus),
      publishedAt: nullableDateTime,
    }),
    defaultValues: {
      projectId: "",
      localeCode: "ru",
      title: "",
      slug: "",
      subtitle: "",
      excerpt: "",
      periodLabel: "",
      bodyDocumentId: "",
      seoTitle: "",
      seoDescription: "",
      seoOgMediaId: "",
      status: "draft",
      publishedAt: "",
    },
    fields: [
      f("projectId", "Project id", "text"),
      f("localeCode", "Locale code", "text"),
      f("title", "Title", "text"),
      f("slug", "Slug", "text"),
      f("subtitle", "Subtitle", "text"),
      f("excerpt", "Excerpt", "textarea"),
      f("periodLabel", "Period label", "text"),
      f("bodyDocumentId", "Body document id", "text"),
      f("seoTitle", "SEO title", "text"),
      f("seoDescription", "SEO description", "textarea"),
      f("seoOgMediaId", "SEO OG media id", "text"),
      f("status", "Status", "select", { options: translationStatus }),
      f("publishedAt", "Published at", "datetime-local"),
    ],
  }),
  "project-media": defineEntityForm({
    schema: z.object({
      projectId: requiredText,
      mediaAssetId: requiredText,
      role: requiredText,
      sortOrder: requiredInt,
    }),
    defaultValues: {
      projectId: "",
      mediaAssetId: "",
      role: "gallery",
      sortOrder: 0,
    },
    fields: [
      f("projectId", "Project id", "text"),
      f("mediaAssetId", "Media asset id", "text"),
      f("role", "Role", "text"),
      f("sortOrder", "Sort order", "number"),
    ],
  }),
  "project-partners": defineEntityForm({
    schema: z.object({
      projectId: requiredText,
      partnerId: requiredText,
      sortOrder: requiredInt,
    }),
    defaultValues: { projectId: "", partnerId: "", sortOrder: 0 },
    fields: [
      f("projectId", "Project id", "text"),
      f("partnerId", "Partner id", "text"),
      f("sortOrder", "Sort order", "number"),
    ],
  }),
  "project-cast-members": defineEntityForm({
    schema: z.object({
      projectId: requiredText,
      personId: requiredText,
      sortOrder: requiredInt,
    }),
    defaultValues: { projectId: "", personId: "", sortOrder: 0 },
    fields: [
      f("projectId", "Project id", "text"),
      f("personId", "Person id", "text"),
      f("sortOrder", "Sort order", "number"),
    ],
  }),
  "project-cast-member-translations": defineEntityForm({
    schema: z.object({
      castMemberId: requiredText,
      localeCode: requiredText,
      roleTitle: nullableText,
      note: nullableText,
    }),
    defaultValues: {
      castMemberId: "",
      localeCode: "ru",
      roleTitle: "",
      note: "",
    },
    fields: [
      f("castMemberId", "Cast member id", "text"),
      f("localeCode", "Locale code", "text"),
      f("roleTitle", "Role title", "text"),
      f("note", "Note", "textarea"),
    ],
  }),
  events: defineEntityForm({
    schema: z.object({
      startsAt: requiredDateTime,
      endsAt: nullableDateTime,
      timezone: requiredText,
      isAllDay: z.coerce.boolean(),
      coverMediaId: nullableText,
      status: z.enum(entityStatus),
      sortOrder: requiredInt,
    }),
    defaultValues: {
      startsAt: "",
      endsAt: "",
      timezone: "Europe/Moscow",
      isAllDay: false,
      coverMediaId: "",
      status: "active",
      sortOrder: 0,
    },
    fields: [
      f("startsAt", "Starts at", "datetime-local"),
      f("endsAt", "Ends at", "datetime-local"),
      f("timezone", "Timezone", "text"),
      f("isAllDay", "All day", "checkbox"),
      f("coverMediaId", "Cover media id", "text"),
      f("status", "Status", "select", { options: entityStatus }),
      f("sortOrder", "Sort order", "number"),
    ],
  }),
  "event-translations": defineEntityForm({
    schema: z.object({
      eventId: requiredText,
      localeCode: requiredText,
      title: nullableText,
      slug: nullableText,
      excerpt: nullableText,
      bodyDocumentId: nullableText,
      seoTitle: nullableText,
      seoDescription: nullableText,
      seoOgMediaId: nullableText,
      status: z.enum(translationStatus),
      publishedAt: nullableDateTime,
    }),
    defaultValues: {
      eventId: "",
      localeCode: "ru",
      title: "",
      slug: "",
      excerpt: "",
      bodyDocumentId: "",
      seoTitle: "",
      seoDescription: "",
      seoOgMediaId: "",
      status: "draft",
      publishedAt: "",
    },
    fields: [
      f("eventId", "Event id", "text"),
      f("localeCode", "Locale code", "text"),
      f("title", "Title", "text"),
      f("slug", "Slug", "text"),
      f("excerpt", "Excerpt", "textarea"),
      f("bodyDocumentId", "Body document id", "text"),
      f("seoTitle", "SEO title", "text"),
      f("seoDescription", "SEO description", "textarea"),
      f("seoOgMediaId", "SEO OG media id", "text"),
      f("status", "Status", "select", { options: translationStatus }),
      f("publishedAt", "Published at", "datetime-local"),
    ],
  }),
  "event-media": defineEntityForm({
    schema: z.object({
      eventId: requiredText,
      mediaAssetId: requiredText,
      role: requiredText,
      sortOrder: requiredInt,
    }),
    defaultValues: { eventId: "", mediaAssetId: "", role: "gallery", sortOrder: 0 },
    fields: [
      f("eventId", "Event id", "text"),
      f("mediaAssetId", "Media asset id", "text"),
      f("role", "Role", "text"),
      f("sortOrder", "Sort order", "number"),
    ],
  }),
  reports: defineEntityForm({
    schema: z.object({
      projectId: nullableText,
      year: nullableInt,
      periodStart: nullableDate,
      periodEnd: nullableDate,
      coverMediaId: nullableText,
      status: z.enum(entityStatus),
    }),
    defaultValues: {
      projectId: "",
      year: "",
      periodStart: "",
      periodEnd: "",
      coverMediaId: "",
      status: "active",
    },
    fields: [
      f("projectId", "Project id", "text"),
      f("year", "Year", "number"),
      f("periodStart", "Period start", "date"),
      f("periodEnd", "Period end", "date"),
      f("coverMediaId", "Cover media id", "text"),
      f("status", "Status", "select", { options: entityStatus }),
    ],
  }),
  "report-translations": defineEntityForm({
    schema: z.object({
      reportId: requiredText,
      localeCode: requiredText,
      title: requiredText,
      slug: nullableText,
      excerpt: nullableText,
      bodyDocumentId: nullableText,
      seoTitle: nullableText,
      seoDescription: nullableText,
      status: z.enum(translationStatus),
      publishedAt: nullableDateTime,
    }),
    defaultValues: {
      reportId: "",
      localeCode: "ru",
      title: "",
      slug: "",
      excerpt: "",
      bodyDocumentId: "",
      seoTitle: "",
      seoDescription: "",
      status: "draft",
      publishedAt: "",
    },
    fields: [
      f("reportId", "Report id", "text"),
      f("localeCode", "Locale code", "text"),
      f("title", "Title", "text"),
      f("slug", "Slug", "text"),
      f("excerpt", "Excerpt", "textarea"),
      f("bodyDocumentId", "Body document id", "text"),
      f("seoTitle", "SEO title", "text"),
      f("seoDescription", "SEO description", "textarea"),
      f("status", "Status", "select", { options: translationStatus }),
      f("publishedAt", "Published at", "datetime-local"),
    ],
  }),
  "report-metrics": defineEntityForm({
    schema: z.object({
      reportId: requiredText,
      code: requiredText,
      valueNumeric: requiredDecimal,
      qualifier: z.enum(metricQualifier),
      unitCode: nullableText,
      sortOrder: requiredInt,
    }),
    defaultValues: {
      reportId: "",
      code: "",
      valueNumeric: "",
      qualifier: "exact",
      unitCode: "",
      sortOrder: 0,
    },
    fields: [
      f("reportId", "Report id", "text"),
      f("code", "Code", "text"),
      f("valueNumeric", "Value numeric", "text"),
      f("qualifier", "Qualifier", "select", { options: metricQualifier }),
      f("unitCode", "Unit code", "text"),
      f("sortOrder", "Sort order", "number"),
    ],
  }),
  "report-metric-translations": defineEntityForm({
    schema: z.object({
      reportMetricId: requiredText,
      localeCode: requiredText,
      label: requiredText,
      suffix: nullableText,
    }),
    defaultValues: {
      reportMetricId: "",
      localeCode: "ru",
      label: "",
      suffix: "",
    },
    fields: [
      f("reportMetricId", "Report metric id", "text"),
      f("localeCode", "Locale code", "text"),
      f("label", "Label", "text"),
      f("suffix", "Suffix", "text"),
    ],
  }),
  venues: defineEntityForm({
    schema: z.object({
      city: nullableText,
      region: nullableText,
      countryCode: nullableText,
      latitude: nullableDecimal,
      longitude: nullableDecimal,
    }),
    defaultValues: {
      city: "",
      region: "",
      countryCode: "",
      latitude: "",
      longitude: "",
    },
    fields: [
      f("city", "City", "text"),
      f("region", "Region", "text"),
      f("countryCode", "Country code", "text"),
      f("latitude", "Latitude", "text"),
      f("longitude", "Longitude", "text"),
    ],
  }),
  "venue-translations": defineEntityForm({
    schema: z.object({
      venueId: requiredText,
      localeCode: requiredText,
      name: requiredText,
      addressText: nullableText,
    }),
    defaultValues: {
      venueId: "",
      localeCode: "ru",
      name: "",
      addressText: "",
    },
    fields: [
      f("venueId", "Venue id", "text"),
      f("localeCode", "Locale code", "text"),
      f("name", "Name", "text"),
      f("addressText", "Address text", "textarea"),
    ],
  }),
  "report-venues": defineEntityForm({
    schema: z.object({
      reportId: requiredText,
      venueId: requiredText,
      sortOrder: requiredInt,
    }),
    defaultValues: { reportId: "", venueId: "", sortOrder: 0 },
    fields: [
      f("reportId", "Report id", "text"),
      f("venueId", "Venue id", "text"),
      f("sortOrder", "Sort order", "number"),
    ],
  }),
  "rental-items": defineEntityForm({
    schema: z.object({
      category: z.enum(rentalCategory),
      coverMediaId: nullableText,
      status: z.enum(entityStatus),
      sortOrder: requiredInt,
    }),
    defaultValues: {
      category: "prop",
      coverMediaId: "",
      status: "active",
      sortOrder: 0,
    },
    fields: [
      f("category", "Category", "select", { options: rentalCategory }),
      f("coverMediaId", "Cover media id", "text"),
      f("status", "Status", "select", { options: entityStatus }),
      f("sortOrder", "Sort order", "number"),
    ],
  }),
  "rental-item-translations": defineEntityForm({
    schema: z.object({
      rentalItemId: requiredText,
      localeCode: requiredText,
      title: requiredText,
      slug: nullableText,
      excerpt: nullableText,
      bodyDocumentId: nullableText,
      seoTitle: nullableText,
      seoDescription: nullableText,
      status: z.enum(translationStatus),
      publishedAt: nullableDateTime,
    }),
    defaultValues: {
      rentalItemId: "",
      localeCode: "ru",
      title: "",
      slug: "",
      excerpt: "",
      bodyDocumentId: "",
      seoTitle: "",
      seoDescription: "",
      status: "draft",
      publishedAt: "",
    },
    fields: [
      f("rentalItemId", "Rental item id", "text"),
      f("localeCode", "Locale code", "text"),
      f("title", "Title", "text"),
      f("slug", "Slug", "text"),
      f("excerpt", "Excerpt", "textarea"),
      f("bodyDocumentId", "Body document id", "text"),
      f("seoTitle", "SEO title", "text"),
      f("seoDescription", "SEO description", "textarea"),
      f("status", "Status", "select", { options: translationStatus }),
      f("publishedAt", "Published at", "datetime-local"),
    ],
  }),
  "organization-awards": defineEntityForm({
    schema: z.object({
      imageMediaId: nullableText,
      awardedOn: nullableDate,
      sortOrder: requiredInt,
      status: z.enum(entityStatus),
    }),
    defaultValues: {
      imageMediaId: "",
      awardedOn: "",
      sortOrder: 0,
      status: "active",
    },
    fields: [
      f("imageMediaId", "Image media id", "text"),
      f("awardedOn", "Awarded on", "date"),
      f("sortOrder", "Sort order", "number"),
      f("status", "Status", "select", { options: entityStatus }),
    ],
  }),
  "organization-award-translations": defineEntityForm({
    schema: z.object({
      awardId: requiredText,
      localeCode: requiredText,
      title: nullableText,
      description: nullableText,
      status: z.enum(translationStatus),
      publishedAt: nullableDateTime,
    }),
    defaultValues: {
      awardId: "",
      localeCode: "ru",
      title: "",
      description: "",
      status: "draft",
      publishedAt: "",
    },
    fields: [
      f("awardId", "Award id", "text"),
      f("localeCode", "Locale code", "text"),
      f("title", "Title", "text"),
      f("description", "Description", "textarea"),
      f("status", "Status", "select", { options: translationStatus }),
      f("publishedAt", "Published at", "datetime-local"),
    ],
  }),
  "site-settings": defineEntityForm({
    schema: z.object({
      singleton: z.coerce.boolean(),
      email: nullableText,
      phone: nullableText,
      telegramUrl: nullableText,
      vkUrl: nullableText,
      youtubeUrl: nullableText,
      addressLatitude: nullableDecimal,
      addressLongitude: nullableDecimal,
    }),
    defaultValues: {
      singleton: true,
      email: "",
      phone: "",
      telegramUrl: "",
      vkUrl: "",
      youtubeUrl: "",
      addressLatitude: "",
      addressLongitude: "",
    },
    fields: [
      f("singleton", "Singleton", "checkbox"),
      f("email", "Email", "text"),
      f("phone", "Phone", "text"),
      f("telegramUrl", "Telegram URL", "text"),
      f("vkUrl", "VK URL", "text"),
      f("youtubeUrl", "YouTube URL", "text"),
      f("addressLatitude", "Address latitude", "text"),
      f("addressLongitude", "Address longitude", "text"),
    ],
  }),
  "site-setting-translations": defineEntityForm({
    schema: z.object({
      siteSettingId: requiredText,
      localeCode: requiredText,
      organizationName: nullableText,
      legalName: nullableText,
      addressText: nullableText,
      footerText: nullableText,
      defaultSeoTitle: nullableText,
      defaultSeoDescription: nullableText,
    }),
    defaultValues: {
      siteSettingId: "",
      localeCode: "ru",
      organizationName: "",
      legalName: "",
      addressText: "",
      footerText: "",
      defaultSeoTitle: "",
      defaultSeoDescription: "",
    },
    fields: [
      f("siteSettingId", "Site setting id", "text"),
      f("localeCode", "Locale code", "text"),
      f("organizationName", "Organization name", "text"),
      f("legalName", "Legal name", "text"),
      f("addressText", "Address text", "textarea"),
      f("footerText", "Footer text", "textarea"),
      f("defaultSeoTitle", "Default SEO title", "text"),
      f("defaultSeoDescription", "Default SEO description", "textarea"),
    ],
  }),
} as const;

export type EntityFormSlug = keyof typeof entityFormDefinitions;
export type EntityFormValues<TSlug extends EntityFormSlug> = z.output<
  (typeof entityFormDefinitions)[TSlug]["schema"]
>;

type EntityWhereDefinition<TSchema extends z.ZodType> = {
  schema: TSchema;
  defaultValue: (recordId: string) => z.input<TSchema>;
};

function defineEntityWhere<TSchema extends z.ZodType>(
  definition: EntityWhereDefinition<TSchema>,
) {
  return definition;
}

const idWhere = defineEntityWhere({
  schema: z.object({ id: requiredText }),
  defaultValue: (recordId) => ({ id: recordId }),
});

const entityWhereDefinitions = {
  "audit-logs": defineEntityWhere({
    schema: z.object({ id: requiredBigInt }),
    defaultValue: (recordId) => ({ id: recordId }),
  }),
  locales: defineEntityWhere({
    schema: z.object({ code: requiredText }),
    defaultValue: (recordId) => ({ code: recordId }),
  }),
  "media-asset-translations": defineEntityWhere({
    schema: z.object({
      mediaAssetId_localeCode: z.object({
        mediaAssetId: requiredText,
        localeCode: requiredText,
      }),
    }),
    defaultValue: () => ({
      mediaAssetId_localeCode: { mediaAssetId: "", localeCode: "ru" },
    }),
  }),
  "project-partners": defineEntityWhere({
    schema: z.object({
      projectId_partnerId: z.object({
        projectId: requiredText,
        partnerId: requiredText,
      }),
    }),
    defaultValue: () => ({
      projectId_partnerId: { projectId: "", partnerId: "" },
    }),
  }),
  "report-metric-translations": defineEntityWhere({
    schema: z.object({
      reportMetricId_localeCode: z.object({
        reportMetricId: requiredText,
        localeCode: requiredText,
      }),
    }),
    defaultValue: () => ({
      reportMetricId_localeCode: { reportMetricId: "", localeCode: "ru" },
    }),
  }),
  "venue-translations": defineEntityWhere({
    schema: z.object({
      venueId_localeCode: z.object({
        venueId: requiredText,
        localeCode: requiredText,
      }),
    }),
    defaultValue: () => ({
      venueId_localeCode: { venueId: "", localeCode: "ru" },
    }),
  }),
  "report-venues": defineEntityWhere({
    schema: z.object({
      reportId_venueId: z.object({
        reportId: requiredText,
        venueId: requiredText,
      }),
    }),
    defaultValue: () => ({
      reportId_venueId: { reportId: "", venueId: "" },
    }),
  }),
  "site-setting-translations": defineEntityWhere({
    schema: z.object({
      siteSettingId_localeCode: z.object({
        siteSettingId: requiredText,
        localeCode: requiredText,
      }),
    }),
    defaultValue: () => ({
      siteSettingId_localeCode: { siteSettingId: "", localeCode: "ru" },
    }),
  }),
} satisfies Partial<Record<EntityFormSlug, EntityWhereDefinition<z.ZodType>>>;

export function getEntityFormDefinition(slug: string) {
  if (slug in entityFormDefinitions) {
    return entityFormDefinitions[slug as EntityFormSlug];
  }

  return null;
}

export function getEntityWhereDefinition(slug: string) {
  if (slug in entityWhereDefinitions) {
    return entityWhereDefinitions[slug as keyof typeof entityWhereDefinitions];
  }

  return idWhere;
}

export function getDefaultEntityWhere(slug: string, recordId: string) {
  return JSON.stringify(
    getEntityWhereDefinition(slug).defaultValue(recordId),
    null,
    2,
  );
}

export function parseEntityFormData(slug: string, data: unknown) {
  const definition = getEntityFormDefinition(slug);

  if (!definition) {
    throw new Error("Form schema is not configured for this entity.");
  }

  return definition.schema.parse(data);
}

export function parseEntityWhere(slug: string, where: unknown) {
  return getEntityWhereDefinition(slug).schema.parse(where);
}
