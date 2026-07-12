import { z } from 'zod';

const IdSchema = z.uuid();
const DateTimeSchema = z.date();
const SortOrderSchema = z.number().int();

export const LocaleSchema = z.enum(['ru', 'en']);
export const ContentStatusSchema = z.enum(['draft', 'published', 'archived']);
export const RentalTypeSchema = z.enum(['mascot', 'attraction', 'props']);
export const ProjectTypeSchema = z.enum([
  'musical',
  'singer',
  'exhibition',
  'newYearShow',
  'masterClass',
  'performance',
  'artist',
  'concertProgram',
  'festival',
  'charity',
  'other',
]);
export const ProjectSectionVariantSchema = z.enum([
  'content',
  'split',
  'gallery',
  'slider',
  'youtube',
  'quote',
]);

export type Locale = z.infer<typeof LocaleSchema>;
export type ContentStatus = z.infer<typeof ContentStatusSchema>;
export type RentalType = z.infer<typeof RentalTypeSchema>;
export type ProjectType = z.infer<typeof ProjectTypeSchema>;
export type ProjectSectionVariant = z.infer<typeof ProjectSectionVariantSchema>;

export const MediaAssetSchema = z.object({
  id: IdSchema,
  objectKey: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number().int().nullable(),
  width: z.number().int().nullable(),
  height: z.number().int().nullable(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export const CreateMediaAssetDtoSchema = MediaAssetSchema.pick({
  objectKey: true,
  originalName: true,
  mimeType: true,
  size: true,
  width: true,
  height: true,
}).partial({ size: true, width: true, height: true });
export const UpdateMediaAssetDtoSchema = CreateMediaAssetDtoSchema.partial();
export const FindOneMediaAssetDtoSchema = z.object({ id: IdSchema });
export const DeleteMediaAssetDtoSchema = FindOneMediaAssetDtoSchema;
export type MediaAsset = z.infer<typeof MediaAssetSchema>;
export type CreateMediaAssetDto = z.infer<typeof CreateMediaAssetDtoSchema>;
export type UpdateMediaAssetDto = z.infer<typeof UpdateMediaAssetDtoSchema>;
export type FindOneMediaAssetDto = z.infer<typeof FindOneMediaAssetDtoSchema>;
export type DeleteMediaAssetDto = z.infer<typeof DeleteMediaAssetDtoSchema>;

export const MediaAssetTranslationSchema = z.object({
  id: IdSchema,
  mediaAssetId: IdSchema,
  locale: LocaleSchema,
  alt: z.string().nullable(),
  title: z.string().nullable(),
  caption: z.string().nullable(),
});
export const CreateMediaAssetTranslationDtoSchema =
  MediaAssetTranslationSchema.pick({
    mediaAssetId: true,
    locale: true,
    alt: true,
    title: true,
    caption: true,
  }).partial({ alt: true, title: true, caption: true });
export const UpdateMediaAssetTranslationDtoSchema =
  CreateMediaAssetTranslationDtoSchema.partial();
export const FindOneMediaAssetTranslationDtoSchema = z.object({ id: IdSchema });
export const DeleteMediaAssetTranslationDtoSchema =
  FindOneMediaAssetTranslationDtoSchema;
export type MediaAssetTranslation = z.infer<typeof MediaAssetTranslationSchema>;
export type CreateMediaAssetTranslationDto = z.infer<
  typeof CreateMediaAssetTranslationDtoSchema
>;
export type UpdateMediaAssetTranslationDto = z.infer<
  typeof UpdateMediaAssetTranslationDtoSchema
>;
export type FindOneMediaAssetTranslationDto = z.infer<
  typeof FindOneMediaAssetTranslationDtoSchema
>;
export type DeleteMediaAssetTranslationDto = z.infer<
  typeof DeleteMediaAssetTranslationDtoSchema
>;

export const TeamMemberSchema = z.object({
  id: IdSchema,
  imageId: IdSchema.nullable(),
  sortOrder: SortOrderSchema,
  isActive: z.boolean(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export const CreateTeamMemberDtoSchema = z.object({
  imageId: IdSchema.nullable().optional(),
  sortOrder: SortOrderSchema.optional(),
  isActive: z.boolean().optional(),
});
export const UpdateTeamMemberDtoSchema = CreateTeamMemberDtoSchema.partial();
export const FindOneTeamMemberDtoSchema = z.object({ id: IdSchema });
export const DeleteTeamMemberDtoSchema = FindOneTeamMemberDtoSchema;
export type TeamMember = z.infer<typeof TeamMemberSchema>;
export type CreateTeamMemberDto = z.infer<typeof CreateTeamMemberDtoSchema>;
export type UpdateTeamMemberDto = z.infer<typeof UpdateTeamMemberDtoSchema>;
export type FindOneTeamMemberDto = z.infer<typeof FindOneTeamMemberDtoSchema>;
export type DeleteTeamMemberDto = z.infer<typeof DeleteTeamMemberDtoSchema>;

export const TeamMemberTranslationSchema = z.object({
  id: IdSchema,
  teamMemberId: IdSchema,
  locale: LocaleSchema,
  name: z.string(),
  role: z.string().nullable(),
  description: z.string().nullable(),
});
export const CreateTeamMemberTranslationDtoSchema =
  TeamMemberTranslationSchema.pick({
    teamMemberId: true,
    locale: true,
    name: true,
    role: true,
    description: true,
  }).partial({ role: true, description: true });
export const UpdateTeamMemberTranslationDtoSchema =
  CreateTeamMemberTranslationDtoSchema.partial();
export const FindOneTeamMemberTranslationDtoSchema = z.object({ id: IdSchema });
export const DeleteTeamMemberTranslationDtoSchema =
  FindOneTeamMemberTranslationDtoSchema;
export type TeamMemberTranslation = z.infer<typeof TeamMemberTranslationSchema>;
export type CreateTeamMemberTranslationDto = z.infer<
  typeof CreateTeamMemberTranslationDtoSchema
>;
export type UpdateTeamMemberTranslationDto = z.infer<
  typeof UpdateTeamMemberTranslationDtoSchema
>;
export type FindOneTeamMemberTranslationDto = z.infer<
  typeof FindOneTeamMemberTranslationDtoSchema
>;
export type DeleteTeamMemberTranslationDto = z.infer<
  typeof DeleteTeamMemberTranslationDtoSchema
>;

export const EventSchema = z.object({
  id: IdSchema,
  slug: z.string(),
  status: ContentStatusSchema,
  eventDate: DateTimeSchema.nullable(),
  coverImageId: IdSchema.nullable(),
  youtubeUrl: z.string().nullable(),
  sortOrder: SortOrderSchema,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
  publishedAt: DateTimeSchema.nullable(),
});
export const CreateEventDtoSchema = z.object({
  slug: z.string(),
  status: ContentStatusSchema.optional(),
  eventDate: DateTimeSchema.nullable().optional(),
  coverImageId: IdSchema.nullable().optional(),
  youtubeUrl: z.string().nullable().optional(),
  sortOrder: SortOrderSchema.optional(),
  publishedAt: DateTimeSchema.nullable().optional(),
});
export const UpdateEventDtoSchema = CreateEventDtoSchema.partial();
export const FindOneEventDtoSchema = z.object({ id: IdSchema });
export const DeleteEventDtoSchema = FindOneEventDtoSchema;
export type Event = z.infer<typeof EventSchema>;
export type CreateEventDto = z.infer<typeof CreateEventDtoSchema>;
export type UpdateEventDto = z.infer<typeof UpdateEventDtoSchema>;
export type FindOneEventDto = z.infer<typeof FindOneEventDtoSchema>;
export type DeleteEventDto = z.infer<typeof DeleteEventDtoSchema>;

export const EventTranslationSchema = z.object({
  id: IdSchema,
  eventId: IdSchema,
  locale: LocaleSchema,
  title: z.string(),
  excerpt: z.string().nullable(),
  body: z.string().nullable(),
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
});
export const CreateEventTranslationDtoSchema = EventTranslationSchema.pick({
  eventId: true,
  locale: true,
  title: true,
  excerpt: true,
  body: true,
  seoTitle: true,
  seoDescription: true,
}).partial({
  excerpt: true,
  body: true,
  seoTitle: true,
  seoDescription: true,
});
export const UpdateEventTranslationDtoSchema =
  CreateEventTranslationDtoSchema.partial();
export const FindOneEventTranslationDtoSchema = z.object({ id: IdSchema });
export const DeleteEventTranslationDtoSchema = FindOneEventTranslationDtoSchema;
export type EventTranslation = z.infer<typeof EventTranslationSchema>;
export type CreateEventTranslationDto = z.infer<
  typeof CreateEventTranslationDtoSchema
>;
export type UpdateEventTranslationDto = z.infer<
  typeof UpdateEventTranslationDtoSchema
>;
export type FindOneEventTranslationDto = z.infer<
  typeof FindOneEventTranslationDtoSchema
>;
export type DeleteEventTranslationDto = z.infer<
  typeof DeleteEventTranslationDtoSchema
>;

export const EventImageSchema = z.object({
  id: IdSchema,
  eventId: IdSchema,
  mediaId: IdSchema,
  sortOrder: SortOrderSchema,
});
export const CreateEventImageDtoSchema = z.object({
  eventId: IdSchema,
  mediaId: IdSchema,
  sortOrder: SortOrderSchema.optional(),
});
export const UpdateEventImageDtoSchema = CreateEventImageDtoSchema.partial();
export const FindOneEventImageDtoSchema = z.object({ id: IdSchema });
export const DeleteEventImageDtoSchema = FindOneEventImageDtoSchema;
export type EventImage = z.infer<typeof EventImageSchema>;
export type CreateEventImageDto = z.infer<typeof CreateEventImageDtoSchema>;
export type UpdateEventImageDto = z.infer<typeof UpdateEventImageDtoSchema>;
export type FindOneEventImageDto = z.infer<typeof FindOneEventImageDtoSchema>;
export type DeleteEventImageDto = z.infer<typeof DeleteEventImageDtoSchema>;

export const RentalItemSchema = z.object({
  id: IdSchema,
  slug: z.string(),
  type: RentalTypeSchema,
  imageId: IdSchema.nullable(),
  sortOrder: SortOrderSchema,
  isActive: z.boolean(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export const CreateRentalItemDtoSchema = z.object({
  slug: z.string(),
  type: RentalTypeSchema,
  imageId: IdSchema.nullable().optional(),
  sortOrder: SortOrderSchema.optional(),
  isActive: z.boolean().optional(),
});
export const UpdateRentalItemDtoSchema = CreateRentalItemDtoSchema.partial();
export const FindOneRentalItemDtoSchema = z.object({ id: IdSchema });
export const DeleteRentalItemDtoSchema = FindOneRentalItemDtoSchema;
export type RentalItem = z.infer<typeof RentalItemSchema>;
export type CreateRentalItemDto = z.infer<typeof CreateRentalItemDtoSchema>;
export type UpdateRentalItemDto = z.infer<typeof UpdateRentalItemDtoSchema>;
export type FindOneRentalItemDto = z.infer<typeof FindOneRentalItemDtoSchema>;
export type DeleteRentalItemDto = z.infer<typeof DeleteRentalItemDtoSchema>;

export const RentalItemTranslationSchema = z.object({
  id: IdSchema,
  rentalItemId: IdSchema,
  locale: LocaleSchema,
  title: z.string(),
  description: z.string().nullable(),
  priceText: z.string().nullable(),
});
export const CreateRentalItemTranslationDtoSchema =
  RentalItemTranslationSchema.pick({
    rentalItemId: true,
    locale: true,
    title: true,
    description: true,
    priceText: true,
  }).partial({ description: true, priceText: true });
export const UpdateRentalItemTranslationDtoSchema =
  CreateRentalItemTranslationDtoSchema.partial();
export const FindOneRentalItemTranslationDtoSchema = z.object({ id: IdSchema });
export const DeleteRentalItemTranslationDtoSchema =
  FindOneRentalItemTranslationDtoSchema;
export type RentalItemTranslation = z.infer<typeof RentalItemTranslationSchema>;
export type CreateRentalItemTranslationDto = z.infer<
  typeof CreateRentalItemTranslationDtoSchema
>;
export type UpdateRentalItemTranslationDto = z.infer<
  typeof UpdateRentalItemTranslationDtoSchema
>;
export type FindOneRentalItemTranslationDto = z.infer<
  typeof FindOneRentalItemTranslationDtoSchema
>;
export type DeleteRentalItemTranslationDto = z.infer<
  typeof DeleteRentalItemTranslationDtoSchema
>;

export const ProjectSchema = z.object({
  id: IdSchema,
  slug: z.string(),
  type: ProjectTypeSchema,
  status: ContentStatusSchema,
  coverImageId: IdSchema.nullable(),
  sortOrder: SortOrderSchema,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
  publishedAt: DateTimeSchema.nullable(),
});
export const CreateProjectDtoSchema = z.object({
  slug: z.string(),
  type: ProjectTypeSchema,
  status: ContentStatusSchema.optional(),
  coverImageId: IdSchema.nullable().optional(),
  sortOrder: SortOrderSchema.optional(),
  publishedAt: DateTimeSchema.nullable().optional(),
});
export const UpdateProjectDtoSchema = CreateProjectDtoSchema.partial();
export const FindOneProjectDtoSchema = z.object({ id: IdSchema });
export const DeleteProjectDtoSchema = FindOneProjectDtoSchema;
export type Project = z.infer<typeof ProjectSchema>;
export type CreateProjectDto = z.infer<typeof CreateProjectDtoSchema>;
export type UpdateProjectDto = z.infer<typeof UpdateProjectDtoSchema>;
export type FindOneProjectDto = z.infer<typeof FindOneProjectDtoSchema>;
export type DeleteProjectDto = z.infer<typeof DeleteProjectDtoSchema>;

export const ProjectTranslationSchema = z.object({
  id: IdSchema,
  projectId: IdSchema,
  locale: LocaleSchema,
  title: z.string(),
  subtitle: z.string().nullable(),
  excerpt: z.string().nullable(),
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
});
export const CreateProjectTranslationDtoSchema = ProjectTranslationSchema.pick({
  projectId: true,
  locale: true,
  title: true,
  subtitle: true,
  excerpt: true,
  seoTitle: true,
  seoDescription: true,
}).partial({
  subtitle: true,
  excerpt: true,
  seoTitle: true,
  seoDescription: true,
});
export const UpdateProjectTranslationDtoSchema =
  CreateProjectTranslationDtoSchema.partial();
export const FindOneProjectTranslationDtoSchema = z.object({ id: IdSchema });
export const DeleteProjectTranslationDtoSchema =
  FindOneProjectTranslationDtoSchema;
export type ProjectTranslation = z.infer<typeof ProjectTranslationSchema>;
export type CreateProjectTranslationDto = z.infer<
  typeof CreateProjectTranslationDtoSchema
>;
export type UpdateProjectTranslationDto = z.infer<
  typeof UpdateProjectTranslationDtoSchema
>;
export type FindOneProjectTranslationDto = z.infer<
  typeof FindOneProjectTranslationDtoSchema
>;
export type DeleteProjectTranslationDto = z.infer<
  typeof DeleteProjectTranslationDtoSchema
>;

export const ProjectSectionSchema = z.object({
  id: IdSchema,
  projectId: IdSchema,
  variant: ProjectSectionVariantSchema,
  youtubeUrl: z.string().nullable(),
  sortOrder: SortOrderSchema,
  isActive: z.boolean(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export const CreateProjectSectionDtoSchema = z.object({
  projectId: IdSchema,
  variant: ProjectSectionVariantSchema.optional(),
  youtubeUrl: z.string().nullable().optional(),
  sortOrder: SortOrderSchema.optional(),
  isActive: z.boolean().optional(),
});
export const UpdateProjectSectionDtoSchema =
  CreateProjectSectionDtoSchema.partial();
export const FindOneProjectSectionDtoSchema = z.object({ id: IdSchema });
export const DeleteProjectSectionDtoSchema = FindOneProjectSectionDtoSchema;
export type ProjectSection = z.infer<typeof ProjectSectionSchema>;
export type CreateProjectSectionDto = z.infer<
  typeof CreateProjectSectionDtoSchema
>;
export type UpdateProjectSectionDto = z.infer<
  typeof UpdateProjectSectionDtoSchema
>;
export type FindOneProjectSectionDto = z.infer<
  typeof FindOneProjectSectionDtoSchema
>;
export type DeleteProjectSectionDto = z.infer<
  typeof DeleteProjectSectionDtoSchema
>;

export const ProjectSectionTranslationSchema = z.object({
  id: IdSchema,
  sectionId: IdSchema,
  locale: LocaleSchema,
  title: z.string().nullable(),
  subtitle: z.string().nullable(),
  body: z.string().nullable(),
  author: z.string().nullable(),
});
export const CreateProjectSectionTranslationDtoSchema =
  ProjectSectionTranslationSchema.pick({
    sectionId: true,
    locale: true,
    title: true,
    subtitle: true,
    body: true,
    author: true,
  }).partial({ title: true, subtitle: true, body: true, author: true });
export const UpdateProjectSectionTranslationDtoSchema =
  CreateProjectSectionTranslationDtoSchema.partial();
export const FindOneProjectSectionTranslationDtoSchema = z.object({
  id: IdSchema,
});
export const DeleteProjectSectionTranslationDtoSchema =
  FindOneProjectSectionTranslationDtoSchema;
export type ProjectSectionTranslation = z.infer<
  typeof ProjectSectionTranslationSchema
>;
export type CreateProjectSectionTranslationDto = z.infer<
  typeof CreateProjectSectionTranslationDtoSchema
>;
export type UpdateProjectSectionTranslationDto = z.infer<
  typeof UpdateProjectSectionTranslationDtoSchema
>;
export type FindOneProjectSectionTranslationDto = z.infer<
  typeof FindOneProjectSectionTranslationDtoSchema
>;
export type DeleteProjectSectionTranslationDto = z.infer<
  typeof DeleteProjectSectionTranslationDtoSchema
>;

export const ProjectSectionMediaSchema = z.object({
  id: IdSchema,
  sectionId: IdSchema,
  mediaId: IdSchema,
  sortOrder: SortOrderSchema,
});
export const CreateProjectSectionMediaDtoSchema = z.object({
  sectionId: IdSchema,
  mediaId: IdSchema,
  sortOrder: SortOrderSchema.optional(),
});
export const UpdateProjectSectionMediaDtoSchema =
  CreateProjectSectionMediaDtoSchema.partial();
export const FindOneProjectSectionMediaDtoSchema = z.object({ id: IdSchema });
export const DeleteProjectSectionMediaDtoSchema =
  FindOneProjectSectionMediaDtoSchema;
export type ProjectSectionMedia = z.infer<typeof ProjectSectionMediaSchema>;
export type CreateProjectSectionMediaDto = z.infer<
  typeof CreateProjectSectionMediaDtoSchema
>;
export type UpdateProjectSectionMediaDto = z.infer<
  typeof UpdateProjectSectionMediaDtoSchema
>;
export type FindOneProjectSectionMediaDto = z.infer<
  typeof FindOneProjectSectionMediaDtoSchema
>;
export type DeleteProjectSectionMediaDto = z.infer<
  typeof DeleteProjectSectionMediaDtoSchema
>;

export const PartnerSchema = z.object({
  id: IdSchema,
  logoId: IdSchema.nullable(),
  websiteUrl: z.string().nullable(),
  sortOrder: SortOrderSchema,
  isActive: z.boolean(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export const CreatePartnerDtoSchema = z.object({
  logoId: IdSchema.nullable().optional(),
  websiteUrl: z.string().nullable().optional(),
  sortOrder: SortOrderSchema.optional(),
  isActive: z.boolean().optional(),
});
export const UpdatePartnerDtoSchema = CreatePartnerDtoSchema.partial();
export const FindOnePartnerDtoSchema = z.object({ id: IdSchema });
export const DeletePartnerDtoSchema = FindOnePartnerDtoSchema;
export type Partner = z.infer<typeof PartnerSchema>;
export type CreatePartnerDto = z.infer<typeof CreatePartnerDtoSchema>;
export type UpdatePartnerDto = z.infer<typeof UpdatePartnerDtoSchema>;
export type FindOnePartnerDto = z.infer<typeof FindOnePartnerDtoSchema>;
export type DeletePartnerDto = z.infer<typeof DeletePartnerDtoSchema>;

export const PartnerTranslationSchema = z.object({
  id: IdSchema,
  partnerId: IdSchema,
  locale: LocaleSchema,
  name: z.string(),
  description: z.string().nullable(),
});
export const CreatePartnerTranslationDtoSchema = PartnerTranslationSchema.pick({
  partnerId: true,
  locale: true,
  name: true,
  description: true,
}).partial({ description: true });
export const UpdatePartnerTranslationDtoSchema =
  CreatePartnerTranslationDtoSchema.partial();
export const FindOnePartnerTranslationDtoSchema = z.object({ id: IdSchema });
export const DeletePartnerTranslationDtoSchema =
  FindOnePartnerTranslationDtoSchema;
export type PartnerTranslation = z.infer<typeof PartnerTranslationSchema>;
export type CreatePartnerTranslationDto = z.infer<
  typeof CreatePartnerTranslationDtoSchema
>;
export type UpdatePartnerTranslationDto = z.infer<
  typeof UpdatePartnerTranslationDtoSchema
>;
export type FindOnePartnerTranslationDto = z.infer<
  typeof FindOnePartnerTranslationDtoSchema
>;
export type DeletePartnerTranslationDto = z.infer<
  typeof DeletePartnerTranslationDtoSchema
>;

export const CertificateSchema = z.object({
  id: IdSchema,
  imageId: IdSchema,
  year: z.number().int().nullable(),
  sortOrder: SortOrderSchema,
  isActive: z.boolean(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});
export const CreateCertificateDtoSchema = z.object({
  imageId: IdSchema,
  year: z.number().int().nullable().optional(),
  sortOrder: SortOrderSchema.optional(),
  isActive: z.boolean().optional(),
});
export const UpdateCertificateDtoSchema = CreateCertificateDtoSchema.partial();
export const FindOneCertificateDtoSchema = z.object({ id: IdSchema });
export const DeleteCertificateDtoSchema = FindOneCertificateDtoSchema;
export type Certificate = z.infer<typeof CertificateSchema>;
export type CreateCertificateDto = z.infer<typeof CreateCertificateDtoSchema>;
export type UpdateCertificateDto = z.infer<typeof UpdateCertificateDtoSchema>;
export type FindOneCertificateDto = z.infer<typeof FindOneCertificateDtoSchema>;
export type DeleteCertificateDto = z.infer<typeof DeleteCertificateDtoSchema>;

export const CertificateTranslationSchema = z.object({
  id: IdSchema,
  certificateId: IdSchema,
  locale: LocaleSchema,
  title: z.string().nullable(),
  issuer: z.string().nullable(),
  description: z.string().nullable(),
});
export const CreateCertificateTranslationDtoSchema =
  CertificateTranslationSchema.pick({
    certificateId: true,
    locale: true,
    title: true,
    issuer: true,
    description: true,
  }).partial({ title: true, issuer: true, description: true });
export const UpdateCertificateTranslationDtoSchema =
  CreateCertificateTranslationDtoSchema.partial();
export const FindOneCertificateTranslationDtoSchema = z.object({
  id: IdSchema,
});
export const DeleteCertificateTranslationDtoSchema =
  FindOneCertificateTranslationDtoSchema;
export type CertificateTranslation = z.infer<
  typeof CertificateTranslationSchema
>;
export type CreateCertificateTranslationDto = z.infer<
  typeof CreateCertificateTranslationDtoSchema
>;
export type UpdateCertificateTranslationDto = z.infer<
  typeof UpdateCertificateTranslationDtoSchema
>;
export type FindOneCertificateTranslationDto = z.infer<
  typeof FindOneCertificateTranslationDtoSchema
>;
export type DeleteCertificateTranslationDto = z.infer<
  typeof DeleteCertificateTranslationDtoSchema
>;
