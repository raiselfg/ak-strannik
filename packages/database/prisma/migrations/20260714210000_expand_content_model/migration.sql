-- Expand the content model first. The legacy columns stay available until their
-- data has been copied, so a failed migration can be inspected safely.

BEGIN;

CREATE TYPE "VideoProvider" AS ENUM ('youtube', 'vk', 'rutube', 'external');

ALTER TYPE "ProjectSectionVariant" ADD VALUE IF NOT EXISTS 'video';

ALTER TABLE "MediaAsset"
ADD COLUMN "checksumSha256" TEXT;

CREATE UNIQUE INDEX "MediaAsset_checksumSha256_key"
ON "MediaAsset"("checksumSha256");

ALTER TABLE "Event"
ADD COLUMN "eventYear" INTEGER,
ADD COLUMN "startDate" DATE,
ADD COLUMN "endDate" DATE,
ADD COLUMN "projectId" UUID;

ALTER TABLE "EventTranslation"
ADD COLUMN "dateText" TEXT,
ADD COLUMN "locationText" TEXT;

ALTER TABLE "ProjectSection"
ADD COLUMN "videoProvider" "VideoProvider",
ADD COLUMN "videoUrl" TEXT;

CREATE TABLE "EventVideo" (
  "id" UUID NOT NULL,
  "eventId" UUID NOT NULL,
  "provider" "VideoProvider" NOT NULL,
  "url" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT "EventVideo_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RentalItemImage" (
  "id" UUID NOT NULL,
  "rentalItemId" UUID NOT NULL,
  "mediaId" UUID NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT "RentalItemImage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PartnerMedia" (
  "id" UUID NOT NULL,
  "partnerId" UUID NOT NULL,
  "mediaId" UUID NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT "PartnerMedia_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PartnerVideo" (
  "id" UUID NOT NULL,
  "partnerId" UUID NOT NULL,
  "provider" "VideoProvider" NOT NULL,
  "url" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT "PartnerVideo_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EventVideo_eventId_url_key" ON "EventVideo"("eventId", "url");
CREATE INDEX "EventVideo_eventId_sortOrder_idx" ON "EventVideo"("eventId", "sortOrder");
CREATE UNIQUE INDEX "RentalItemImage_rentalItemId_mediaId_key" ON "RentalItemImage"("rentalItemId", "mediaId");
CREATE INDEX "RentalItemImage_rentalItemId_sortOrder_idx" ON "RentalItemImage"("rentalItemId", "sortOrder");
CREATE INDEX "RentalItemImage_mediaId_idx" ON "RentalItemImage"("mediaId");
CREATE UNIQUE INDEX "PartnerMedia_partnerId_mediaId_key" ON "PartnerMedia"("partnerId", "mediaId");
CREATE INDEX "PartnerMedia_partnerId_sortOrder_idx" ON "PartnerMedia"("partnerId", "sortOrder");
CREATE INDEX "PartnerMedia_mediaId_idx" ON "PartnerMedia"("mediaId");
CREATE UNIQUE INDEX "PartnerVideo_partnerId_url_key" ON "PartnerVideo"("partnerId", "url");
CREATE INDEX "PartnerVideo_partnerId_sortOrder_idx" ON "PartnerVideo"("partnerId", "sortOrder");

ALTER TABLE "Event"
ADD CONSTRAINT "Event_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "Project"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "EventVideo"
ADD CONSTRAINT "EventVideo_eventId_fkey"
FOREIGN KEY ("eventId") REFERENCES "Event"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RentalItemImage"
ADD CONSTRAINT "RentalItemImage_rentalItemId_fkey"
FOREIGN KEY ("rentalItemId") REFERENCES "RentalItem"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RentalItemImage"
ADD CONSTRAINT "RentalItemImage_mediaId_fkey"
FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PartnerMedia"
ADD CONSTRAINT "PartnerMedia_partnerId_fkey"
FOREIGN KEY ("partnerId") REFERENCES "Partner"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PartnerMedia"
ADD CONSTRAINT "PartnerMedia_mediaId_fkey"
FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PartnerVideo"
ADD CONSTRAINT "PartnerVideo_partnerId_fkey"
FOREIGN KEY ("partnerId") REFERENCES "Partner"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- Preserve every legacy event date and YouTube URL before dropping the old fields.
UPDATE "Event"
SET
  "startDate" = "eventDate"::date,
  "eventYear" = EXTRACT(YEAR FROM "eventDate")::integer
WHERE "eventDate" IS NOT NULL;

INSERT INTO "EventVideo" ("id", "eventId", "provider", "url", "sortOrder")
SELECT "id", "id", 'youtube'::"VideoProvider", BTRIM("youtubeUrl"), 0
FROM "Event"
WHERE NULLIF(BTRIM("youtubeUrl"), '') IS NOT NULL
ON CONFLICT ("eventId", "url") DO NOTHING;

DROP INDEX IF EXISTS "Event_status_eventDate_idx";

ALTER TABLE "Event"
DROP COLUMN "eventDate",
DROP COLUMN "youtubeUrl";

CREATE INDEX "Event_status_eventYear_startDate_idx"
ON "Event"("status", "eventYear", "startDate");
CREATE INDEX "Event_projectId_idx" ON "Event"("projectId");

-- Media cannot be deleted while content still points to it. Replacing SetNull
-- and Cascade with Restrict keeps the content and storage state consistent.
ALTER TABLE "TeamMember" DROP CONSTRAINT IF EXISTS "TeamMember_imageId_fkey";
ALTER TABLE "TeamMember"
ADD CONSTRAINT "TeamMember_imageId_fkey"
FOREIGN KEY ("imageId") REFERENCES "MediaAsset"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Event" DROP CONSTRAINT IF EXISTS "Event_coverImageId_fkey";
ALTER TABLE "Event"
ADD CONSTRAINT "Event_coverImageId_fkey"
FOREIGN KEY ("coverImageId") REFERENCES "MediaAsset"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "EventImage" DROP CONSTRAINT IF EXISTS "EventImage_mediaId_fkey";
ALTER TABLE "EventImage"
ADD CONSTRAINT "EventImage_mediaId_fkey"
FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "RentalItem" DROP CONSTRAINT IF EXISTS "RentalItem_imageId_fkey";
ALTER TABLE "RentalItem"
ADD CONSTRAINT "RentalItem_imageId_fkey"
FOREIGN KEY ("imageId") REFERENCES "MediaAsset"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Project" DROP CONSTRAINT IF EXISTS "Project_coverImageId_fkey";
ALTER TABLE "Project"
ADD CONSTRAINT "Project_coverImageId_fkey"
FOREIGN KEY ("coverImageId") REFERENCES "MediaAsset"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ProjectSectionMedia" DROP CONSTRAINT IF EXISTS "ProjectSectionMedia_mediaId_fkey";
ALTER TABLE "ProjectSectionMedia"
ADD CONSTRAINT "ProjectSectionMedia_mediaId_fkey"
FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Partner" DROP CONSTRAINT IF EXISTS "Partner_logoId_fkey";
ALTER TABLE "Partner"
ADD CONSTRAINT "Partner_logoId_fkey"
FOREIGN KEY ("logoId") REFERENCES "MediaAsset"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Certificate" DROP CONSTRAINT IF EXISTS "Certificate_imageId_fkey";
ALTER TABLE "Certificate"
ADD CONSTRAINT "Certificate_imageId_fkey"
FOREIGN KEY ("imageId") REFERENCES "MediaAsset"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;
