"use server";

import { prisma } from "@ak-strannik/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCrudEntity } from "../_config/admin-entities";
import {
  parseEntityFormData,
  parseEntityWhere,
} from "../_forms/entity-form-definitions";
import { requireAdminSession } from "../../lib/require-admin-session";

type JsonObject = Record<string, unknown>;

type CrudDelegate = {
  findMany(args?: { orderBy?: JsonObject; take?: number }): Promise<unknown[]>;
  findUnique(args: { where: JsonObject }): Promise<unknown | null>;
  create(args: { data: JsonObject }): Promise<unknown>;
  update(args: { where: JsonObject; data: JsonObject }): Promise<unknown>;
  delete(args: { where: JsonObject }): Promise<unknown>;
};

const crudDelegates = {
  locale: prisma.locale,
  auditLog: prisma.auditLog,
  redirect: prisma.redirect,
  job: prisma.job,
  contentSeedRegistry: prisma.contentSeedRegistry,
  mediaAsset: prisma.mediaAsset,
  mediaVariant: prisma.mediaVariant,
  mediaAssetTranslation: prisma.mediaAssetTranslation,
  contentDocument: prisma.contentDocument,
  contentBlock: prisma.contentBlock,
  page: prisma.page,
  pageTranslation: prisma.pageTranslation,
  document: prisma.document,
  documentTranslation: prisma.documentTranslation,
  person: prisma.person,
  personTranslation: prisma.personTranslation,
  teamMembership: prisma.teamMembership,
  teamMembershipTranslation: prisma.teamMembershipTranslation,
  personLink: prisma.personLink,
  personLinkTranslation: prisma.personLinkTranslation,
  personAward: prisma.personAward,
  personAwardTranslation: prisma.personAwardTranslation,
  partner: prisma.partner,
  partnerTranslation: prisma.partnerTranslation,
  project: prisma.project,
  projectTranslation: prisma.projectTranslation,
  projectMedia: prisma.projectMedia,
  projectPartner: prisma.projectPartner,
  projectCastMember: prisma.projectCastMember,
  projectCastMemberTranslation: prisma.projectCastMemberTranslation,
  event: prisma.event,
  eventTranslation: prisma.eventTranslation,
  eventMedia: prisma.eventMedia,
  report: prisma.report,
  reportTranslation: prisma.reportTranslation,
  reportMetric: prisma.reportMetric,
  reportMetricTranslation: prisma.reportMetricTranslation,
  venue: prisma.venue,
  venueTranslation: prisma.venueTranslation,
  reportVenue: prisma.reportVenue,
  rentalItem: prisma.rentalItem,
  rentalItemTranslation: prisma.rentalItemTranslation,
  organizationAward: prisma.organizationAward,
  organizationAwardTranslation: prisma.organizationAwardTranslation,
  siteSetting: prisma.siteSetting,
  siteSettingTranslation: prisma.siteSettingTranslation,
} satisfies Record<string, unknown>;

const modelToDelegateKey = {
  Locale: "locale",
  AuditLog: "auditLog",
  Redirect: "redirect",
  Job: "job",
  ContentSeedRegistry: "contentSeedRegistry",
  MediaAsset: "mediaAsset",
  MediaVariant: "mediaVariant",
  MediaAssetTranslation: "mediaAssetTranslation",
  ContentDocument: "contentDocument",
  ContentBlock: "contentBlock",
  Page: "page",
  PageTranslation: "pageTranslation",
  Document: "document",
  DocumentTranslation: "documentTranslation",
  Person: "person",
  PersonTranslation: "personTranslation",
  TeamMembership: "teamMembership",
  TeamMembershipTranslation: "teamMembershipTranslation",
  PersonLink: "personLink",
  PersonLinkTranslation: "personLinkTranslation",
  PersonAward: "personAward",
  PersonAwardTranslation: "personAwardTranslation",
  Partner: "partner",
  PartnerTranslation: "partnerTranslation",
  Project: "project",
  ProjectTranslation: "projectTranslation",
  ProjectMedia: "projectMedia",
  ProjectPartner: "projectPartner",
  ProjectCastMember: "projectCastMember",
  ProjectCastMemberTranslation: "projectCastMemberTranslation",
  Event: "event",
  EventTranslation: "eventTranslation",
  EventMedia: "eventMedia",
  Report: "report",
  ReportTranslation: "reportTranslation",
  ReportMetric: "reportMetric",
  ReportMetricTranslation: "reportMetricTranslation",
  Venue: "venue",
  VenueTranslation: "venueTranslation",
  ReportVenue: "reportVenue",
  RentalItem: "rentalItem",
  RentalItemTranslation: "rentalItemTranslation",
  OrganizationAward: "organizationAward",
  OrganizationAwardTranslation: "organizationAwardTranslation",
  SiteSetting: "siteSetting",
  SiteSettingTranslation: "siteSettingTranslation",
} satisfies Record<string, keyof typeof crudDelegates>;

