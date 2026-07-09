export type AdminEntity = {
  model: string;
  slug: string;
  label: string;
  module: string;
};

export type AdminEntityGroup = {
  label: string;
  entities: AdminEntity[];
};

export const adminEntityGroups = [
  {
    label: "Auth",
    entities: [
      { model: "User", slug: "users", label: "Users", module: "auth" },
      { model: "Session", slug: "sessions", label: "Sessions", module: "auth" },
      { model: "Account", slug: "accounts", label: "Accounts", module: "auth" },
      {
        model: "Verification",
        slug: "verifications",
        label: "Verifications",
        module: "auth",
      },
    ],
  },
  {
    label: "System",
    entities: [
      { model: "Locale", slug: "locales", label: "Locales", module: "system" },
      { model: "AuditLog", slug: "audit-logs", label: "Audit logs", module: "system" },
      { model: "Redirect", slug: "redirects", label: "Redirects", module: "system" },
      { model: "Job", slug: "jobs", label: "Jobs", module: "system" },
      {
        model: "ContentSeedRegistry",
        slug: "content-seed-registry",
        label: "Content seed registry",
        module: "system",
      },
    ],
  },
  {
    label: "Media",
    entities: [
      { model: "MediaAsset", slug: "media-assets", label: "Media assets", module: "media" },
      { model: "MediaVariant", slug: "media-variants", label: "Media variants", module: "media" },
      {
        model: "MediaAssetTranslation",
        slug: "media-asset-translations",
        label: "Media asset translations",
        module: "media",
      },
    ],
  },
  {
    label: "Content",
    entities: [
      {
        model: "ContentDocument",
        slug: "content-documents",
        label: "Content documents",
        module: "content",
      },
      { model: "ContentBlock", slug: "content-blocks", label: "Content blocks", module: "content" },
      { model: "Page", slug: "pages", label: "Pages", module: "content" },
      {
        model: "PageTranslation",
        slug: "page-translations",
        label: "Page translations",
        module: "content",
      },
      { model: "Document", slug: "documents", label: "Documents", module: "content" },
      {
        model: "DocumentTranslation",
        slug: "document-translations",
        label: "Document translations",
        module: "content",
      },
    ],
  },
  {
    label: "People",
    entities: [
      { model: "Person", slug: "people", label: "People", module: "people" },
      {
        model: "PersonTranslation",
        slug: "person-translations",
        label: "Person translations",
        module: "people",
      },
      {
        model: "TeamMembership",
        slug: "team-memberships",
        label: "Team memberships",
        module: "people",
      },
      {
        model: "TeamMembershipTranslation",
        slug: "team-membership-translations",
        label: "Team membership translations",
        module: "people",
      },
      { model: "PersonLink", slug: "person-links", label: "Person links", module: "people" },
      {
        model: "PersonLinkTranslation",
        slug: "person-link-translations",
        label: "Person link translations",
        module: "people",
      },
      { model: "PersonAward", slug: "person-awards", label: "Person awards", module: "people" },
      {
        model: "PersonAwardTranslation",
        slug: "person-award-translations",
        label: "Person award translations",
        module: "people",
      },
    ],
  },
  {
    label: "Projects",
    entities: [
      { model: "Partner", slug: "partners", label: "Partners", module: "projects" },
      {
        model: "PartnerTranslation",
        slug: "partner-translations",
        label: "Partner translations",
        module: "projects",
      },
      { model: "Project", slug: "projects", label: "Projects", module: "projects" },
      {
        model: "ProjectTranslation",
        slug: "project-translations",
        label: "Project translations",
        module: "projects",
      },
      { model: "ProjectMedia", slug: "project-media", label: "Project media", module: "projects" },
      {
        model: "ProjectPartner",
        slug: "project-partners",
        label: "Project partners",
        module: "projects",
      },
      {
        model: "ProjectCastMember",
        slug: "project-cast-members",
        label: "Project cast members",
        module: "projects",
      },
      {
        model: "ProjectCastMemberTranslation",
        slug: "project-cast-member-translations",
        label: "Project cast member translations",
        module: "projects",
      },
    ],
  },
  {
    label: "Events",
    entities: [
      { model: "Event", slug: "events", label: "Events", module: "events" },
      {
        model: "EventTranslation",
        slug: "event-translations",
        label: "Event translations",
        module: "events",
      },
      { model: "EventMedia", slug: "event-media", label: "Event media", module: "events" },
    ],
  },
  {
    label: "Reports",
    entities: [
      { model: "Report", slug: "reports", label: "Reports", module: "reports" },
      {
        model: "ReportTranslation",
        slug: "report-translations",
        label: "Report translations",
        module: "reports",
      },
      { model: "ReportMetric", slug: "report-metrics", label: "Report metrics", module: "reports" },
      {
        model: "ReportMetricTranslation",
        slug: "report-metric-translations",
        label: "Report metric translations",
        module: "reports",
      },
      { model: "Venue", slug: "venues", label: "Venues", module: "reports" },
      {
        model: "VenueTranslation",
        slug: "venue-translations",
        label: "Venue translations",
        module: "reports",
      },
      { model: "ReportVenue", slug: "report-venues", label: "Report venues", module: "reports" },
    ],
  },
  {
    label: "Catalog",
    entities: [
      { model: "RentalItem", slug: "rental-items", label: "Rental items", module: "catalog" },
      {
        model: "RentalItemTranslation",
        slug: "rental-item-translations",
        label: "Rental item translations",
        module: "catalog",
      },
      {
        model: "OrganizationAward",
        slug: "organization-awards",
        label: "Organization awards",
        module: "catalog",
      },
      {
        model: "OrganizationAwardTranslation",
        slug: "organization-award-translations",
        label: "Organization award translations",
        module: "catalog",
      },
    ],
  },
  {
    label: "Settings",
    entities: [
      { model: "SiteSetting", slug: "site-settings", label: "Site settings", module: "settings" },
      {
        model: "SiteSettingTranslation",
        slug: "site-setting-translations",
        label: "Site setting translations",
        module: "settings",
      },
    ],
  },
] satisfies AdminEntityGroup[];

export const adminEntities = adminEntityGroups.flatMap((group) => group.entities);
export const crudEntities = adminEntities.filter(
  (entity) => entity.module !== "auth",
);

export function getAdminEntity(slug: string) {
  return adminEntities.find((entity) => entity.slug === slug);
}

export function getCrudEntity(slug: string) {
  return crudEntities.find((entity) => entity.slug === slug);
}