type CrudModel = keyof typeof modelToDelegateKey;

function isCrudModel(model: string): model is CrudModel {
  return Object.hasOwn(modelToDelegateKey, model);
}

function parseJsonObject(value: FormDataEntryValue | null, label: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a JSON object.`);
  }

  const parsed: unknown = JSON.parse(value);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${label} must be a JSON object.`);
  }

  return parsed as JsonObject;
}

function getDelegate(entitySlug: string) {
  const entity = getCrudEntity(entitySlug);

  if (!entity) {
    throw new Error("CRUD actions are not enabled for this entity.");
  }

  if (!isCrudModel(entity.model)) {
    throw new Error("CRUD delegate is not configured for this entity.");
  }

  const delegateKey = modelToDelegateKey[entity.model];
  const delegate = crudDelegates[delegateKey] as unknown as CrudDelegate;

  return { entity, delegate };
}

function revalidateEntity(entitySlug: string) {
  revalidatePath("/");
  revalidatePath(`/entities/${entitySlug}`);
}

export async function listCrudRecords(entitySlug: string) {
  await requireAdminSession();
  const { delegate } = getDelegate(entitySlug);
  return delegate.findMany({ take: 50 });
}

export async function readCrudRecord(entitySlug: string, where: JsonObject) {
  await requireAdminSession();
  const { delegate } = getDelegate(entitySlug);
  return delegate.findUnique({
    where: parseEntityWhere(entitySlug, where) as JsonObject,
  });
}

export async function createCrudRecord(formData: FormData) {
  await requireAdminSession();
  const entitySlug = String(formData.get("entitySlug") ?? "");
  const { delegate } = getDelegate(entitySlug);
  const data = parseEntityFormData(
    entitySlug,
    parseJsonObject(formData.get("data"), "Data"),
  ) as JsonObject;

  await delegate.create({ data });
  revalidateEntity(entitySlug);
  redirect(`/entities/${entitySlug}`);
}

export async function updateCrudRecord(formData: FormData) {
  await requireAdminSession();
  const entitySlug = String(formData.get("entitySlug") ?? "");
  const { delegate } = getDelegate(entitySlug);
  const where = parseEntityWhere(
    entitySlug,
    parseJsonObject(formData.get("where"), "Where"),
  ) as JsonObject;
  const data = parseEntityFormData(
    entitySlug,
    parseJsonObject(formData.get("data"), "Data"),
  ) as JsonObject;

  await delegate.update({ where, data });
  revalidateEntity(entitySlug);
  redirect(`/entities/${entitySlug}`);
}

export async function deleteCrudRecord(formData: FormData) {
  await requireAdminSession();
  const entitySlug = String(formData.get("entitySlug") ?? "");
  const { delegate } = getDelegate(entitySlug);
  const where = parseEntityWhere(
    entitySlug,
    parseJsonObject(formData.get("where"), "Where"),
  ) as JsonObject;

  await delegate.delete({ where });
  revalidateEntity(entitySlug);
  redirect(`/entities/${entitySlug}`);
}
